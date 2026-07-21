import { useState, useEffect, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "./Recommendations.css";
import { getRecommendations } from "../../services/recommendationApi";
import { getDashboardData } from "../../services/dashboardApi";
import { FaBrain, FaBolt, FaExclamationTriangle } from "react-icons/fa";

function Recommendations() {
  const [recommendations, setRecommendations] = useState("");
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState("Delhi");
  const [aqi, setAqi] = useState("");
  const [aqiLoading, setAqiLoading] = useState(true);
  const [error, setError] = useState("");

  // Seed AQI from live dashboard on mount
  useEffect(() => {
    getDashboardData()
      .then((res) => {
        const liveAqi = res.data?.currentAqi;
        if (liveAqi && typeof liveAqi === "number") {
          setAqi(liveAqi);
        } else {
          setAqi(248);
        }
      })
      .catch(() => setAqi(248))
      .finally(() => setAqiLoading(false));
  }, []);

  // Auto-fetch recommendations once AQI is loaded
  const fetchRecommendations = useCallback((currentAqi, currentLocation) => {
    const aqiValue = currentAqi !== undefined ? currentAqi : aqi;
    const locationValue = currentLocation !== undefined ? currentLocation : location;

    if (!aqiValue && aqiValue !== 0) return;

    setLoading(true);
    setError("");
    getRecommendations({ aqi: aqiValue, location: locationValue })
      .then((res) => {
        const text = res.data?.recommendations || "";
        if (text.toLowerCase().startsWith("error:") || text.toLowerCase().includes("unavailable")) {
          setError(text);
          setRecommendations("");
        } else {
          setRecommendations(text);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to retrieve recommendations. Please verify the Gemini API key configuration and ensure the AI service is running.");
        setLoading(false);
      });
  }, [aqi, location]);

  useEffect(() => {
    if (!aqiLoading && aqi !== "") {
      fetchRecommendations(aqi, location);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aqiLoading, aqi]);

  const handleGenerate = () => {
    fetchRecommendations(aqi, location);
  };

  return (
    <div className="recommendation-container">
      <div>
        <h1 className="dashboard-title">
          <FaBrain style={{ color: "#f97316" }} />
          Decision Intelligence Advisor
        </h1>
        <p className="dashboard-subtitle">
          Get immediate, Gemini AI-driven action plans for municipal and environmental control actions
        </p>
      </div>

      <div className="advisor-control-bar">
        <div className="input-group">
          <label className="input-label">City / Location</label>
          <input
            type="text"
            className="control-input"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        <div className="input-group">
          <label className="input-label">
            Current AQI {aqiLoading && <span style={{ color: "var(--text-dim)", fontSize: "0.75rem" }}>(loading live…)</span>}
          </label>
          <input
            type="number"
            className="control-input"
            style={{ width: "120px" }}
            value={aqi}
            onChange={(e) => setAqi(Number(e.target.value))}
          />
        </div>
        <button
          className="action-btn"
          onClick={handleGenerate}
          disabled={loading || aqiLoading}
        >
          <FaBolt />
          {loading ? "Analyzing..." : "Generate Action Plan"}
        </button>
      </div>

      <div className="recommendation-box">
        {loading ? (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <div className="spinner" style={{ margin: "0 auto 16px" }} />
            <div style={{ color: "#f97316", fontSize: "1rem", fontWeight: "600" }}>
              Generating optimized interventions via Gemini AI...
            </div>
            <p style={{ color: "var(--text-dim)", marginTop: "8px", fontSize: "0.85rem" }}>
              Evaluating emission controls, traffic routing & emergency protocols
            </p>
          </div>
        ) : error ? (
          <div style={{ textAlign: "center", padding: "30px 0" }}>
            <FaExclamationTriangle style={{ fontSize: "2.5rem", color: "#ef4444", marginBottom: "12px" }} />
            <p style={{ color: "#ef4444", marginBottom: "8px", fontWeight: "bold" }}>Could not generate recommendations</p>
            <p style={{ color: "var(--text-muted)", fontSize: "0.88rem", maxWidth: "500px", margin: "0 auto" }}>{error}</p>
          </div>
        ) : recommendations ? (
          <div className="markdown-body" style={{ color: "#e2e8f0", lineHeight: "1.8" }}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{recommendations}</ReactMarkdown>
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "40px 0", color: "var(--text-dim)" }}>
            <FaBrain style={{ fontSize: "3rem", marginBottom: "16px", opacity: 0.5 }} />
            <p style={{ fontSize: "1rem", marginBottom: "6px", color: "var(--text-muted)" }}>No recommendations generated yet</p>
            <p style={{ fontSize: "0.85rem" }}>Click "Generate Action Plan" to get AI-powered intervention strategies.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Recommendations;