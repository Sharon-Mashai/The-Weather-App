
import type {
  ForecastData,
  SearchCityResult,
  WeatherData,
} from "../types/weather";

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

const BASE_URL = "https://api.openweathermap.org";
const WEATHER_URL = `${BASE_URL}/data/2.5`;
const GEO_URL = `${BASE_URL}/geo/1.0`;
const FETCH_TIMEOUT_MS = 10000;

if (!API_KEY) {
  console.error(
    "OpenWeather API key is missing. Add VITE_OPENWEATHER_API_KEY to your .env.local file."
  );
}

class TimeoutError extends Error {
  constructor(message = "Request timed out.") {
    super(message);
    this.name = "TimeoutError";
  }
}

function timedFetch(url: string): Promise<Response> {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  return fetch(url, { signal: controller.signal }).then(
    (response) => {
      window.clearTimeout(timer);
      return response;
    },
    (reason) => {
      window.clearTimeout(timer);
      if (reason instanceof DOMException && reason.name === "AbortError") {
        throw new TimeoutError();
      }
      throw reason;
    }
  );
}

export async function searchCity(
  city: string
): Promise<SearchCityResult[]> {
  const response = await timedFetch(
    `${GEO_URL}/direct?q=${encodeURIComponent(city)}&limit=5&appid=${API_KEY}`
  );

  if (!response.ok) {
    throw new Error("Unable to search city.");
  }

  return response.json();
}

async function resolveCoords(
  query: string | { lat: number; lon: number }
): Promise<{ lat: number; lon: number; name?: string }> {
  if (typeof query === "object") {
    return query;
  }

  const results = await searchCity(query);

  if (!results.length) {
    throw new Error("City not found.");
  }

  const match = results[0];

  return { lat: match.lat, lon: match.lon, name: match.name };
}

export async function getCurrentWeather(
  latOrCity: number | string,
  lon?: number
): Promise<WeatherData> {
  const coords =
    typeof latOrCity === "number" && typeof lon === "number"
      ? { lat: latOrCity, lon }
      : await resolveCoords(latOrCity as string);

  const response = await timedFetch(
    `${WEATHER_URL}/weather?lat=${coords.lat}&lon=${coords.lon}&units=metric&appid=${API_KEY}`
  );

  if (!response.ok) {
    throw new Error("Unable to fetch current weather.");
  }

  const data: WeatherData = await response.json();

  if (typeof latOrCity === "string" && coords.name) {
    data.name = coords.name;
  }

  return data;
}

export async function getForecast(
  latOrCity: number | string,
  lon?: number
): Promise<ForecastData> {
  const coords =
    typeof latOrCity === "number" && typeof lon === "number"
      ? { lat: latOrCity, lon }
      : await resolveCoords(latOrCity as string);

  const response = await timedFetch(
    `${WEATHER_URL}/forecast?lat=${coords.lat}&lon=${coords.lon}&units=metric&appid=${API_KEY}`
  );

  if (!response.ok) {
    throw new Error("Unable to fetch forecast.");
  }

  const data: ForecastData = await response.json();

  if (typeof latOrCity === "string" && coords.name) {
    data.city.name = coords.name;
  }

  return data;
}