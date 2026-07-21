import "./RecommendationPanel.css";
import { FaBrain } from "react-icons/fa";

function RecommendationPanel({ recommendations }) {
  const content = recommendations || "Loading custom AI recommendations based on current AQI data...";

  const renderContent = () => {
    return content.split("\n").map((line, index) => {
      if (line.trim().startsWith("-") || line.trim().startsWith("*")) {
        return <li key={index}>{line.replace(/^[-*]\s*/, "")}</li>;
      }
      if (line.trim().startsWith("###")) {
        return <h4 key={index}>{line.replace(/^###\s*/, "")}</h4>;
      }
      if (line.trim().startsWith("##")) {
        return <h3 key={index}>{line.replace(/^##\s*/, "")}</h3>;
      }
      if (line.trim() === "") {
        return <br key={index} />;
      }
      return <p key={index}>{line}</p>;
    });
  };

  return (
    <div className="recommendation">
      <h2 className="recommendation-panel-title">
        <FaBrain style={{ color: "#f97316" }} />
        Gemini AI-Powered Decision Recommendations
      </h2>
      <div className="recommendation-content">
        {renderContent()}
      </div>
    </div>
  );
}

export default RecommendationPanel;