"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Anchor, LogOut } from "lucide-react";

export default function Header() {
  const router = useRouter();
  const [time, setTime] = useState<string>("");
  const [date, setDate] = useState<string>("");

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  useEffect(() => {
    function updateClock() {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
          timeZone: "America/New_York",
        })
      );
      setDate(
        now.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          timeZone: "America/New_York",
        })
      );
    }

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header
      className="bg-gradient-to-br from-blue-800 to-blue-500 text-white"
      style={{ padding: "52px 0 100px" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Left: Logo + Title */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-white/15 backdrop-blur-sm rounded-[14px] flex items-center justify-center">
            <Anchor className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight leading-tight">
              CQ Command Center
            </h1>
            <p className="text-sm text-white/80 mt-0.5">
              Celtic Quest Fishing &middot; Port Jefferson, NY
            </p>
          </div>
        </div>

        {/* Right: Clock + Logout */}
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-lg font-semibold tabular-nums">{time}</p>
            <p className="text-sm text-white/70">{date}</p>
          </div>
          <button
            onClick={handleLogout}
            title="Sign out"
            className="w-9 h-9 bg-white/15 hover:bg-white/25 backdrop-blur-sm rounded-lg flex items-center justify-center transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </header>
  );
}
