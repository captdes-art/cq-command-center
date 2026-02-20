"use client";

import { useState, useEffect, useCallback } from "react";
import { Waves, AlertTriangle, ExternalLink, Wind, Clock } from "lucide-react";
import type { MarineForecastPeriod } from "@/lib/marine";
import { hasAdvisory, extractWindInfo, extractSeasInfo } from "@/lib/marine";

interface MarineResponse {
  periods: MarineForecastPeriod[];
  updatedAt: string;
  fallbackUrl: string;
  error?: string;
}

export default function MarineWidget() {
  const [data, setData] = useState<MarineResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const loadMarine = useCallback(async () => {
    try {
      const res = await fetch("/api/marine");
      const json: MarineResponse = await res.json();
      setData(json);
    } catch {
      setData({
        periods: [],
        updatedAt: new Date().toISOString(),
        fallbackUrl:
          "https://marine.weather.gov/MapClick.php?zonetype=2&zoneinfo=ANZ331",
        error: "Failed to load marine forecast",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMarine();
    const interval = setInterval(loadMarine, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, [loadMarine]);

  if (loading) {
    return (
      <div className="bg-card rounded-xl border border-border p-6 animate-pulse">
        <div className="h-4 bg-navy-700 rounded w-1/2 mb-4" />
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-navy-700 rounded" />
          ))}
        </div>
      </div>
    );
  }

  const fallbackUrl =
    data?.fallbackUrl ||
    "https://marine.weather.gov/MapClick.php?zonetype=2&zoneinfo=ANZ331";

  return (
    <div className="bg-card rounded-xl border border-border p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
          Marine Forecast — LI Sound East
        </h2>
        <Waves className="w-5 h-5 text-teal-400" />
      </div>

      {data?.error || !data?.periods.length ? (
        <div className="text-center py-6">
          <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto mb-2" />
          <p className="text-sm text-slate-400 mb-3">
            Marine forecast temporarily unavailable
          </p>
          <a
            href={fallbackUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-teal-400 hover:text-teal-300 transition-colors"
          >
            View on NOAA <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      ) : (
        <>
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
            {data.periods.map((period) => {
              const isAdvisory = hasAdvisory(period.detailedForecast);
              const windInfo = extractWindInfo(period.detailedForecast);
              const seasInfo = extractSeasInfo(period.detailedForecast);

              return (
                <div
                  key={period.number}
                  className={`p-3 rounded-lg border ${
                    isAdvisory
                      ? "border-red-500/50 bg-red-500/10"
                      : "border-navy-700 bg-navy-800/50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <h3
                      className={`text-sm font-semibold ${
                        isAdvisory ? "text-red-400" : "text-slate-200"
                      }`}
                    >
                      {isAdvisory && (
                        <AlertTriangle className="w-3.5 h-3.5 inline mr-1.5" />
                      )}
                      {period.name}
                    </h3>
                  </div>

                  {/* Highlighted wind and seas info */}
                  {(windInfo || seasInfo) && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {windInfo && (
                        <span className="inline-flex items-center gap-1 text-xs font-medium bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded">
                          <Wind className="w-3 h-3" />
                          {windInfo}
                        </span>
                      )}
                      {seasInfo && (
                        <span className="inline-flex items-center gap-1 text-xs font-medium bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded">
                          <Waves className="w-3 h-3" />
                          {seasInfo}
                        </span>
                      )}
                    </div>
                  )}

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {period.detailedForecast}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-navy-700">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Clock className="w-3 h-3" />
              Updated:{" "}
              {new Date(data.updatedAt).toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
                timeZone: "America/New_York",
              })}
            </div>
            <a
              href={fallbackUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-teal-400 hover:text-teal-300 transition-colors flex items-center gap-1"
            >
              Full forecast <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </>
      )}
    </div>
  );
}
