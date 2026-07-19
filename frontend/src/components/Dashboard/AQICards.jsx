import "./AQICards.css";
import dashboardCards from "../../data/dashboardData";

function AQICards() {
  return (
    <div className="aqi-cards">
      {dashboardCards.map((card) => (
        <div className="card" key={card.id}>
          <h3>{card.title}</h3>
          <h2>{card.value}</h2>
          <p>{card.status}</p>
        </div>
      ))}
    </div>
  );
}

export default AQICards;