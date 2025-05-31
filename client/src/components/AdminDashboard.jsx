import React, { useState, useEffect } from 'react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [recentActivity, setRecentActivity] = useState({});
  // const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // API Base URL
  const API_BASE_URL = 'http://localhost:5000';

  // Admin API functions
  const adminAPI = {
    getStats: async () => {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication required");

      const response = await fetch(`${API_BASE_URL}/admin/stats`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    },

    getRecentActivity: async () => {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication required");

      const response = await fetch(`${API_BASE_URL}/admin/activity`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    },

    getAllUsers: async () => {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication required");

      const response = await fetch(`${API_BASE_URL}/admin/users`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    },

    getAllProducts: async () => {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication required");

      const response = await fetch(`${API_BASE_URL}/admin/products`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    },

    deleteUser: async (userId) => {
      if (!userId) throw new Error("User ID required");

      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication required");

      const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      return await response.json();
    },

    toggleUserAdmin: async (userId) => {
      if (!userId) throw new Error("User ID required");

      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication required");

      const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/toggle-admin`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      return await response.json();
    },

    deleteProduct: async (productId) => {
      if (!productId) throw new Error("Product ID required");

      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication required");

      const response = await fetch(`${API_BASE_URL}/admin/products/${productId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      return await response.json();
    },

    toggleProductActive: async (productId) => {
      if (!productId) throw new Error("Product ID required");

      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication required");

      const response = await fetch(`${API_BASE_URL}/admin/products/${productId}/toggle-active`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      return await response.json();
    },
  };

  const fetchStats = async () => {
    try {
      const data = await adminAPI.getStats();
      setStats(data);
    } catch (err) {
      setError('Failed to fetch stats');
    }
  };

  const fetchUsers = async () => {
    try {
      const data = await adminAPI.getAllUsers();
      setUsers(data);
    } catch (err) {
      setError('Failed to fetch users');
    }
  };

  const fetchProducts = async () => {
    try {
      const data = await adminAPI.getAllProducts();
      setProducts(data);
    } catch (err) {
      setError('Failed to fetch products');
    }
  };

  const fetchRecentActivity = async () => {
    try {
      const data = await adminAPI.getRecentActivity();
      setRecentActivity(data);
    } catch (err) {
      setError('Failed to fetch recent activity');
    }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This will also delete all their products.')) {
      return;
    }
    
    try {
      await adminAPI.deleteUser(userId);
      setUsers(users.filter(user => user._id !== userId));
      fetchStats(); // Refresh stats
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleUserAdmin = async (userId) => {
    try {
      const data = await adminAPI.toggleUserAdmin(userId);
      setUsers(users.map(user => 
        user._id === userId ? { ...user, isAdmin: data.user.isAdmin } : user
      ));
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }
    
    try {
      await adminAPI.deleteProduct(productId);
      setProducts(products.filter(product => product._id !== productId));
      fetchStats(); // Refresh stats
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleProductActive = async (productId) => {
    try {
      const data = await adminAPI.toggleProductActive(productId);
      setProducts(products.map(product => 
        product._id === productId ? { ...product, isActive: data.product.isActive } : product
      ));
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchRecentActivity();
  }, []);

  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    } else if (activeTab === 'products') {
      fetchProducts();
    }
  }, [activeTab]);

  const StatCard = ({ title, value, icon, color = 'primary' }) => (
    <div className={`card border-start border-5 border-${color} shadow-sm`}>
      <div className="card-body">
        <div className="d-flex align-items-center justify-content-between">
          <div>
            <h6 className="text-muted mb-1">{title}</h6>
            <h2 className="mb-0 fw-bold">{value || 0}</h2>
          </div>
          <i className={`${icon} text-${color}`} style={{fontSize: '3rem'}}></i>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container-fluid bg-light min-vh-100 py-4">
      <div className="container">
        {/* Header */}
        <div className="row mb-4">
          <div className="col">
            <h1 className="display-5 fw-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted lead">Manage users, products, and monitor system activity</p>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="alert alert-danger alert-dismissible fade show mb-4" role="alert">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {error}
            <button 
              type="button" 
              className="btn-close" 
              onClick={() => setError('')}
              aria-label="Close"
            ></button>
          </div>
        )}

        {/* Navigation Tabs */}
        <ul className="nav nav-pills mb-4" role="tablist">
          <li className="nav-item me-2" role="presentation">
            <button
              className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <i className="bi bi-graph-up me-1"></i>
              Overview
            </button>
          </li>
          <li className="nav-item me-2" role="presentation">
            <button
              className={`nav-link ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              <i className="bi bi-people me-1"></i>
              Users
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button
              className={`nav-link ${activeTab === 'products' ? 'active' : ''}`}
              onClick={() => setActiveTab('products')}
            >
              <i className="bi bi-box me-1"></i>
              Products
            </button>
          </li>
        </ul>

        {/* Tab Content */}
        <div className="tab-content">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="tab-pane fade show active">
              {/* Stats Grid */}
              <div className="row g-4 mb-5">
                <div className="col-12 col-sm-6 col-lg-3">
                  <StatCard title="Total Users" value={stats.totalUsers} icon="bi bi-people-fill" color="primary" />
                </div>
                <div className="col-12 col-sm-6 col-lg-3">
                  <StatCard title="Total Products" value={stats.totalProducts} icon="bi bi-box-fill" color="success" />
                </div>
                <div className="col-12 col-sm-6 col-lg-3">
                  <StatCard title="Active Products" value={stats.activeProducts} icon="bi bi-graph-up" color="info" />
                </div>
                <div className="col-12 col-sm-6 col-lg-3">
                  <StatCard title="Admin Users" value={stats.adminUsers} icon="bi bi-shield-fill" color="warning" />
                </div>
              </div>

              {/* Recent Activity */}
              <div className="row g-4">
                <div className="col-lg-6">
                  <div className="card shadow-sm">
                    <div className="card-header bg-white">
                      <h5 className="card-title mb-0">Recent Users</h5>
                    </div>
                    <div className="card-body">
                      {recentActivity.recentUsers?.slice(0, 5).map((user) => (
                        <div key={user._id} className="d-flex align-items-center justify-content-between py-2 border-bottom">
                          <div>
                            <h6 className="mb-1">{user.firstName} {user.lastName}</h6>
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

                <div className="col-lg-6">
                  <div className="card shadow-sm">
                    <div className="card-header bg-white">
                      <h5 className="card-title mb-0">Recent Products</h5>
                    </div>
                    <div className="card-body">
                      {recentActivity.recentProducts?.slice(0, 5).map((product) => (
                        <div key={product._id} className="d-flex align-items-center justify-content-between py-2 border-bottom">
                          <div>
                            <h6 className="mb-1">{product.name}</h6>
                            <small className="text-muted">by {product.user?.firstName} {product.user?.lastName}</small>
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

          {/* Users Tab */}
          {activeTab === 'users' && (
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
                                <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center text-white fw-bold me-3" style={{width: '40px', height: '40px'}}>
                                  {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                                </div>
                                <div>
                                  <h6 className="mb-0">{user.firstName} {user.lastName}</h6>
                                </div>
                              </div>
                            </td>
                            <td className="text-muted">{user.email}</td>
                            <td>
                              <span className={`badge ${user.isAdmin ? 'bg-warning' : 'bg-secondary'}`}>
                                {user.isAdmin ? 'Admin' : 'User'}
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
                                  onClick={() => toggleUserAdmin(user._id)}
                                  title={user.isAdmin ? 'Remove Admin' : 'Make Admin'}
                                >
                                  <i className="bi bi-shield"></i>
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-outline-danger btn-sm"
                                  onClick={() => deleteUser(user._id)}
                                  title="Delete User"
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

          {/* Products Tab */}
          {activeTab === 'products' && (
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
                                <div className="bg-light rounded d-flex align-items-center justify-content-center me-3" style={{width: '48px', height: '48px'}}>
                                  <i className="bi bi-box text-muted" style={{fontSize: '1.5rem'}}></i>
                                </div>
                                <div>
                                  <h6 className="mb-0">{product.name}</h6>
                                  <small className="text-muted">{product.category}</small>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div>
                                <h6 className="mb-0">{product.user?.firstName} {product.user?.lastName}</h6>
                                <small className="text-muted">{product.user?.email}</small>
                              </div>
                            </td>
                            <td className="fw-bold">${product.price}</td>
                            <td>
                              <span className={`badge ${product.isActive ? 'bg-success' : 'bg-danger'}`}>
                                {product.isActive ? 'Active' : 'Inactive'}
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
                                  onClick={() => toggleProductActive(product._id)}
                                  title={product.isActive ? 'Deactivate' : 'Activate'}
                                >
                                  <i className={`bi ${product.isActive ? 'bi-toggle-on' : 'bi-toggle-off'}`}></i>
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-outline-danger btn-sm"
                                  onClick={() => deleteProduct(product._id)}
                                  title="Delete Product"
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