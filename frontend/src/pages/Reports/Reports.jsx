import { useState, useEffect } from "react";
import "./Reports.css";
import { generateReport } from "../../services/llmApi";
import { getDashboardData } from "../../services/dashboardApi";
import { FaFileAlt, FaPrint, FaExclamationTriangle, FaMagic } from "react-icons/fa";

function Reports() {
  const [reportText, setReportText] = useState("");
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState("Delhi");
  const [aqi, setAqi] = useState(248);
  const [aqiLoading, setAqiLoading] = useState(true);
  const [error, setError] = useState("");
  const [generatedAt, setGeneratedAt] = useState(null);

  // Seed AQI from live dashboard on mount
  useEffect(() => {
    getDashboardData()
      .then((res) => {
        const liveAqi = res.data?.currentAqi;
        if (liveAqi && typeof liveAqi === "number") {
          setAqi(liveAqi);
        }
      })
      .catch(() => {/* keep default 248 */})
      .finally(() => setAqiLoading(false));
  }, []);

  const triggerReport = () => {
    setLoading(true);
    setError("");
    generateReport({ aqi, location })
      .then((res) => {
        const text = res.data?.report || "";
        if (text.toLowerCase().startsWith("error:") || text.toLowerCase().includes("unavailable")) {
          setError(text);
          setReportText("");
        } else {
          setReportText(text);
          setGeneratedAt(new Date().toLocaleString());
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to generate report. Please check server connections and Gemini configuration.");
        setLoading(false);
      });
  };

  const formatMarkdown = (text) => {
    return text.split("\n").map((line, idx) => {
      const trimmed = line.trim();
      if (!trimmed) return <br key={idx} />;
      if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
        return <li key={idx} style={{ marginLeft: "20px", marginBottom: "6px", color: "#cbd5e1" }}>{trimmed.replace(/^[-*]\s*/, "")}</li>;
      }
      if (trimmed.startsWith("###")) {
        return <h4 key={idx} style={{ color: "#f97316", marginTop: "16px", marginBottom: "8px", fontSize: "14px", fontWeight: "600" }}>{trimmed.replace(/^###\s*/, "")}</h4>;
      }
      if (trimmed.startsWith("##")) {
        return (
          <h3
            key={idx}
            style={{
              color: "#f97316",
              borderBottom: "1px solid rgba(249,115,22,0.25)",
              paddingBottom: "6px",
              marginTop: "24px",
              marginBottom: "12px",
              fontSize: "16px",
            }}
          >
            {trimmed.replace(/^##\s*/, "")}
          </h3>
        );
      }
      if (trimmed.startsWith("#")) {
        return (
          <h2 key={idx} style={{ color: "#fff", marginTop: "28px", marginBottom: "8px", fontSize: "20px", fontWeight: "700" }}>
            {trimmed.replace(/^#\s*/, "")}
          </h2>
        );
      }
      return <p key={idx} style={{ marginBottom: "12px", lineHeight: "1.75", color: "#cbd5e1" }}>{line}</p>;
    });
  };

  return (
    <div className="reports-container">
      <div>
        <h1 className="dashboard-title">
          <FaFileAlt style={{ color: "#3b82f6" }} />
          Executive Report Generator
        </h1>
        <p className="dashboard-subtitle">
          Generate comprehensive, AI-authored environmental summaries for submission to municipal officers and regulatory bodies
        </p>
      </div>

      {/* Controls */}
      <div className="report-controls">
        <div className="input-group">
          <label className="input-label">Target Location</label>
          <input
            type="text"
            className="control-input"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        <div className="input-group">
          <label className="input-label">
            Average AQI {aqiLoading && <span style={{ color: "var(--text-dim)", fontSize: "0.75rem" }}>(loading live…)</span>}
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
          onClick={triggerReport}
          disabled={loading}
        >
          <FaMagic />
          {loading ? "Generating Report..." : "Generate Report"}
        </button>
      </div>

      {/* Output */}
      <div className="report-output">
        {loading ? (
          <div style={{ textAlign: "center", padding: "50px 0" }}>
            <div className="spinner" style={{ margin: "0 auto 16px" }} />
            <p style={{ color: "var(--text-muted)", fontSize: "1rem" }}>Preparing executive report via Gemini AI...</p>
            <p style={{ color: "var(--text-dim)", fontSize: "0.85rem", marginTop: "6px" }}>Formatting analysis, health impact, and remediation plan</p>
          </div>
        ) : error ? (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <FaExclamationTriangle style={{ fontSize: "2.5rem", color: "#ef4444", marginBottom: "12px" }} />
            <p style={{ color: "#ef4444", fontWeight: "bold", marginBottom: "8px" }}>Failed to generate report</p>
            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", maxWidth: "500px", margin: "0 auto" }}>{error}</p>
          </div>
        ) : reportText ? (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              {generatedAt && (
                <span style={{ fontSize: "0.82rem", color: "var(--text-dim)" }}>
                  Generated: {generatedAt} · Location: {location} · AQI: {aqi}
                </span>
              )}
              <button className="print-btn" onClick={() => window.print()} style={{ marginLeft: "auto" }}>
                <FaPrint /> Print / Save PDF
              </button>
            </div>
            <div className="report-text">{formatMarkdown(reportText)}</div>
          </div>
        ) : (
          <div style={{ textAlign: "center", color: "var(--text-dim)", padding: "50px 0" }}>
            <FaFileAlt style={{ fontSize: "3rem", marginBottom: "16px", opacity: 0.4 }} />
            <p style={{ fontSize: "1rem", marginBottom: "6px", color: "var(--text-muted)" }}>No report generated yet</p>
            <p style={{ fontSize: "0.85rem" }}>
              Click <strong style={{ color: "#f97316" }}>Generate Report</strong> to compile a full AI-authored executive brief.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Reports;