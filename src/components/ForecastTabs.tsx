import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { searchCity } from "../services/weatherApi";

export type ForecastTab = "hourly" | "daily";

interface ForecastTabsProps {
  active: ForecastTab;
  onChange: (tab: ForecastTab) => void;
}

export const ForecastTabs = ({ active, onChange }: ForecastTabsProps) => {
  const tabs: { id: ForecastTab; label: string; icon: ReactNode }[] = [
    {
      id: "hourly",
      label: "Hourly",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
    },
    {
      id: "daily",
      label: "7-Day",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      ),
    },
  ];

  return (
    <div className="forecastTabs" role="tablist" aria-label="Forecast view">
      {tabs.map((t) => {
        const isActive = active === t.id;
        return (
          <button
            key={t.id}
            role="tab"
            aria-selected={isActive}
            className={`tabBtn ${isActive ? "active" : ""}`}
            onClick={() => onChange(t.id)}
          >
            {t.icon}
            <span>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
};

interface GeoSearchResult {
  name: string;
  country?: string;
  state?: string;
  lat: number;
  lon: number;
}

interface SearchOverlayProps {
  open: boolean;
  onClose: () => void;
  onSelectCity: (city: string) => void;
}

export const SearchOverlay = ({ open, onClose, onSelectCity }: SearchOverlayProps) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<GeoSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const debounceRef = useRef<number | undefined>(undefined);
  const reqIdRef = useRef(0);

  useEffect(() => {
    if (!open) {
      queueMicrotask(() => {
        setQuery("");
        setSuggestions([]);
        setError("");
        setLoading(false);
      });
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      queueMicrotask(() => {
        setSuggestions([]);
        setError("");
        setLoading(false);
      });
      return;
    }

    queueMicrotask(() => {
      setLoading(true);
      setError("");
    });

    const myReq = ++reqIdRef.current;
    if (debounceRef.current) window.clearTimeout(debounceRef.current);

    debounceRef.current = window.setTimeout(async () => {
      try {
        const data = await searchCity(trimmed);
        if (reqIdRef.current !== myReq) return;
        setSuggestions(
          (data as GeoSearchResult[]).filter(
            (r, i, arr) =>
              arr.findIndex(
                (o) =>
                  o.name.toLowerCase() === r.name.toLowerCase() &&
                  (o.country ?? "") === (r.country ?? "") &&
                  (o.state ?? "") === (r.state ?? "")
              ) === i
          )
        );
        setError("");
      } catch {
        if (reqIdRef.current !== myReq) return;
        setSuggestions([]);
        setError("Couldn't reach search — try again shortly.");
      } finally {
        if (reqIdRef.current === myReq) setLoading(false);
      }
    }, 350);

    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
  }, [query, open]);

  if (!open) return null;

  const regionDisplay = (r: GeoSearchResult) => {
    const countryName = r.country
      ? new Intl.DisplayNames(["en"], { type: "region" }).of(r.country) ?? r.country
      : "";
    const parts = [r.state, countryName].filter(Boolean);
    return parts.join(", ");
  };

  return (
    <div className="modalOverlay" onClick={onClose}>
      <div
        className="modalContent searchPanel"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="searchHeader">
          <div className="searchInputWrap">
            {loading ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="spinSvg">
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            )}
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && query.trim()) {
                  onSelectCity(query.trim());
                  onClose();
                }
              }}
              placeholder="Search city, country…"
            />
            {query && (
              <button
                className="iconBtn small"
                onClick={() => setQuery("")}
                aria-label="Clear"
              >
                ×
              </button>
            )}
          </div>
          <button
            className="textBtn"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>

        <ul className="suggestionsList">
          {query.trim() !== "" && (
            <li>
              <button
                className="suggestBtn"
                onClick={() => {
                  onSelectCity(query.trim());
                  onClose();
                }}
              >
                🔎 <span>Search “{query.trim()}”</span>
              </button>
            </li>
          )}
          {error && (
            <li className="suggestError">
              <span>{error}</span>
            </li>
          )}
          {!error && loading && suggestions.length === 0 && query.trim().length >= 2 && (
            <li className="suggestHint">
              <span>Looking up locations…</span>
            </li>
          )}
          {!error && !loading && suggestions.length === 0 && query.trim().length >= 2 && (
            <li className="suggestHint">
              <span>No locations found — try a different name.</span>
            </li>
          )}
          {suggestions.map((r, idx) => {
            const region = regionDisplay(r);
            return (
              <li key={`${r.lat}-${r.lon}-${idx}`}>
                <button
                  className="suggestBtn"
                  onClick={() => {
                    onSelectCity(r.name);
                    onClose();
                  }}
                >
                  📍{" "}
                  <span className="suggestText">
                    <strong>{r.name}</strong>
                    {region && <small> · {region}</small>}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};
