import { useNavigate } from "react-router-dom";
import "./Navbar.css";
import { FaSearch, FaSignOutAlt } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

function Navbar() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <h2>🌍 AirVision</h2>
      </div>

      <div className="search">
        <FaSearch className="search-icon" />
        <input type="text" placeholder="Search city or ward..." />
      </div>

      <div className="navbar-right">
        <button className="logout-btn" onClick={handleLogout}>
          <FaSignOutAlt />
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;