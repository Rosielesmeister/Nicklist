const API_BASE_URL = 'http://localhost:5000';

export const productsAPI = {
  // GET all products - NO AUTH REQUIRED
  getAllProducts: async () => {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  },
  getProduct: async (id) => {
    if (!id) throw new Error('Product ID required');
    
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  },
  
  // POST create product - AUTH REQUIRED
  createProduct: async (productData) => {
    if (!productData) throw new Error('Product data required');
    
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Authentication required');
    
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(productData),
    });
    
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  },
  
  // GET user's products - AUTH REQUIRED
  getUserProducts: async () => {
    const token = localStorage.getItem('token'); 
    if (!token) throw new Error('Authentication required');
    
    const response = await fetch(`${API_BASE_URL}/user/products`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  },
  
  // PUT update product - AUTH REQUIRED
  updateProduct: async (id, productData) => {
    if (!id) throw new Error('Product ID required');
    
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Authentication required');
    
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(productData),
    });
    
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  },
  
  // DELETE product - AUTH REQUIRED
  deleteProduct: async (id) => {
    if (!id) throw new Error('Product ID required');
    
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Authentication required');
    
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  },
  
  // Search products - usually no auth required
  searchProducts: async (searchTerm, filters = {}) => {
    const queryParams = new URLSearchParams({
      ...(searchTerm && { search: searchTerm }),
      ...filters
    });
    
    const response = await fetch(`${API_BASE_URL}/products/search?${queryParams}`, {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  }
};

export const postsAPI = {
  getUserPosts: async () => {
    const token = localStorage.getItem("authToken");
    const response = await fetch(`${API_BASE_URL}/products`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch user posts");
    }
    return response.json();
  },
};

// Auth API for user management
export const authAPI = {
  // Register new user
  register: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  },
  
  // Login user
  login: async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    
    // Store token in localStorage for subsequent API calls
    if (data.token) localStorage.setItem('token', data.token);
    return data;
  },
  
  // Logout user (client-side)
  logout: () => {
    localStorage.removeItem('token');
  },
  
  // Get current user info
  getCurrentUser: async () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      localStorage.removeItem('token');
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  }
};