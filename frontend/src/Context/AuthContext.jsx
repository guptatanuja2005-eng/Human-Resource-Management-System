import React, { createContext, useState, useEffect, useContext } from 'react';
import apiService from '../services/api';
const AuthContext = createContext(null);
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          apiService.setAuthToken(token);
          const userData = await apiService.getProfile();
          setUser(userData);
        } catch (err) {
          console.error("Failed to load user profile:", err);
          logout();
        }
      }
      setLoading(false);
    };
    loadUser();
  }, [token]);
  const login = async (email, password) => {
    setError(null);
    setLoading(true);
    try {
      const data = await apiService.login(email, password);
      localStorage.setItem('token', data.token);
      apiService.setAuthToken(data.token);
      setToken(data.token);
      setUser(data.user);
      setLoading(false);
      return data.user;
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check credentials.');
      setLoading(false);
      throw err;
    }
  };
  const signup = async (formData) => {
    setError(null);
    setLoading(true);
    try {
      const data = await apiService.signup(formData);
      localStorage.setItem('token', data.token);
      apiService.setAuthToken(data.token);
      setToken(data.token);
      setUser(data.user);
      setLoading(false);
      return data.user;
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
      setLoading(false);
      throw err;
    }
  };
  const logout = () => {
    localStorage.removeItem('token');
    apiService.setAuthToken(null);
    setToken(null);
    setUser(null);
    setError(null);
  };
  const value = {
    token,
    user,
    loading,
    error,
    login,
    signup,
    logout,
    isAdmin: user?.role === 'admin'
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
