

import './App.css'
import { CurrentWeather } from './components/CurrentWeather'
import { Header } from './components/Header'
import { HourlyForecast } from './components/HourlyForecast'
import { WeatherStats } from './components/WeatherStats'

function App() {


  return (
    <>
    <Header/>
    <CurrentWeather/>
    <WeatherStats/>
    <HourlyForecast/>
    </>
  )
}

export default App
