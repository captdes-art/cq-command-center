export interface MarineForecastPeriod {
  number: number;
  name: string;
  detailedForecast: string;
  startTime: string;
  endTime: string;
}

export interface MarineForecastData {
  periods: MarineForecastPeriod[];
  updatedAt: string;
}

// Check if forecast text contains advisory/warning keywords
export function hasAdvisory(text: string): boolean {
  const advisoryKeywords = [
    "small craft advisory",
    "gale warning",
    "storm warning",
    "hurricane warning",
    "hazardous seas",
    "special marine warning",
  ];
  const lower = text.toLowerCase();
  return advisoryKeywords.some((keyword) => lower.includes(keyword));
}

// Extract wind info from forecast text for highlighting
export function extractWindInfo(text: string): string | null {
  const windPatterns = [
    /winds?\s+\w+\s+\d+\s+to\s+\d+\s+(?:kt|knots?|mph)/i,
    /\w+\s+winds?\s+\d+\s+to\s+\d+\s+(?:kt|knots?|mph)/i,
    /winds?\s+\d+\s+to\s+\d+\s+(?:kt|knots?|mph)/i,
  ];

  for (const pattern of windPatterns) {
    const match = text.match(pattern);
    if (match) return match[0];
  }
  return null;
}

// Extract seas/wave info from forecast text
export function extractSeasInfo(text: string): string | null {
  const seasPatterns = [
    /seas?\s+\d+\s+to\s+\d+\s+(?:ft|feet)/i,
    /waves?\s+\d+\s+to\s+\d+\s+(?:ft|feet)/i,
    /seas?\s+\d+\s+(?:ft|feet)/i,
  ];

  for (const pattern of seasPatterns) {
    const match = text.match(pattern);
    if (match) return match[0];
  }
  return null;
}
