import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from "recharts";
import "./ChartsSection.css";

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

  return (
    <div className="charts">
      <div className="chart-box">
        <h3>📈 ARIMA 5-Day AQI Forecast Trend</h3>
        <div style={{ width: "100%", height: 260 }}>
          <ResponsiveContainer>
            <AreaChart data={forecastData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorAqi" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="day" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip />
              <Area type="monotone" dataKey="aqi" stroke="#f97316" strokeWidth={2} fillOpacity={1} fill="url(#colorAqi)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="chart-box">
        <h3>🍩 Pollution Source Attribution Breakdown</h3>
        <div style={{ width: "100%", height: 260, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ width: "50%", height: "100%" }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={sourceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
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
          <div style={{ width: "50%", paddingLeft: "10px", fontSize: "12px" }}>
            {sourceData.map((item, idx) => (
              <div key={idx} style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
                <div style={{ width: "12px", height: "12px", backgroundColor: COLORS[idx % COLORS.length], marginRight: "8px", borderRadius: "2px" }} />
                <span>{item.source}: <strong>{item.percentage}%</strong></span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChartsSection;