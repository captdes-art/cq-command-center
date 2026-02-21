import { NextRequest, NextResponse } from "next/server";
import { validateCredentials, createSession, isSetupComplete } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      );
    }

    if (!validateCredentials(username, password)) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }

    await createSession();

    // If setup not complete, tell frontend to redirect to setup
    const setupComplete = isSetupComplete();

    return NextResponse.json({ success: true, needsSetup: !setupComplete });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
