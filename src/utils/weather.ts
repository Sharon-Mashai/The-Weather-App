
export type TemperatureUnit = "C" | "F";

export function celsiusToFahrenheit(celsius: number): number {
  return Math.round((celsius * 9) / 5 + 32);
}

export function formatTemperature(
  celsius: number,
  unit: TemperatureUnit
): string {
  if (unit === "F") {
    return `${celsiusToFahrenheit(celsius)}°F`;
  }

  return `${Math.round(celsius)}°C`;
}

export const formatTemp = formatTemperature;

export function formatTemperatureShort(
  celsius: number,
  unit: TemperatureUnit
): string {
  if (unit === "F") {
    return `${celsiusToFahrenheit(celsius)}°`;
  }

  return `${Math.round(celsius)}°`;
}

export const formatTempShort = formatTemperatureShort;

export function formatWindSpeed(
  metersPerSecond: number,
  unit: TemperatureUnit
): string {
  if (unit === "F") {
    const mph = Math.round(metersPerSecond * 2.23694);
    return `${mph} mph`;
  }

  const kmh = Math.round(metersPerSecond * 3.6);

  return `${kmh} km/h`;
}

export const formatSpeed = formatWindSpeed;

export function formatTime(unix: number): string {
  return new Date(unix * 1000).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getDayName(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
  });
}

export function getShortDay(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    weekday: "short",
  });
}

export function getDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
  });
}

/*Timestamp*/
export function relativeTime(timestamp: number): string {
  const difference = Date.now() - timestamp;

  const minutes = Math.floor(difference / 60000);

  if (minutes < 1) return "Just now";

  if (minutes < 60) {
    return `${minutes} min ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours} hr ago`;
  }

  const days = Math.floor(hours / 24);

  return `${days} day${days === 1 ? "" : "s"} ago`;
}

/*Official OpenWeather icon*/
export function getWeatherIcon(icon: string): string {
  return `https://openweathermap.org/img/wn/${icon}@4x.png`;
}

/*Smaller icon for forecast cards*/
export function getForecastIcon(icon: string): string {
  return `https://openweathermap.org/img/wn/${icon}@2x.png`;
}

/*Weather alerts*/
export function getSevereAlert(weatherMain: string): string | null {
  const value = weatherMain.toLowerCase();

  if (value.includes("thunderstorm")) {
    return "Thunderstorm warning. Stay indoors if possible.";
  }

  if (value.includes("tornado")) {
    return "Tornado warning issued.";
  }

  if (value.includes("hurricane")) {
    return "Hurricane warning issued.";
  }

  if (value.includes("snow")) {
    return "Snow advisory in effect.";
  }

  if (value.includes("blizzard")) {
    return "Blizzard warning.";
  }

  if (value.includes("rain")) {
    return "Heavy rain expected. Drive carefully.";
  }

  return null;
}