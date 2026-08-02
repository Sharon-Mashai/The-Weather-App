

import './App.css'
import { AirConditions } from './components/AirConditions'
import { CurrentWeather } from './components/CurrentWeather'
import { Header } from './components/Header'
import { HourlyForecast } from './components/HourlyForecast'
import { WeatherStats } from './components/WeatherStats'
import { WeeklyForecast } from './components/WeeklyForecast'

function App() {


  return (
    <>
    <Header/>
    <CurrentWeather/>
    <WeatherStats/>
    <HourlyForecast/>
    <WeeklyForecast/>
    <AirConditions/>
    </>
  )
}

export default App
