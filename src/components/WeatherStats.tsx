import type { WeatherData } from "../types/weather";
import type { TemperatureUnit } from "../utils/weather";
import { formatSpeed } from "../utils/weather";

interface WeatherStatsProps {
  weather: WeatherData;
  unit: TemperatureUnit;
}

function WeatherStats({ weather, unit }: WeatherStatsProps) {
  return (
    <section className="weatherStats">

      <div className="statCard">
        <div className="statLabel">Feels Like</div>

        <div className="statValue">
          {Math.round(weather.main.feels_like)}°
          {unit}
        </div>
      </div>

      <div className="statCard">
        <div className="statLabel">Humidity</div>

        <div className="statValue">
          {weather.main.humidity}%
        </div>
      </div>

      <div className="statCard">
        <div className="statLabel">Wind</div>

        <div className="statValue">
          {formatSpeed(weather.wind.speed, unit)}
        </div>
      </div>

      <div className="statCard">
        <div className="statLabel">Pressure</div>

        <div className="statValue">
          {weather.main.pressure} hPa
        </div>
      </div>

    </section>
  );
}

export default WeatherStats;