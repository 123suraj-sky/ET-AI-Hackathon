import { useState, useEffect } from "react";
import "./Reports.css";
import { generateReport } from "../../services/llmApi";
import { getDashboardData } from "../../services/dashboardApi";

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
      <h2 className="page-title">📊 Executive Report Generator</h2>
      <p className="page-description">
        Generate comprehensive, AI-authored environmental summaries for submission to municipal officers and regulatory bodies.
      </p>

      {/* Controls */}
      <div
        className="report-controls"
        style={{
          display: "flex",
          gap: "15px",
          margin: "20px 0",
          background: "rgba(255, 255, 255, 0.05)",
          padding: "16px 20px",
          borderRadius: "10px",
          flexWrap: "wrap",
          alignItems: "flex-end",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
          <label style={{ color: "#94a3b8", fontSize: "13px" }}>Target Location</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            style={{ padding: "8px 12px", borderRadius: "6px", border: "1px solid #334155", background: "#0F172A", color: "#fff", fontSize: "14px" }}
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
          <label style={{ color: "#94a3b8", fontSize: "13px" }}>
            Average AQI
            {aqiLoading && <span style={{ color: "#64748b", fontSize: "11px", marginLeft: "6px" }}>(loading live…)</span>}
          </label>
          <input
            type="number"
            value={aqi}
            onChange={(e) => setAqi(Number(e.target.value))}
            style={{ padding: "8px 12px", borderRadius: "6px", border: "1px solid #334155", background: "#0F172A", color: "#fff", fontSize: "14px", width: "110px" }}
          />
        </div>
        <button
          onClick={triggerReport}
          disabled={loading}
          style={{
            padding: "10px 22px",
            borderRadius: "6px",
            border: "none",
            background: loading ? "#374151" : "linear-gradient(135deg, #f97316, #ea580c)",
            color: "#fff",
            fontWeight: "bold",
            cursor: loading ? "not-allowed" : "pointer",
            fontSize: "14px",
            transition: "opacity 0.2s",
          }}
        >
          {loading ? "⏳ Generating Report..." : "📄 Generate Report"}
        </button>
      </div>

      {/* Output */}
      <div
        className="report-output"
        style={{
          background: "rgba(15, 23, 42, 0.85)",
          padding: "30px",
          borderRadius: "12px",
          border: "1px solid rgba(249, 115, 22, 0.12)",
          minHeight: "280px",
        }}
      >
        {loading ? (
          <div style={{ textAlign: "center", padding: "50px 0" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                border: "3px solid rgba(249, 115, 22, 0.2)",
                borderTopColor: "#f97316",
                borderRadius: "50%",
                animation: "spin 0.8s linear infinite",
                margin: "0 auto 16px",
              }}
            />
            <p style={{ color: "#94a3b8", fontSize: "15px" }}>Preparing executive report via Gemini AI...</p>
            <p style={{ color: "#475569", fontSize: "12px", marginTop: "6px" }}>Formatting analysis, health impact, and remediation plan</p>
          </div>
        ) : error ? (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <div style={{ fontSize: "36px", marginBottom: "12px" }}>⚠️</div>
            <p style={{ color: "#ef4444", fontWeight: "bold", marginBottom: "8px" }}>Failed to generate report</p>
            <p style={{ color: "#64748b", fontSize: "13px", maxWidth: "500px", margin: "0 auto" }}>{error}</p>
          </div>
        ) : reportText ? (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              {generatedAt && (
                <span style={{ fontSize: "12px", color: "#475569" }}>
                  Generated: {generatedAt} · Location: {location} · AQI: {aqi}
                </span>
              )}
              <button
                onClick={() => window.print()}
                style={{
                  padding: "8px 16px",
                  borderRadius: "6px",
                  background: "transparent",
                  color: "#f97316",
                  border: "1px solid #f97316",
                  cursor: "pointer",
                  fontWeight: "bold",
                  fontSize: "13px",
                  marginLeft: "auto",
                }}
              >
                🖨️ Print / Save PDF
              </button>
            </div>
            <div className="report-text">{formatMarkdown(reportText)}</div>
          </div>
        ) : (
          <div style={{ textAlign: "center", color: "#475569", padding: "50px 0" }}>
            <div style={{ fontSize: "42px", marginBottom: "16px" }}>📊</div>
            <p style={{ fontSize: "15px", marginBottom: "6px", color: "#64748b" }}>No report generated yet</p>
            <p style={{ fontSize: "13px" }}>
              Click <strong style={{ color: "#f97316" }}>Generate Report</strong> to compile a full AI-authored executive brief.
            </p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

export default Reports;