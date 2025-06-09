// Environment-based API URL configuration
const getApiBaseUrl = () => {
  if (import.meta.env.DEV) {
    return `http://localhost:${import.meta.env.VITE_API_PORT || 5000}/api`
  } else {
    const renderUrl = import.meta.env.VITE_API_URL
    if (!renderUrl) {
      return 'https://nicklistcapstone.onrender.com/api'
    }
    return renderUrl.endsWith('/api') ? renderUrl : `${renderUrl}/api`
  }
}

const API_BASE_URL = getApiBaseUrl()

// Utility functions
const getAuthToken = () => localStorage.getItem("token")
const isAuthenticated = () => !!getAuthToken()

const createHeaders = (requireAuth = false) => {
  const headers = { "Content-Type": "application/json" }
  if (requireAuth) {
    const token = getAuthToken()
    if (!token) throw new Error("Authentication required")
    headers.Authorization = `Bearer ${token}`
  }
  return headers
}

const apiRequest = async (endpoint, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  })

  if (!response.ok) {
    let errorMessage
    try {
      const errorData = await response.json()
      errorMessage = errorData.message || `HTTP error! status: ${response.status}`
    } catch {
      errorMessage = `HTTP error! status: ${response.status}`
    }
    throw new Error(errorMessage)
  }

  return await response.json()
}

// Products API
export const productsAPI = {
  getAllProducts: () => apiRequest("/products"),
  getProduct: (id) => apiRequest(`/products/${id}`),
  createProduct: (productData) => apiRequest("/products", {
    method: "POST",
    headers: createHeaders(true),
    body: JSON.stringify(productData),
  }),
  getUserProducts: () => apiRequest("/user/products", {
    headers: createHeaders(true),
  }),
  updateProduct: (id, productData) => apiRequest(`/products/${id}`, {
    method: "PUT",
    headers: createHeaders(true),
    body: JSON.stringify(productData),
  }),
  deleteProduct: (id) => apiRequest(`/products/${id}`, {
    method: "DELETE",
    headers: createHeaders(true),
  }),
  searchProducts: (searchTerm, filters = {}) => {
    const queryParams = new URLSearchParams({
      ...(searchTerm && { search: searchTerm }),
      ...filters,
    })
    return apiRequest(`/products/search?${queryParams}`)
  },
}

// Authentication API
export const authAPI = {
  register: async (userData) => {
    const response = await apiRequest("/register", {
      method: "POST",
      body: JSON.stringify(userData),
    })
    if (response.token) localStorage.setItem("token", response.token)
    return response
  },
  login: async (credentials) => {
    const response = await apiRequest("/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    })
    if (response.token) localStorage.setItem("token", response.token)
    return response
  },
  logout: () => localStorage.removeItem("token"),
  getCurrentUser: async () => {
    const token = getAuthToken()
    if (!token) return null
    try {
      return await apiRequest("/me", { headers: createHeaders(true) })
    } catch (error) {
      if (error.message.includes("401")) {
        localStorage.removeItem("token")
      }
      throw error
    }
  },
  updateUser: (userId, userData) => apiRequest(`/update/${userId}`, {
    method: "PUT",
    headers: createHeaders(true),
    body: JSON.stringify(userData),
  }),
  deleteUser: (userId) => apiRequest(`/user/${userId}`, {
    method: "DELETE",
    headers: createHeaders(true),
  }),
}

// Favorites API
export const favoritesAPI = {
  getUserFavorites: () => apiRequest("/user/favorites", {
    headers: createHeaders(true),
  }),
  addToFavorites: (productId) => apiRequest(`/user/favorites/${productId}`, {
    method: "POST",
    headers: createHeaders(true),
  }),
  removeFromFavorites: (productId) => apiRequest(`/user/favorites/${productId}`, {
    method: "DELETE",
    headers: createHeaders(true),
  }),
  isFavorited: async (productId) => {
    if (!productId || !getAuthToken()) return false
    try {
      const favorites = await favoritesAPI.getUserFavorites()
      return favorites.some(fav => fav._id === productId || fav.product?._id === productId)
    } catch {
      return false
    }
  },
}

// Messages API
export const messagesAPI = {
  sendMessage: (messageData) => apiRequest("/messages", {
    method: "POST",
    headers: createHeaders(true),
    body: JSON.stringify(messageData),
  }),
  getMessagesForUser: () => apiRequest("/messages/user", {
    headers: createHeaders(true),
  }),
  getMessagesForProduct: (productId) => apiRequest(`/messages/product/${productId}`, {
    headers: createHeaders(true),
  }),
  markAsRead: (messageId) => apiRequest(`/messages/${messageId}/read`, {
    method: "PATCH",
    headers: createHeaders(true),
  }),
}

// Admin API
export const adminAPI = {
  getStats: () => apiRequest("/admin/stats", { headers: createHeaders(true) }),
  getRecentActivity: () => apiRequest("/admin/activity", { headers: createHeaders(true) }),
  getAllUsers: () => apiRequest("/admin/users", { headers: createHeaders(true) }),
  getAllProducts: () => apiRequest("/admin/products", { headers: createHeaders(true) }),
  deleteUser: (userId) => apiRequest(`/admin/users/${userId}`, {
    method: "DELETE",
    headers: createHeaders(true),
  }),
  toggleUserAdmin: (userId) => apiRequest(`/admin/users/${userId}/toggle-admin`, {
    method: "PATCH",
    headers: createHeaders(true),
  }),
  deleteProduct: (productId) => apiRequest(`/admin/products/${productId}`, {
    method: "DELETE",
    headers: createHeaders(true),
  }),
  toggleProductActive: (productId) => apiRequest(`/admin/products/${productId}/toggle-active`, {
    method: "PATCH",
    headers: createHeaders(true),
  }),
}

// Legacy compatibility
export const postsAPI = {
  getAllPosts: () => productsAPI.getAllProducts(),
  getPost: (id) => productsAPI.getProduct(id),
  createPost: (postData) => productsAPI.createProduct(postData),
  getUserPosts: () => productsAPI.getUserProducts(),
  updatePost: (id, postData) => productsAPI.updateProduct(id, postData),
  deletePost: (id) => productsAPI.deleteProduct(id),
}

// Mock Orders API
export const ordersAPI = {
  createOrder: async (orderData) => {
    await new Promise(resolve => setTimeout(resolve, 1500))
    const mockOrder = {
      _id: `order_${Date.now()}`,
      ...orderData,
      status: "confirmed",
      orderNumber: `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      createdAt: new Date().toISOString(),
    }
    localStorage.setItem("lastOrder", JSON.stringify(mockOrder))
    return mockOrder
  },
  getUserOrders: async () => {
    await new Promise(resolve => setTimeout(resolve, 500))
    return []
  },
  getOrder: async (orderId) => {
    const lastOrder = localStorage.getItem("lastOrder")
    if (lastOrder) {
      const order = JSON.parse(lastOrder)
      if (order._id === orderId) return order
    }
    return { _id: orderId, status: "confirmed" }
  },
}

export { isAuthenticated, getAuthToken }

export default {
  productsAPI,
  authAPI,
  favoritesAPI,
  messagesAPI,
  adminAPI,
  postsAPI,
  ordersAPI,
}