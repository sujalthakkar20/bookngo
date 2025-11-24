import React, { createContext, useState, useContext, useEffect } from "react";
import API from "../utils/api";
import { API_ENDPOINTS } from "../config/api";

// Create context
const AuthContext = createContext();

// Hook for easy access
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));

    if (token) {
      API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, [token]);

  // Fetch logged-in user profile
  const fetchUserProfile = async () => {
    try {
      const { data } = await API.get(API_ENDPOINTS.AUTH.PROFILE);
      setUser(data);
      localStorage.setItem("user", JSON.stringify(data));
    } catch (error) {
      console.error("Failed to fetch user:", error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  // Login function (normal & admin)
  const login = async (email, password, isAdmin = false) => {
    try {
      const endpoint = isAdmin
        ? API_ENDPOINTS.AUTH.ADMIN_LOGIN
        : API_ENDPOINTS.AUTH.LOGIN;

      const { data } = await API.post(endpoint, { email, password });
      const { token, ...userData } = data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));
      setToken(token);
      setUser(userData);
      API.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      return { success: true, user: userData };
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      return {
        success: false,
        message: error.response?.data?.message || "Invalid credentials",
      };
    }
  };

  // Register function (normal users only)
  const register = async (name, email, password, phone) => {
    try {
      const { data } = await API.post(API_ENDPOINTS.AUTH.REGISTER, {
        name,
        email,
        password,
        phone,
      });
      const { token, ...userData } = data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));
      setToken(token);
      setUser(userData);
      API.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      return { success: true, user: userData };
    } catch (error) {
      console.error("Registration failed:", error.response?.data || error.message);
      return {
        success: false,
        message: error.response?.data?.message || "Registration failed",
      };
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    delete API.defaults.headers.common["Authorization"];
  };

  // Context value
  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.isAdmin || false,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};
