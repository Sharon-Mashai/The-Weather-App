export interface WeatherData {
  name: string;
  visibility?: number;
  main: {
    temp: number;
    humidity: number;
    feels_like: number;
    pressure: number;
    temp_min: number;
    temp_max: number;
  };
  wind: {
    speed: number;
  };
  weather: {
    main: string;
    description: string;
    icon: string;
  }[];
  clouds?: {
    all: number;
  };
  rain?: {
    "1h"?: number;
    "3h"?: number;
  };
  snow?: {
    "1h"?: number;
    "3h"?: number;
  };
  sys?: {
    sunrise?: number;
    sunset?: number;
    country?: string;
  };
  coord?: {
    lat: number;
    lon: number;
  };
}

export interface ForecastItem {
  dt: number;
  dt_txt: string;
  main: {
    temp: number;
    temp_min: number;
    temp_max: number;
    humidity?: number;
    pressure?: number;
  };
  weather: {
    main: string;
    description: string;
    icon: string;
  }[];
  pop?: number;
  rain?: {
    "3h"?: number;
  };
  snow?: {
    "3h"?: number;
  };
  wind?: {
    speed?: number;
  };
  clouds?: {
    all?: number;
  };
}

export interface ForecastData {
  list: ForecastItem[];
  city?: {
    name: string;
    country: string;
    sunrise: number;
    sunset: number;
  };
}