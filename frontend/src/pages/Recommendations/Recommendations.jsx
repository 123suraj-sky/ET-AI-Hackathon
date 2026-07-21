import { useState, useEffect, useCallback } from "react";
import "./Recommendations.css";
import { getRecommendations } from "../../services/recommendationApi";
import { getDashboardData } from "../../services/dashboardApi";

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

  // Auto-fetch recommendations once AQI is loaded — pass aqi as param to avoid stale closure
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

  const formatText = (text) => {
    if (!text) return null;
    return text.split("\n").map((line, idx) => {
      const trimmed = line.trim();
      if (!trimmed) return <br key={idx} />;
      if (trimmed.startsWith("**") && trimmed.endsWith("**")) {
        return <strong key={idx} style={{ display: "block", marginTop: "12px", color: "#f97316" }}>{trimmed.slice(2, -2)}</strong>;
      }
      if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
        return <li key={idx} className="rec-bullet">{trimmed.replace(/^[-*]\s*/, "").replace(/\*\*(.*?)\*\*/g, "$1")}</li>;
      }
      if (trimmed.startsWith("###")) {
        return <h4 key={idx} className="rec-subheading">{trimmed.replace(/^###\s*/, "")}</h4>;
      }
      if (trimmed.startsWith("##")) {
        return <h3 key={idx} className="rec-heading">{trimmed.replace(/^##\s*/, "")}</h3>;
      }
      if (trimmed.startsWith("#")) {
        return <h2 key={idx} className="rec-main-title">{trimmed.replace(/^#\s*/, "")}</h2>;
      }
      return <p key={idx} className="rec-paragraph">{line}</p>;
    });
  };

  return (
    <div className="recommendation-container">
      <h2 className="page-title">🧠 Decision Intelligence Advisor</h2>
      <p className="page-description">Get immediate, Gemini AI-driven action plans for municipal and environmental control actions.</p>

      <div
        className="advisor-control-bar"
        style={{
          display: "flex",
          gap: "15px",
          marginBottom: "25px",
          background: "rgba(255, 255, 255, 0.05)",
          padding: "15px",
          borderRadius: "8px",
          flexWrap: "wrap",
          alignItems: "flex-end",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
          <label style={{ color: "#94a3b8", fontSize: "13px" }}>City / Location</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            style={{ padding: "8px 12px", borderRadius: "6px", border: "1px solid #334155", background: "#0F172A", color: "#fff", fontSize: "14px" }}
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
          <label style={{ color: "#94a3b8", fontSize: "13px" }}>
            Current AQI{aqiLoading && <span style={{ color: "#64748b", fontSize: "11px", marginLeft: "6px" }}>(loading live…)</span>}
          </label>
          <input
            type="number"
            value={aqi}
            onChange={(e) => setAqi(Number(e.target.value))}
            style={{ padding: "8px 12px", borderRadius: "6px", border: "1px solid #334155", background: "#0F172A", color: "#fff", fontSize: "14px", width: "110px" }}
          />
        </div>
        <button
          onClick={handleGenerate}
          disabled={loading || aqiLoading}
          style={{
            padding: "10px 22px",
            borderRadius: "6px",
            border: "none",
            background: loading || aqiLoading ? "#374151" : "linear-gradient(135deg, #f97316, #ea580c)",
            color: "#fff",
            fontWeight: "bold",
            cursor: loading || aqiLoading ? "not-allowed" : "pointer",
            transition: "opacity 0.2s",
            fontSize: "14px",
          }}
        >
          {loading ? "⏳ Analyzing..." : "⚡ Generate Action Plan"}
        </button>
      </div>

      <div
        className="recommendation-box"
        style={{
          background: "rgba(15, 23, 42, 0.8)",
          padding: "24px",
          borderRadius: "10px",
          border: "1px solid rgba(249, 115, 22, 0.15)",
          minHeight: "200px",
        }}
      >
        {loading ? (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <div className="loading" style={{ color: "#f97316", fontSize: "16px" }}>
              🔄 Generating optimized interventions via Gemini AI...
            </div>
            <p style={{ color: "#64748b", marginTop: "10px", fontSize: "13px" }}>This may take a few seconds</p>
          </div>
        ) : error ? (
          <div style={{ textAlign: "center", padding: "30px 0" }}>
            <div style={{ fontSize: "36px", marginBottom: "12px" }}>⚠️</div>
            <p style={{ color: "#ef4444", marginBottom: "8px", fontWeight: "bold" }}>Could not generate recommendations</p>
            <p style={{ color: "#64748b", fontSize: "13px", maxWidth: "500px", margin: "0 auto" }}>{error}</p>
          </div>
        ) : recommendations ? (
          <div className="markdown-body" style={{ color: "#e2e8f0", lineHeight: "1.8" }}>
            {formatText(recommendations)}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "40px 0", color: "#475569" }}>
            <div style={{ fontSize: "40px", marginBottom: "14px" }}>🧠</div>
            <p style={{ fontSize: "15px", marginBottom: "6px" }}>No recommendations yet</p>
            <p style={{ fontSize: "13px" }}>Click "Generate Action Plan" to get AI-powered intervention strategies.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Recommendations;