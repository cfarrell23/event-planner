import { getMockForecast } from "../mockData";
import type { DayForecast } from "../types";

const LONDON_LAT = 51.5072;
const LONDON_LNG = -0.1276;

/**
 * Fetches a daily forecast for the given dates. Falls back to deterministic mock data
 * (per PRD NFR-03) if no API key is configured or the OpenWeatherMap call fails.
 */
export async function getWeekForecast(dates: string[]): Promise<DayForecast[]> {
  const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
  if (!apiKey) {
    return getMockForecast(dates);
  }

  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast/daily?lat=${LONDON_LAT}&lon=${LONDON_LNG}&cnt=${dates.length}&units=metric&appid=${apiKey}`,
    );
    if (!res.ok) throw new Error(`OpenWeatherMap responded ${res.status}`);
    const json = await res.json();
    return dates.map((date, i) => {
      const day = json.list?.[i];
      if (!day) return getMockForecast([date])[0];
      return {
        date,
        tempC: Math.round(day.temp.day),
        condition: mapCondition(day.weather?.[0]?.main),
        summary: day.weather?.[0]?.description ?? "No summary available",
      };
    });
  } catch {
    return getMockForecast(dates);
  }
}

function mapCondition(main: string | undefined): DayForecast["condition"] {
  switch (main) {
    case "Clear":
      return "sunny";
    case "Clouds":
      return "cloudy";
    case "Rain":
    case "Drizzle":
    case "Thunderstorm":
      return "rainy";
    default:
      return "windy";
  }
}
