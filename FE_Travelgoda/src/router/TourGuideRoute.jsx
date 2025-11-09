import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Loading from '../components/Loading';

const TourGuideRoute = ({ children }) => {
  const { isAuthenticated, isLoading, isTourGuide } = useAuth();

  if (isLoading) {
    return <Loading fullScreen text="Đang tải..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has tour guide role
  if (!isTourGuide()) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default TourGuideRoute;
