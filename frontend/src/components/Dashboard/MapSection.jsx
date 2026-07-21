import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./MapSection.css";

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
    <div className="map-section">
      <h2 className="section-title">🗺 Live Ward & Monitoring Station Map</h2>
      <div className="map-wrapper" style={{ height: "350px", width: "100%", borderRadius: "8px", overflow: "hidden" }}>
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
              fillOpacity={0.75}
            >
              <Popup>
                <div style={{ fontSize: "14px", fontFamily: "sans-serif" }}>
                  <strong>{station.name}</strong>
                  <div style={{ margin: "4px 0" }}>AQI: <span style={{ color: getColor(station.aqi), fontWeight: "bold" }}>{station.aqi}</span> ({station.status})</div>
                  <div>Primary Driver: {station.majorSource}</div>
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