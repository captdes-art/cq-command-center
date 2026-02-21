"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Anchor,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
  ShieldQuestion,
} from "lucide-react";

export default function ResetPasswordPage() {
  const [question, setQuestion] = useState<string | null>(null);
  const [noQuestion, setNoQuestion] = useState(false);
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchQuestion() {
      try {
        const res = await fetch("/api/auth/reset");
        if (res.ok) {
          const data = await res.json();
          setQuestion(data.question);
        } else {
          setNoQuestion(true);
        }
      } catch {
        setNoQuestion(true);
      }
    }
    fetchQuestion();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ securityAnswer, newPassword }),
      });

      if (res.ok) {
        setSuccess(true);
      } else {
        const data = await res.json();
        setError(data.error || "Reset failed");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-800 to-blue-500 flex items-center justify-center px-4">
      <div className="w-full max-w-md animate-fade-in-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-white/15 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Anchor className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            CQ Command Center
          </h1>
          <p className="text-sm text-white/70 mt-1">
            Celtic Quest Fishing &middot; Port Jefferson, NY
          </p>
        </div>

        {/* Reset Card */}
        <div className="bg-white rounded-2xl shadow-card p-8">
          {success ? (
            <div className="text-center py-4">
              <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-7 h-7 text-green-500" />
              </div>
              <h2 className="text-xl font-bold text-foreground mb-2">
                Password Reset!
              </h2>
              <p className="text-sm text-slate-500 mb-6">
                Your password has been updated. You can now sign in.
              </p>
              <Link
                href="/login"
                className="inline-flex items-center justify-center w-full bg-gradient-to-r from-blue-800 to-blue-600 hover:from-blue-900 hover:to-blue-700 text-white font-semibold py-2.5 px-4 rounded-xl text-sm transition-all"
              >
                Go to Login
              </Link>
            </div>
          ) : noQuestion ? (
            <div className="text-center py-4">
              <div className="w-14 h-14 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldQuestion className="w-7 h-7 text-amber-500" />
              </div>
              <h2 className="text-xl font-bold text-foreground mb-2">
                No Security Question Set
              </h2>
              <p className="text-sm text-slate-500 mb-6">
                A security question hasn&apos;t been set up yet. Log in with the
                default credentials and complete account setup first.
              </p>
              <Link
                href="/login"
                className="inline-flex items-center justify-center w-full bg-gradient-to-r from-blue-800 to-blue-600 hover:from-blue-900 hover:to-blue-700 text-white font-semibold py-2.5 px-4 rounded-xl text-sm transition-all"
              >
                Back to Login
              </Link>
            </div>
          ) : !question ? (
            <div className="flex items-center justify-center py-12">
              <span className="w-6 h-6 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
            </div>
          ) : (
            <>
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-foreground">
                  Reset Password
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Answer your security question to set a new password
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="flex items-center gap-2 bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Security Question (read-only) */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Security Question
                  </label>
                  <div className="px-4 py-2.5 bg-blue-50 border border-blue-100 rounded-xl text-sm text-foreground font-medium">
                    {question}
                  </div>
                </div>

                {/* Security Answer */}
                <div>
                  <label
                    htmlFor="securityAnswer"
                    className="block text-sm font-medium text-foreground mb-1.5"
                  >
                    Your Answer
                  </label>
                  <div className="relative">
                    <ShieldQuestion className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      id="securityAnswer"
                      type="text"
                      value={securityAnswer}
                      onChange={(e) => setSecurityAnswer(e.target.value)}
                      placeholder="Enter your answer"
                      required
                      className="w-full pl-10 pr-4 py-2.5 bg-background border border-gray-200 rounded-xl text-sm text-foreground placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>

                {/* Divider */}
                <div className="relative py-1">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-white px-3 text-slate-400">
                      New Password
                    </span>
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <label
                    htmlFor="newPassword"
                    className="block text-sm font-medium text-foreground mb-1.5"
                  >
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      id="newPassword"
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      required
                      minLength={6}
                      autoComplete="new-password"
                      className="w-full pl-10 pr-10 py-2.5 bg-background border border-gray-200 rounded-xl text-sm text-foreground placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-foreground mb-1.5"
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      id="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter your password"
                      required
                      minLength={6}
                      autoComplete="new-password"
                      className="w-full pl-10 pr-4 py-2.5 bg-background border border-gray-200 rounded-xl text-sm text-foreground placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-800 to-blue-600 hover:from-blue-900 hover:to-blue-700 text-white font-semibold py-2.5 px-4 rounded-xl text-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-2 cursor-pointer"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Resetting...
                    </span>
                  ) : (
                    "Reset Password"
                  )}
                </button>
              </form>

              {/* Back to Login */}
              <div className="mt-5 text-center">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back to Login
                </Link>
              </div>
            </>
          )}
        </div>

        <p className="text-center text-xs text-white/50 mt-6">
          Authorized personnel only
        </p>
      </div>
    </div>
  );
}
