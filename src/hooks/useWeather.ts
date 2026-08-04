

import { useCallback, useEffect, useState } from "react";

import {
  getCurrentWeather,
  getForecast,
  searchCity,
} from "../services/weatherApi";

import type {
  WeatherData,
  ForecastData,
} from "../types/weather";

import type { SavedLocation } from "../components/LocationsDrawer";

import { useLocalStorage } from "./useLocalStorage";

interface CachedWeather {
  weather: WeatherData;
  forecast: ForecastData;
  savedAt: number;
}

export function useWeather() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData | null>(null);

  const [city, setCity] = useState("Polokwane");
  const [country, setCountry] = useState("");

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [lastUpdated, setLastUpdated] = useState<number>();

  const [offline, setOffline] = useState(false);

  const [savedLocations, setSavedLocations] =
    useLocalStorage<SavedLocation[]>(
      "saved_locations",
      []
    );

  const [cache, setCache] =
    useLocalStorage<Record<string, CachedWeather>>(
      "weather_cache",
      {}
    );

  //-------------------------------------------------
  // Save Cache
  //-------------------------------------------------

  const saveCache = useCallback(
    (
      key: string,
      weather: WeatherData,
      forecast: ForecastData
    ) => {
      setCache((prev) => ({
        ...prev,
        [key]: {
          weather,
          forecast,
          savedAt: Date.now(),
        },
      }));
    },
    [setCache]
  );

  //-------------------------------------------------
  // Load Weather
  //-------------------------------------------------

  const loadWeather = useCallback(
    async (
      latitude: number,
      longitude: number,
      cityName?: string
    ) => {
      setLoading(true);
      setError("");

      const cacheKey =
        `${latitude.toFixed(2)}_${longitude.toFixed(2)}`;

      try {
        const weatherData =
          await getCurrentWeather(latitude, longitude);

        const forecastData =
          await getForecast(latitude, longitude);

        setWeather(weatherData);
        setForecast(forecastData);

        setCity(cityName ?? weatherData.name);

        setCountry(weatherData.sys.country);

        setOffline(false);

        setLastUpdated(Date.now());

        saveCache(
          cacheKey,
          weatherData,
          forecastData
        );

      } catch {

        const cached = cache[cacheKey];

        if (cached) {
          setWeather(cached.weather);
          setForecast(cached.forecast);
          setOffline(true);
        } else {
          setError(
            "Unable to load weather."
          );
        }

      } finally {
        setLoading(false);
      }
    },
    [cache, saveCache]
  );

  //-------------------------------------------------
  // Search City
  //-------------------------------------------------

  const searchWeather = useCallback(
    async (cityName: string) => {
      try {

        const results =
          await searchCity(cityName);

        if (!results.length) {
          setError("City not found.");
          return;
        }

        const location = results[0];

        await loadWeather(
          location.lat,
          location.lon,
          location.name
        );

      } catch {

        setError("City not found.");

      }
    },
    [loadWeather]
  );

  //-------------------------------------------------
  // Current Location
  //-------------------------------------------------

  const useCurrentLocation = useCallback(() => {

    if (!navigator.geolocation) {
      searchWeather("Polokwane");
      return;
    }

    navigator.geolocation.getCurrentPosition(

      async (position) => {

        await loadWeather(
          position.coords.latitude,
          position.coords.longitude
        );

      },

      () => {

        searchWeather("Polokwane");

      }

    );

  }, [loadWeather, searchWeather]);

  //-------------------------------------------------
  // Save Location
  //-------------------------------------------------

  const saveLocation = useCallback(() => {

    if (!weather) return;

    const exists =
      savedLocations.some(
        location =>
          location.name === weather.name
      );

    if (exists) return;

    const newLocation: SavedLocation = {

      id: Date.now().toString(),

      name: weather.name,

      country: weather.sys.country,

      lat: weather.coord.lat,

      lon: weather.coord.lon,

      isCurrent: false,

      lastTempC: weather.main.temp,

      icon: weather.weather[0].icon,

      updatedAt: Date.now(),

    };

    setSavedLocations([
      ...savedLocations,
      newLocation,
    ]);

  }, [
    weather,
    savedLocations,
    setSavedLocations,
  ]);

  //-------------------------------------------------
  // Remove Saved Location
  //-------------------------------------------------

  const removeLocation = useCallback(

    (id: string) => {

      setSavedLocations(
        savedLocations.filter(
          location => location.id !== id
        )
      );

    },

    [savedLocations, setSavedLocations]

  );

  //-------------------------------------------------
  // Select Saved Location
  //-------------------------------------------------

  const selectLocation = useCallback(

    async (location: SavedLocation) => {

      await loadWeather(
        location.lat,
        location.lon,
        location.name
      );

    },

    [loadWeather]

  );

  //-------------------------------------------------
  // Default Weather
  //-------------------------------------------------

  useEffect(() => {
    const t = window.setTimeout(() => {
      searchWeather("Polokwane");
    }, 0);
    return () => window.clearTimeout(t);
  }, [searchWeather]);

  //-------------------------------------------------

  return {

    weather,

    forecast,

    city,

    country,

    loading,

    error,

    offline,

    lastUpdated,

    searchWeather,

    useCurrentLocation,

    saveLocation,

    removeLocation,

    selectLocation,

    savedLocations,

  };

}