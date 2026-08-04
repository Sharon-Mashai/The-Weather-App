
export interface Weather {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface MainWeather {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
}

export interface Wind {
  speed: number;
  deg: number;
}

export interface Clouds {
  all: number;
}

export interface Sys {
  country: string;
  sunrise: number;
  sunset: number;
}

export interface WeatherData {
  coord: {
    lon: number;
    lat: number;
  };

  weather: Weather[];

  main: MainWeather;

  wind: Wind;

  clouds: Clouds;

  visibility: number;

  sys: Sys;

  timezone: number;

  dt: number;

  name: string;
}

export interface ForecastItem {
  dt: number;

  main: {
    temp: number;
    temp_min: number;
    temp_max: number;
    humidity: number;
  };

  weather: Weather[];

  wind: {
    speed: number;
  };

  pop: number;

  dt_txt: string;
}

export interface ForecastCity {
  id: number;
  name: string;
  country: string;
  timezone: number;
}

export interface ForecastData {
  list: ForecastItem[];
  city: ForecastCity;
}

export interface SearchCityResult {
  name: string;
  country: string;
  state?: string;
  lat: number;
  lon: number;
}