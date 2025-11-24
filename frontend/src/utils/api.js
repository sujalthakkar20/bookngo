import axios from "axios";

// Create an Axios instance with a base URL
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "https://bookngo-zrbr.vercel.app/api",
});

// Add a request interceptor to include JWT token automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Optional: handle responses globally (for 401 errors)
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid – clear user data
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login"; // redirect to login
    }
    return Promise.reject(error);
  }
);

export default API;
