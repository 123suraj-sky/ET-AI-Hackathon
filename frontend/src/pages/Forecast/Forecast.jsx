import "./Forecast.css";
import forecastData from "../../data/forecastData";

function Forecast() {
  return (
    <div className="forecast-container">

      <h2 className="forecast-title">5-Day AQI Forecast</h2>

      <table className="forecast-table">

        <thead>
          <tr>
            <th>Day</th>
            <th>AQI</th>
            <th>Temperature</th>
            <th>Humidity</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>

          {forecastData.map((item) => (
            <tr key={item.id}>
              <td>{item.day}</td>
              <td>{item.aqi}</td>
              <td>{item.temperature}</td>
              <td>{item.humidity}</td>
              <td>{item.status}</td>
            </tr>
          ))}

        </tbody>

      </table>

    </div>
  );
}

export default Forecast;