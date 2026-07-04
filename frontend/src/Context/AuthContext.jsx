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

    if (!token) {
      setLoading(false);
      return;
    }

    try {

      const data = await apiService.getProfile();

      setUser(data.user);

    } catch (err) {

      console.error(err);

      logout();

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

    localStorage.setItem("token", data.token);

    setToken(data.token);
    setUser(data.user);

    setLoading(false);

    return data.user;

  } catch (err) {
    setError(
      err.response?.data?.message ||
      "Login failed. Please check credentials."
    );

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

    setLoading(false);

    return data.user;

  } catch (err) {

    setError(
      err.response?.data?.message ||
      "Signup failed."
    );

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