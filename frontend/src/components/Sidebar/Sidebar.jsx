import "./Sidebar.css";
import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <div className="sidebar">

      <NavLink to="/">Dashboard</NavLink>

      <NavLink to="/forecast">Forecast</NavLink>

      <NavLink to="/source-analysis">Source Analysis</NavLink>

      <NavLink to="/recommendations">Recommendations</NavLink>

      <NavLink to="/citizen-health">Citizen Health</NavLink>

      <NavLink to="/reports">Reports</NavLink>

      <NavLink to="/copilot">
    AI Copilot
</NavLink>

    </div>
  );
}

export default Sidebar;