import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './AdminLogin.css'; // ✅ make sure this is the correct path

function AdminLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post("http://localhost:8080/admin/login", formData);
      console.log('Login response:', response.data); // Debug log

      if (response.data.token) {
        localStorage.setItem("adminToken", response.data.token);
        localStorage.setItem("adminName", response.data.username || "Admin");
        navigate("/admin/dashboard");
      } else {
        setError("Invalid response from server");
      }
    } catch (err) {
      console.error('Login error:', err.response?.data || err.message); // Debug log
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Replace your old return(...) block with this one:
  return (
    <div className="admin-login-wrapper">
      <div className="admin-login-box">
        <h1>Admin Login</h1>
        <p>Please enter your credentials to login</p>

        {error && <div className="admin-login-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;
