import AIChat from "../../components/AIChat/AIChat";
import "./Copilot.css";

function Copilot() {
  return (
    <div className="copilot-page">
      <h2>🤖 AirVision AI Copilot</h2>

      <p className="subtitle">
        Ask any question about air quality, pollution, health, or forecasts.
      </p>

      <AIChat />
    </div>
  );
}

export default Copilot;