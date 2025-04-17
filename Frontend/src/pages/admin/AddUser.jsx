import React, { useState } from "react";
import AdminLayout from "./AdminLayout";
import { Link } from "react-router-dom";
import axios from "axios";
import "./AddUser.css"; // <-- Add CSS file

function AddUser() {
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    status: "Active"
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (userData.password !== userData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("http://localhost:8080/signup", {
        username: userData.username,
        email: userData.email,
        password: userData.password,
        phone: userData.phone,
        status: userData.status
      });

      if (response.data.message) {
        setSuccess("User created successfully");
        setUserData({
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
          phone: "",
          status: "Active"
        });
      }
    } catch (error) {
      setError(error.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="add-user-container">
        <div className="add-user-header">
          <h2>Add New User</h2>
          <Link to="/admin/dashboard" className="back-btn">
            Back to Dashboard
          </Link>
        </div>

        {error && <div className="error-msg">{error}</div>}
        {success && <div className="success-msg">{success}</div>}

        <form onSubmit={handleSubmit} className="add-user-form">
          <div className="form-grid">
            <div className="form-group">
              <label>Username</label>
              <input type="text" name="username" value={userData.username} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" name="email" value={userData.email} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" name="password" value={userData.password} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Confirm Password</label>
              <input type="password" name="confirmPassword" value={userData.confirmPassword} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input type="tel" name="phone" value={userData.phone} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Status</label>
              <select name="status" value={userData.status} onChange={handleChange}>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" disabled={loading}>
              {loading ? "Creating User..." : "Create User"}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}

export default AddUser;
