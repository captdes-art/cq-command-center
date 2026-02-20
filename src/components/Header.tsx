"use client";

import { useState, useEffect } from "react";
import { Anchor, Radio } from "lucide-react";

export default function Header() {
  const [time, setTime] = useState<string>("");
  const [date, setDate] = useState<string>("");

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
    <header className="border-b border-navy-700 bg-navy-950/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        {/* Left: Branding */}
        <div className="flex items-center gap-3">
          <div className="bg-teal-600 text-white font-bold text-xl w-10 h-10 rounded-lg flex items-center justify-center font-[family-name:var(--font-space-grotesk)]">
            CQ
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-200 font-[family-name:var(--font-space-grotesk)] leading-tight">
              Command Center
            </h1>
            <p className="text-xs text-slate-400 hidden sm:block">
              Celtic Quest Fishing
            </p>
          </div>
        </div>

        {/* Center: Status */}
        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-teal-400 text-sm">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>Live</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-400 text-sm">
            <Anchor className="w-3.5 h-3.5" />
            <span>Port Jefferson, NY</span>
          </div>
        </div>

        {/* Right: Clock & Greeting */}
        <div className="text-right">
          <p className="text-sm font-medium text-slate-200 font-[family-name:var(--font-space-grotesk)]">
            Captain&apos;s Bridge
          </p>
          <p className="text-xs text-teal-400 tabular-nums">{time}</p>
          <p className="text-xs text-slate-400 hidden sm:block">{date}</p>
        </div>
      </div>
    </header>
  );
}
