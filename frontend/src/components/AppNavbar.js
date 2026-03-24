import React from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { clearStoredUser, useStoredUser } from "../services/authStorage";

function AppNavbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useStoredUser();

  const handleLogout = () => {
    clearStoredUser();
    navigate("/", { replace: true });
  };

  if (!user || location.pathname === "/") {
    return null;
  }

  return (
    <nav className="navbar glass-nav px-3 px-lg-4">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold text-white" to="/dashboard">
          Sync Space
        </Link>
        <div className="d-flex flex-wrap align-items-center justify-content-end gap-2 gap-lg-3 ms-auto">
          <NavLink className="nav-link text-white px-2" to="/">
            Home
          </NavLink>
          <NavLink className="nav-link text-white px-2" to="/dashboard">
            Dashboard
          </NavLink>
          <span className="text-white-50 small px-2">{user.name}</span>
          <button type="button" className="btn btn-sunset" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default AppNavbar;
