import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function NavBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  console.log("user", user);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h3>Welcome, {user?.name || user?.username || "Author"}</h3>
      </div>

      <div className="navbar-right">
        <NavLink
          to="/dashboard"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/posts/new"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          New Post
        </NavLink>

        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
    </nav>
  );
}

export default NavBar;
