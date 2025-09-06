// src/components/ProtectedRoute.jsx
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    // While we're checking for a user, show a loading message.
    return <div className="min-h-screen bg-background flex items-center justify-center text-white">Loading...</div>;
  }

  if (!user) {
    // If loading is done and there's still no user, redirect to the login page.
    return <Navigate to="/" />;
  }

  // If loading is done and there is a user, show the page they wanted.
  return children;
};

export default ProtectedRoute;