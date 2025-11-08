import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Loading from '../components/Loading';

const ProtectedRoute = ({ children, requireAuth = true, redirectTo = '/login' }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <Loading fullScreen text="Đang tải..." />;
  }

  if (requireAuth && !isAuthenticated) {
    // Redirect to login and save the location they were trying to access
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  if (!requireAuth && isAuthenticated) {
    // If user is already authenticated and tries to access auth pages
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
