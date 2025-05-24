const API_BASE_URL = 'http://localhost:5000/'

// Token management (fallback for localStorage compatibility)
const getAuthToken = () => {
  if (typeof window !== 'undefined' && window.localStorage) {
    return localStorage.getItem('token');
  }
  return null;
};

const setAuthToken = (token) => {
  if (typeof window !== 'undefined' && window.localStorage) {
    localStorage.setItem('token', token);
  }
};

const removeAuthToken = () => {
  if (typeof window !== 'undefined' && window.localStorage) {
    localStorage.removeItem('token');
  }
};

// Enhanced error class for API errors
class APIError extends Error {
  constructor(message, status, data = null) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.data = data;
  }
}

// Base API function with improved error handling
const fetchAPI = async (endpoint, options = {}) => {
  try {
    // Clean up endpoint (remove leading slash if present)
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    
    // Prepare headers
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Add auth token if available and not explicitly skipped
    const token = getAuthToken();
    if (token && !options.skipAuth) {
      headers.Authorization = `Bearer ${token}`;
    }

    // Prepare fetch configuration
    const config = {
      ...options,
      headers,
    };

    // Make the request
    const response = await fetch(`${API_BASE_URL}${cleanEndpoint}`, config);
    
    // Handle different response types
    let responseData = null;
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      responseData = await response.json();
    } else {
      responseData = await response.text();
    }

    // Handle non-successful responses
    if (!response.ok) {
      const errorMessage = responseData?.message || 
                          responseData?.error || 
                          responseData || 
                          `Request failed with status ${response.status}`;
      
      throw new APIError(errorMessage, response.status, responseData);
    }
    
    return responseData;
  } catch (error) {
    // If it's already an APIError, re-throw it
    if (error instanceof APIError) {
      throw error;
    }
    
    // Handle network errors, timeout, etc.
    console.error('API Request Error:', error);
    const errorMessage = error.message || 'Network error occurred';
    throw new APIError(errorMessage, 0, null);
  }
};

// Authentication API
export const authAPI = {
  register: async (userData) => {
    try {
      const response = await fetchAPI('/register', { 
        method: 'POST', 
        body: JSON.stringify(userData),
        skipAuth: true
      });
      
      // Store token if provided
      if (response.token) {
        setAuthToken(response.token);
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  },

  login: async (credentials) => {
    try {
      const response = await fetchAPI('/login', { 
        method: 'POST', 
        body: JSON.stringify(credentials),
        skipAuth: true
      });
      
      // Store token if provided
      if (response.token) {
        setAuthToken(response.token);
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  },

  logout: async () => {
    try {
      await fetchAPI('auth/logout', { method: 'POST' });
      removeAuthToken();
      return { success: true };
    } catch (error) {
      // Even if logout fails on server, remove local token
      removeAuthToken();
      throw error;
    }
  },

  getCurrentUser: () => fetchAPI('auth/me'),
  
  updateUser: (id, userData) => fetchAPI(`users/${id}`, { 
    method: 'PUT', 
    body: JSON.stringify(userData) 
  }),
  
  deleteUser: (id) => fetchAPI(`users/${id}`, { method: 'DELETE' }),
  
  // Helper to check if user is authenticated
  isAuthenticated: () => !!getAuthToken(),
  
  // Helper to get token
  getToken: getAuthToken
};

// Posts/Listings API (unified approach)
export const postsAPI = {
  // Get all posts with optional query parameters
  getAllPosts: async (params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const endpoint = queryString ? `products?${queryString}` : 'products';
      
      // Make sure to skip authentication for public product listings
      const data = await fetchAPI(endpoint, { skipAuth: true });
      
      // Ensure consistent response format
      return { 
        data: Array.isArray(data) ? data : data.products || data.posts || data.data || [],
        total: data.total || (Array.isArray(data) ? data.length : 0),
        ...data
      };
    } catch (error) {
      console.error("Error fetching posts:", error);
      return { data: [], total: 0 }; // Return empty data instead of throwing to prevent UI crashes
    }
  },

  getPost: (id) => {
    if (!id) {
      throw new APIError('Post ID is required', 400);
    }
    return fetchAPI(`posts/${id}`, { skipAuth: true });
  },

  createPost: (postData) => {
    if (!postData) {
      throw new APIError('Post data is required', 400);
    }
    return fetchAPI('posts', { 
      method: 'POST', 
      body: JSON.stringify(postData) 
    });
  },

  getUserPosts: () => fetchAPI('user/posts'),

  updatePost: (id, postData) => {
    if (!id) {
      throw new APIError('Post ID is required', 400);
    }
    return fetchAPI(`posts/${id}`, { 
      method: 'PUT', 
      body: JSON.stringify(postData) 
    });
  },

  deletePost: (id) => {
    if (!id) {
      throw new APIError('Post ID is required', 400);
    }
    return fetchAPI(`posts/${id}`, { method: 'DELETE' });
  },

  // Search posts
  searchPosts: (searchTerm, filters = {}) => {
    const params = {
      search: searchTerm,
      ...filters
    };
    return postsAPI.getAllPosts(params);
  }
};

// Generic CRUD API factory (for extensibility)
export const createCRUDAPI = (resource) => ({
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `${resource}?${queryString}` : resource;
    return fetchAPI(endpoint);
  },
  
  get: (id) => fetchAPI(`${resource}/${id}`),
  
  create: (data) => fetchAPI(resource, { 
    method: 'POST', 
    body: JSON.stringify(data) 
  }),
  
  update: (id, data) => fetchAPI(`${resource}/${id}`, { 
    method: 'PUT', 
    body: JSON.stringify(data) 
  }),
  
  delete: (id) => fetchAPI(`${resource}/${id}`, { method: 'DELETE' })
});

// Categories API (if needed separately)
export const categoriesAPI = createCRUDAPI('categories');

// Regions API (if needed separately)
export const regionsAPI = createCRUDAPI('regions');

// File upload helper
export const uploadFile = async (file, endpoint = 'upload') => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const token = getAuthToken();
    const headers = {};
    
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: formData
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new APIError(
        errorData.message || `Upload failed with status ${response.status}`,
        response.status,
        errorData
      );
    }
    
    return await response.json();
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    throw new APIError(error.message || 'Upload failed', 0);
  }
};

// Export utilities
export { 
  fetchAPI as default, 
  APIError, 
  getAuthToken, 
  setAuthToken, 
  removeAuthToken 
};
