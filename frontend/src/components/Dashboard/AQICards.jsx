import "./AQICards.css";
import { FaWind, FaThermometerHalf, FaTint, FaCheckCircle } from "react-icons/fa";

function AQICards({ data }) {
  const currentAqi = data?.currentAqi ?? 248;
  const status = data?.status ?? "Poor";
  const temp = data?.temperature ?? "32°C";
  const humidity = data?.humidity ?? "64%";

  function getAqiColor(aqi) {
    if (aqi <= 100) return { colorClass: "card-green", dotClass: "dot-green" };
    if (aqi <= 200) return { colorClass: "card-yellow", dotClass: "dot-yellow" };
    if (aqi <= 300) return { colorClass: "card-orange", dotClass: "dot-orange" };
    return { colorClass: "card-red", dotClass: "dot-red" };
  }

  const aqiTheme = getAqiColor(currentAqi);

  const cards = [
    {
      id: 1,
      title: "Current AQI",
      value: currentAqi,
      status: status,
      colorClass: aqiTheme.colorClass,
      dotClass: aqiTheme.dotClass,
      icon: <FaWind style={{ color: "#f97316" }} />,
    },
    {
      id: 2,
      title: "Temperature",
      value: temp,
      status: "Normal Range",
      colorClass: "card-blue",
      dotClass: "dot-blue",
      icon: <FaThermometerHalf style={{ color: "#3b82f6" }} />,
    },
    {
      id: 3,
      title: "Humidity",
      value: humidity,
      status: "Optimal Level",
      colorClass: "card-teal",
      dotClass: "dot-teal",
      icon: <FaTint style={{ color: "#14b8a6" }} />,
    },
    {
      id: 4,
      title: "System Status",
      value: "Online",
      status: "All endpoints active",
      colorClass: "card-green",
      dotClass: "dot-green",
      icon: <FaCheckCircle style={{ color: "#22c55e" }} />,
    },
  ];

  return (
    <div className="aqi-cards">
      {cards.map((card) => (
        <div className={`glass-card aqi-card-item ${card.colorClass}`} key={card.id}>
          <div className="aqi-card-header">
            <span className="aqi-card-title">{card.title}</span>
            <span className="aqi-card-icon">{card.icon}</span>
          </div>
          <div className="aqi-card-value">{card.value}</div>
          <div className="aqi-card-status">
            <span className={`status-dot ${card.dotClass}`}></span>
            <span>{card.status}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default AQICards;