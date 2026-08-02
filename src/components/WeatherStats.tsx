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
            <circle cx="12" cy="12" r="10" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
        </div>
        <p className="statLabel">Pressure</p>
        <h3 className="statValue">{weather.main.pressure} hPa</h3>
      </div>
    </section>
  );
};

export default WeatherStats;
