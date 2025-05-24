import axios from "axios";

// Set your backend URL here
const API_BASE_URL = "http://localhost:5000/api"; // Adjust port as needed

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth functions
export const authAPI = {
  register: (userData) => api.post("/auth/register", userData),
  login: (credentials) => api.post("/auth/login", credentials),
};

// Posts functions
export const postsAPI = {
  getAllPosts: () => api.get("/posts"),
  getPost: (id) => api.get(`/posts/${id}`),
  createPost: (postData) => api.post("/posts", postData),
  getUserPosts: () => api.get("/posts/user"),
  updatePost: (id, postData) => api.put(`/posts/${id}`, postData),
  deletePost: (id) => api.delete(`/posts/${id}`),
  addBookmark: (id) => api.post(`/products/${id}/bookmark`),
  removeBookmark: (id) => api.delete(`/products/${id}/bookmark`),
  getBookmarks: () => api.get("/user/bookmarks"),
};

export default api;
