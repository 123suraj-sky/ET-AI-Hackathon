import { useEffect, useState } from "react";
import AQICards from "../../components/Dashboard/AQICards";
import MapSection from "../../components/Dashboard/MapSection";
import ChartsSection from "../../components/Dashboard/ChartsSection";
import RecommendationPanel from "../../components/Dashboard/RecommendationPanel";
import { getDashboardData } from "../../services/dashboardApi";
import "./Dashboard.css";

function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardData()
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load dashboard data", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="loading-container"><h2>Loading dashboard analytics...</h2></div>;
  }

  return (
    <div className="dashboard-root">
      <h1 className="dashboard-title">City Air Quality Control Tower</h1>
      <AQICards data={data} />
      <div className="dashboard-grid">
        <MapSection data={data?.attribution?.hotspots} />
        <ChartsSection forecast={data?.forecast} attribution={data?.attribution?.attribution} />
      </div>
      <RecommendationPanel recommendations={data?.recommendation?.recommendations} />
    </div>
  );
}

export default Dashboard;