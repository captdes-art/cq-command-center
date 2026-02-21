import { NextRequest, NextResponse } from "next/server";
import { isSetupComplete, completeSetup, createSession, canWriteToFilesystem } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    if (isSetupComplete()) {
      return NextResponse.json(
        { error: "Setup has already been completed" },
        { status: 403 }
      );
    }

    // On Vercel (read-only filesystem), setup is done via environment variables
    if (!canWriteToFilesystem()) {
      return NextResponse.json(
        { error: "On Vercel, set ADMIN_USERNAME, ADMIN_PASSWORD, ADMIN_SECURITY_QUESTION, and ADMIN_SECURITY_ANSWER in your Vercel environment variables instead." },
        { status: 400 }
      );
    }

    const { username, password, securityQuestion, securityAnswer } = await request.json();

    if (!username || !password || !securityQuestion || !securityAnswer) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const saved = completeSetup(username, password, securityQuestion, securityAnswer);
    if (!saved) {
      return NextResponse.json(
        { error: "Could not save credentials" },
        { status: 500 }
      );
    }

    await createSession();

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
