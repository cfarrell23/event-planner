import { Sun, Cloud, CloudRain, Moon, Wind } from "lucide-react";
import type { DayForecast } from "@/lib/types";

const ICONS: Record<DayForecast["condition"], typeof Sun> = {
  sunny: Sun,
  cloudy: Cloud,
  rainy: CloudRain,
  "clear-night": Moon,
  windy: Wind,
};

export function WeatherBadge({ forecast }: { forecast: DayForecast }) {
  const Icon = ICONS[forecast.condition];
  return (
    <div
      className="flex items-center gap-1.5 text-xs text-muted"
      title={forecast.summary}
      aria-label={`Forecast: ${forecast.summary}, ${forecast.tempC} degrees Celsius`}
    >
      <Icon size={14} aria-hidden />
      <span>{forecast.tempC}°C</span>
    </div>
  );
}
