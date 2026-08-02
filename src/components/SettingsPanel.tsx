import type { TemperatureUnit } from "../utils/weather";

export type AppTheme = "dark" | "light";

interface SettingsPanelProps {
  open: boolean;
  onClose: () => void;
  theme: AppTheme;
  unit: TemperatureUnit;
  onThemeChange: (t: AppTheme) => void;
  onUnitChange: (u: TemperatureUnit) => void;
}

export const SettingsPanel = ({
  open,
  onClose,
  theme,
  unit,
  onThemeChange,
  onUnitChange,
}: SettingsPanelProps) => {
  if (!open) return null;

  return (
    <div className="modalOverlay" onClick={onClose}>
      <div
        className="modalContent settingsPanel"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="drawerHeader">
          <h3>Settings</h3>
          <button
            className="iconBtn"
            onClick={onClose}
            aria-label="Close settings"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="settingsGroup">
          <div className="settingsGroupLabel">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
            Theme
          </div>
          <div className="segmentedControl">
            <button
              className={`segBtn ${theme === "dark" ? "active" : ""}`}
              onClick={() => onThemeChange("dark")}
            >
              🌙 Dark
            </button>
            <button
              className={`segBtn ${theme === "light" ? "active" : ""}`}
              onClick={() => onThemeChange("light")}
            >
              ☀️ Light
            </button>
          </div>
        </div>

        <div className="settingsGroup">
          <div className="settingsGroupLabel">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" />
            </svg>
            Temperature units
          </div>
          <div className="segmentedControl">
            <button
              className={`segBtn ${unit === "C" ? "active" : ""}`}
              onClick={() => onUnitChange("C")}
            >
              °C Celsius
            </button>
            <button
              className={`segBtn ${unit === "F" ? "active" : ""}`}
              onClick={() => onUnitChange("F")}
            >
              °F Fahrenheit
            </button>
          </div>
        </div>

        <div className="settingsGroup privacy">
          <div className="settingsGroupLabel">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            Privacy
          </div>
          <p className="privacyNote">
            Your location and saved cities are stored only on this device and are never sent to third parties. Weather data is fetched from OpenWeatherMap.
          </p>
        </div>
      </div>
    </div>
  );
};
