import { NextRequest, NextResponse } from "next/server";
import { getSecurityQuestion, validateSecurityAnswer, resetPassword, canWriteToFilesystem } from "@/lib/auth";

export async function GET() {
  const question = getSecurityQuestion();
  if (!question) {
    return NextResponse.json(
      { error: "No security question has been set up yet" },
      { status: 404 }
    );
  }
  return NextResponse.json({ question });
}

export async function POST(request: NextRequest) {
  try {
    const { securityAnswer, newPassword } = await request.json();

    if (!securityAnswer || !newPassword) {
      return NextResponse.json(
        { error: "Security answer and new password are required" },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    if (!validateSecurityAnswer(securityAnswer)) {
      return NextResponse.json(
        { error: "Incorrect security answer" },
        { status: 401 }
      );
    }

    // On Vercel, we can't write to the filesystem
    if (!canWriteToFilesystem()) {
      return NextResponse.json(
        { error: "To change your password on Vercel, update the ADMIN_PASSWORD environment variable in your Vercel dashboard." },
        { status: 400 }
      );
    }

    const updated = resetPassword(newPassword);
    if (!updated) {
      return NextResponse.json(
        { error: "Could not update password" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
