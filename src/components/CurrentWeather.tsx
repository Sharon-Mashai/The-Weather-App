

export const CurrentWeather = () => {
  return (
    <section>
        <p className="location">
            Johannesburg, South Africa
        </p>

         <img src="/weather.png" alt="Weather"className="weatherImage"/>

      <h1>21°</h1>

      <h3>Mostly Cloudy</h3>

      <p className="feelsLike">
        Feels like 18°
      </p>

    </section>
  )
}
