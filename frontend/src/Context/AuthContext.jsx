import React, { createContext, useState, useEffect, useContext } from 'react';
import apiService from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ LOAD USER ON REFRESH
  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          apiService.setAuthToken(token);

          const userData = await apiService.getProfile();

          // 🔥 FIX: ensure correct structure
          setUser(userData?.user || userData);

        } catch (err) {
          console.error("Failed to load user profile:", err);
          logout(); // auto logout if token invalid
        }
      }
      setLoading(false);
    };

    loadUser();
  }, [token]);

  // ✅ LOGIN
  const login = async (email, password) => {
    setError(null);
    setLoading(true);

    try {
      const data = await apiService.login(email, password);

      // 🔥 SAVE TOKEN
      localStorage.setItem('token', data.token);
      apiService.setAuthToken(data.token);

      setToken(data.token);

      // 🔥 FIX: safe user extraction
      const loggedUser = data.user || data;
      setUser(loggedUser);

      setLoading(false);

      return loggedUser; // 🔥 IMPORTANT (used in Login.jsx)

    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check credentials.');
      setLoading(false);
      throw err;
    }
  };

  // ✅ SIGNUP
  const signup = async (formData) => {
    setError(null);
    setLoading(true);

    try {
      const data = await apiService.signup(formData);

      localStorage.setItem('token', data.token);
      apiService.setAuthToken(data.token);

      setToken(data.token);

      const newUser = data.user || data;
      setUser(newUser);

      setLoading(false);

      return newUser;

    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
      setLoading(false);
      throw err;
    }
  };

  // ✅ LOGOUT
  const logout = () => {
    localStorage.removeItem('token');
    apiService.setAuthToken(null);

    setToken(null);
    setUser(null);
    setError(null);
  };

  // ✅ CONTEXT VALUE
  const value = {
    token,
    user,
    loading,
    error,
    login,
    signup,
    logout,

    // 🔥 HELPER FLAGS
    isAuthenticated: !!token,
    isAdmin: user?.role === 'admin'
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// ✅ HOOK
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};