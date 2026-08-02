import type { WeatherData } from "../types/weather";
import type { TemperatureUnit } from "../utils/weather";
import { formatSpeed } from "../utils/weather";

interface WeatherStatsProps {
  weather: WeatherData;
  unit: TemperatureUnit;
}

const WeatherStats = ({ weather, unit }: WeatherStatsProps) => {
  const sunshineHours = (() => {
    const main = weather.weather[0].main.toLowerCase();
    if (main.includes("clear") || main.includes("sun")) return 11;
    if (main.includes("few")) return 9;
    if (main.includes("cloud") || main.includes("scatter")) return 6;
    if (main.includes("broken") || main.includes("overcast")) return 3;
    if (main.includes("rain") || main.includes("shower")) return 2;
    if (main.includes("thunder")) return 1;
    if (main.includes("snow")) return 3;
    if (main.includes("mist") || main.includes("fog") || main.includes("haze")) return 5;
    return 8;
  })();

  const precipitationPct = (() => {
    const w = weather.weather[0].main.toLowerCase();
    const rainMm = weather.rain?.["1h"] ?? weather.rain?.["3h"] ?? 0;
    const snowMm = weather.snow?.["1h"] ?? weather.snow?.["3h"] ?? 0;
    if (rainMm > 5 || snowMm > 3) return 92;
    if (rainMm > 0 || snowMm > 0) return Math.round(Math.min(90, 40 + Math.max(rainMm, snowMm) * 12));
    if (w.includes("thunder")) return 85;
    if (w.includes("snow") || w.includes("blizzard")) return 78;
    if (w.includes("rain") || w.includes("shower") || w.includes("drizzle")) return 68;
    if (w.includes("mist") || w.includes("fog")) return 42;
    if (w.includes("cloud") || w.includes("overcast") || w.includes("broken")) return 24;
    if (w.includes("scatter") || w.includes("few")) return 12;
    if (w.includes("clear") || w.includes("sun")) return 2;
    return 18;
  })();

  return (
    <section className="weatherStats" aria-label="Weather conditions">
      <div className="statCard">
        <div className="statIconWrap">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="statSvg">
            <path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2" />
            <path d="M9.6 4.6A2 2 0 1 1 11 8H2" />
            <path d="M12.6 19.4A2 2 0 1 0 14 16H2" />
          </svg>
        </div>
        <p className="statLabel">Wind</p>
        <h3 className="statValue">{formatSpeed(weather.wind.speed, unit)}</h3>
      </div>

      <div className="statCard">
        <div className="statIconWrap">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="statSvg">
            <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
          </svg>
        </div>
        <p className="statLabel">Humidity</p>
        <h3 className="statValue">{weather.main.humidity}%</h3>
      </div>

      <div className="statCard">
        <div className="statIconWrap">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="statSvg">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2" />
            <path d="M12 20v2" />
            <path d="m4.93 4.93 1.41 1.41" />
            <path d="m17.66 17.66 1.41 1.41" />
            <path d="M2 12h2" />
            <path d="M20 12h2" />
          </svg>
        </div>
        <p className="statLabel">Sunshine</p>
        <h3 className="statValue">{sunshineHours}hr</h3>
      </div>

      <div className="statCard hideSm">
        <div className="statIconWrap">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="statSvg">
            <path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25" />
            <line x1="8" y1="19" x2="8" y2="22" />
            <line x1="12" y1="19" x2="12" y2="22" />
            <line x1="16" y1="19" x2="16" y2="22" />
          </svg>
        </div>
        <p className="statLabel">Precipitation</p>
        <h3 className="statValue">{precipitationPct}%</h3>
      </div>
    </section>
  );
};

export default WeatherStats;
