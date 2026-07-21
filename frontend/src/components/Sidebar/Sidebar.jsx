import "./Sidebar.css";
import { NavLink } from "react-router-dom";
import { 
  FaChartLine, 
  FaProjectDiagram, 
  FaLightbulb, 
  FaHeartbeat, 
  FaFileAlt, 
  FaRobot,
  FaThLarge
} from "react-icons/fa";

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-heading">Navigation Menu</div>

      <NavLink to="/dashboard" className={({ isActive }) => (isActive ? "active" : "")}>
        <FaThLarge className="sidebar-icon" />
        <span>Dashboard</span>
      </NavLink>

      <NavLink to="/forecast" className={({ isActive }) => (isActive ? "active" : "")}>
        <FaChartLine className="sidebar-icon" />
        <span>Forecast</span>
      </NavLink>

      <NavLink to="/source-analysis" className={({ isActive }) => (isActive ? "active" : "")}>
        <FaProjectDiagram className="sidebar-icon" />
        <span>Source Analysis</span>
      </NavLink>

      <NavLink to="/recommendations" className={({ isActive }) => (isActive ? "active" : "")}>
        <FaLightbulb className="sidebar-icon" />
        <span>Recommendations</span>
      </NavLink>

      <NavLink to="/citizen-health" className={({ isActive }) => (isActive ? "active" : "")}>
        <FaHeartbeat className="sidebar-icon" />
        <span>Citizen Health</span>
      </NavLink>

      <NavLink to="/reports" className={({ isActive }) => (isActive ? "active" : "")}>
        <FaFileAlt className="sidebar-icon" />
        <span>Reports</span>
      </NavLink>

      <div className="sidebar-heading" style={{ marginTop: "16px" }}>AI Tools</div>

      <NavLink to="/copilot" className={({ isActive }) => (isActive ? "active" : "")}>
        <FaRobot className="sidebar-icon" style={{ color: "#a855f7" }} />
        <span>AI Copilot</span>
      </NavLink>
    </aside>
  );
}

export default Sidebar;