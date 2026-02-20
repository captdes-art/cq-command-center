"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Sun,
  CloudSun,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudRainWind,
  CloudHail,
  Snowflake,
  CloudSnow,
  CloudLightning,
  Wind,
  Sunrise,
  Sunset,
  Thermometer,
  Navigation,
} from "lucide-react";
import {
  fetchWeather,
  getWeatherInfo,
  getWindDirection,
  formatTime,
  getDayName,
} from "@/lib/weather";
import type { WeatherData } from "@/lib/weather";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Sun,
  CloudSun,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudRainWind,
  CloudHail,
  Snowflake,
  CloudSnow,
  CloudLightning,
};

export default function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadWeather = useCallback(async () => {
    try {
      const data = await fetchWeather();
      setWeather(data);
      setError(null);
    } catch {
      setError("Unable to load weather data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadWeather();
    const interval = setInterval(loadWeather, 30 * 60 * 1000); // 30 min refresh
    return () => clearInterval(interval);
  }, [loadWeather]);

  if (loading) {
    return (
      <div className="bg-card rounded-xl border border-border p-6 animate-pulse">
        <div className="h-4 bg-navy-700 rounded w-1/3 mb-4" />
        <div className="h-16 bg-navy-700 rounded mb-4" />
        <div className="flex gap-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-20 bg-navy-700 rounded flex-1" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className="bg-card rounded-xl border border-border p-6">
        <h2 className="text-lg font-bold font-[family-name:var(--font-space-grotesk)] text-slate-200 mb-2">
          Weather
        </h2>
        <p className="text-red-400 text-sm">{error || "No data available"}</p>
      </div>
    );
  }

  const currentInfo = getWeatherInfo(weather.current.weatherCode);
  const CurrentIcon = iconMap[currentInfo.icon] || Cloud;

  return (
    <div className="bg-card rounded-xl border border-border p-6 animate-fade-in">
      <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
        Port Jefferson Weather
      </h2>

      {/* Current Conditions */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <CurrentIcon className="w-12 h-12 text-teal-400" />
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold text-slate-200 font-[family-name:var(--font-space-grotesk)]">
                {weather.current.temperature}
              </span>
              <span className="text-xl text-slate-400">°F</span>
            </div>
            <p className="text-sm text-slate-400">{currentInfo.description}</p>
          </div>
        </div>

        {/* Wind - Prominently displayed */}
        <div className="text-right">
          <div className="flex items-center gap-1.5 justify-end text-amber-400">
            <Wind className="w-5 h-5" />
            <span className="text-2xl font-bold font-[family-name:var(--font-space-grotesk)]">
              {weather.current.windSpeed}
            </span>
            <span className="text-sm">mph</span>
          </div>
          <div className="flex items-center gap-1 justify-end text-slate-400 text-sm mt-0.5">
            <Navigation
              className="w-3.5 h-3.5"
              style={{
                transform: `rotate(${weather.current.windDirection}deg)`,
              }}
            />
            <span>{getWindDirection(weather.current.windDirection)}</span>
          </div>
        </div>
      </div>

      {/* Sunrise/Sunset */}
      <div className="flex gap-4 mb-5 text-sm text-slate-400">
        <div className="flex items-center gap-1.5">
          <Sunrise className="w-4 h-4 text-amber-400" />
          <span>{formatTime(weather.sunrise)}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Sunset className="w-4 h-4 text-orange-400" />
          <span>{formatTime(weather.sunset)}</span>
        </div>
      </div>

      {/* 5-Day Forecast */}
      <div className="border-t border-navy-700 pt-4">
        <div className="grid grid-cols-5 gap-2">
          {weather.daily.map((day) => {
            const dayInfo = getWeatherInfo(day.weatherCode);
            const DayIcon = iconMap[dayInfo.icon] || Cloud;
            return (
              <div
                key={day.date}
                className="text-center p-2 rounded-lg hover:bg-navy-700/50 transition-colors"
              >
                <p className="text-xs font-medium text-slate-400 mb-1">
                  {getDayName(day.date)}
                </p>
                <DayIcon className="w-6 h-6 text-slate-300 mx-auto mb-1" />
                <div className="flex items-center justify-center gap-1 text-xs">
                  <Thermometer className="w-3 h-3 text-slate-500" />
                  <span className="text-slate-200 font-medium">
                    {day.tempMax}°
                  </span>
                  <span className="text-slate-500">{day.tempMin}°</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
