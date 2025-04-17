import React, { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import axios from "axios";
import { Link } from "react-router-dom";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import "./EditProfile.css";

function EditProfile() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    status: "Active"
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get('http://localhost:8080/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setUsers(response.data);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to fetch users');
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      phone: user.phone,
      status: user.status || "Active"
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.put(`http://localhost:8080/admin/users/${selectedUser._id}`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setSuccess("User updated successfully!");
      setSelectedUser(null);
      setFormData({
        username: "",
        email: "",
        phone: "",
        status: "Active"
      });
      fetchUsers(); // Refresh the user list
    } catch (err) {
      console.error('Error updating user:', err);
      setError(err.response?.data?.message || "Failed to update user");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const token = localStorage.getItem('adminToken');
        await axios.delete(`http://localhost:8080/admin/users/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setUsers(users.filter(user => user._id !== userId));
        setSuccess("User deleted successfully!");
      } catch (err) {
        console.error('Error deleting user:', err);
        setError(err.response?.data?.message || "Failed to delete user");
      }
    }
  };

  return (
    <AdminLayout title="User Management">
      <div className="edit-profile-container">
        {/* Users Table */}
        <div className="table-container">
          <table className="user-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user._id}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>{user.status || "Active"}</td>
                  <td className="action-icons">
                    <button
                      onClick={() => handleEdit(user)}
                      className="edit-btn"
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="delete-btn"
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Edit User Form */}
        {selectedUser && (
          <div className="profile-form-box">
            <h2>EDIT USER PROFILE</h2>
            
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="form-actions">
                <button type="submit" disabled={loading}>
                  {loading ? "Updating..." : "Update User"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedUser(null);
                    setFormData({
                      username: "",
                      email: "",
                      phone: "",
                      status: "Active"
                    });
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default EditProfile;
