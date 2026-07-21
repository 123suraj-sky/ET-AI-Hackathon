import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./MapSection.css";
import { FaMapMarkedAlt } from "react-icons/fa";

function MapSection({ data }) {
  const position = [28.6139, 77.2090]; // Delhi Center
  
  const hotspots = data || [
    { id: 1, name: "Anand Vihar", aqi: 342, status: "Severe", lat: 28.6476, lon: 77.3161, majorSource: "Vehicular & Construction" },
    { id: 2, name: "Punjabi Bagh", aqi: 285, status: "Poor", lat: 28.6675, lon: 77.1264, majorSource: "Vehicular Emissions" },
    { id: 3, name: "Dwarka Sector 8", aqi: 210, status: "Poor", lat: 28.5707, lon: 77.0678, majorSource: "Construction Dust" },
    { id: 4, name: "Okhla Phase 3", aqi: 298, status: "Poor", lat: 28.5358, lon: 77.2743, majorSource: "Industrial Output" },
    { id: 5, name: "Bawana", aqi: 375, status: "Severe", lat: 28.7997, lon: 77.0329, majorSource: "Industrial & Waste Burning" }
  ];

  function getColor(aqi) {
    if (aqi <= 100) return "#22c55e"; // Green
    if (aqi <= 200) return "#eab308"; // Yellow
    if (aqi <= 300) return "#f97316"; // Orange
    return "#ef4444"; // Red
  }

  return (
    <div className="glass-panel map-section" style={{ padding: "24px" }}>
      <h2 className="map-section-title">
        <FaMapMarkedAlt style={{ color: "#3b82f6" }} />
        Live Ward & Monitoring Station Map
      </h2>
      <div className="map-wrapper">
        <MapContainer center={position} zoom={11} scrollWheelZoom={false} style={{ height: "100%", width: "100%" }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {hotspots.map((station) => (
            <CircleMarker
              key={station.id}
              center={[station.lat, station.lon]}
              radius={12 + (station.aqi / 100) * 4}
              fillColor={getColor(station.aqi)}
              color="#ffffff"
              weight={2}
              fillOpacity={0.8}
            >
              <Popup>
                <div style={{ fontSize: "13px", fontFamily: "var(--font-sans)", color: "#e2e8f0" }}>
                  <strong style={{ fontSize: "14px", color: "#ffffff", display: "block", marginBottom: "4px" }}>{station.name}</strong>
                  <div style={{ margin: "4px 0" }}>
                    AQI: <span style={{ color: getColor(station.aqi), fontWeight: "bold", fontSize: "14px" }}>{station.aqi}</span> 
                    <span style={{ marginLeft: "6px", fontSize: "11px", padding: "2px 6px", borderRadius: "4px", background: "rgba(255,255,255,0.1)" }}>{station.status}</span>
                  </div>
                  <div style={{ color: "#94a3b8", fontSize: "12px", marginTop: "4px" }}>Driver: {station.majorSource}</div>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}

export default MapSection;