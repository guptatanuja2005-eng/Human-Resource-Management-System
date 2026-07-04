import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { token, user, loading } = useAuth();

  // ⏳ Wait until auth is loaded
  if (loading) return <div>Loading...</div>;

  // ❌ Not logged in → go to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // ❌ Not admin but trying to access admin page
  if (adminOnly && user?.role !== 'admin') {
    return <Navigate to="/employee" replace />;
  }

  // ✅ Allowed
  return children;
};

export default ProtectedRoute;