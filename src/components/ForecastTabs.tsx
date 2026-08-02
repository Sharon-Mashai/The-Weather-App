import { useEffect, useState } from "react";

export type ForecastTab = "hourly" | "daily";

interface ForecastTabsProps {
  active: ForecastTab;
  onChange: (tab: ForecastTab) => void;
}

export const ForecastTabs = ({ active, onChange }: ForecastTabsProps) => {
  const tabs: { id: ForecastTab; label: string; icon: JSX.Element }[] = [
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

interface SearchOverlayProps {
  open: boolean;
  onClose: () => void;
  onSelectCity: (city: string) => void;
}

export const SearchOverlay = ({ open, onClose, onSelectCity }: SearchOverlayProps) => {
  const [query, setQuery] = useState("");
  const suggestions = [
    "Johannesburg, South Africa",
    "Cape Town, South Africa",
    "Mumbai, India",
    "London, United Kingdom",
    "New York, United States",
    "Tokyo, Japan",
    "Sydney, Australia",
    "Paris, France",
  ].filter((s) => s.toLowerCase().includes(query.toLowerCase()));

  useEffect(() => {
    if (!open) {
      // Reset asynchronously to avoid synchronous setState within an effect body.
      queueMicrotask(() => setQuery(""));
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="modalOverlay" onClick={onClose}>
      <div
        className="modalContent searchPanel"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="searchHeader">
          <div className="searchInputWrap">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
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
          {suggestions.map((s) => (
            <li key={s}>
              <button
                className="suggestBtn"
                onClick={() => {
                  onSelectCity(s.split(",")[0].trim());
                  onClose();
                }}
              >
                📍 <span>{s}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
