import { cookies } from "next/headers";
import crypto from "crypto";
import fs from "fs";
import path from "path";

// --- Environment variables (work everywhere including Vercel) ---
const ENV_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ENV_PASSWORD = process.env.ADMIN_PASSWORD || "cqadmin2025";
const ENV_SECURITY_QUESTION = process.env.ADMIN_SECURITY_QUESTION || "";
const ENV_SECURITY_ANSWER = process.env.ADMIN_SECURITY_ANSWER || "";

// --- File-based storage (works locally, not on Vercel) ---
const CREDENTIALS_FILE = path.join(process.cwd(), "data", "admin-credentials.json");

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

function hashValue(value: string): string {
  return crypto.createHash("sha256").update(value.toLowerCase().trim()).digest("hex");
}

function canWriteToFilesystem(): boolean {
  try {
    const dir = path.dirname(CREDENTIALS_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    // Test write
    const testFile = path.join(dir, ".write-test");
    fs.writeFileSync(testFile, "ok");
    fs.unlinkSync(testFile);
    return true;
  } catch {
    return false;
  }
}

function loadCredentials(): AdminCredentials | null {
  try {
    if (fs.existsSync(CREDENTIALS_FILE)) {
      const raw = fs.readFileSync(CREDENTIALS_FILE, "utf-8");
      return JSON.parse(raw) as AdminCredentials;
    }
  } catch {
    // File doesn't exist or can't be read
  }
  return null;
}

function saveCredentials(data: AdminCredentials): boolean {
  try {
    const dir = path.dirname(CREDENTIALS_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(CREDENTIALS_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch {
    return false;
  }
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
  // First check saved file (local dev)
  const saved = loadCredentials();
  if (saved) {
    return username === saved.username && hashValue(password) === saved.passwordHash;
  }

  // Fall back to environment variables
  return username === ENV_USERNAME && password === ENV_PASSWORD;
}

// --- Security question setup ---

export function isSetupComplete(): boolean {
  // Check file first (local dev)
  const saved = loadCredentials();
  if (saved?.setupComplete) return true;

  // On Vercel: if security question env var is set, setup is done
  if (ENV_SECURITY_QUESTION && ENV_SECURITY_ANSWER) return true;

  return false;
}

export function getSecurityQuestion(): string | null {
  // Check file first
  const saved = loadCredentials();
  if (saved?.securityQuestion) return saved.securityQuestion;

  // Fall back to env var
  if (ENV_SECURITY_QUESTION) return ENV_SECURITY_QUESTION;

  return null;
}

export function completeSetup(
  username: string,
  password: string,
  securityQuestion: string,
  securityAnswer: string
): boolean {
  return saveCredentials({
    username,
    passwordHash: hashValue(password),
    securityQuestion,
    securityAnswerHash: hashValue(securityAnswer),
    setupComplete: true,
    updatedAt: new Date().toISOString(),
  });
}

// --- Password reset via security question ---

export function validateSecurityAnswer(answer: string): boolean {
  // Check file first
  const saved = loadCredentials();
  if (saved?.securityAnswerHash) {
    return hashValue(answer) === saved.securityAnswerHash;
  }

  // Fall back to env var
  if (ENV_SECURITY_ANSWER) {
    return answer.toLowerCase().trim() === ENV_SECURITY_ANSWER.toLowerCase().trim();
  }

  return false;
}

export function resetPassword(newPassword: string): boolean {
  const saved = loadCredentials();
  if (!saved) return false;

  saved.passwordHash = hashValue(newPassword);
  saved.updatedAt = new Date().toISOString();
  return saveCredentials(saved);
}

export { canWriteToFilesystem };
