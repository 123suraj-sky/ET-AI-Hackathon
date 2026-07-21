import { useState, useEffect } from "react";
import "./SourceAnalysis.css";
import { getSourceAnalysis } from "../../services/sourceApi";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from "recharts";
import { FaSearch, FaExclamationTriangle, FaMapMarkerAlt, FaChartBar } from "react-icons/fa";

function SourceAnalysis() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSourceAnalysis()
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load source analysis data", err);
        setLoading(false);
      });
  }, []);

  const sources = data?.attribution || [
    { source: "Vehicular Emissions", percentage: 40 },
    { source: "Construction Dust", percentage: 25 },
    { source: "Industrial Output", percentage: 20 },
    { source: "Waste Burning & Others", percentage: 15 }
  ];

  const hotspots = data?.hotspots || [
    { id: 1, name: "Anand Vihar", aqi: 342, status: "Severe", majorSource: "Vehicular & Construction" },
    { id: 2, name: "Punjabi Bagh", aqi: 285, status: "Poor", majorSource: "Vehicular Emissions" },
    { id: 3, name: "Dwarka Sector 8", aqi: 210, status: "Poor", majorSource: "Construction Dust" },
    { id: 4, name: "Okhla Phase 3", aqi: 298, status: "Poor", majorSource: "Industrial Output" },
    { id: 5, name: "Bawana", aqi: 375, status: "Severe", majorSource: "Industrial & Waste Burning" }
  ];

  const COLORS = ["#3b82f6", "#eab308", "#f97316", "#ef4444"];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          background: "rgba(15, 23, 42, 0.9)",
          border: "1px solid rgba(255, 255, 255, 0.15)",
          backdropFilter: "blur(12px)",
          padding: "10px 14px",
          borderRadius: "8px",
          color: "#fff",
          fontSize: "13px"
        }}>
          <p style={{ fontWeight: "600", marginBottom: "4px" }}>{payload[0].payload.source}</p>
          <p style={{ color: "#3b82f6" }}>Contribution: <strong>{payload[0].value}%</strong></p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="source-container">
      <div>
        <h1 className="dashboard-title">
          <FaSearch style={{ color: "#3b82f6" }} />
          Source Attribution & Hotspot Analysis
        </h1>
        <p className="dashboard-subtitle">
          Detailed breakdown of major pollution drivers and geographic hotspots based on spatial analysis
        </p>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <h3>Analyzing pollution sources...</h3>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="summary-cards">
            <div className="glass-card summary-card glow-blue">
              <FaExclamationTriangle style={{ fontSize: "1.5rem", color: "#3b82f6", marginBottom: "8px" }} />
              <h3>Top Pollution Source</h3>
              <h2>{sources[0]?.source || "Vehicular"}</h2>
            </div>
            <div className="glass-card summary-card glow-orange">
              <FaMapMarkerAlt style={{ fontSize: "1.5rem", color: "#f97316", marginBottom: "8px" }} />
              <h3>Total Identified Hotspots</h3>
              <h2>{hotspots.length}</h2>
            </div>
            <div className="glass-card summary-card glow-blue">
              <FaChartBar style={{ fontSize: "1.5rem", color: "#8b5cf6", marginBottom: "8px" }} />
              <h3>Avg Hotspot AQI</h3>
              <h2>{Math.round(hotspots.reduce((acc, curr) => acc + curr.aqi, 0) / hotspots.length)}</h2>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
            {/* Pollution Sources */}
            <div className="glass-panel chart-section">
              <div className="section-title-icon">
                <FaChartBar style={{ color: "#3b82f6" }} />
                Pollution Source Distribution (%)
              </div>
              <div style={{ width: "100%", height: 280, marginTop: "15px" }}>
                <ResponsiveContainer>
                  <BarChart data={sources} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                    <XAxis dataKey="source" stroke="#64748b" tick={{ fontSize: 11 }} interval={0} angle={-10} textAnchor="end" />
                    <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="percentage" radius={[6, 6, 0, 0]}>
                      {sources.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Hotspot Areas */}
            <div className="glass-panel hotspot-section">
              <div className="section-title-icon">
                <FaMapMarkerAlt style={{ color: "#ef4444" }} />
                Identified City Hotspots
              </div>
              <div style={{ overflowX: "auto" }}>
                <table className="forecast-table">
                  <thead>
                    <tr>
                      <th>Location</th>
                      <th>AQI</th>
                      <th>Main Driver</th>
                    </tr>
                  </thead>
                  <tbody>
                    {hotspots.map((area, index) => (
                      <tr key={index}>
                        <td><strong>{area.name}</strong></td>
                        <td>
                          <span style={{ 
                            color: area.aqi > 300 ? "#ef4444" : "#f97316", 
                            fontWeight: "bold",
                            padding: "4px 8px",
                            borderRadius: "6px",
                            background: area.aqi > 300 ? "rgba(239, 68, 68, 0.15)" : "rgba(249, 115, 22, 0.15)"
                          }}>
                            {area.aqi}
                          </span>
                        </td>
                        <td style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>{area.majorSource}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default SourceAnalysis;