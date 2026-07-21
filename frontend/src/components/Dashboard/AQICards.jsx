import "./AQICards.css";

function AQICards({ data }) {
  const currentAqi = data?.currentAqi ?? 248;
  const status = data?.status ?? "Poor";
  const temp = data?.temperature ?? "32°C";
  const humidity = data?.humidity ?? "64%";

  const cards = [
    { id: 1, title: "Current AQI", value: currentAqi, status: status, color: getAqiColor(currentAqi) },
    { id: 2, title: "Temperature", value: temp, status: "Normal Range", color: "card-blue" },
    { id: 3, title: "Humidity", value: humidity, status: "Optimal", color: "card-teal" },
    { id: 4, title: "System Status", value: "Online", status: "All endpoints active", color: "card-green" },
  ];

  function getAqiColor(aqi) {
    if (aqi <= 100) return "card-green";
    if (aqi <= 200) return "card-yellow";
    if (aqi <= 300) return "card-orange";
    return "card-red";
  }

  return (
    <div className="aqi-cards">
      {cards.map((card) => (
        <div className={`card ${card.color}`} key={card.id}>
          <h3>{card.title}</h3>
          <h2>{card.value}</h2>
          <p>{card.status}</p>
        </div>
      ))}
    </div>
  );
}

export default AQICards;