import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./global.css";
import Header from "./components/Header";
import CurrentWeather from "./components/CurrentWeather";
import ForecastTabs from "./components/ForecastTabs";
import HourlyForecast from "./components/HourlyForecast";
import WeeklyForecast from "./components/WeeklyForecast";
import AirConditions from "./components/AirConditions";
import LocationsDrawer, {type SavedLocation,} from "./components/LocationsDrawer";
import {ToastStack,type ToastItem,type ToastKind,} from "./components/ToastStack";
import Loading from "./components/Loading";
import { getCurrentWeather, getForecast } from "./services/weatherApi";
import type { WeatherData, ForecastData } from "./types/weather";
import { getSevereAlert, type TemperatureUnit } from "./utils/weather";
import { useLocalStorage } from "./hooks/useLocalStorage";

const DEFAULT_CITY = "Polokwane";

const POLOKWANE_COORDS = {
  lat: -26.2041,
  lon: 28.0473,
};

export default function App() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState<number>();
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  /* Forecast */
  const [forecastTab, setForecastTab] = useState<"hourly" | "weekly">(
    "hourly",
  );

  /* Panels */
  const [drawerOpen, setDrawerOpen] = useState(false);

  /* Settings */
  const [unit, setUnit] = useLocalStorage<TemperatureUnit>("unit", "C");

  const [theme, setTheme] = useLocalStorage<"dark" | "light">(
    "theme",
    "dark",
  );

  const [savedLocations, setSavedLocations] = useLocalStorage<
    SavedLocation[]
  >("savedLocations", []);

  const [activeCity, setActiveCity] = useLocalStorage(
    "activeCity",
    DEFAULT_CITY,
  );

  const [searchedLocation, setSearchedLocation] =
    useState<SavedLocation | null>(null);

  /* Notifications */
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const initializedRef = useRef(false);

  const dismissToast = useCallback((id: number) => {
    setToasts((previousToasts) =>
      previousToasts.filter((toast) => toast.id !== id),
    );
  }, []);

  const showNotification = useCallback(
    (message: string, kind: ToastKind = "info") => {
      const id = Date.now() + Math.random();

      setToasts((previousToasts) => [
        ...previousToasts,
        {
          id,
          message,
          kind,
        },
      ]);

      window.setTimeout(() => {
        setToasts((previousToasts) =>
          previousToasts.filter((toast) => toast.id !== id),
        );
      }, 4000);
    },
    [],
  );

  const persistWeatherSnapshot = useCallback(
    (weatherData: WeatherData, forecastData: ForecastData, city: string) => {
      const snapshot = {
        weather: weatherData,
        forecast: forecastData,
        city,
        savedAt: Date.now(),
      };

      localStorage.setItem("lastWeather", JSON.stringify(snapshot));
    },
    [],
  );

  const readCachedWeatherSnapshot = useCallback(() => {
    try {
      const storedWeather = localStorage.getItem("lastWeather");

      if (!storedWeather) {
        return null;
      }

      const parsed = JSON.parse(storedWeather);

      if (!parsed.weather || !parsed.forecast) {
        return null;
      }

      return parsed;
    } catch {
      return null;
    }
  }, []);

  const applyWeatherPayload = useCallback(
    (weatherData: WeatherData, forecastData: ForecastData, city: string) => {
      setWeather(weatherData);
      setForecast(forecastData);
      setActiveCity(city);
      setLastUpdated(Date.now());
      setIsOffline(false);

      persistWeatherSnapshot(weatherData, forecastData, city);
    },
    [persistWeatherSnapshot, setActiveCity],
  );

  const showCachedWeather = useCallback(
    (cached: ReturnType<typeof readCachedWeatherSnapshot>) => {
      if (!cached) return;

      setWeather(cached.weather);
      setForecast(cached.forecast);
      setActiveCity(cached.city);
      setLastUpdated(cached.savedAt);
      setIsOffline(true);
      setError("");

      showNotification(
        "Showing cached weather because you are offline.",
        "warning",
      );
    },
    [setActiveCity, showNotification],
  );

  const raiseSevereWeatherAlert = useCallback(
    (weatherData: WeatherData) => {
      const alert = getSevereAlert(weatherData.weather[0]?.main ?? "");

      if (!alert) return;

      showNotification(alert, "warning");

      if ("Notification" in window && Notification.permission === "granted") {
        new Notification(`Weather Alert - ${weatherData.name}`, {
          body: alert,
        });
      }
    },
    [showNotification],
  );

  const activeLocationId = useMemo(() => {
    if (!weather) {
      return null;
    }

    const location = savedLocations.find(
      (savedLocation) =>
        savedLocation.name.toLowerCase() === weather.name.toLowerCase(),
    );

    return location ? location.id : null;
  }, [savedLocations, weather]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const loadWeatherByCoords = useCallback(
    async (
      lat: number,
      lon: number,
      cityName?: string,
    ): Promise<boolean> => {
      try {
        setLoading(true);
        setError("");

        const [weatherData, forecastData] = await Promise.all([
          getCurrentWeather(lat, lon),
          getForecast(lat, lon),
        ]);

        if (cityName) {
          weatherData.name = cityName;
          forecastData.city.name = cityName;
        }

        applyWeatherPayload(weatherData, forecastData, weatherData.name);

        raiseSevereWeatherAlert(weatherData);

        return true;
      } catch {
        const cached = readCachedWeatherSnapshot();

        if (cached) {
          showCachedWeather(cached);
          return true;
        }

        setError("Unable to load weather.");

        return false;
      } finally {
        setLoading(false);
      }
    },
    [
      applyWeatherPayload,
      raiseSevereWeatherAlert,
      readCachedWeatherSnapshot,
      showCachedWeather,
    ],
  );

  const loadWeatherByCity = useCallback(
    async (city: string): Promise<boolean> => {
      try {
        setLoading(true);
        setError("");

        const [weatherData, forecastData] = await Promise.all([
          getCurrentWeather(city),
          getForecast(city),
        ]);

        applyWeatherPayload(weatherData, forecastData, weatherData.name);

        raiseSevereWeatherAlert(weatherData);

        return true;
      } catch {
        const cached = readCachedWeatherSnapshot();

        if (cached) {
          showCachedWeather(cached);
          return true;
        }

        setError("Unable to load weather.");

        return false;
      } finally {
        setLoading(false);
      }
    },
    [
      applyWeatherPayload,
      raiseSevereWeatherAlert,
      readCachedWeatherSnapshot,
      showCachedWeather,
    ],
  );

  const showDefaultWeather = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const weatherData = await getCurrentWeather(DEFAULT_CITY);
      const forecastData = await getForecast(DEFAULT_CITY);

      applyWeatherPayload(weatherData, forecastData, weatherData.name);
    } catch {
      const cached = readCachedWeatherSnapshot();

      if (cached) {
        showCachedWeather(cached);
      } else {
        setError("Unable to load weather.");
      }
    } finally {
      setLoading(false);
    }
  }, [applyWeatherPayload, readCachedWeatherSnapshot, showCachedWeather]);

  const loadCurrentLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      await showDefaultWeather();
      showNotification(
        "Geolocation is not supported. Using Polokwane.",
        "info",
      );
      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        await loadWeatherByCoords(
          position.coords.latitude,
          position.coords.longitude,
        );

        setLoading(false);
        showNotification("Using your current location.", "success");
      },

      async () => {
        await loadWeatherByCoords(
          POLOKWANE_COORDS.lat,
          POLOKWANE_COORDS.lon,
          "Polokwane",
        );

        setLoading(false);
        showNotification("Using Polokwane as your location.", "info");
      },

      {
        timeout: 8000,
        maximumAge: 60000,
      },
    );
  }, [loadWeatherByCoords, showDefaultWeather, showNotification]);

  useEffect(() => {
    if (initializedRef.current) {
      return;
    }

    initializedRef.current = true;

    async function initialiseApp() {
      await loadCurrentLocation();
    }

    window.setTimeout(() => {
      initialiseApp();
    }, 0);
  }, [loadCurrentLocation]);

  useEffect(() => {
    function handleConnectionChange() {
      const online = navigator.onLine;

      setIsOffline(!online);

      if (!online) {
        const cached = readCachedWeatherSnapshot();

        if (cached) {
          showCachedWeather(cached);
        }
      } else if (weather) {
        loadWeatherByCity(weather.name);
      }
    }

    window.addEventListener("online", handleConnectionChange);
    window.addEventListener("offline", handleConnectionChange);

    return () => {
      window.removeEventListener("online", handleConnectionChange);
      window.removeEventListener("offline", handleConnectionChange);
    };
  }, [
    weather,
    loadWeatherByCity,
    readCachedWeatherSnapshot,
    showCachedWeather,
  ]);

  const handleSearchSelect = async (city: {
    name: string;
    country: string;
    lat: number;
    lon: number;
  }) => {
    const success = await loadWeatherByCoords(
      city.lat,
      city.lon,
      city.name,
    );

    if (!success) {
      setSearchedLocation(null);
      return;
    }

    const alreadySaved = savedLocations.some(
      (location) =>
        location.name.toLowerCase() === city.name.toLowerCase(),
    );

    if (alreadySaved) {
      setSearchedLocation(null);
      return;
    }

    try {
      const currentWeather = await getCurrentWeather(
        city.lat,
        city.lon,
      );

      const newLocation: SavedLocation = {
        id: crypto.randomUUID(),
        name: city.name,
        country: city.country,
        lat: city.lat,
        lon: city.lon,
        icon: currentWeather.weather[0]?.icon ?? "",
        lastTempC: currentWeather.main.temp,
        updatedAt: Date.now(),
      };

      setSearchedLocation(newLocation);
    } catch {
      setSearchedLocation(null);
    }
  };

  const handleSaveLocation = async () => {
    if (!weather) {
      return;
    }

    let locationToSave: SavedLocation | null = searchedLocation;

    if (!locationToSave) {
      const alreadySavedByName = savedLocations.some(
        (location) =>
          location.name.toLowerCase() === weather.name.toLowerCase(),
      );

      if (alreadySavedByName) {
        showNotification(
          `${weather.name} is already saved.`,
          "info",
        );
        return;
      }

      locationToSave = {
        id: crypto.randomUUID(),
        name: weather.name,
        country: weather.sys.country,
        lat: weather.coord.lat,
        lon: weather.coord.lon,
        icon: weather.weather[0]?.icon ?? "",
        lastTempC: weather.main.temp,
        updatedAt: Date.now(),
      };
    } else {
      const alreadySaved = savedLocations.some(
        (location) =>
          location.name.toLowerCase() ===
          locationToSave!.name.toLowerCase(),
      );

      if (alreadySaved) {
        showNotification(
          `${locationToSave.name} is already saved.`,
          "info",
        );

        setSearchedLocation(null);
        return;
      }
    }

    setSavedLocations([
      ...savedLocations,
      locationToSave,
    ]);

    showNotification(
      `${locationToSave.name} saved.`,
      "success",
    );

    setSearchedLocation(null);
  };

  const handleSelectLocation = async (location: SavedLocation) => {
    setDrawerOpen(false);

    setSearchedLocation(null);

    await loadWeatherByCoords(
      location.lat,
      location.lon,
      location.name,
    );
  };

  const handleDeleteLocation = (id: string) => {
    const location = savedLocations.find((item) => item.id === id);

    setSavedLocations(
      savedLocations.filter((item) => item.id !== id),
    );

    if (location) {
      showNotification(`${location.name} removed.`, "info");
    }
  };

  if (loading && !weather) {
    return (
      <div className="app">
        <Loading message="Loading weather..." />

        <ToastStack
          toasts={toasts}
          onDismiss={dismissToast}
        />
      </div>
    );
  }

  const hasData = weather !== null && forecast !== null;

  return (
    <div className="app">
      <div className="websiteShell">
        <Header
          city={weather ? weather.name : activeCity}
          country={weather?.sys.country}
          onMenuClick={() => setDrawerOpen(true)}
          onSaveLocationClick={handleSaveLocation}
          canSaveLocation={weather !== null}
          theme={theme}
          onThemeToggle={() =>
            setTheme(theme === "dark" ? "light" : "dark")
          }
          unit={unit}
          onUnitChange={setUnit}
          onSelectCity={handleSearchSelect}
          lastUpdated={lastUpdated}
          isOffline={isOffline}
        />

        <main className="websiteMain">
          <div className="websiteContent">
            {error && !weather ? (
              <div className="errorState">{error}</div>
            ) : !hasData ? (
              !error && null
            ) : (
              <>
                <section className="sectionCard currentHero">
                  <div className="heroGrid">
                    <div className="heroPrimary">
                      <CurrentWeather
                        weather={weather}
                        unit={unit}
                      />

                      <div className="currentWeatherSummary">
                        <span>
                          Min{" "}
                          {Math.round(weather.main.temp_min)}°{unit}
                        </span>

                        <span>
                          Max{" "}
                          {Math.round(weather.main.temp_max)}°{unit}
                        </span>

                        <span>
                          Feels like{" "}
                          {Math.round(weather.main.feels_like)}°{unit}
                        </span>
                      </div>
                    </div>
                  </div>
                </section>

                <section className="sectionCard">
                  <div className="sectionHeading">
                    <div className="titleWrap">
                      <h2>Forecast</h2>
                    </div>

                    <ForecastTabs
                      active={forecastTab}
                      onChange={setForecastTab}
                    />
                  </div>

                  {forecastTab === "hourly" ? (
                    <HourlyForecast
                      forecast={forecast}
                      unit={unit}
                    />
                  ) : (
                    <WeeklyForecast
                      forecast={forecast}
                      unit={unit}
                    />
                  )}
                </section>

                {weather && forecast && (
                  <AirConditions
                    weather={weather}
                    forecast={forecast}
                    unit={unit}
                  />
                )}
              </>
            )}
          </div>
        </main>
      </div>

      <LocationsDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        locations={savedLocations}
        activeId={activeLocationId}
        unit={unit}
        onSelect={handleSelectLocation}
        onRemove={handleDeleteLocation}
      />

      <ToastStack
        toasts={toasts}
        onDismiss={dismissToast}
      />
    </div>
  );
}