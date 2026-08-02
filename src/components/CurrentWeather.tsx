import type { WeatherData } from "../types/weather";
import type { TemperatureUnit } from "../utils/weather";

interface CurrentWeatherProps {
  weather: WeatherData;
  unit: TemperatureUnit;
}

const descriptionMap: Record<string, string> = {
  "clear sky": "Clear and sunny skies ahead.",
  "few clouds": "Partly cloudy throughout the day.",
  "scattered clouds": "Scattered clouds expected today.",
  "broken clouds": "Broken clouds overhead.",
  "shower rain": "Expect showers today.",
  rain: "Expect rain today.",
  "light rain": "Light rain throughout the day.",
  "moderate rain": "Expect moderate rain today.",
  "heavy intensity rain": "Expect heavy rain today.",
  thunderstorm: "Thunderstorms likely today.",
  snow: "Snowfall expected today.",
  mist: "Misty conditions throughout the day.",
  fog: "Foggy weather expected.",
  haze: "Hazy conditions today.",
  smoke: "Smoky conditions, stay indoors.",
  dust: "Dusty conditions expected.",
  "overcast clouds": "Overcast skies all day.",
};

const CurrentWeather = ({ weather, unit }: CurrentWeatherProps) => {
  const rawDesc = weather.weather[0].description.toLowerCase();
  const description =
    descriptionMap[rawDesc] ||
    `Expect ${weather.weather[0].description.toLowerCase()} today.`;

  const tempValue = Math.round(
    unit === "F" ? weather.main.temp * 1.8 + 32 : weather.main.temp
  );
  const unitLabel = unit === "F" ? "°F" : "°c";

  return (
    <section className="currentWeather">
      <div className="currentWeatherInfo">
        <div className="weatherIcon">
          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`}
            alt={weather.weather[0].description}
            loading="lazy"
          />
        </div>

        <div className="weatherText">
          <h1>
            {tempValue}
            <span>{unitLabel}</span>
          </h1>
          <p className="description">{description}</p>
        </div>
      </div>
    </section>
  );
};

export default CurrentWeather;
