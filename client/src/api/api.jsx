// Frontend API Configuration
// Imports port variable from frontend ENV file
const API_BASE_URL = `http://localhost:${
  import.meta.env.VITE_API_PORT || 5000
}`;

// Products API - matches your backend routes
export const productsAPI = {
  // GET all products - NO AUTH REQUIRED
  getAllProducts: async () => {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  },

  // GET single product by ID - NO AUTH REQUIRED
  getProduct: async (id) => {
    if (!id) throw new Error("Product ID required");

    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  },

  // POST create product - AUTH REQUIRED
  createProduct: async (productData) => {
    if (!productData) throw new Error("Product data required");

    const token = localStorage.getItem("token");
    if (!token) throw new Error("Authentication required");

    const response = await fetch(`${API_BASE_URL}/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(productData),
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  },

  // GET user's own products - AUTH REQUIRED
  getUserProducts: async () => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Authentication required");

    const response = await fetch(`${API_BASE_URL}/user/products`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  },

  // PUT update product - AUTH REQUIRED
  updateProduct: async (id, productData) => {
    if (!id) throw new Error("Product ID required");
    if (!productData) throw new Error("Product data required");

    const token = localStorage.getItem("token");
    if (!token) throw new Error("Authentication required");

    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(productData),
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  },

  // DELETE product - AUTH REQUIRED
  // Updated api.jsx - deleteProduct function with better error handling

  // DELETE product - AUTH REQUIRED
  deleteProduct: async (id) => {
    if (!id) throw new Error("Product ID required");

    const token = localStorage.getItem("token");
    if (!token) throw new Error("Authentication required");

    console.log("Deleting product with ID:", id);
    console.log("Using token:", token ? "Token present" : "No token");

    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Delete response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Delete failed with response:", errorText);

      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch (e) {
        errorData = { message: errorText };
      }

      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    const result = await response.json();
    console.log("Delete successful:", result);
    return result;
  },

  // Search products - NO AUTH REQUIRED
  searchProducts: async (searchTerm, filters = {}) => {
    const queryParams = new URLSearchParams({
      ...(searchTerm && { search: searchTerm }),
      ...filters,
    });

    const response = await fetch(
      `${API_BASE_URL}/products/search?${queryParams}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  },
};

// Legacy postsAPI for backward compatibility - points to productsAPI
export const postsAPI = {
  getAllPosts: () => productsAPI.getAllProducts(),
  getPost: (id) => productsAPI.getProduct(id),
  createPost: (postData) => productsAPI.createProduct(postData),
  getUserPosts: () => productsAPI.getUserProducts(), // Fixed to use correct method
  updatePost: (id, postData) => productsAPI.updateProduct(id, postData),
  deletePost: (id) => productsAPI.deleteProduct(id),
};

// Auth API for user management - matches your backend routes
export const authAPI = {
  // Register new user
  register: async (userData) => {
    if (!userData) throw new Error("User data required");

    const response = await fetch(`${API_BASE_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    const data = await response.json();
    // Store token in localStorage for subsequent API calls
    if (data.token) localStorage.setItem("token", data.token);
    return data;
  },

  // Login user
  login: async (credentials) => {
    if (!credentials) throw new Error("Credentials required");

    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    const data = await response.json();
    // Store token in localStorage for subsequent API calls
    if (data.token) localStorage.setItem("token", data.token);
    return data;
  },

  // Logout user (client-side)
  logout: () => {
    localStorage.removeItem("token");
  },

  // Get current user info
  getCurrentUser: async () => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    const response = await fetch(`${API_BASE_URL}/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      // If token is invalid, remove it
      if (response.status === 401) {
        localStorage.removeItem("token");
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  },

  // Update user profile
  updateUser: async (userId, userData) => {
    if (!userId || !userData) throw new Error("User ID and data required");

    const token = localStorage.getItem("token");
    if (!token) throw new Error("Authentication required");

    const response = await fetch(`${API_BASE_URL}/update/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }
    return await response.json();
  },

  // Delete user account
  deleteUser: async (userId) => {
    if (!userId) throw new Error("User ID required");

    const token = localStorage.getItem("token");
    if (!token) throw new Error("Authentication required");

    const response = await fetch(`${API_BASE_URL}/user/${userId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }
    return await response.json();
  },
};

// Utility function to check if user is authenticated
export const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  return !!token;
};

// Utility function to get auth token
export const getAuthToken = () => {
  return localStorage.getItem("token");
};

// Favorites API for user favorites management
export const favoritesAPI = {
  // GET user's favorite products - AUTH REQUIRED
  getUserFavorites: async () => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Authentication required");

    const response = await fetch(`${API_BASE_URL}/user/favorites`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  },

  // POST add product to favorites - AUTH REQUIRED
  addToFavorites: async (productId) => {
    if (!productId) throw new Error("Product ID required");

    const token = localStorage.getItem("token");
    if (!token) throw new Error("Authentication required");

    const response = await fetch(
      `${API_BASE_URL}/user/favorites/${productId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  },

  // DELETE remove product from favorites - AUTH REQUIRED
  removeFromFavorites: async (productId) => {
    if (!productId) throw new Error("Product ID required");

    const token = localStorage.getItem("token");
    if (!token) throw new Error("Authentication required");

    const response = await fetch(
      `${API_BASE_URL}/user/favorites/${productId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  },

  // GET check if product is favorited - AUTH REQUIRED
  isFavorited: async (productId) => {
    if (!productId) throw new Error("Product ID required");

    const token = localStorage.getItem("token");
    if (!token) return false;

    try {
      const favorites = await favoritesAPI.getUserFavorites();
      return favorites.some(
        (fav) => fav._id === productId || fav.product?._id === productId
      );
    } catch (error) {
      console.error("Error checking favorite status:", error);
      return false;
    }
  },
};

// Messages API
export const messagesAPI = {
  // Send message
  sendMessage: async (data) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Authentication required");

    const response = await fetch(`${API_BASE_URL}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  },

  // Get messages for current user
  getMessagesForUser: async () => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Authentication required");

    const response = await fetch(`${API_BASE_URL}/messages/user`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  },

  // Get messages for a product
  getMessagesForProduct: async (productId) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Authentication required");

    const response = await fetch(
      `${API_BASE_URL}/messages/product/${productId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  },

  // Mark message as read
  markAsRead: async (messageId) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Authentication required");

    const response = await fetch(`${API_BASE_URL}/messages/${messageId}/read`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  },
};

export default { productsAPI, postsAPI, authAPI, favoritesAPI, messagesAPI };
