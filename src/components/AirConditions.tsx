import type { WeatherData } from "../types/weather";

interface AirConditionsProps {
  weather: WeatherData;
}

export const AirConditions = ({ weather }: AirConditionsProps) => {
  const visibilityKm = weather.visibility
    ? Math.round(weather.visibility / 1000)
    : 10;

  return (
    <section className="airConditions">
      <h2>Air Conditions</h2>

      <div className="airGrid">
        <div className="airCard">
          <span>Visibility</span>
          <h3>{visibilityKm} km</h3>
        </div>

        <div className="airCard">
          <span>Feels Like</span>
          <h3>{Math.round(weather.main.feels_like)}°</h3>
        </div>

        <div className="airCard">
          <span>Humidity</span>
          <h3>{weather.main.humidity}%</h3>
        </div>

        <div className="airCard">
          <span>Wind Speed</span>
          <h3>{weather.wind.speed} m/s</h3>
        </div>
      </div>
    </section>
  );
};