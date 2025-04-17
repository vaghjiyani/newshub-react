import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./AdminLayout.css";

function AdminLayout({ children, title }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminName");
    navigate("/admin/login");
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="admin-layout">
      {/* Desktop Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <span>News Dashboard</span>
          </div>
        </div>
        <nav className="sidebar-nav">
          <Link
            to="/admin/dashboard"
            className={`nav-link ${isActive("/admin/dashboard") ? "active" : ""}`}
          >
            User Management
          </Link>
          <Link
            to="/admin/edit-profile"
            className={`nav-link ${isActive("/admin/edit-profile") ? "active" : ""}`}
          >
            Service Management
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <header className="header">
          <div className="header-content">
            <h1 className="page-title">{title}</h1>
            <div className="user-profile">
              <div className="profile-icon">👤</div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="content">
          {children}
        </main>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="mobile-menu-overlay">
          <div className="mobile-menu">
            <div className="mobile-menu-header">
              <div className="logo">
                <span>News Dashboard</span>
              </div>
            </div>
            <nav className="mobile-nav">
              <Link
                to="/admin/dashboard"
                className={`nav-link ${isActive("/admin/dashboard") ? "active" : ""}`}
                onClick={() => setIsMenuOpen(false)}
              >
                User Management
              </Link>
              <Link
                to="/admin/edit-profile"
                className={`nav-link ${isActive("/admin/edit-profile") ? "active" : ""}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Service Management
              </Link>
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminLayout; 