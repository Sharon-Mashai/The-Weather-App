import type { WeatherData } from "../types/weather";
import { formatTemp, type TemperatureUnit } from "../utils/weather";

interface CurrentWeatherProps {
  weather: WeatherData;
  unit: TemperatureUnit;
}

export default function CurrentWeather({
  weather,
  unit,
}: CurrentWeatherProps) {
  const icon = weather.weather[0].icon;

  const iconUrl = `https://openweathermap.org/img/wn/${icon}@4x.png`;

  return (
    <section className="currentWeather">
      <div className="locationBlock">
        <h2 className="locationName">{weather.name}</h2>

        <p className="locationCountry">
          {weather.sys.country}
        </p>
      </div>

      <div className="weatherIcon">
        <img
          src={iconUrl}
          alt={weather.weather[0].description}
        />
      </div>

      <div className="weatherInfo">
        <h1>{formatTemp(weather.main.temp, unit)}</h1>

        <p className="weatherDescription">
          {weather.weather[0].description}
        </p>
      </div>

   
    </section>
  );
}