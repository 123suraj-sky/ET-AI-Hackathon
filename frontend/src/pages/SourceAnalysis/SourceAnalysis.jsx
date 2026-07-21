import { useState, useEffect } from "react";
import "./SourceAnalysis.css";
import { getSourceAnalysis } from "../../services/sourceApi";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from "recharts";

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

  return (
    <div className="source-container">
      <h2 className="page-title">🔍 Source Attribution & Hotspot Analysis</h2>
      <p style={{ color: "#94a3b8", marginBottom: "20px" }}>Detailed breakdown of major pollution drivers and geographic hotspots based on spatial analysis.</p>

      {loading ? (
        <h3>Analyzing pollution sources...</h3>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="summary-cards">
            <div className="summary-card">
              <h3>Top Pollution Source</h3>
              <h2>{sources[0]?.source || "Vehicular"}</h2>
            </div>
            <div className="summary-card">
              <h3>Total Identified Hotspots</h3>
              <h2>{hotspots.length}</h2>
            </div>
            <div className="summary-card">
              <h3>Avg Hotspot AQI</h3>
              <h2>{Math.round(hotspots.reduce((acc, curr) => acc + curr.aqi, 0) / hotspots.length)}</h2>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "25px", marginTop: "25px" }}>
            {/* Pollution Sources */}
            <div className="chart-section" style={{ background: "rgba(255,255,255,0.02)", padding: "20px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)" }}>
              <h3>Pollution Source Distribution (%)</h3>
              <div style={{ width: "100%", height: 260, marginTop: "15px" }}>
                <ResponsiveContainer>
                  <BarChart data={sources}>
                    <XAxis dataKey="source" stroke="#94a3b8" tick={{ fontSize: 10 }} />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip />
                    <Bar dataKey="percentage">
                      {sources.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Hotspot Areas */}
            <div className="hotspot-section" style={{ background: "rgba(255,255,255,0.02)", padding: "20px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)" }}>
              <h3>Identified City Hotspots</h3>
              <table className="forecast-table" style={{ width: "100%", marginTop: "15px" }}>
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
                      <td style={{ color: area.aqi > 300 ? "#ef4444" : "#f97316", fontWeight: "bold" }}>{area.aqi}</td>
                      <td style={{ fontSize: "12px" }}>{area.majorSource}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default SourceAnalysis;