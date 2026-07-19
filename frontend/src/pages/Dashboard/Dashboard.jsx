import AQICards from "../../components/Dashboard/AQICards";
import MapSection from "../../components/Dashboard/MapSection";
import ChartsSection from "../../components/Dashboard/ChartsSection";
import RecommendationPanel from "../../components/Dashboard/RecommendationPanel";

function Dashboard() {
  return (
    <div>

      <AQICards />

      <MapSection />

      <ChartsSection />

      <RecommendationPanel />

    </div>
  );
}

export default Dashboard;