// =============================================================================
// CONFIGURATION & UTILITIES
// =============================================================================
const API_BASE_URL = `http://localhost:${import.meta.env.VITE_API_PORT || 5000}/api`;

const auth = {
  getToken: () => localStorage.getItem("token"),
  isAuthenticated: () => !!localStorage.getItem("token"),
  storeToken: (token) => token && localStorage.setItem("token", token),
  removeToken: () => localStorage.removeItem("token"),
  headers: (requireAuth = false) => ({
    "Content-Type": "application/json",
    ...(requireAuth && { Authorization: `Bearer ${auth.getToken() || (() => { throw new Error("Authentication required"); })()}` })
  })
};

// =============================================================================
// BASE API CLIENT
// =============================================================================
const api = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error);
    throw error;
  }
};

// HTTP method helpers
const http = {
  get: (endpoint, requireAuth = false) => 
    api(endpoint, { headers: auth.headers(requireAuth) }),
  
  post: (endpoint, data, requireAuth = false) => 
    api(endpoint, { method: "POST", headers: auth.headers(requireAuth), body: JSON.stringify(data) }),
  
  put: (endpoint, data, requireAuth = false) => 
    api(endpoint, { method: "PUT", headers: auth.headers(requireAuth), body: JSON.stringify(data) }),
  
  patch: (endpoint, data = null, requireAuth = false) => 
    api(endpoint, { method: "PATCH", headers: auth.headers(requireAuth), ...(data && { body: JSON.stringify(data) }) }),
  
  delete: (endpoint, requireAuth = false) => 
    api(endpoint, { method: "DELETE", headers: auth.headers(requireAuth) })
};

// Validation helper
const required = (value, message) => {
  if (!value) throw new Error(message);
  return value;
};

// =============================================================================
// API MODULES
// =============================================================================
export const productsAPI = {
  getAllProducts: () => http.get("/products"),
  getProduct: (id) => http.get(`/products/${required(id, "Product ID required")}`),
  createProduct: (data) => http.post("/products", required(data, "Product data required"), true),
  getUserProducts: () => http.get("/user/products", true),
  updateProduct: (id, data) => http.put(`/products/${required(id, "Product ID required")}`, required(data, "Product data required"), true),
  deleteProduct: (id) => {
    console.log("Deleting product with ID:", id);
    return http.delete(`/products/${required(id, "Product ID required")}`, true);
  },
  searchProducts: (searchTerm, filters = {}) => 
    http.get(`/products/search?${new URLSearchParams({ ...(searchTerm && { search: searchTerm }), ...filters })}`),
};

export const authAPI = {
  register: async (userData) => {
    const response = await http.post("/register", required(userData, "User data required"));
    auth.storeToken(response.token);
    return response;
  },

  login: async (credentials) => {
    const response = await http.post("/login", required(credentials, "Credentials required"));
    auth.storeToken(response.token);
    return response;
  },

  logout: auth.removeToken,

  getCurrentUser: async () => {
    if (!auth.getToken()) return null;
    try {
      return await http.get("/me", true);
    } catch (error) {
      if (error.message.includes("401")) auth.removeToken();
      throw error;
    }
  },

  updateUser: (userId, userData) => 
    http.put(`/update/${required(userId, "User ID required")}`, required(userData, "User data required"), true),

  deleteUser: (userId) => 
    http.delete(`/user/${required(userId, "User ID required")}`, true),
};

export const favoritesAPI = {
  getUserFavorites: () => http.get("/user/favorites", true),
  addToFavorites: (id) => {
    required(id, "Product ID required");
    console.log("Adding to favorites with ID:", id);
    return http.post(`/user/favorites/${id}`, null, true);
  },
  removeFromFavorites: (id) => {
    required(id, "Product ID required");
    console.log("Removing from favorites with ID:", id);
    return http.delete(`/user/favorites/${id}`, true);
  },
  
  isFavorited: async (productId) => {
    if (!required(productId, "Product ID required") || !auth.getToken()) return false;
    try {
      const favorites = await favoritesAPI.getUserFavorites();
      return favorites.some(fav => fav._id === productId || fav.product?._id === productId);
    } catch (error) {
      console.error("Error checking favorite status:", error);
      return false;
    }
  },
};

export const messagesAPI = {
  sendMessage: async (messageData) => {
    console.log("API: Sending message with data:", messageData);
    const response = await http.post("/messages", messageData, true);
    console.log("API: Message sent successfully:", response);
    return response;
  },

  getMessagesForUser: () => http.get("/messages/user", true),
  getMessagesForProduct: (id) => http.get(`/messages/product/${required(id, "Product ID required")}`, true),
  markAsRead: (id) => http.patch(`/messages/${required(id, "Message ID required")}/read`, null, true),
};

export const adminAPI = {
  getStats: () => http.get("/admin/stats", true),
  getRecentActivity: () => http.get("/admin/activity", true),
  getAllUsers: () => http.get("/admin/users", true),
  getAllProducts: () => http.get("/admin/products", true),
  deleteUser: (id) => http.delete(`/admin/users/${required(id, "User ID required")}`, true),
  toggleUserAdmin: (id) => http.patch(`/admin/users/${required(id, "User ID required")}/toggle-admin`, null, true),
  deleteProduct: (id) => http.delete(`/admin/products/${required(id, "Product ID required")}`, true),
  toggleProductActive: (id) => http.patch(`/admin/products/${required(id, "Product ID required")}/toggle-active`, null, true),
};

// =============================================================================
// EXPORTS
// =============================================================================
export const isAuthenticated = auth.isAuthenticated;
export const getAuthToken = auth.getToken;

export default { productsAPI, authAPI, favoritesAPI, messagesAPI, adminAPI };