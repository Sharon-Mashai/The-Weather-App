import axios from "axios";

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

const BASE_URL = "https://api.openweathermap.org/data/2.5";
const GEO_URL = "https://api.openweathermap.org/geo/1.0";

if (!API_KEY) {
  console.warn("VITE_OPENWEATHER_API_KEY is not set.");
}

export const weatherApi = axios.create({
  baseURL: BASE_URL,
});

export const getCurrentWeather = async (latitude: number, longitude: number) => {
  const response = await weatherApi.get("/weather", {
    params: {
      lat: latitude,
      lon: longitude,
      units: "metric",
      appid: API_KEY,
    },
  });

  return response.data;
};

export const getForecast = async (latitude: number, longitude: number) => {
  const response = await weatherApi.get("/forecast", {
    params: {
      lat: latitude,
      lon: longitude,
      units: "metric",
      appid: API_KEY,
    },
  });

  return response.data;
};

export const searchCity = async (city: string) => {
  const response = await axios.get(`${GEO_URL}/direct`, {
    params: {
      q: city,
      limit: 5,
      appid: API_KEY,
    },
  });

  return response.data;
};