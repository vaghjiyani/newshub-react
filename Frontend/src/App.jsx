import React from "react";
import { v4 as uuidv4 } from "uuid";
import NavBar from "./components/NavBar/NavBar";
import News from "./components/News/News";
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from "react-router-dom";
import { router } from "./config/config";
import Search from "./components/Search/Search";
import Register from "./components/Register/Register";
import Login from "./components/Login/Login";
import AdminLogin from "./pages/admin/AdminLogin";
import Welcome from "./pages/admin/Welcome";
import Dashboard from "./pages/admin/Dashboard";
import AddUser from "./pages/admin/AddUser";
import EditProfile from "./pages/admin/EditProfile";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const adminToken = localStorage.getItem("adminToken");
  if (!adminToken) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
};

// NavBar Wrapper Component
const NavBarWrapper = ({ children }) => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  
  return (
    <>
      {!isAdminRoute && <NavBar />}
      {children}
    </>
  );
};

function App() {
  return (
    <Router>
      <NavBarWrapper>
        <Routes>
          {/* Public Routes */}
          {router.map((path) => (
            <Route
              exact
              key={uuidv4()}
              path={path.path}
              element={
                <News
                  key={path.key}
                  newscategory={path.category}
                  country={path.country}
                />
              }
            />
          ))}
          <Route path="/search/:query" element={<Search />} />
          <Route path="/user/register" element={<Register />} />
          <Route path="/user/login" element={<Login />} />
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          
          <Route
            path="/admin/welcome"
            element={
              <ProtectedRoute>
                <Welcome />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/admin/add-user"
            element={
              <ProtectedRoute>
                <AddUser />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/admin/edit-profile"
            element={
              <ProtectedRoute>
                <EditProfile />
              </ProtectedRoute>
            }
          />

          {/* Redirect to home for unknown routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </NavBarWrapper>
    </Router>
  );
}

export default App;
