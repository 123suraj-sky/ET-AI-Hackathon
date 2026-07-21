import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from "recharts";
import "./ChartsSection.css";
import { FaChartArea, FaChartPie } from "react-icons/fa";

function ChartsSection({ forecast, attribution }) {
  const forecastData = forecast || [
    { day: "Mon", aqi: 195 },
    { day: "Tue", aqi: 242 },
    { day: "Wed", aqi: 210 },
    { day: "Thu", aqi: 285 },
    { day: "Fri", aqi: 342 }
  ];

  const sourceData = attribution || [
    { source: "Vehicular Emissions", percentage: 40 },
    { source: "Construction Dust", percentage: 25 },
    { source: "Industrial Output", percentage: 20 },
    { source: "Waste Burning & Others", percentage: 15 }
  ];

  const COLORS = ["#3b82f6", "#eab308", "#f97316", "#ef4444"];

  const CustomTooltip = ({ active, payload, label }) => {
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
          <p style={{ fontWeight: "600", marginBottom: "4px" }}>{label}</p>
          <p style={{ color: "#f97316" }}>AQI: <strong>{payload[0].value}</strong></p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="charts">
      <div className="chart-box">
        <h3 className="chart-box-title">
          <FaChartArea style={{ color: "#f97316" }} />
          ARIMA 5-Day AQI Forecast Trend
        </h3>
        <div style={{ width: "100%", height: 200 }}>
          <ResponsiveContainer>
            <AreaChart data={forecastData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorAqi" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="day" stroke="#64748b" tick={{ fontSize: 12 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="aqi" stroke="#f97316" strokeWidth={3} fillOpacity={1} fill="url(#colorAqi)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="chart-box">
        <h3 className="chart-box-title">
          <FaChartPie style={{ color: "#a855f7" }} />
          Pollution Source Attribution Breakdown
        </h3>
        <div style={{ width: "100%", height: 200, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ width: "45%", height: "100%" }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={sourceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="percentage"
                  nameKey="source"
                >
                  {sourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ width: "55%", paddingLeft: "10px" }}>
            {sourceData.map((item, idx) => (
              <div key={idx} className="legend-item">
                <div style={{ width: "10px", height: "10px", backgroundColor: COLORS[idx % COLORS.length], borderRadius: "50%" }} />
                <span style={{ fontSize: "0.82rem", color: "var(--text-muted)", flex: 1 }}>{item.source}</span>
                <strong style={{ fontSize: "0.85rem", color: "var(--text-main)" }}>{item.percentage}%</strong>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChartsSection;