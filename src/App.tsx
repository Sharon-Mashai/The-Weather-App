import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./global.css";
import Header from "./components/Header";
import CurrentWeather from "./components/CurrentWeather";
import WeatherStats from "./components/WeatherStats";
import ForecastTabs from "./components/ForecastTabs";
import HourlyForecast from "./components/HourlyForecast";
import WeeklyForecast from "./components/WeeklyForecast";
import AirConditions from "./components/AirConditions";
import SearchOverlay from "./components/SearchOverlay";
import SettingsPanel from "./components/SettingsPanel";
import LocationsDrawer, { type SavedLocation,} from "./components/LocationsDrawer";
import { ToastStack, type ToastItem, type ToastKind } from "./components/ToastStack";
import Loading from "./components/Loading";
import LocationPermission from "./components/LocationPermission";
import { getCurrentWeather,getForecast,} from "./services/weatherApi";
import type { WeatherData, ForecastData,} from "./types/weather";
import type { TemperatureUnit } from "./utils/weather";
import { useLocalStorage } from "./hooks/useLocalStorage";

const DEFAULT_CITY = "Polokwane";
const JOHANNESBURG_COORDS = { lat: -26.2041, lon: 28.0473 };

type PermissionState = "prompt" | "granted" | "denied";

export default function App() {


  function readCachedWeather(): {
    weather: WeatherData | null;
    forecast: ForecastData | null;
    savedAt: number | undefined;
    isOffline: boolean;
  } {
    if (typeof window === "undefined") {
      return { weather: null, forecast: null, savedAt: undefined, isOffline: false };
    }
    const raw = window.localStorage.getItem("lastWeather");
    if (!raw) {
      return { weather: null, forecast: null, savedAt: undefined, isOffline: false };
    }
    try {
      const parsed = JSON.parse(raw);
      if (parsed.weather && parsed.forecast) {
        return {
          weather: parsed.weather as WeatherData,
          forecast: parsed.forecast as ForecastData,
          savedAt: typeof parsed.savedAt === "number" ? parsed.savedAt : undefined,
          isOffline: true,
        };
      }
    } catch {
   /* */
    }
    return { weather: null, forecast: null, savedAt: undefined, isOffline: false };
  }

  const [cachedInitial] = useState(readCachedWeather);
  const [weather, setWeather] = useState<WeatherData | null>(cachedInitial.weather);
  const [forecast, setForecast] = useState<ForecastData | null>(cachedInitial.forecast);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [offline, setOffline] = useState(cachedInitial.isOffline);
  const [lastUpdated, setLastUpdated] = useState<number | undefined>(cachedInitial.savedAt);


  const [forecastTab, setForecastTab] =
    useState<"hourly" | "weekly">("hourly");

  const [searchOpen, setSearchOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [permissionOpen, setPermissionOpen] = useState(false);


  const [unit, setUnit] =
    useLocalStorage<TemperatureUnit>("unit", "C");

  const [theme, setTheme] =
    useLocalStorage<"dark" | "light">("theme", "dark");

  const [savedLocations, setSavedLocations] =
    useLocalStorage<SavedLocation[]>("savedLocations", []);

  const [activeCity, setActiveCity] =
    useLocalStorage<string>("activeCity", DEFAULT_CITY);

  const [permissionState, setPermissionState] =
    useLocalStorage<PermissionState>("locationPermission", "prompt");

  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showNotification = useCallback(
    (
      message: string,
      type: ToastKind = "info"
    ) => {
      const id = Date.now() + Math.random();
      setToasts((prev) => [...prev, { id, message, kind: type }]);
      window.setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4000);
    },
    []
  );

  const activeLocationId = useMemo(() => {
    if (!weather) return null;
    const found = savedLocations.find(
      (loc) =>
        loc.name.toLowerCase() === weather.name.toLowerCase()
    );
    return found ? found.id : null;
  }, [savedLocations, weather]);


  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);


  const loadWeatherByCoords = useCallback(
    async (
      lat: number,
      lon: number,
      displayName?: string
    ): Promise<boolean> => {
      try {
        setLoading(true);
        setError("");

        const [weatherData, forecastData] = await Promise.all([
          getCurrentWeather(lat, lon),
          getForecast(lat, lon),
        ]);

        if (displayName) {
          weatherData.name = displayName;
          forecastData.city.name = displayName;
        }

        setWeather(weatherData);
        setForecast(forecastData);
        setActiveCity(weatherData.name);
        setOffline(false);
        setLastUpdated(Date.now());

        localStorage.setItem(
          "lastWeather",
          JSON.stringify({
            weather: weatherData,
            forecast: forecastData,
            savedAt: Date.now(),
            city: weatherData.name,
          })
        );

        return true;
      } catch {
        const cached = localStorage.getItem("lastWeather");
        if (cached) {
          const data = JSON.parse(cached);
          setWeather(data.weather);
          setForecast(data.forecast);
          setOffline(true);
          showNotification(
            "Offline mode. Showing cached weather.",
            "warning"
          );
          return true;
        } else {
          setError("Unable to load weather.");
          return false;
        }
      } finally {
        setLoading(false);
      }
    },
    [setActiveCity, showNotification]
  );

  const loadWeatherByCity = useCallback(
    async (cityName: string): Promise<boolean> => {
      try {
        setLoading(true);
        setError("");

        const [weatherData, forecastData] = await Promise.all([
          getCurrentWeather(cityName),
          getForecast(cityName),
        ]);

        setWeather(weatherData);
        setForecast(forecastData);
        setActiveCity(weatherData.name);
        setOffline(false);
        setLastUpdated(Date.now());

        localStorage.setItem(
          "lastWeather",
          JSON.stringify({
            weather: weatherData,
            forecast: forecastData,
            savedAt: Date.now(),
            city: weatherData.name,
          })
        );

        return true;
      } catch {
        const cached = localStorage.getItem("lastWeather");
        if (cached) {
          const data = JSON.parse(cached);
          setWeather(data.weather);
          setForecast(data.forecast);
          setOffline(true);
          showNotification(
            "Offline mode. Showing cached weather.",
            "warning"
          );
          return true;
        } else {
          setError("Unable to load weather.");
          return false;
        }
      } finally {
        setLoading(false);
      }
    },
    [setActiveCity, showNotification]
  );

  const initializedRef = useRef(false);

  const requestBrowserNotifications = useCallback(async (): Promise<void> => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      showNotification("Browser notifications are not supported on this device.", "warning");
      return;
    }

    if (Notification.permission === "granted") {
      showNotification("Browser notifications are enabled.", "success");
      return;
    }

    if (Notification.permission === "denied") {
      showNotification("Browser notifications were blocked. You can enable them in your browser settings.", "warning");
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        showNotification("Browser notifications enabled.", "success");
      } else {
        showNotification("Browser notifications were not allowed.", "warning");
      }
    } catch {
      showNotification("Unable to request browser notifications right now.", "warning");
    }
  }, [showNotification]);

  const loadCurrentLocation = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError("");

    if (!navigator.geolocation) {
      await loadWeatherByCity(DEFAULT_CITY);
      showNotification("Geolocation is unavailable. Showing Polokwane.", "warning");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        await loadWeatherByCoords(
          position.coords.latitude,
          position.coords.longitude
        );
      },
      async () => {
        showNotification("Using Johannesburg because location access was unavailable.", "warning");
        await loadWeatherByCoords(
          JOHANNESBURG_COORDS.lat,
          JOHANNESBURG_COORDS.lon,
          "Johannesburg"
        );
      },
      { timeout: 8000, maximumAge: 60000 }
    );
  }, [loadWeatherByCoords, loadWeatherByCity, showNotification]);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const timer = window.setTimeout(() => {
      if (permissionState === "granted") {
        showNotification("Using your current location.", "info");
        void loadCurrentLocation();
      } else if (permissionState === "denied") {
        showNotification("Location access denied. Using Johannesburg instead.", "warning");
        void loadWeatherByCoords(
          JOHANNESBURG_COORDS.lat,
          JOHANNESBURG_COORDS.lon,
          "Johannesburg"
        );
      } else {
        setPermissionOpen(true);
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, [permissionState, loadCurrentLocation, loadWeatherByCoords, showNotification]);


  const handleAllowLocation = async () => {
    setPermissionState("granted");
    setPermissionOpen(false);
    showNotification("Allowing current-location weather updates.", "info");
    await requestBrowserNotifications();
    await loadCurrentLocation();
  };

  const handleDenyLocation = async () => {
    setPermissionState("denied");
    setPermissionOpen(false);
    showNotification("Location access denied. Using Johannesburg instead.", "warning");
    await loadWeatherByCoords(
      JOHANNESBURG_COORDS.lat,
      JOHANNESBURG_COORDS.lon,
      "Johannesburg"
    );
  };



  const handleSearchSelect = async (city: {
    name: string;
    country: string;
    lat: number;
    lon: number;
  }) => {
    const success = await loadWeatherByCoords(
      city.lat,
      city.lon,
      city.name
    );

    setSearchOpen(false);

    if (success) {
      const exists = savedLocations.some(
        (loc) =>
          Math.abs(loc.lat - city.lat) < 0.01 &&
          Math.abs(loc.lon - city.lon) < 0.01
      );

      if (!exists && weather) {
        const newLocation: SavedLocation = {
          id: `${city.lat.toFixed(2)}_${city.lon.toFixed(2)}_${Date.now()}`,
          name: city.name,
          country: city.country,
          lat: city.lat,
          lon: city.lon,
          icon: weather.weather[0]?.icon,
          lastTempC: weather.main.temp,
          updatedAt: Date.now(),
        };
        setSavedLocations([...savedLocations, newLocation]);
      }

      showNotification(`${city.name} added.`, "success");
    }
  };



  const handleSelectLocation = (location: SavedLocation) => {
    setDrawerOpen(false);
    loadWeatherByCoords(location.lat, location.lon, location.name);
  };

  const handleDeleteLocation = (id: string) => {
    const loc = savedLocations.find((l) => l.id === id);
    setSavedLocations(
      savedLocations.filter((item) => item.id !== id)
    );
    if (loc) {
      showNotification(`${loc.name} removed.`, "info");
    }
  };

  if (loading && !weather) {
    return (
      <div className="app">
        <Loading message="Loading weather data..." />
        <ToastStack toasts={toasts} onDismiss={dismissToast} />
      </div>
    );
  }

  const hasData = weather && forecast;

  return (
    <div className="app">
      <div className="websiteShell">
        {/* ---------- Top Navigation ---------- */}
        <Header
          city={weather ? weather.name : activeCity}
          country={weather?.sys?.country}
          onMenuClick={() => setDrawerOpen(true)}
          onSearchClick={() => setSearchOpen(true)}
          onSettingsClick={() => setSettingsOpen(true)}
          isOffline={offline}
          lastUpdated={lastUpdated}
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
                        weather={weather!}
                        unit={unit}
                      />
                      <WeatherStats
                        weather={weather!}
                        unit={unit}
                      />
                    </div>
                    <div className="heroRight">
                      <div className="heroSideCards">
                        <div className="heroSideCard">
                          <span className="heroSideCardLabel">
                            Min Temp
                          </span>
                          <span className="heroSideCardValue">
                            {Math.round(weather!.main.temp_min)}°
                            {unit}
                          </span>
                        </div>
                        <div className="heroSideCard">
                          <span className="heroSideCardLabel">
                            Max Temp
                          </span>
                          <span className="heroSideCardValue">
                            {Math.round(weather!.main.temp_max)}°
                            {unit}
                          </span>
                        </div>
                        <div className="heroSideCard">
                          <span className="heroSideCardLabel">
                            Sunrise
                          </span>
                          <span className="heroSideCardValue">
                            {new Date(
                              weather!.sys.sunrise * 1000
                            ).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        <div className="heroSideCard">
                          <span className="heroSideCardLabel">
                            Sunset
                          </span>
                          <span className="heroSideCardValue">
                            {new Date(
                              weather!.sys.sunset * 1000
                            ).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/*Forecast Section */}
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
                      forecast={forecast!}
                      unit={unit}
                    />
                  ) : (
                    <WeeklyForecast
                      forecast={forecast!}
                      unit={unit}
                    />
                  )}
                </section>

                {/*Air Conditions */}
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

        {/*Footer*/}
        <footer className="websiteFooter">
          The WeatherApp · By Mashai Sharon.
        </footer>
      </div>


      <SearchOverlay
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelectCity={handleSearchSelect}
      />

      <SettingsPanel
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        theme={theme}
        unit={unit}
        onThemeChange={setTheme}
        onUnitChange={setUnit}
      />

      <LocationsDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        locations={savedLocations}
        activeId={activeLocationId}
        unit={unit}
        onSelect={handleSelectLocation}
        onRemove={handleDeleteLocation}
        onSearchOpen={() => {
          setDrawerOpen(false);
          setSearchOpen(true);
        }}
      />

      <ToastStack toasts={toasts} onDismiss={dismissToast} />

      {permissionOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 999,
          }}
        >
          <LocationPermission
            onAllow={handleAllowLocation}
            onDeny={handleDenyLocation}
          />
        </div>
      )}
    </div>
  );
}
