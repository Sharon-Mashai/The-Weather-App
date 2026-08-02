export const WeeklyForecast = () => {

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  return (

    <section className="weeklyForecast">

      <h2>7-Day Forecast</h2>

      {days.map((day) => (

        <div
          className="dayRow"
          key={day}
        >

          <span>{day}</span>

          <span>🌤️</span>

          <strong>22°</strong>

        </div>

      ))}

    </section>

  );
};

