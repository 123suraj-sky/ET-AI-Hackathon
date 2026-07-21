import "./RecommendationPanel.css";
import { FaBrain } from "react-icons/fa";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function RecommendationPanel({ recommendations }) {
  const content = recommendations || "Loading custom AI recommendations based on current AQI data...";

  return (
    <div className="recommendation">
      <h2 className="recommendation-panel-title">
        <FaBrain style={{ color: "#f97316" }} />
        Gemini AI-Powered Decision Recommendations
      </h2>
      <div className="recommendation-content">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
      </div>
    </div>
  );
}

export default RecommendationPanel;