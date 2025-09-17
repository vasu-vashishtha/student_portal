import axios from "axios";

// Ensure baseURL always points to the backend API root (with trailing /api)
const rawBase = import.meta?.env?.VITE_API_URL || "http://localhost:5000/api";
const normalizedBase = (() => {
  if (!rawBase) return "http://localhost:5000/api";
  const trimmed = String(rawBase).replace(/\/+$/, ""); // remove trailing slash(es)
  // Append '/api' if it's not already present at the end
  return /\/api$/.test(trimmed) ? trimmed : `${trimmed}/api`;
})();

const api = axios.create({
  baseURL: normalizedBase, // e.g., https://api.example.com/api
});

// Add token to headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
