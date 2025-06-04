import React, { useState, useEffect } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../App.css";


import { adminAPI } from "../api/api"; 

const AdminDashboard = () => {
  // State management - keeping track of what data we have
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [recentActivity, setRecentActivity] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // =============================================================================
  // DATA FETCHING FUNCTIONS
  // =============================================================================

  // Get dashboard statistics
  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await adminAPI.getStats();
      setStats(data);
    } catch (err) {
      setError("Failed to fetch stats: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Get all users for the users tab
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await adminAPI.getAllUsers();
      setUsers(data);
    } catch (err) {
      setError("Failed to fetch users: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Get all products for the products tab
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await adminAPI.getAllProducts();
      setProducts(data);
    } catch (err) {
      setError("Failed to fetch products: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Get recent activity for the overview tab
  const fetchRecentActivity = async () => {
    try {
      setLoading(true);
      const data = await adminAPI.getRecentActivity();
      setRecentActivity(data);
    } catch (err) {
      setError("Failed to fetch recent activity: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // =============================================================================
  // USER MANAGEMENT FUNCTIONS
  // =============================================================================

  // Delete a user account
  const handleDeleteUser = async (userId) => {
    // Ask for confirmation before deleting
    if (!window.confirm(
      "Are you sure you want to delete this user? This will also delete all their products."
    )) {
      return; // User clicked "Cancel", so don't delete
    }

    try {
      setLoading(true);
      await adminAPI.deleteUser(userId);
      
      // Update the users list by removing the deleted user
      setUsers(users.filter((user) => user._id !== userId));
      
      // Refresh stats since user count changed
      await fetchStats();
      
      setError(""); // Clear any previous errors
    } catch (err) {
      setError("Failed to delete user: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Toggle user's admin status (make admin or remove admin)
  const handleToggleUserAdmin = async (userId) => {
    try {
      setLoading(true);
      const data = await adminAPI.toggleUserAdmin(userId);
      
      // Update the specific user in our users list
      setUsers(users.map((user) =>
        user._id === userId 
          ? { ...user, isAdmin: data.user.isAdmin } 
          : user
      ));
      
      setError(""); // Clear any previous errors
    } catch (err) {
      setError("Failed to toggle admin status: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // =============================================================================
  // PRODUCT MANAGEMENT FUNCTIONS
  // =============================================================================

  // Delete a product
  const handleDeleteProduct = async (productId) => {
    // Ask for confirmation before deleting
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return; // User clicked "Cancel", so don't delete
    }

    try {
      setLoading(true);
      await adminAPI.deleteProduct(productId);
      
      // Update the products list by removing the deleted product
      setProducts(products.filter((product) => product._id !== productId));
      
      // Refresh stats since product count changed
      await fetchStats();
      
      setError(""); // Clear any previous errors
    } catch (err) {
      setError("Failed to delete product: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Toggle product's active status (activate or deactivate)
  const handleToggleProductActive = async (productId) => {
    try {
      setLoading(true);
      const data = await adminAPI.toggleProductActive(productId);
      
      // Update the specific product in our products list
      setProducts(products.map((product) =>
        product._id === productId
          ? { ...product, isActive: data.product.isActive }
          : product
      ));
      
      setError(""); // Clear any previous errors
    } catch (err) {
      setError("Failed to toggle product status: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // =============================================================================
  // REACT EFFECTS (When component loads or changes)
  // =============================================================================

  // When component first loads, get stats and recent activity
  useEffect(() => {
    fetchStats();
    fetchRecentActivity();
  }, []); // Empty array means "run once when component mounts"

  // When user changes tabs, load appropriate data
  useEffect(() => {
    if (activeTab === "users") {
      fetchUsers();
    } else if (activeTab === "products") {
      fetchProducts();
    }
  }, [activeTab]); // Run when activeTab changes

  // =============================================================================
  // UI HELPER COMPONENTS
  // =============================================================================

  // Reusable component for displaying statistics cards
  const StatCard = ({ title, value, icon, color = "primary" }) => (
    <div className={`card border-start border-5 border-${color} shadow-sm`}>
      <div className="card-body">
        <div className="d-flex align-items-center justify-content-between">
          <div>
            <h6 className="text-muted mb-1">{title}</h6>
            <h2 className="mb-0 fw-bold">{value || 0}</h2>
          </div>
          <i className={`${icon} text-${color}`} style={{ fontSize: "3rem" }}></i>
        </div>
      </div>
    </div>
  );

  // Loading spinner component
  const LoadingSpinner = () => (
    <div className="d-flex justify-content-center align-items-center p-4">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );

  // =============================================================================
  // MAIN COMPONENT RENDER
  // =============================================================================

  return (
    <div className="container-fluid bg-light min-vh-100 py-4">
      <div className="container">
        {/* Header Section */}
        <div className="row mb-4">
          <div className="col">
            <h1 className="display-5 fw-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted lead">
              Manage users, products, and monitor system activity
            </p>
          </div>
        </div>

        {/* Error Alert - Shows when something goes wrong */}
        {error && (
          <div className="alert alert-danger alert-dismissible fade show mb-4" role="alert">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {error}
            <button
              type="button"
              className="btn-close"
              onClick={() => setError("")}
              aria-label="Close"
            ></button>
          </div>
        )}

        {/* Loading Indicator */}
        {loading && <LoadingSpinner />}

        {/* Navigation Tabs */}
        <ul className="nav nav-pills mb-4" role="tablist">
          <li className="nav-item me-2" role="presentation">
            <button
              className={`nav-link ${activeTab === "overview" ? "active" : ""}`}
              onClick={() => setActiveTab("overview")}
              disabled={loading}
            >
              <i className="bi bi-graph-up me-1"></i>
              Overview
            </button>
          </li>
          <li className="nav-item me-2" role="presentation">
            <button
              className={`nav-link ${activeTab === "users" ? "active" : ""}`}
              onClick={() => setActiveTab("users")}
              disabled={loading}
            >
              <i className="bi bi-people me-1"></i>
              Users
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button
              className={`nav-link ${activeTab === "products" ? "active" : ""}`}
              onClick={() => setActiveTab("products")}
              disabled={loading}
            >
              <i className="bi bi-box me-1"></i>
              Products
            </button>
          </li>
        </ul>

        {/* Tab Content - Shows different content based on selected tab */}
        <div className="tab-content">
          
          {/* OVERVIEW TAB - Shows statistics and recent activity */}
          {activeTab === "overview" && (
            <div className="tab-pane fade show active">
              {/* Statistics Cards Grid */}
              <div className="row g-4 mb-5">
                <div className="col-12 col-sm-6 col-lg-3">
                  <StatCard
                    title="Total Users"
                    value={stats.totalUsers}
                    icon="bi bi-people-fill"
                    color="primary"
                  />
                </div>
                <div className="col-12 col-sm-6 col-lg-3">
                  <StatCard
                    title="Total Products"
                    value={stats.totalProducts}
                    icon="bi bi-box-fill"
                    color="success"
                  />
                </div>
                <div className="col-12 col-sm-6 col-lg-3">
                  <StatCard
                    title="Active Products"
                    value={stats.activeProducts}
                    icon="bi bi-graph-up"
                    color="info"
                  />
                </div>
                <div className="col-12 col-sm-6 col-lg-3">
                  <StatCard
                    title="Admin Users"
                    value={stats.adminUsers}
                    icon="bi bi-shield-fill"
                    color="warning"
                  />
                </div>
              </div>

              {/* Recent Activity Section */}
              <div className="row g-4">
                {/* Recent Users Card */}
                <div className="col-lg-6">
                  <div className="card shadow-sm">
                    <div className="card-header bg-white">
                      <h5 className="card-title mb-0">Recent Users</h5>
                    </div>
                    <div className="card-body">
                      {recentActivity.recentUsers?.slice(0, 5).map((user) => (
                        <div
                          key={user._id}
                          className="d-flex align-items-center justify-content-between py-2 border-bottom"
                        >
                          <div>
                            <h6 className="mb-1">
                              {user.firstName} {user.lastName}
                            </h6>
                            <small className="text-muted">{user.email}</small>
                          </div>
                          <small className="text-muted">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </small>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Recent Products Card */}
                <div className="col-lg-6">
                  <div className="card shadow-sm">
                    <div className="card-header bg-white">
                      <h5 className="card-title mb-0">Recent Products</h5>
                    </div>
                    <div className="card-body">
                      {recentActivity.recentProducts?.slice(0, 5).map((product) => (
                        <div
                          key={product._id}
                          className="d-flex align-items-center justify-content-between py-2 border-bottom"
                        >
                          <div>
                            <h6 className="mb-1">{product.name}</h6>
                            <small className="text-muted">
                              by {product.user?.firstName} {product.user?.lastName}
                            </small>
                          </div>
                          <small className="text-muted">
                            {new Date(product.createdAt).toLocaleDateString()}
                          </small>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* USERS TAB - Shows user management table */}
          {activeTab === "users" && (
            <div className="tab-pane fade show active">
              <div className="card shadow-sm">
                <div className="card-header bg-white">
                  <h5 className="card-title mb-1">User Management</h5>
                  <p className="text-muted mb-0">Manage user accounts and permissions</p>
                </div>
                <div className="card-body p-0">
                  <div className="table-responsive">
                    <table className="table table-hover mb-0">
                      <thead className="table-light">
                        <tr>
                          <th className="border-0">User</th>
                          <th className="border-0">Email</th>
                          <th className="border-0">Role</th>
                          <th className="border-0">Joined</th>
                          <th className="border-0">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((user) => (
                          <tr key={user._id}>
                            <td>
                              <div className="d-flex align-items-center">
                                <div
                                  className="bg-primary rounded-circle d-flex align-items-center justify-content-center text-white fw-bold me-3"
                                  style={{ width: "40px", height: "40px" }}
                                >
                                  {user.firstName?.charAt(0)}
                                  {user.lastName?.charAt(0)}
                                </div>
                                <div>
                                  <h6 className="mb-0">
                                    {user.firstName} {user.lastName}
                                  </h6>
                                </div>
                              </div>
                            </td>
                            <td className="text-muted">{user.email}</td>
                            <td>
                              <span
                                className={`badge ${
                                  user.isAdmin ? "bg-warning" : "bg-secondary"
                                }`}
                              >
                                {user.isAdmin ? "Admin" : "User"}
                              </span>
                            </td>
                            <td className="text-muted">
                              {new Date(user.createdAt).toLocaleDateString()}
                            </td>
                            <td>
                              <div className="btn-group" role="group">
                                <button
                                  type="button"
                                  className="btn btn-outline-primary btn-sm"
                                  onClick={() => handleToggleUserAdmin(user._id)}
                                  title={user.isAdmin ? "Remove Admin" : "Make Admin"}
                                  disabled={loading}
                                >
                                  <i className="bi bi-shield"></i>
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-outline-danger btn-sm"
                                  onClick={() => handleDeleteUser(user._id)}
                                  title="Delete User"
                                  disabled={loading}
                                >
                                  <i className="bi bi-trash"></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PRODUCTS TAB - Shows product management table */}
          {activeTab === "products" && (
            <div className="tab-pane fade show active">
              <div className="card shadow-sm">
                <div className="card-header bg-white">
                  <h5 className="card-title mb-1">Product Management</h5>
                  <p className="text-muted mb-0">Manage products and their status</p>
                </div>
                <div className="card-body p-0">
                  <div className="table-responsive">
                    <table className="table table-hover mb-0">
                      <thead className="table-light">
                        <tr>
                          <th className="border-0">Product</th>
                          <th className="border-0">Owner</th>
                          <th className="border-0">Price</th>
                          <th className="border-0">Status</th>
                          <th className="border-0">Created</th>
                          <th className="border-0">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map((product) => (
                          <tr key={product._id}>
                            <td>
                              <div className="d-flex align-items-center">
                                <div
                                  className="bg-light rounded d-flex align-items-center justify-content-center me-3"
                                  style={{ width: "48px", height: "48px" }}
                                >
                                  <i
                                    className="bi bi-box text-muted"
                                    style={{ fontSize: "1.5rem" }}
                                  ></i>
                                </div>
                                <div>
                                  <h6 className="mb-0">{product.name}</h6>
                                  <small className="text-muted">{product.category}</small>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div>
                                <h6 className="mb-0">
                                  {product.user?.firstName} {product.user?.lastName}
                                </h6>
                                <small className="text-muted">{product.user?.email}</small>
                              </div>
                            </td>
                            <td className="fw-bold">${product.price}</td>
                            <td>
                              <span
                                className={`badge ${
                                  product.isActive ? "bg-success" : "bg-danger"
                                }`}
                              >
                                {product.isActive ? "Active" : "Inactive"}
                              </span>
                            </td>
                            <td className="text-muted">
                              {new Date(product.createdAt).toLocaleDateString()}
                            </td>
                            <td>
                              <div className="btn-group" role="group">
                                <button
                                  type="button"
                                  className="btn btn-outline-primary btn-sm"
                                  onClick={() => handleToggleProductActive(product._id)}
                                  title={product.isActive ? "Deactivate" : "Activate"}
                                  disabled={loading}
                                >
                                  <i
                                    className={`bi ${
                                      product.isActive ? "bi-toggle-on" : "bi-toggle-off"
                                    }`}
                                  ></i>
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-outline-danger btn-sm"
                                  onClick={() => handleDeleteProduct(product._id)}
                                  title="Delete Product"
                                  disabled={loading}
                                >
                                  <i className="bi bi-trash"></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;