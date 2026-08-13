import { HugeiconsIcon } from "@hugeicons/react";
import {Location01Icon,Delete02Icon,} from "@hugeicons/core-free-icons";

import type { TemperatureUnit } from "../utils/weather";
import { formatTempShort } from "../utils/weather";

export interface SavedLocation {
  id: string;
  name: string;
  country?: string;
  lat: number;
  lon: number;
  icon?: string;
  lastTempC?: number;
  updatedAt?: number;
  isCurrent?: boolean;
}

interface LocationsDrawerProps {
  open: boolean;
  onClose: () => void;
  locations: SavedLocation[];
  activeId: string | null;
  unit: TemperatureUnit;
  onSelect: (location: SavedLocation) => void;
  onRemove: (id: string) => void;
}

export default function LocationsDrawer({
  open,
  onClose,
  locations,
  activeId,
  unit,
  onSelect,
  onRemove,
}: LocationsDrawerProps) {
  return (
    <>
      <div
        className={`drawerBackdrop ${open ? "show" : ""}`}
        onClick={onClose}
      />

      <aside className={`locationsDrawer ${open ? "open" : ""}`}>

        <div className="drawerHeader">

          <h3>Saved Locations</h3>

          <button
            className="iconBtn"
            onClick={onClose}
          >
            ✕
          </button>

        </div>

        {locations.length === 0 && (

          <p className="emptyHint">
            Search for a city using the search icon in the header above to save it here.
          </p>

        )}

        <ul className="locationsList">

          {locations.map((location) => (

            <li
              key={location.id}
              className={`locItem ${
                activeId === location.id ? "active" : ""
              }`}
            >

              <button
                className="locItemBtn"
                onClick={() => onSelect(location)}
              >

                <div>

                  <div className="locNameRow">

                    <HugeiconsIcon
                      icon={Location01Icon}
                      size={16}
                    />

                    <span className="locName">
                      {location.name}
                    </span>

                  </div>

                  <div className="locCountry">
                    {location.country}
                  </div>

                </div>

                <div className="locTemp">

                  {location.icon && (

                    <img
                      src={`https://openweathermap.org/img/wn/${location.icon}.png`}
                      alt=""
                    />

                  )}

                  {location.lastTempC !== undefined && (

                    <span className="locTempVal">

                      {formatTempShort(
                        location.lastTempC,
                        unit
                      )}

                    </span>

                  )}

                </div>

              </button>

              <button
                className="locRemove"
                onClick={() => onRemove(location.id)}
              >
                <HugeiconsIcon
                  icon={Delete02Icon}
                  size={18}
                />
              </button>

            </li>

          ))}

        </ul>

      </aside>
    </>
  );
}