import { useState, useEffect } from "react";
import "./Forecast.css";
import { getForecastData } from "../../services/forecastApi";
import { FaChartLine } from "react-icons/fa";

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
      <div>
        <h1 className="dashboard-title">
          <FaChartLine style={{ color: "#3b82f6" }} />
          5-Day ML AQI Forecast (ARIMA Model)
        </h1>
        <p className="dashboard-subtitle">
          Autoregressive Integrated Moving Average predictive modeling for atmospheric trends
        </p>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <h3>Analyzing seasonal atmospheric data patterns...</h3>
        </div>
      ) : (
        <div className="table-glass-wrapper">
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
                  <td><strong>{item.day}</strong></td>
                  <td>
                    <span style={{ fontWeight: "800", color: "#f97316", fontSize: "1.05rem" }}>
                      {item.aqi}
                    </span>
                  </td>
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
        </div>
      )}
    </div>
  );
}

export default Forecast;