// =============================================================================
// API CONFIGURATION
// =============================================================================
const API_BASE_URL = `http://localhost:${import.meta.env.VITE_API_PORT || 5000}/api`;

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

// Get the authentication token from localStorage
const getAuthToken = () => localStorage.getItem("token");

// Check if user is currently authenticated
const isAuthenticated = () => !!getAuthToken();

// Store authentication token in localStorage
const storeAuthToken = (token) => {
  if (token) localStorage.setItem("token", token);
};

// Remove authentication token from localStorage
const removeAuthToken = () => localStorage.removeItem("token");

// Create headers for API requests
const createHeaders = (requireAuth = false) => {
  const headers = { "Content-Type": "application/json" };
  
  if (requireAuth) {
    const token = getAuthToken();
    if (!token) throw new Error("Authentication required");
    headers.Authorization = `Bearer ${token}`;
  }
  
  return headers;
};

// Generic API request handler with error handling
const apiRequest = async (endpoint, options = {}) => {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });

    if (!response.ok) {
      let errorMessage;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || `HTTP error! status: ${response.status}`;
      } catch {
        errorMessage = `HTTP error! status: ${response.status}`;
      }
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error);
    throw error;
  }
};

// =============================================================================
// PRODUCTS API
// =============================================================================
export const productsAPI = {
  // Get all products (public endpoint)
  getAllProducts: async () => {
    return apiRequest("/products");
  },

  // Get a single product by ID (public endpoint)
  getProduct: async (id) => {
    if (!id) throw new Error("Product ID required");
    return apiRequest(`/products/${id}`);
  },

  // Create a new product (requires authentication)
  createProduct: async (productData) => {
    if (!productData) throw new Error("Product data required");
    
    return apiRequest("/products", {
      method: "POST",
      headers: createHeaders(true),
      body: JSON.stringify(productData),
    });
  },

  // Get current user's products (requires authentication)
  getUserProducts: async () => {
    return apiRequest("/user/products", {
      method: "GET",
      headers: createHeaders(true),
    });
  },

  // Update a product (requires authentication)
  updateProduct: async (id, productData) => {
    if (!id) throw new Error("Product ID required");
    if (!productData) throw new Error("Product data required");

    return apiRequest(`/products/${id}`, {
      method: "PUT",
      headers: createHeaders(true),
      body: JSON.stringify(productData),
    });
  },

  // Delete a product (requires authentication)
  deleteProduct: async (id) => {
    if (!id) throw new Error("Product ID required");

    console.log("Deleting product with ID:", id);
    
    return apiRequest(`/products/${id}`, {
      method: "DELETE",
      headers: createHeaders(true),
    });
  },

  // Search products with optional filters (public endpoint)
  searchProducts: async (searchTerm, filters = {}) => {
    const queryParams = new URLSearchParams({
      ...(searchTerm && { search: searchTerm }),
      ...filters,
    });

    return apiRequest(`/products/search?${queryParams}`);
  },
};

// =============================================================================
// AUTHENTICATION API
// =============================================================================
export const authAPI = {
  // Register a new user
  register: async (userData) => {
    if (!userData) throw new Error("User data required");

    const response = await apiRequest("/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });

    storeAuthToken(response.token);
    return response;
  },

	// Login user
	login: async (credentials) => {
		if (!credentials) throw new Error("Credentials required")

    const response = await apiRequest("/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });

    storeAuthToken(response.token);
    return response;
  },

  // Logout user (client-side only)
  logout: () => {
    removeAuthToken();
  },

  // Get current user information
  getCurrentUser: async () => {
    const token = getAuthToken();
    if (!token) return null;

    try {
      return await apiRequest("/me", {
        headers: createHeaders(true),
      });
    } catch (error) {
      // If token is invalid, remove it
      if (error.message.includes("401")) {
        removeAuthToken();
      }
      throw error;
    }
  },

	// Update user profile
	updateUser: async (userId, userData) => {
		if (!userId || !userData) throw new Error("User ID and data required")

    return apiRequest(`/update/${userId}`, {
      method: "PUT",
      headers: createHeaders(true),
      body: JSON.stringify(userData),
    });
  },

	// Delete user account
	deleteUser: async (userId) => {
		if (!userId) throw new Error("User ID required")

    return apiRequest(`/user/${userId}`, {
      method: "DELETE",
      headers: createHeaders(true),
    });
  },
};

// =============================================================================
// FAVORITES API
// =============================================================================
export const favoritesAPI = {
  // Get user's favorite products
  getUserFavorites: async () => {
    return apiRequest("/user/favorites", {
      headers: createHeaders(true),
    });
  },

  // Add product to favorites
  addToFavorites: async (productId) => {
    if (!productId) throw new Error("Product ID required");

    return apiRequest(`/user/favorites/${productId}`, {
      method: "POST",
      headers: createHeaders(true),
    });
  },

  // Remove product from favorites
  removeFromFavorites: async (productId) => {
    if (!productId) throw new Error("Product ID required");

    return apiRequest(`/user/favorites/${productId}`, {
      method: "DELETE",
      headers: createHeaders(true),
    });
  },

  // Check if a product is in user's favorites
  isFavorited: async (productId) => {
    if (!productId) throw new Error("Product ID required");
    if (!getAuthToken()) return false;

		try {
			const favorites = await favoritesAPI.getUserFavorites()
			return favorites.some(
				(fav) => fav._id === productId || fav.product?._id === productId,
			)
		} catch (error) {
			console.error("Error checking favorite status:", error)
			return false
		}
	},
}

// =============================================================================
// MESSAGES API
// =============================================================================
export const messagesAPI = {
  // Send a message
  sendMessage: async (messageData) => {
    console.log("API: Sending message with data:", messageData);

    const response = await apiRequest("/messages", {
      method: "POST",
      headers: createHeaders(true),
      body: JSON.stringify(messageData),
    });

    console.log("API: Message sent successfully:", response);
    return response;
  },

  // Get messages for current user
  getMessagesForUser: async () => {
    return apiRequest("/messages/user", {
      headers: createHeaders(true),
    });
  },

  // Get messages for a specific product
  getMessagesForProduct: async (productId) => {
    if (!productId) throw new Error("Product ID required");

    return apiRequest(`/messages/product/${productId}`, {
      headers: createHeaders(true),
    });
  },

  // Mark a message as read
  markAsRead: async (messageId) => {
    if (!messageId) throw new Error("Message ID required");

    return apiRequest(`/messages/${messageId}/read`, {
      method: "PATCH",
      headers: createHeaders(true),
    });
  },
};

// =============================================================================
// ADMIN API
// =============================================================================
export const adminAPI = {
  // Get admin dashboard statistics
  getStats: async () => {
    return apiRequest("/admin/stats", {
      headers: createHeaders(true),
    });
  },

  // Get recent activity logs
  getRecentActivity: async () => {
    return apiRequest("/admin/activity", {
      headers: createHeaders(true),
    });
  },

  // Get all users (admin only)
  getAllUsers: async () => {
    return apiRequest("/admin/users", {
      headers: createHeaders(true),
    });
  },

  // Get all products (admin view)
  getAllProducts: async () => {
    return apiRequest("/admin/products", {
      headers: createHeaders(true),
    });
  },

  // Delete a user (admin only)
  deleteUser: async (userId) => {
    if (!userId) throw new Error("User ID required");

    return apiRequest(`/admin/users/${userId}`, {
      method: "DELETE",
      headers: createHeaders(true),
    });
  },

  // Toggle user admin status
  toggleUserAdmin: async (userId) => {
    if (!userId) throw new Error("User ID required");

    return apiRequest(`/admin/users/${userId}/toggle-admin`, {
      method: "PATCH",
      headers: createHeaders(true),
    });
  },

  // Delete a product (admin only)
  deleteProduct: async (productId) => {
    if (!productId) throw new Error("Product ID required");

    return apiRequest(`/admin/products/${productId}`, {
      method: "DELETE",
      headers: createHeaders(true),
    });
  },

  // Toggle product active status
  toggleProductActive: async (productId) => {
    if (!productId) throw new Error("Product ID required");

    return apiRequest(`/admin/products/${productId}/toggle-active`, {
      method: "PATCH",
      headers: createHeaders(true),
    });
  },
};



// =============================================================================
// EXPORTS
// =============================================================================
export { isAuthenticated, getAuthToken };

export default {
  productsAPI,
  authAPI,
  favoritesAPI,
  messagesAPI,
  adminAPI,
};