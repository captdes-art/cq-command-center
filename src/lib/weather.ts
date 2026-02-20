export interface CurrentWeather {
  temperature: number;
  windSpeed: number;
  windDirection: number;
  weatherCode: number;
}

export interface DailyForecast {
  date: string;
  weatherCode: number;
  tempMax: number;
  tempMin: number;
  sunrise: string;
  sunset: string;
}

export interface WeatherData {
  current: CurrentWeather;
  daily: DailyForecast[];
  sunrise: string;
  sunset: string;
}

const WEATHER_API_URL =
  "https://api.open-meteo.com/v1/forecast?latitude=40.9465&longitude=-73.0691&current=temperature_2m,wind_speed_10m,wind_direction_10m,weather_code&hourly=temperature_2m,precipitation_probability,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=America/New_York";

export async function fetchWeather(): Promise<WeatherData> {
  const res = await fetch(WEATHER_API_URL);
  if (!res.ok) throw new Error("Failed to fetch weather data");
  const data = await res.json();

  const daily: DailyForecast[] = data.daily.time.map(
    (date: string, i: number) => ({
      date,
      weatherCode: data.daily.weather_code[i],
      tempMax: Math.round(data.daily.temperature_2m_max[i]),
      tempMin: Math.round(data.daily.temperature_2m_min[i]),
      sunrise: data.daily.sunrise[i],
      sunset: data.daily.sunset[i],
    })
  );

  return {
    current: {
      temperature: Math.round(data.current.temperature_2m),
      windSpeed: Math.round(data.current.wind_speed_10m),
      windDirection: data.current.wind_direction_10m,
      weatherCode: data.current.weather_code,
    },
    daily: daily.slice(0, 5),
    sunrise: data.daily.sunrise[0],
    sunset: data.daily.sunset[0],
  };
}

// WMO Weather Code to description and icon name
export function getWeatherInfo(code: number): {
  description: string;
  icon: string;
} {
  const map: Record<number, { description: string; icon: string }> = {
    0: { description: "Clear sky", icon: "Sun" },
    1: { description: "Mainly clear", icon: "Sun" },
    2: { description: "Partly cloudy", icon: "CloudSun" },
    3: { description: "Overcast", icon: "Cloud" },
    45: { description: "Foggy", icon: "CloudFog" },
    48: { description: "Depositing rime fog", icon: "CloudFog" },
    51: { description: "Light drizzle", icon: "CloudDrizzle" },
    53: { description: "Moderate drizzle", icon: "CloudDrizzle" },
    55: { description: "Dense drizzle", icon: "CloudDrizzle" },
    61: { description: "Slight rain", icon: "CloudRain" },
    63: { description: "Moderate rain", icon: "CloudRain" },
    65: { description: "Heavy rain", icon: "CloudRainWind" },
    66: { description: "Light freezing rain", icon: "CloudHail" },
    67: { description: "Heavy freezing rain", icon: "CloudHail" },
    71: { description: "Slight snow", icon: "Snowflake" },
    73: { description: "Moderate snow", icon: "Snowflake" },
    75: { description: "Heavy snow", icon: "Snowflake" },
    77: { description: "Snow grains", icon: "Snowflake" },
    80: { description: "Slight showers", icon: "CloudRain" },
    81: { description: "Moderate showers", icon: "CloudRain" },
    82: { description: "Violent showers", icon: "CloudRainWind" },
    85: { description: "Slight snow showers", icon: "CloudSnow" },
    86: { description: "Heavy snow showers", icon: "CloudSnow" },
    95: { description: "Thunderstorm", icon: "CloudLightning" },
    96: { description: "Thunderstorm w/ hail", icon: "CloudLightning" },
    99: { description: "Thunderstorm w/ heavy hail", icon: "CloudLightning" },
  };

  return map[code] || { description: "Unknown", icon: "Cloud" };
}

// Convert wind direction degrees to compass label
export function getWindDirection(degrees: number): string {
  const directions = [
    "N",
    "NNE",
    "NE",
    "ENE",
    "E",
    "ESE",
    "SE",
    "SSE",
    "S",
    "SSW",
    "SW",
    "WSW",
    "W",
    "WNW",
    "NW",
    "NNW",
  ];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
}

// Format time from ISO string to 12-hour format
export function formatTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "America/New_York",
  });
}

// Get day name from date string
export function getDayName(dateString: string): string {
  const date = new Date(dateString + "T12:00:00");
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow";

  return date.toLocaleDateString("en-US", { weekday: "short" });
}
