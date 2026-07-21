import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "./CitizenHealth.css";
import { getHealthAdvisor } from "../../services/citizenApi";
import { getDashboardData } from "../../services/dashboardApi";
import { FaHeartbeat, FaSyncAlt, FaExclamationTriangle } from "react-icons/fa";

const GROUP_CONFIG = [
  { label: "General Public", icon: "👥", color: "#3b82f6", risk: "Low" },
  { label: "Children & Infants", icon: "👶", color: "#22c55e", risk: "High" },
  { label: "Elderly / Seniors", icon: "🧓", color: "#f59e0b", risk: "High" },
  { label: "Outdoor Workers", icon: "⛑️", color: "#8b5cf6", risk: "Medium" },
  { label: "Sensitive Groups (Asthma, Heart Conditions)", icon: "🫁", color: "#ef4444", risk: "Very High" },
  { label: "Pregnant Women", icon: "🤰", color: "#ec4899", risk: "High" },
];

function getAqiColor(aqi) {
  if (aqi <= 50) return "#22c55e";
  if (aqi <= 100) return "#84cc16";
  if (aqi <= 200) return "#eab308";
  if (aqi <= 300) return "#f97316";
  if (aqi <= 400) return "#ef4444";
  return "#dc2626";
}

function getAqiLabel(aqi) {
  if (aqi <= 50) return "Good";
  if (aqi <= 100) return "Satisfactory";
  if (aqi <= 200) return "Moderate";
  if (aqi <= 300) return "Poor";
  if (aqi <= 400) return "Very Poor";
  return "Severe";
}

function CitizenHealth() {
  const [advice, setAdvice] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(GROUP_CONFIG[4]); // Default: Sensitive
  const [aqi, setAqi] = useState(null);
  const [aqiLoading, setAqiLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastFetched, setLastFetched] = useState(null);

  // Seed AQI from live dashboard on mount
  useEffect(() => {
    getDashboardData()
      .then((res) => {
        const liveAqi = res.data?.currentAqi;
        setAqi(typeof liveAqi === "number" ? liveAqi : 248);
      })
      .catch(() => setAqi(248))
      .finally(() => setAqiLoading(false));
  }, []);

  // Auto-fetch once AQI is available
  useEffect(() => {
    if (!aqiLoading && aqi !== null) {
      triggerFetch(aqi, selectedGroup.label);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aqiLoading]);

  const triggerFetch = (currentAqi, groupLabel) => {
    setLoading(true);
    setError("");
    setAdvice("");

    getHealthAdvisor({ aqi: currentAqi, location: "Delhi", demographics: groupLabel })
      .then((res) => {
        const text = res.data?.advice || "";
        if (text.toLowerCase().startsWith("error:") || text.toLowerCase().includes("unavailable")) {
          setError(text);
        } else {
          setAdvice(text);
          setLastFetched(new Date().toLocaleTimeString());
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to retrieve health advice. Please check Gemini API configuration and ensure the AI service is running on port 8000.");
        setLoading(false);
      });
  };

  const handleGroupChange = (group) => {
    setSelectedGroup(group);
    if (!aqiLoading && aqi !== null) {
      triggerFetch(aqi, group.label);
    }
  };

  const aqiColor = aqi !== null ? getAqiColor(aqi) : "#64748b";
  const aqiLabel = aqi !== null ? getAqiLabel(aqi) : "—";

  return (
    <div className="citizen-container">
      <div>
        <h1 className="dashboard-title">
          <FaHeartbeat style={{ color: "#ec4899" }} />
          Citizen Health Advisory
        </h1>
        <p className="dashboard-subtitle">
          AI-powered health advice tailored to your demographic group and current AQI levels (Citizen Health Agent)
        </p>
      </div>

      {/* AQI Banner */}
      <div className="aqi-banner" style={{ borderColor: `${aqiColor}44` }}>
        <div className="aqi-banner-left">
          <span className="aqi-label-small">LIVE AQI · Delhi</span>
          <span className="aqi-value" style={{ color: aqiColor }}>
            {aqiLoading ? "—" : aqi}
          </span>
          <span className="aqi-status" style={{ background: aqiColor + "22", color: aqiColor, border: `1px solid ${aqiColor}44` }}>
            {aqiLoading ? "Loading..." : aqiLabel}
          </span>
        </div>
        <div className="aqi-banner-right">
          {!aqiLoading && (
            <div className="aqi-scale">
              {[
                { max: 50, label: "Good", color: "#22c55e" },
                { max: 100, label: "Satisfactory", color: "#84cc16" },
                { max: 200, label: "Moderate", color: "#eab308" },
                { max: 300, label: "Poor", color: "#f97316" },
                { max: 400, label: "Very Poor", color: "#ef4444" },
                { max: 500, label: "Severe", color: "#dc2626" },
              ].map((band) => (
                <div
                  key={band.label}
                  className="aqi-band"
                  style={{
                    background: band.color,
                    opacity: aqi <= band.max && aqi > (band.max - 50 < 0 ? 0 : band.max - 50) ? 1 : 0.3,
                  }}
                  title={band.label}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Demographic Group Selector */}
      <div className="group-selector-section">
        <h3 className="section-label">Select Demographic Group</h3>
        <div className="group-grid">
          {GROUP_CONFIG.map((group) => (
            <button
              key={group.label}
              className={`group-card ${selectedGroup.label === group.label ? "group-card--active" : ""}`}
              style={{
                borderColor: selectedGroup.label === group.label ? group.color : "var(--glass-border)",
                background: selectedGroup.label === group.label ? group.color + "18" : "rgba(30, 41, 59, 0.35)",
              }}
              onClick={() => handleGroupChange(group)}
              disabled={loading}
            >
              <span className="group-icon">{group.icon}</span>
              <span className="group-name">{group.label}</span>
              <span
                className="group-risk"
                style={{
                  color: group.risk === "Very High" ? "#ef4444" : group.risk === "High" ? "#f97316" : group.risk === "Medium" ? "#eab308" : "#22c55e",
                }}
              >
                {group.risk} Risk
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Advice Output */}
      <div className="advice-output-card">
        <div className="advice-header">
          <span className="advice-icon">{selectedGroup.icon}</span>
          <div>
            <h3 className="advice-title">
              Advisory for: <span style={{ color: selectedGroup.color }}>{selectedGroup.label}</span>
            </h3>
            {lastFetched && !loading && (
              <span className="advice-timestamp">Last updated: {lastFetched}</span>
            )}
          </div>
          <button
            className="refresh-btn"
            onClick={() => triggerFetch(aqi, selectedGroup.label)}
            disabled={loading || aqiLoading}
            title="Refresh advice"
            style={{ marginLeft: "auto" }}
          >
            <FaSyncAlt className={loading ? "spin" : ""} /> Refresh Advice
          </button>
        </div>

        <div className="advice-body">
          {loading ? (
            <div className="advice-loading">
              <div className="spinner" style={{ margin: "0 auto 16px" }} />
              <p>Analyzing health recommendations for <strong>{selectedGroup.label}</strong> with AQI {aqi}...</p>
              <p className="loading-sub">Powered by Gemini AI · Tailoring medical & protection guidance</p>
            </div>
          ) : error ? (
            <div className="advice-error">
              <FaExclamationTriangle style={{ fontSize: "2.5rem", color: "#ef4444", marginBottom: "12px" }} />
              <p style={{ color: "#ef4444", fontWeight: "bold", marginBottom: "8px" }}>Could not retrieve health advice</p>
              <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>{error}</p>
            </div>
          ) : advice ? (
            <div className="advice-content">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{advice}</ReactMarkdown>
            </div>
          ) : (
            <div className="advice-empty">
              <div style={{ fontSize: "2.5rem", marginBottom: "14px" }}>🏥</div>
              <p>No advice yet. Select a demographic group above to get started.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CitizenHealth;