import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/interntrack-logo.png";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <NavLink to="/dashboard" className="navbar-brand">
        <img
          src={logo}
          alt="InternTrack logo"
          className="navbar-logo-full"
        />

        
      </NavLink>

      <div className="navbar-links">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/applications"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          Applications
        </NavLink>

        <span className="navbar-user">
          {user?.name}
        </span>

        <button
          className="logout-button"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;