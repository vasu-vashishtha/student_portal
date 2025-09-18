import axios from "axios";

// Direct base (must be fully specified including /api if your backend expects it)
// Fallback stays at legacy localhost with /api path.
const API_BASE = (import.meta?.env?.VITE_API_URL || "http://localhost:5000/api").replace(/\/+$/, "");

const api = axios.create({
  baseURL: API_BASE,
});

// Token injection
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Uploads base URL logic
// Priority:
// 1. Explicit VITE_UPLOADS_BASE_URL (e.g. https://api.convocationmedal.ccsuniversity.ac.in)
// 2. Derive from VITE_API_URL by stripping trailing /api
// 3. Fallback to localhost:5000
export function getUploadsBase() {
  const explicit = import.meta?.env?.VITE_UPLOADS_BASE_URL;
  if (explicit) return String(explicit).replace(/\/$/, "");
  try {
    const url = new URL(API_BASE);
    return `${url.protocol}//${url.host}`; // origin only
  } catch (e) {
    // Fallback: naive strip of trailing /api if parse fails (unlikely)
    return API_BASE.replace(/\/api$/, "");
  }
}

export function buildFileUrl(filename) {
  if (!filename) return null;
  return `${getUploadsBase()}/uploads/${filename}`;
}

export default api;
