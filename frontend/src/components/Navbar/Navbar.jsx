import { useNavigate } from "react-router-dom";
import "./Navbar.css";
import { FaBell, FaUserCircle } from "react-icons/fa";
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
        <input type="text" placeholder="Search City..." />
      </div>

      <button onClick={handleLogout}>
    Logout
</button>
    </nav>
  );
}

export default Navbar;