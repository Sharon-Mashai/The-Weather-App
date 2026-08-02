import type { TemperatureUnit } from "../utils/weather";
import { formatTempShort } from "../utils/weather";

export interface SavedLocation {
  id: string;
  name: string;
  country?: string;
  lat: number;
  lon: number;
  isCurrent?: boolean;
  lastTempC?: number;
  icon?: string;
  updatedAt?: number;
}

interface LocationsDrawerProps {
  open: boolean;
  onClose: () => void;
  locations: SavedLocation[];
  activeId: string | null;
  unit: TemperatureUnit;
  onSelect: (loc: SavedLocation) => void;
  onRemove: (id: string) => void;
  onSearchOpen: () => void;
}

export const LocationsDrawer = ({
  open,
  onClose,
  locations,
  activeId,
  unit,
  onSelect,
  onRemove,
  onSearchOpen,
}: LocationsDrawerProps) => {
  return (
    <>
      <div
        className={`drawerBackdrop ${open ? "show" : ""}`}
        onClick={onClose}
        aria-hidden={!open}
      />
      <aside className={`locationsDrawer ${open ? "open" : ""}`} aria-label="Saved locations">
        <div className="drawerHeader">
          <h3>My Locations</h3>
          <button
            className="iconBtn"
            onClick={onClose}
            aria-label="Close locations"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <button className="searchRowBtn" onClick={onSearchOpen}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <span>Search for a city…</span>
        </button>

        {locations.length === 0 && (
          <p className="emptyHint">No saved locations yet.</p>
        )}

        <ul className="locationsList">
          {locations.map((loc) => {
            const active = activeId === loc.id;
            return (
              <li key={loc.id} className={`locItem ${active ? "active" : ""}`}>
                <button className="locItemBtn" onClick={() => onSelect(loc)}>
                  <div className="locInfo">
                    <div className="locNameRow">
                      <span className="locName">
                        {loc.isCurrent && "📍 "}
                        {loc.name}
                      </span>
                      {loc.isCurrent && (
                        <span className="locBadge">Current</span>
                      )}
                    </div>
                    {loc.country && <small className="locCountry">{loc.country}</small>}
                  </div>

                  <div className="locTemp">
                    {loc.lastTempC !== undefined && (
                      <span className="locTempVal">
                        {formatTempShort(loc.lastTempC, unit)}
                      </span>
                    )}
                    {loc.icon && (
                      <img
                        width="36"
                        height="36"
                        src={`https://openweathermap.org/img/wn/${loc.icon}@2x.png`}
                        alt=""
                      />
                    )}
                  </div>
                </button>

                {!loc.isCurrent && (
                  <button
                    className="locRemove"
                    onClick={() => onRemove(loc.id)}
                    aria-label={`Remove ${loc.name}`}
                    title="Remove location"
                  >
                    ×
                  </button>
                )}
              </li>
            );
          })}
        </ul>

        <div className="drawerFooter">
          <small>Locations are stored locally on your device.</small>
        </div>
      </aside>
    </>
  );
};
