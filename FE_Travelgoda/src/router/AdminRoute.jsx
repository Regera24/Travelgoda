import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Loading from '../components/Loading';

const AdminRoute = ({ children }) => {
  const { isAuthenticated, isLoading, isAdmin, isTourProvider } = useAuth();

  if (isLoading) {
    return <Loading fullScreen text="Đang tải..." />;
  }

  // if (!isAuthenticated) {
  //   return <Navigate to="/login" replace />;
  // }

  // Check if user has admin or tour provider role
  // if (!isAdmin() && !isTourProvider()) {
  //   return <Navigate to="/" replace />;
  // }

  return children;
};

export default AdminRoute;
