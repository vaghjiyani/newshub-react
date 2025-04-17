import React from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2>Dashboard</h2>
      <ul>
        <li>
          <Link to="/admin/dashboard" className="sidebar-link">
            📰 News Dashboard
          </Link>
        </li>
        <li>
          <Link to="/admin/add-user" className="sidebar-link">
            👤 User Management
          </Link>
        </li>
        <li>
          <Link to="/admin/edit-profile" className="sidebar-link">
            🛠️ Service Management
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
