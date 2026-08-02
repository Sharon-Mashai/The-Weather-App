export interface WeatherData {
  name: string;

  main: {
    temp: number;
    humidity: number;
    feels_like: number;
    pressure: number;
  };

  wind: {
    speed: number;
  };

  weather: {
    main: string;
    description: string;
    icon: string;
  }[];
}