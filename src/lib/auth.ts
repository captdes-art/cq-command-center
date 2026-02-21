import { cookies } from "next/headers";
import crypto from "crypto";
import fs from "fs";
import path from "path";

// Path to the credentials file (persists across restarts)
const CREDENTIALS_FILE = path.join(process.cwd(), "data", "admin-credentials.json");

// Defaults — used if no credentials file exists yet
const DEFAULT_USERNAME = process.env.ADMIN_USERNAME || "admin";
const DEFAULT_PASSWORD = process.env.ADMIN_PASSWORD || "cqadmin2025";

const SESSION_COOKIE = "cq-session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

interface AdminCredentials {
  username: string;
  passwordHash: string;
  securityQuestion?: string;
  securityAnswerHash?: string;
  setupComplete: boolean;
  updatedAt: string;
}

function hash(value: string): string {
  return crypto.createHash("sha256").update(value.toLowerCase().trim()).digest("hex");
}

function loadCredentials(): AdminCredentials | null {
  try {
    if (fs.existsSync(CREDENTIALS_FILE)) {
      const raw = fs.readFileSync(CREDENTIALS_FILE, "utf-8");
      return JSON.parse(raw) as AdminCredentials;
    }
  } catch {
    // Fall through to defaults
  }
  return null;
}

function saveCredentials(data: AdminCredentials): void {
  const dir = path.dirname(CREDENTIALS_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(CREDENTIALS_FILE, JSON.stringify(data, null, 2));
}

function generateSessionToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

// --- Session management ---

export async function createSession(): Promise<string> {
  const token = generateSessionToken();
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });
  return token;
}

export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE);
  return !!session?.value;
}

// --- Credential validation ---

export function validateCredentials(username: string, password: string): boolean {
  const saved = loadCredentials();

  if (saved) {
    return username === saved.username && hash(password) === saved.passwordHash;
  }

  // Fall back to defaults (first-time use before setup)
  return username === DEFAULT_USERNAME && password === DEFAULT_PASSWORD;
}

// --- Security question setup ---

export function isSetupComplete(): boolean {
  const saved = loadCredentials();
  return saved?.setupComplete === true;
}

export function getSecurityQuestion(): string | null {
  const saved = loadCredentials();
  return saved?.securityQuestion || null;
}

export function completeSetup(
  username: string,
  password: string,
  securityQuestion: string,
  securityAnswer: string
): void {
  saveCredentials({
    username,
    passwordHash: hash(password),
    securityQuestion,
    securityAnswerHash: hash(securityAnswer),
    setupComplete: true,
    updatedAt: new Date().toISOString(),
  });
}

// --- Password reset via security question ---

export function validateSecurityAnswer(answer: string): boolean {
  const saved = loadCredentials();
  if (!saved?.securityAnswerHash) return false;
  return hash(answer) === saved.securityAnswerHash;
}

export function resetPassword(newPassword: string): void {
  const saved = loadCredentials();
  if (!saved) return;

  saved.passwordHash = hash(newPassword);
  saved.updatedAt = new Date().toISOString();
  saveCredentials(saved);
}
