import { useCallback, useEffect, useRef, useState } from "react";
import Header from "./components/Header";
import CurrentWeather from "./components/CurrentWeather";
import WeatherStats from "./components/WeatherStats";
import HourlyForecast from "./components/HourlyForecast";
import WeeklyForecast from "./components/WeeklyForecast";
import AirConditions from "./components/AirConditions";
import LocationPermission from "./components/LocationPermission";
import {
  ForecastTabs,
  SearchOverlay,
  type ForecastTab,
} from "./components/ForecastTabs";
import { LocationsDrawer, type SavedLocation } from "./components/LocationsDrawer";
import { SettingsPanel, type AppTheme } from "./components/SettingsPanel";
import { ToastStack, type ToastItem, type ToastKind } from "./components/ToastStack";
import { getCurrentWeather, getForecast, searchCity } from "./services/weatherApi";
import type { ForecastData, WeatherData } from "./types/weather";
import { useLocalStorage } from "./hooks/useLocalStorage";
import type { TemperatureUnit } from "./utils/weather";
import { getSevereAlert } from "./utils/weather";

import "./global.css";

const CACHE_KEY = "weather_cache_v1";

interface CacheEntry {
  weather: WeatherData;
  forecast: ForecastData;
  city: string;
  country?: string;
  lat: number;
  lon: number;
  savedAt: number;
}

interface CacheShape {
  [key: string]: CacheEntry;
}

function App() {
  // Persisted preferences
  const [savedLocations, setSavedLocations] = useLocalStorage<SavedLocation[]>(
    "weather_locations_v1",
    []
  );
  const [activeLocId, setActiveLocId] = useLocalStorage<string | null>(
    "weather_active_loc_v1",
    null
  );
  const [unit, setUnit] = useLocalStorage<TemperatureUnit>("weather_unit_v1", "C");
  const [theme, setTheme] = useLocalStorage<AppTheme>("weather_theme_v1", "dark");
  const [cache, setCache] = useLocalStorage<CacheShape>(CACHE_KEY, {});

  // Runtime UI state
  // Pre-compute: if there is a saved active location, skip the modal and start loading right away
  const [initialActive] = useState(() => {
    if (typeof window === "undefined" || !activeLocId) return null;
    return savedLocations.find((l) => l.id === activeLocId) ?? null;
  });

  const [city, setCity] = useState(initialActive?.name ?? "Johannesburg");
  const [country, setCountry] = useState<string | undefined>(initialActive?.country);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState<number | undefined>(undefined);
  const [isOffline, setIsOffline] = useState(false);

  // Modals
  const [showLocationModal, setShowLocationModal] = useState(!initialActive);
  const [locationAsked, setLocationAsked] = useState(!!initialActive);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [forecastTab, setForecastTab] = useState<ForecastTab>("hourly");

  // Toasts (notifications)
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const toastIdRef = useRef(1);
  const severeAlertShownRef = useRef<string | null>(null);
  const nativeNotifAskedRef = useRef(false);

  const pushToast = useCallback((message: string, kind: ToastKind = "info") => {
    const id = toastIdRef.current++;
    setToasts((prev) => [...prev, { id, message, kind }]);
  }, []);

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const pushNativeNotification = useCallback(
    (title: string, body: string) => {
      if (typeof Notification === "undefined") return;
      if (Notification.permission === "granted") {
        try {
          const n = new Notification(title, {
            body,
            icon: "/favicon.svg",
            badge: "/favicon.svg",
          });
          n.onclick = () => {
            window.focus();
            n.close();
          };
          setTimeout(() => n.close(), 9000);
        } catch {
          // ignore
        }
      }
    },
    []
  );

  // Ask for native notification permission after user interacts with the page
  useEffect(() => {
    if (typeof Notification === "undefined") return;
    if (nativeNotifAskedRef.current) return;
    if (Notification.permission === "granted" || Notification.permission === "denied") {
      nativeNotifAskedRef.current = true;
      return;
    }

    const askOnce = async () => {
      if (nativeNotifAskedRef.current) return;
      nativeNotifAskedRef.current = true;
      try {
        await Notification.requestPermission();
      } catch {
        // ignore
      }
    };

    const onFirstInteract = () => {
      void askOnce();
      window.removeEventListener("click", onFirstInteract);
      window.removeEventListener("keydown", onFirstInteract);
    };

    window.addEventListener("click", onFirstInteract, { once: false });
    window.addEventListener("keydown", onFirstInteract, { once: false });
    return () => {
      window.removeEventListener("click", onFirstInteract);
      window.removeEventListener("keydown", onFirstInteract);
    };
  }, []);

  // Apply theme attribute on the document root
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "light") {
      root.setAttribute("data-theme", "light");
    } else {
      root.setAttribute("data-theme", "dark");
    }
  }, [theme]);

  // Listen for online/offline for the offline badge
  useEffect(() => {
    const updateOnline = () => setIsOffline(!navigator.onLine);
    updateOnline();
    window.addEventListener("online", updateOnline);
    window.addEventListener("offline", updateOnline);
    return () => {
      window.removeEventListener("online", updateOnline);
      window.removeEventListener("offline", updateOnline);
    };
  }, []);

  const writeCache = useCallback(
    (key: string, entry: CacheEntry) => {
      setCache((prev) => ({ ...prev, [key]: entry }));
    },
    [setCache]
  );

  const readCache = useCallback(
    (key: string): CacheEntry | null => {
      return cache[key] ?? null;
    },
    [cache]
  );

  const upsertSavedLocation = useCallback(
    (loc: Omit<SavedLocation, "id"> & { id?: string }) => {
      setSavedLocations((prev) => {
        const matchIdx = prev.findIndex(
          (l) =>
            (loc.id && l.id === loc.id) ||
            (loc.isCurrent && l.isCurrent) ||
            (Math.abs(l.lat - loc.lat) < 0.02 && Math.abs(l.lon - loc.lon) < 0.02)
        );
        if (matchIdx >= 0) {
          const copy = [...prev];
          copy[matchIdx] = { ...copy[matchIdx], ...loc, id: copy[matchIdx].id };
          return copy;
        }
        const id = loc.id ?? `loc_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
        return [...prev, { ...loc, id }];
      });
    },
    [setSavedLocations]
  );

  const removeSavedLocation = useCallback(
    (id: string) => {
      setSavedLocations((prev) => {
        const target = prev.find((l) => l.id === id);
        if (target) {
          pushToast(`Removed ${target.name} from saved locations`, "info");
        }
        const next = prev.filter((l) => l.id !== id);
        if (activeLocId === id && next.length) {
          setActiveLocId(next[0].id);
        } else if (activeLocId === id) {
          setActiveLocId(null);
        }
        return next;
      });
    },
    [activeLocId, pushToast, setActiveLocId, setSavedLocations]
  );

  const applyWeatherData = useCallback(
    (payload: {
      weatherData: WeatherData;
      forecastData: ForecastData;
      resolvedName: string;
      resolvedCountry?: string;
      lat: number;
      lon: number;
      isCurrentLocation?: boolean;
    }) => {
      const {
        weatherData,
        forecastData,
        resolvedName,
        resolvedCountry,
        lat,
        lon,
        isCurrentLocation,
      } = payload;

      setCity(resolvedName);
      setCountry(resolvedCountry);
      setWeather(weatherData);
      setForecast(forecastData);
      setLastUpdated(Date.now());
      setError("");
      setIsOffline(false);

      // Cache it by lat+lon for offline access
      const cacheKey = `${lat.toFixed(2)}_${lon.toFixed(2)}`;
      writeCache(cacheKey, {
        weather: weatherData,
        forecast: forecastData,
        city: resolvedName,
        country: resolvedCountry,
        lat,
        lon,
        savedAt: Date.now(),
      });

      // Persist a snapshot in saved locations
      upsertSavedLocation({
        name: resolvedName,
        country: resolvedCountry,
        lat,
        lon,
        isCurrent: !!isCurrentLocation,
        lastTempC: weatherData.main.temp,
        icon: weatherData.weather[0].icon,
        updatedAt: Date.now(),
      });

      // Severe weather alert push (toast + native notification)
      const alertMsg = getSevereAlert(weatherData.weather[0].main);
      if (alertMsg) {
        const alertKey = `${resolvedName}_${alertMsg}_${new Date().toDateString()}`;
        if (severeAlertShownRef.current !== alertKey) {
          severeAlertShownRef.current = alertKey;
          setTimeout(() => pushToast(alertMsg, "warning"), 900);
          setTimeout(
            () =>
              pushNativeNotification(
                `Weather alert · ${resolvedName}`,
                alertMsg
              ),
            1100
          );
        }
      }
    },
    [pushNativeNotification, pushToast, upsertSavedLocation, writeCache]
  );

  const loadWeatherByCoords = useCallback(
    async (
      lat: number,
      lon: number,
      opts?: { cityName?: string; isCurrentLocation?: boolean }
    ) => {
      const cacheKey = `${lat.toFixed(2)}_${lon.toFixed(2)}`;
      const cached = readCache(cacheKey);

      try {
        setLoading(true);
        setError("");

        if (!navigator.onLine && cached) {
          applyWeatherData({
            weatherData: cached.weather,
            forecastData: cached.forecast,
            resolvedName: cached.city,
            resolvedCountry: cached.country,
            lat: cached.lat,
            lon: cached.lon,
            isCurrentLocation: opts?.isCurrentLocation,
          });
          setIsOffline(true);
          pushToast(
            `Showing cached data for ${cached.city} (saved ${new Date(
              cached.savedAt
            ).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })})`,
            "info"
          );
          return;
        }

        const [weatherData, forecastData] = await Promise.all([
          getCurrentWeather(lat, lon),
          getForecast(lat, lon),
        ]);

        const name =
          opts?.cityName && opts.cityName.trim()
            ? opts.cityName.trim()
            : weatherData.name || "Unknown";

        applyWeatherData({
          weatherData,
          forecastData,
          resolvedName: name,
          lat,
          lon,
          isCurrentLocation: opts?.isCurrentLocation,
        });
      } catch {
        if (cached) {
          applyWeatherData({
            weatherData: cached.weather,
            forecastData: cached.forecast,
            resolvedName: cached.city,
            resolvedCountry: cached.country,
            lat: cached.lat,
            lon: cached.lon,
            isCurrentLocation: opts?.isCurrentLocation,
          });
          setIsOffline(true);
          pushToast(`Network unavailable. Showing cached data for ${cached.city}.`, "warning");
        } else {
          setError("Couldn't load weather. Please check your connection.");
          setWeather(null);
          setForecast(null);
        }
      } finally {
        setLoading(false);
      }
    },
    [applyWeatherData, pushToast, readCache]
  );

  const loadWeather = useCallback(
    async (cityName: string) => {
      try {
        setLoading(true);
        setError("");

        const searchResults = await searchCity(cityName);
        const location = searchResults[0];

        if (!location) {
          throw new Error("City not found");
        }

        const countryName = location.country
          ? new Intl.DisplayNames(["en"], { type: "region" }).of(location.country)
          : undefined;

        await loadWeatherByCoords(location.lat, location.lon, {
          cityName: location.name || cityName,
        });

        // Country was returned from search — update snapshot in saved locations (best effort)
        if (countryName) {
          setSavedLocations((prev) =>
            prev.map((l) =>
              Math.abs(l.lat - location.lat) < 0.02 &&
              Math.abs(l.lon - location.lon) < 0.02
                ? { ...l, country: countryName }
                : l
            )
          );
        }

        const active = savedLocations.find(
          (l) =>
            Math.abs(l.lat - location.lat) < 0.02 &&
            Math.abs(l.lon - location.lon) < 0.02
        );
        if (active) setActiveLocId(active.id);

        pushToast(`Loaded weather for ${location.name}`, "success");
      } catch {
        setError("City not found — please try a different search term.");
        setWeather(null);
        setForecast(null);
        setLoading(false);
        pushToast("City not found", "error");
      }
    },
    [loadWeatherByCoords, pushToast, savedLocations, setActiveLocId, setSavedLocations]
  );

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      pushToast("Geolocation is not supported by this browser.", "error");
      void loadWeather("Johannesburg");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        await loadWeatherByCoords(latitude, longitude, { isCurrentLocation: true });
        pushToast("Using your current location", "success");
      },
      async () => {
        pushToast("Location permission denied. Showing default city.", "info");
        await loadWeather("Johannesburg");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    );
  }, [loadWeather, loadWeatherByCoords, pushToast]);

  const handleAllowLocation = useCallback(() => {
    setShowLocationModal(false);
    setLocationAsked(true);
    requestLocation();
  }, [requestLocation]);

  const handleDenyLocation = useCallback(() => {
    setShowLocationModal(false);
    setLocationAsked(true);
    void loadWeather("Johannesburg");
    pushToast("You can always allow location later in browser settings.", "info");
  }, [loadWeather, pushToast]);

  // Initial app startup: show location permission modal via delay, or use saved active location right away
  useEffect(() => {
    let mounted = true;
    if (initialActive) {
      // Load weather asynchronously in a microtask to avoid synchronous cascading renders
      queueMicrotask(() => {
        if (!mounted) return;
        void loadWeatherByCoords(initialActive.lat, initialActive.lon, {
          cityName: initialActive.name,
          isCurrentLocation: initialActive.isCurrent,
        });
      });
      return () => {
        mounted = false;
      };
    }

    const timer = setTimeout(() => {
      if (mounted) setShowLocationModal(true);
    }, 350);

    return () => {
      mounted = false;
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelectSavedLocation = useCallback(
    (loc: SavedLocation) => {
      setDrawerOpen(false);
      setActiveLocId(loc.id);
      void loadWeatherByCoords(loc.lat, loc.lon, {
        cityName: loc.name,
        isCurrentLocation: loc.isCurrent,
      });
      pushToast(`Switched to ${loc.name}`, "success");
    },
    [loadWeatherByCoords, pushToast, setActiveLocId]
  );

  const handleSearchCity = useCallback(
    (cityName: string) => {
      setSearchOpen(false);
      void loadWeather(cityName);
    },
    [loadWeather]
  );

  return (
    <>
      <ToastStack toasts={toasts} onDismiss={dismissToast} />

      {showLocationModal && !locationAsked && (
        <LocationPermission
          onAllow={handleAllowLocation}
          onDeny={handleDenyLocation}
        />
      )}

      <LocationsDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        locations={savedLocations}
        activeId={activeLocId}
        unit={unit}
        onSelect={handleSelectSavedLocation}
        onRemove={removeSavedLocation}
        onSearchOpen={() => {
          setDrawerOpen(false);
          setSearchOpen(true);
        }}
      />

      <SearchOverlay
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelectCity={handleSearchCity}
      />

      <SettingsPanel
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        theme={theme}
        unit={unit}
        onThemeChange={(t) => {
          setTheme(t);
          pushToast(`Switched to ${t} theme`, "info");
        }}
        onUnitChange={(u) => {
          setUnit(u);
          pushToast(
            u === "C" ? "Showing °C Celsius" : "Showing °F Fahrenheit",
            "info"
          );
        }}
      />

      <div className="app">
        <Header
          city={city}
          country={country}
          onMenuClick={() => setDrawerOpen(true)}
          onSearchClick={() => setSearchOpen(true)}
          onSettingsClick={() => setSettingsOpen(true)}
          isOffline={isOffline}
          lastUpdated={lastUpdated}
        />

          {loading && (
            <div className="loadingState">
              <div className="spinner" />
              <p>Loading weather…</p>
            </div>
          )}

          {error && !loading && <h2 className="errorState">{error}</h2>}

          {weather && forecast && (
            <>
              <CurrentWeather weather={weather} unit={unit} />
              <WeatherStats weather={weather} unit={unit} />

              <div className="forecastTabsWrap">
                <div className="sectionHeading">
                  <div className="titleWrap">
                    <span className="headingIcon">
                      {forecastTab === "hourly" ? (
                        <svg width="20" height="20" viewBox="0 0 24 24">
                          <circle cx="12" cy="12" r="10" strokeWidth="2" />
                          <polyline
                            points="12 6 12 12 16 14"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth="2" />
                          <line x1="16" y1="2" x2="16" y2="6" strokeWidth="2" strokeLinecap="round" />
                          <line x1="8" y1="2" x2="8" y2="6" strokeWidth="2" strokeLinecap="round" />
                          <line x1="3" y1="10" x2="21" y2="10" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                      )}
                    </span>
                    <h2>
                      {forecastTab === "hourly" ? "Hourly Forecast" : "7-Day Forecast"}
                    </h2>
                  </div>
                  <ForecastTabs active={forecastTab} onChange={setForecastTab} />
                </div>

                {forecastTab === "hourly" ? (
                  <HourlyForecast forecast={forecast} unit={unit} />
                ) : (
                  <WeeklyForecast forecast={forecast} unit={unit} />
                )}
              </div>

              <AirConditions weather={weather} forecast={forecast} unit={unit} />
            </>
          )}
      </div>
    </>
  );
}

export default App;
