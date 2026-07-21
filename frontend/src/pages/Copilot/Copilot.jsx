import AIChat from "../../components/AIChat/AIChat";
import "./Copilot.css";
import { FaRobot } from "react-icons/fa";

function Copilot() {
  return (
    <div className="copilot-page">
      <div>
        <h1 className="dashboard-title">
          <FaRobot style={{ color: "#a855f7" }} />
          AirVision AI Copilot
        </h1>
        <p className="dashboard-subtitle">
          Ask any question about air quality, pollution mitigation strategies, health advisories, or forecasts
        </p>
      </div>

      <AIChat />
    </div>
  );
}

export default Copilot;