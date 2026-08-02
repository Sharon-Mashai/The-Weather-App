

export const HourlyForecast = () => {
  return (

    <section className="forecastSection">

      <h2>Today's Forecast</h2>

      <div className="forecastRow">

        {Array.from({ length: 6 }).map((_, index) => (

          <div
            key={index}
            className="forecastCard"
          >

            <p>12 PM</p>

            <img
              src="/weather.png"
              alt=""
            />

            <h3>20°</h3>

          </div>

        ))}

      </div>

    </section>

  );
};
