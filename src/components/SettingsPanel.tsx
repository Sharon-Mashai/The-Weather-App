import { HugeiconsIcon } from "@hugeicons/react";
import {
  Moon02Icon,
  Sun03Icon,
  ThermometerIcon,
  Settings02Icon,
} from "@hugeicons/core-free-icons";

import type { TemperatureUnit } from "../utils/weather";

export type AppTheme = "light" | "dark";

interface SettingsPanelProps {
  open: boolean;
  onClose: () => void;
  theme: AppTheme;
  unit: TemperatureUnit;
  onThemeChange: (theme: AppTheme) => void;
  onUnitChange: (unit: TemperatureUnit) => void;
  onClearStoredData: () => void;
}

export default function SettingsPanel({
  open,
  onClose,
  theme,
  unit,
  onThemeChange,
  onUnitChange,
  onClearStoredData,
}: SettingsPanelProps) {
  if (!open) return null;

  return (
    <div className="modalOverlay">

      <div className="modalContent settingsPanel">

        <div className="drawerHeader">

          <h3>

            <HugeiconsIcon
              icon={Settings02Icon}
              size={20}
            />

            Settings

          </h3>

          <button
            className="iconBtn"
            onClick={onClose}
          >
            ✕
          </button>

        </div>

        {/* Theme */}

        <div className="settingsGroup">

          <div className="settingsGroupLabel">

            <HugeiconsIcon
              icon={Moon02Icon}
              size={18}
            />

            Theme

          </div>

          <div className="segmentedControl">

            <button
              className={`segBtn ${
                theme === "light" ? "active" : ""
              }`}
              onClick={() => onThemeChange("light")}
            >
              <HugeiconsIcon
                icon={Sun03Icon}
                size={16}
              />

              Light

            </button>

            <button
              className={`segBtn ${
                theme === "dark" ? "active" : ""
              }`}
              onClick={() => onThemeChange("dark")}
            >
              <HugeiconsIcon
                icon={Moon02Icon}
                size={16}
              />

              Dark

            </button>

          </div>

        </div>

        {/* Temperature */}

        <div className="settingsGroup">

          <div className="settingsGroupLabel">

            <HugeiconsIcon  icon={ThermometerIcon} size={18} />

            Temperature

          </div>

          <div className="segmentedControl">

            <button
              className={`segBtn ${
                unit === "C" ? "active" : ""
              }`}
              onClick={() => onUnitChange("C")}
            >
              Celsius (°C)
            </button>

            <button
              className={`segBtn ${
                unit === "F" ? "active" : ""
              }`}
              onClick={() => onUnitChange("F")}
            >
              Fahrenheit (°F)
            </button>

          </div>

        </div>

        <div className="settingsGroup privacy">

          <div className="settingsGroupLabel">
            Privacy & security
          </div>

          <p className="privacyNote">
            Your preferences and saved locations stay in this browser. The app only uses your location when you allow it, and cached weather data is stored locally for offline access.
          </p>

          <button className="privacyActionBtn" onClick={onClearStoredData}>
            Clear cached weather data
          </button>

        </div>

      </div>

    </div>
  );
}