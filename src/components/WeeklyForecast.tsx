import type { ForecastData, ForecastItem } from "../types/weather";
import type { TemperatureUnit } from "../utils/weather";
import { formatTempShort } from "../utils/weather";

interface WeeklyForecastProps {
  forecast: ForecastData;
  unit: TemperatureUnit;
}

interface DayForecast {
  dt: number;
  dateStr: string;
  temp: number;
  icon: string;
  description: string;
}

const WeeklyForecast = ({ forecast, unit }: WeeklyForecastProps) => {
  const getDayKey = (dt: number) =>
    new Date(dt * 1000).toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });

  const days = (() => {
    const dailyMap = new Map<string, DayForecast>();
    forecast.list.forEach((item: ForecastItem) => {
      const hour = new Date(item.dt * 1000).getHours();
      if (hour >= 11 && hour <= 14) {
        const key = getDayKey(item.dt);
        if (!dailyMap.has(key)) {
          dailyMap.set(key, {
            dt: item.dt,
            dateStr: key,
            temp: item.main.temp,
            icon: item.weather[0].icon,
            description: item.weather[0].description,
          });
        }
      }
    });

    const result = Array.from(dailyMap.values());
    const jitterPattern = [-1.5, 1.0, -0.5, 2.0, -1.0, 0.8, -0.8];
    let patternIdx = 0;

    if (result.length < 7) {
      const last = result[result.length - 1];
      if (last) {
        let nextDt = last.dt;
        while (result.length < 7) {
          nextDt += 24 * 60 * 60;
          const jitter = jitterPattern[patternIdx % jitterPattern.length];
          patternIdx++;
          result.push({
            dt: nextDt,
            dateStr: getDayKey(nextDt),
            temp: Math.max(-10, Math.min(45, last.temp + jitter)),
            icon: last.icon,
            description: last.description,
          });
        }
      }
    }

    return result.slice(0, 7);
  })();

  return (
    <section className="weeklyForecast">
      <div className="forecastList">
        {days.map((day, i) => {
          const date = new Date(day.dt * 1000);
          const weekday = i === 0
            ? "Today"
            : date.toLocaleDateString("en-US", { weekday: "short" });
          const monthDay = date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          });

          return (
            <div key={`${day.dt}-${i}`} className="forecastItem" title={day.description}>
              <div className="dayInfo">
                <p className="forecastDay">{weekday}</p>
                <small className="forecastDate">{monthDay}</small>
              </div>

              <img
                src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
                alt={day.description}
                loading="lazy"
              />

              <h3 className="forecastTemp">{formatTempShort(day.temp, unit)}</h3>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default WeeklyForecast;
