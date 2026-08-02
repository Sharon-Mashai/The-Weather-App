import type { ForecastData } from "../types/weather";
import type { TemperatureUnit } from "../utils/weather";
import { formatTempShort } from "../utils/weather";

interface HourlyForecastProps {
  forecast: ForecastData;
  unit: TemperatureUnit;
}

const HourlyForecast = ({ forecast, unit }: HourlyForecastProps) => {
  const hours = forecast.list.slice(0, 16);

  return (
    <section className="hourlyForecast">
      <div className="hourlyCards">
        {hours.map((item, index) => {
          const date = new Date(item.dt * 1000);
          const isNow = index === 0;

          const label = isNow
            ? "Now"
            : date.toLocaleTimeString([], {
                hour: "numeric",
                hour12: true,
              });

          const pop = item.pop ?? 0;
          const showPop = pop >= 0.1;

          return (
            <div
              key={item.dt}
              className={`hourCard ${isNow ? "nowCard" : ""}`}
              title={`${label} — ${item.weather[0].description}${
                showPop ? ` · Precipitation ${Math.round(pop * 100)}%` : ""
              }`}
            >
              <p className="hourLabel">{label}</p>
              {showPop && (
                <span className="hourPop">{Math.round(pop * 100)}%</span>
              )}
              <img
                src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                alt={item.weather[0].description}
                loading="lazy"
              />
              <h3 className="hourTemp">{formatTempShort(item.main.temp, unit)}</h3>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default HourlyForecast;
