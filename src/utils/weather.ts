export type TemperatureUnit = "C" | "F";

export const celsiusToFahrenheit = (c: number): number => Math.round((c * 9) / 5 + 32);

export const formatTemp = (celsius: number, unit: TemperatureUnit): string => {
  if (unit === "F") return `${celsiusToFahrenheit(celsius)}°F`;
  return `${Math.round(celsius)}°C`;
};

export const formatTempShort = (celsius: number, unit: TemperatureUnit): string => {
  if (unit === "F") return `${celsiusToFahrenheit(celsius)}°`;
  return `${Math.round(celsius)}°`;
};

export const formatSpeed = (mps: number, unit: TemperatureUnit): string => {
  if (unit === "F") {
    const mph = Math.round(mps * 2.23694);
    return `${mph}mph`;
  }
  const kmh = Math.round(mps * 3.6);
  return `${kmh}km/hr`;
};

export const getSevereAlert = (weatherMain: string): string | null => {
  const w = weatherMain.toLowerCase();
  if (w.includes("thunderstorm")) return "Severe thunderstorm warning in effect.";
  if (w.includes("heavy") && (w.includes("rain") || w.includes("snow")))
    return "Heavy precipitation warning — exercise caution.";
  if (w.includes("extreme") || w.includes("tornado") || w.includes("hurricane"))
    return "Extreme weather alert — stay indoors.";
  if (w.includes("snow") || w.includes("blizzard")) return "Snow advisory issued.";
  return null;
};

export const relativeTime = (tsMs: number): string => {
  const diff = Date.now() - tsMs;
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m} min ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} hr ago`;
  const d = Math.floor(h / 24);
  return `${d} day${d === 1 ? "" : "s"} ago`;
};
