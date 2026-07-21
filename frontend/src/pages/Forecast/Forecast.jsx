import { useState, useEffect } from "react";
import "./Forecast.css";
import { getForecastData } from "../../services/forecastApi";

function Forecast() {
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getForecastData()
      .then((res) => {
        setForecast(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Forecast load failed", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="forecast-container">
      <h2 className="forecast-title">🔮 5-Day ML AQI Forecast (ARIMA Model)</h2>
      <p style={{ color: "#94a3b8", marginBottom: "20px" }}>Autoregressive Integrated Moving Average predictive modeling for atmospheric trends.</p>

      {loading ? (
        <h3>Analyzing seasonal atmospheric data patterns...</h3>
      ) : (
        <table className="forecast-table">
          <thead>
            <tr>
              <th>Day</th>
              <th>Predicted AQI</th>
              <th>Estimated Temp</th>
              <th>Expected Humidity</th>
              <th>Air Quality Status</th>
            </tr>
          </thead>
          <tbody>
            {forecast.map((item) => (
              <tr key={item.id}>
                <td>{item.day}</td>
                <td style={{ fontWeight: "bold", color: "#f97316" }}>{item.aqi}</td>
                <td>{item.temperature}</td>
                <td>{item.humidity}</td>
                <td>
                  <span className={`status-badge ${item.status.toLowerCase().replace(/\s+/g, "-")}`}>
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Forecast;