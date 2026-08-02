import type { WeatherData } from "../types/weather";
import type { ForecastData } from "../types/weather";
import type { TemperatureUnit } from "../utils/weather";
import { formatTempShort } from "../utils/weather";

interface AirConditionsProps {
  weather: WeatherData;
  forecast?: ForecastData;
  unit: TemperatureUnit;
}

const formatClock = (ts?: number) => {
  if (!ts) return "—";
  return new Date(ts * 1000).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

export const AirConditions = ({ weather, forecast, unit }: AirConditionsProps) => {
  const visibilityKm = weather.visibility
    ? Math.round(weather.visibility / 1000)
    : 10;

  const cloudPct = weather.clouds?.all ?? 0;
  const sunrise = weather.sys?.sunrise ?? forecast?.city?.sunrise;
  const sunset = weather.sys?.sunset ?? forecast?.city?.sunset;

  const todayMin = weather.main.temp_min;
  const todayMax = weather.main.temp_max;

  return (
    <section className="airConditions">
      <div className="sectionHeading">
        <div className="titleWrap">
          <span className="headingIcon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2" />
              <circle cx="12" cy="13" r="3" />
            </svg>
          </span>
          <h2>Air & Details</h2>
        </div>
      </div>

      <div className="airGrid">
        <div className="airCard">
          <div className="airCardHead">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" />
            </svg>
            <span>Feels Like</span>
          </div>
          <h3>{formatTempShort(weather.main.feels_like, unit)}</h3>
        </div>

        <div className="airCard">
          <div className="airCardHead">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            <span>Visibility</span>
          </div>
          <h3>{visibilityKm} km</h3>
        </div>

        <div className="airCard">
          <div className="airCardHead">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            <span>Pressure</span>
          </div>
          <h3>{weather.main.pressure} hPa</h3>
        </div>

        <div className="airCard">
          <div className="airCardHead">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9z" />
            </svg>
            <span>Cloud Cover</span>
          </div>
          <h3>{cloudPct}%</h3>
        </div>

        <div className="airCard airCardSpan">
          <div className="sunRow">
            <div className="sunCell">
              <div className="airCardHead">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                </svg>
                <span>Sunrise</span>
              </div>
              <h3>{formatClock(sunrise)}</h3>
            </div>
            <div className="sunDivider" />
            <div className="sunCell">
              <div className="airCardHead">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
                <span>Sunset</span>
              </div>
              <h3>{formatClock(sunset)}</h3>
            </div>
          </div>
        </div>

        <div className="airCard airCardSpan">
          <div className="rangeRow">
            <div className="rangeLabel">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v20M5 9l7-7 7 7" />
              </svg>
              <span>Today's Range</span>
            </div>
            <div className="rangeValues">
              <strong className="rangeLow">{formatTempShort(todayMin, unit)}</strong>
              <div className="rangeBar">
                <div className="rangeFill" />
              </div>
              <strong className="rangeHigh">{formatTempShort(todayMax, unit)}</strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AirConditions;