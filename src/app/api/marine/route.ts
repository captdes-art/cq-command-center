import { NextResponse } from "next/server";

const NOAA_MARINE_URL =
  "https://api.weather.gov/zones/forecast/ANZ331/forecast";

const FALLBACK_URL =
  "https://marine.weather.gov/MapClick.php?zonetype=2&zoneinfo=ANZ331";

export const revalidate = 1800; // 30 minutes

export async function GET() {
  try {
    const res = await fetch(NOAA_MARINE_URL, {
      headers: {
        "User-Agent": "CQCommandCenter (contact@celticquestfishing.com)",
        Accept: "application/geo+json",
      },
      next: { revalidate: 1800 },
    });

    if (!res.ok) {
      return NextResponse.json(
        {
          error: "Failed to fetch marine forecast",
          fallbackUrl: FALLBACK_URL,
          periods: [],
          updatedAt: new Date().toISOString(),
        },
        { status: 502 }
      );
    }

    const data = await res.json();
    const periods = (data.properties?.periods || [])
      .slice(0, 6)
      .map(
        (p: {
          number: number;
          name: string;
          detailedForecast: string;
          startTime: string;
          endTime: string;
        }) => ({
          number: p.number,
          name: p.name,
          detailedForecast: p.detailedForecast,
          startTime: p.startTime,
          endTime: p.endTime,
        })
      );

    return NextResponse.json({
      periods,
      updatedAt: data.properties?.updateTime || new Date().toISOString(),
      fallbackUrl: FALLBACK_URL,
    });
  } catch {
    return NextResponse.json(
      {
        error: "Marine forecast unavailable",
        fallbackUrl: FALLBACK_URL,
        periods: [],
        updatedAt: new Date().toISOString(),
      },
      { status: 502 }
    );
  }
}
