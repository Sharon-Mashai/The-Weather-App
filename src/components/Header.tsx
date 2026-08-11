
import { useEffect, useRef, useState } from "react";
import {HugeiconsIcon} from "@hugeicons/react";
import {Menu01Icon,Search01Icon,SunCloud02Icon,Bookmark01Icon,Sun01Icon,Moon01Icon,Cancel01Icon,Location01Icon,} from "@hugeicons/core-free-icons";
import { searchCity } from "../services/weatherApi";
import type { TemperatureUnit } from "../utils/weather";

interface SearchResult {
  name: string;
  country: string;
  lat: number;
  lon: number;
}

interface HeaderProps {
  city: string;
  country?: string;
  onMenuClick: () => void;
  onSaveLocationClick?: () => void;
  canSaveLocation?: boolean;
  theme?: "dark" | "light";
  onThemeToggle?: () => void;
  unit?: TemperatureUnit;
  onUnitChange?: (unit: TemperatureUnit) => void;
  onSelectCity: (city: SearchResult) => void;
  lastUpdated?: number;
  isOffline?: boolean;
}

function Header({
  onMenuClick,
  onSaveLocationClick,
  canSaveLocation = false,
  theme = "dark",
  onThemeToggle,
  unit = "C",
  onUnitChange,
  onSelectCity,
}: HeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [cities, setCities] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const searchWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!query.trim()) {
      const t = window.setTimeout(() => setCities([]), 0);
      return () => window.clearTimeout(t);
    }

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        const results = await searchCity(query);
        setCities(results);
      } catch {
        setCities([]);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        searchWrapRef.current &&
        !searchWrapRef.current.contains(e.target as Node)
      ) {
        setSearchOpen(false);
        setQuery("");
        setCities([]);
      }
    }

    if (searchOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchOpen]);

  const handleCitySelect = (city: SearchResult) => {
    onSelectCity(city);
    setSearchOpen(false);
    setQuery("");
    setCities([]);
  };

  const openSearch = () => {
    setSearchOpen(true);
  };

  const closeSearch = () => {
    setSearchOpen(false);
    setQuery("");
    setCities([]);
  };

  return (
    <header className="topNav">
      <div className="topNavInner">
        <button
          className="iconBtn"
          onClick={onMenuClick}
          aria-label="Open saved locations"
        >
          <HugeiconsIcon icon={Menu01Icon} size={22} />
        </button>

        <div className="navBrand">
          <div className="brandIcon">
            <HugeiconsIcon icon={SunCloud02Icon} />
          </div>
          <div className="brandText">
            <span className="brandName">The WeatherApp</span>
            <span className="brandTag">Weather Forecast</span>
          </div>
        </div>

        <div className="navSpacer" />

        <button
          className={`iconBtn ${canSaveLocation ? "saveActive" : ""}`}
          onClick={onSaveLocationClick}
          aria-label="Save location"
          disabled={!canSaveLocation}
          style={{ opacity: canSaveLocation ? 1 : 0.4 }}
        >
          <HugeiconsIcon icon={Bookmark01Icon} size={22} />
        </button>

        {!searchOpen ? (
          <button
            className="iconBtn"
            onClick={openSearch}
            aria-label="Search city"
          >
            <HugeiconsIcon icon={Search01Icon} size={22} />
          </button>
        ) : (
          <div className="headerSearchWrap" ref={searchWrapRef}>
            <div className="headerSearchInputWrap">
              <HugeiconsIcon icon={Search01Icon} size={18} />
              <input
                autoFocus
                type="text"
                placeholder="Search city..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              {query && (
                <button
                  type="button"
                  className="headerSearchClear"
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                >
                  <HugeiconsIcon icon={Cancel01Icon} size={16} />
                </button>
              )}
              <button
                type="button"
                className="headerSearchClose"
                onClick={closeSearch}
                aria-label="Close search"
              >
                <HugeiconsIcon icon={Cancel01Icon} size={18} />
              </button>
            </div>

            {(cities.length > 0 || loading || query) && (
              <div className="headerSearchDropdown">
                {loading && (
                  <p className="suggestHint">Searching...</p>
                )}
                {!loading && cities.length === 0 && query && (
                  <p className="suggestHint">No cities found.</p>
                )}
                <ul className="suggestionsList">
                  {cities.map((city) => (
                    <li key={`${city.name}-${city.lat}`}>
                      <button
                        className="suggestBtn"
                        onClick={() => handleCitySelect(city)}
                      >
                        <HugeiconsIcon icon={Location01Icon} size={18} />
                        <div className="suggestText">
                          <strong>{city.name}</strong>
                          <small>{city.country}</small>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <button
          className="iconBtn themeToggle"
          onClick={onThemeToggle}
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        >
          {theme === "dark" ? (
            <HugeiconsIcon icon={Sun01Icon} size={22} />
          ) : (
            <HugeiconsIcon icon={Moon01Icon} size={22} />
          )}
        </button>

        <div
          className="headerUnitToggle"
          role="group"
          aria-label="Temperature unit"
        >
          <button
            className={`unitSegBtn ${unit === "C" ? "active" : ""}`}
            onClick={() => onUnitChange?.("C")}
            aria-pressed={unit === "C"}
            aria-label="Celsius"
            title="Celsius (°C)"

          >°C</button>

          <button
            className={`unitSegBtn ${unit === "F" ? "active" : ""}`}
            onClick={() => onUnitChange?.("F")}
            aria-pressed={unit === "F"}
            aria-label="Fahrenheit"
            title="Fahrenheit (°F)"

          >°F</button>
          
        </div>
      </div>
    </header>
  );
}

export default Header;
