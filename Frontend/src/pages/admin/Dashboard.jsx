import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import "./Dashboard.css";
import axios from "axios";
import { Link } from 'react-router-dom';
import { FiSearch, FiEdit2, FiTrash2, FiPlus, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import AdminLayout from './AdminLayout';

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('username');
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });
  const usersPerPage = 5;

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
      setLoading(false);
    } catch (err) {
      console.error('Error fetching users:', err.response?.data || err.message);
      if (err.response?.status === 401) {
        localStorage.removeItem('adminToken');
        window.location.href = '/admin/login';
      } else {
        setError(err.response?.data?.message || 'Failed to fetch users');
      }
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const token = localStorage.getItem('adminToken');
        const response = await axios.delete(`http://localhost:8080/admin/users/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.data.message === 'User deleted successfully') {
          setUsers(users.filter(user => user._id !== userId));
        } else {
          throw new Error(response.data.message || 'Failed to delete user');
        }
      } catch (err) {
        console.error('Error deleting user:', err.response?.data || err.message);
        setError(err.response?.data?.message || 'Failed to delete user');
      }
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
        const token = localStorage.getItem('adminToken');
        const response = await fetch('http://localhost:8080/admin/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                username: newUser.username,
                email: newUser.email,
                password: newUser.password,
                phone: newUser.phone
            })
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Failed to add user');
        }

        setUsers([...users, data]);
        setShowAddForm(false);
        setNewUser({
            username: '',
            email: '',
            password: '',
            phone: ''
        });
    } catch (err) {
        setError(err.message);
    } finally {
        setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSort = (field) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = sortedUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(sortedUsers.length / usersPerPage);

  if (loading) {
    return (
      <AdminLayout title="Dashboard">
        <div className="loading">Loading users...</div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout title="Dashboard">
        <div className="error-message">{error}</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Dashboard">
      <div className="main-content">
        {/* Stats Cards */}
        <div className="table-container" style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
            <div style={{ flex: 1, padding: '20px', background: 'white', borderRadius: '6px', border: '1px solid #ddd' }}>
              <h3 style={{ marginBottom: '10px', color: '#333' }}>Total Users</h3>
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#2266cc' }}>{users.length}</p>
            </div>
            <div style={{ flex: 1, padding: '20px', background: 'white', borderRadius: '6px', border: '1px solid #ddd' }}>
              <h3 style={{ marginBottom: '10px', color: '#333' }}>Active Users</h3>
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#28a745' }}>{users.length}</p>
            </div>
            <div style={{ flex: 1, padding: '20px', background: 'white', borderRadius: '6px', border: '1px solid #ddd' }}>
              <h3 style={{ marginBottom: '10px', color: '#333' }}>Inactive Users</h3>
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#dc3545' }}>0</p>
            </div>
          </div>
        </div>

        {/* Search and Add User */}
        <div className="table-container" style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div style={{ position: 'relative', width: '300px' }}>
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 10px 10px 35px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              />
              <FiSearch style={{ position: 'absolute', left: '10px', top: '12px', color: '#666' }} />
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="add-user-btn"
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <FiPlus /> Add User
            </button>
          </div>
        </div>

        {/* Add User Form */}
        {showAddForm && (
          <div className="table-container" style={{ marginBottom: '20px' }}>
            <div className="add-user-form">
              <h3>Add New User</h3>
              <form onSubmit={handleAddUser}>
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={newUser.username}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={newUser.email}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="text"
                  name="phone"
                  placeholder="Phone Number"
                  value={newUser.phone}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={newUser.password}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={newUser.confirmPassword}
                  onChange={handleInputChange}
                  required
                />
                <div className="form-buttons">
                  <button type="submit">Add</button>
                  <button type="button" onClick={() => setShowAddForm(false)}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Users Table */}
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th onClick={() => handleSort('_id')} style={{ cursor: 'pointer' }}>
                  ID {sortField === '_id' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('username')} style={{ cursor: 'pointer' }}>
                  User Name {sortField === 'username' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('email')} style={{ cursor: 'pointer' }}>
                  Email {sortField === 'email' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th>Phone</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user) => (
                <tr key={user._id}>
                  <td>{user._id}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td className="action-icons">
                    <Link
                      to={`/admin/edit-user/${user._id}`}
                      className="edit-btn"
                    >
                      <FiEdit2 />
                    </Link>
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

        {/* Pagination */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginTop: '20px' }}>
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            style={{
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              background: 'white',
              cursor: 'pointer',
              opacity: currentPage === 1 ? 0.5 : 1
            }}
          >
            <FiChevronLeft />
          </button>
          <span style={{ color: '#666' }}>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            style={{
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              background: 'white',
              cursor: 'pointer',
              opacity: currentPage === totalPages ? 0.5 : 1
            }}
          >
            <FiChevronRight />
          </button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
