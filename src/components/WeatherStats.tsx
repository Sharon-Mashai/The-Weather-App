
export const WeatherStats = () => {
  return (
    <section className="statsGrid">
      <div className="statCard">
        <span>Wind</span>
        <h3>18 km/h</h3>
      </div>

      <div className="statCard">
        <span>Humidity</span>
        <h3>72%</h3>
      </div>

      <div className="statCard">
        <span>Pressure</span>
        <h3>1018 hPa</h3>
      </div>

      <div className="statCard">
        <span>UV Index</span>
        <h3>3</h3>
      </div>
    </section>
  );
};
