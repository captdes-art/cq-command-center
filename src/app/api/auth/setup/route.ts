import { NextRequest, NextResponse } from "next/server";
import { isSetupComplete, completeSetup, createSession } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    // Don't allow re-setup if already complete
    if (isSetupComplete()) {
      return NextResponse.json(
        { error: "Setup has already been completed" },
        { status: 403 }
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

    completeSetup(username, password, securityQuestion, securityAnswer);
    await createSession();

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
