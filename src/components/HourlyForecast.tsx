import type { ForecastData } from "../types/weather";
import type { TemperatureUnit } from "../utils/weather";

import {
  formatTempShort,
  getWeatherIcon,
} from "../utils/weather";

interface HourlyForecastProps {
  forecast: ForecastData;
  unit: TemperatureUnit;
}

function HourlyForecast({
  forecast,
  unit,
}: HourlyForecastProps) {

  const hourly = forecast.list.slice(0, 8);

  return (

    <section className="hourlyForecast">

      <div className="hourlyCards">

        {hourly.map((hour) => {

          const time = new Date(hour.dt * 1000);

          const hourLabel = time.toLocaleTimeString([], {
            hour: "numeric",
          });

          return (

            <div
              key={hour.dt}
              className="hourCard"
            >

              <p className="hourLabel">
                {hourLabel}
              </p>

              <img
                src={getWeatherIcon(hour.weather[0].icon)}
                alt={hour.weather[0].description}
              />

              <p className="hourTemp">
                {formatTempShort(
                  hour.main.temp,
                  unit
                )}
              </p>

              {hour.pop > 0 && (

                <span className="hourPop">

                  {Math.round(hour.pop * 100)}%

                </span>

              )}

            </div>

          );

        })}

      </div>

    </section>

  );

}

export default HourlyForecast;