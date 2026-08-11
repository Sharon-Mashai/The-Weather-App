
import type { ForecastData } from "../types/weather";
import type { TemperatureUnit } from "../utils/weather";

import {
  formatTemperatureShort,
  getForecastIcon,
  getShortDay,
} from "../utils/weather";

interface WeeklyForecastProps {
  forecast: ForecastData;
  unit: TemperatureUnit;
}

interface DailyForecast {
  day: string;
  icon: string;
  min: number;
  max: number;
  pop: number;
}

function WeeklyForecast({
  forecast,
  unit,
}: WeeklyForecastProps) {
  const grouped = new Map<string, DailyForecast>();

  forecast.list.forEach((item) => {
    const date = item.dt_txt.split(" ")[0];

    if (!grouped.has(date)) {
      grouped.set(date, {
        day: getShortDay(item.dt_txt),
        icon: item.weather[0].icon,
        min: item.main.temp_min,
        max: item.main.temp_max,
        pop: item.pop,
      });

      return;
    }

    const existing = grouped.get(date)!;

    existing.min = Math.min(existing.min, item.main.temp_min);

    existing.max = Math.max(existing.max, item.main.temp_max);

    if (item.pop > existing.pop) {
      existing.pop = item.pop;
    }
  });

  const dailyForecast = Array.from(grouped.values()).slice(0, 7);

  return (
    <section className="weeklyForecast">
      <div className="forecastList">
        {dailyForecast.map((day, index) => (
          <div
            className="forecastItem forecastItemExtended"
            key={index}
          >
            <div className="dayInfo">
              <p className="forecastDay">
                {day.day}
              </p>
            </div>

            <div className="dayIconWrap">
              <img
                src={getForecastIcon(day.icon)}
                alt=""
              />

              {day.pop > 0 && (
                <span className="popChip">
                  {Math.round(day.pop * 100)}%
                </span>
              )}
            </div>

            <div className="tempRangeWrap">
              <span className="tempRangeLow">
                {formatTemperatureShort(day.min, unit)}
              </span>

              <span className="tempRangeHigh">
                {formatTemperatureShort(day.max, unit)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default WeeklyForecast;
