import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

function AppNavbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("syncSpaceUser"));

  const handleLogout = () => {
    localStorage.removeItem("syncSpaceUser");
    navigate("/login");
  };

  if (!user) {
    return null;
  }

  return (
    <nav className="navbar navbar-expand-lg glass-nav px-3 px-lg-4">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold text-white" to="/">
          Sync Space
        </Link>
        <button
          className="navbar-toggler border-0 shadow-none"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNav"
          aria-controls="mainNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="mainNav">
          <div className="navbar-nav ms-auto align-items-lg-center gap-lg-2">
            <NavLink className="nav-link text-white" to="/">
              Dashboard
            </NavLink>
            <span className="nav-link text-white-50 small">{user.name}</span>
            <button type="button" className="btn btn-sunset" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default AppNavbar;
