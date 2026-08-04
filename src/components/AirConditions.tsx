import type { WeatherData, ForecastData } from "../types/weather";
import type { TemperatureUnit } from "../utils/weather";

import {
  formatTemp,
  formatSpeed,
} from "../utils/weather";

interface AirConditionsProps {
  weather: WeatherData;
  forecast: ForecastData;
  unit: TemperatureUnit;
}

function formatTime(unix: number) {
  return new Date(unix * 1000).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AirConditions({
  weather,
  unit,
}: AirConditionsProps) {
  return (
    <section className="airConditions">

      <div className="sectionHeading">
        <h2>Air Conditions</h2>
      </div>

      <div className="airGrid">

        <div className="airCard">
          <span className="airCardHead">
            Feels Like
          </span>

          <h3>
            {formatTemp(weather.main.feels_like, unit)}
          </h3>
        </div>

        <div className="airCard">
          <span className="airCardHead">
            Wind Speed
          </span>

          <h3>
            {formatSpeed(weather.wind.speed, unit)}
          </h3>
        </div>

        <div className="airCard">
          <span className="airCardHead">
            Humidity
          </span>

          <h3>
            {weather.main.humidity}%
          </h3>
        </div>

        <div className="airCard">
          <span className="airCardHead">
            Pressure
          </span>

          <h3>
            {weather.main.pressure} hPa
          </h3>
        </div>

        <div className="airCard">
          <span className="airCardHead">
            Visibility
          </span>

          <h3>
            {(weather.visibility / 1000).toFixed(1)} km
          </h3>
        </div>

        <div className="airCard">
          <span className="airCardHead">
            Cloud Cover
          </span>

          <h3>
            {weather.clouds.all}%
          </h3>
        </div>

        <div className="airCard airCardSpan">

          <div className="sunRow">

            <div className="sunCell">

              <span className="airCardHead">
                Sunrise
              </span>

              <h3>
                {formatTime(weather.sys.sunrise)}
              </h3>

            </div>

            <div className="sunDivider"></div>

            <div className="sunCell">

              <span className="airCardHead">
                Sunset
              </span>

              <h3>
                {formatTime(weather.sys.sunset)}
              </h3>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}