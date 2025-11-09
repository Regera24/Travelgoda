import React, { createContext, useState, useEffect, useCallback } from 'react';
import { STORAGE_KEYS, USER_ROLES } from '../config/constants';
import authService from '../services/authService';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [accessToken, setAccessToken] = useState(null);

  // Load user data from localStorage on mount
  useEffect(() => {
    const loadUserData = () => {
      try {
        const storedUser = localStorage.getItem(STORAGE_KEYS.USER_DATA);
        const storedToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
        console.log('Loaded user data from localStorage:', { storedUser, storedToken });

        if (storedUser && storedToken) {
          setUser(JSON.parse(storedUser));
          setAccessToken(storedToken);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        // Clear invalid data instead of calling logout
        localStorage.removeItem(STORAGE_KEYS.USER_DATA);
        localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, []);

  // Login function
  const login = useCallback(async (userData, token) => {
    try {
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);

      setUser(userData);
      setAccessToken(token);
      setIsAuthenticated(true);

      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  }, []);

  // Logout function
  const logout = useCallback(async () => {
    try {
      const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);

      // Call backend logout API if token exists
      if (token) {
        await authService.logout(token);
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Continue with local logout even if API call fails
    } finally {
      // Clear local storage and state
      localStorage.removeItem(STORAGE_KEYS.USER_DATA);
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);

      setUser(null);
      setAccessToken(null);
      setIsAuthenticated(false);
    }
  }, []);

  // Update user profile
  const updateUser = useCallback((updatedData) => {
    const updatedUser = { ...user, ...updatedData };
    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(updatedUser));
    setUser(updatedUser);
  }, [user]);

  // Check if user has specific role
  const hasRole = useCallback((role) => {
    return user?.role === role;
  }, [user]);

  // Check if user is admin
  const isAdmin = useCallback(() => {
    console.log('Checking if user is admin:', user);
    return user?.role === USER_ROLES.ADMIN;
  }, [user]);

  // Check if user is customer
  const isCustomer = useCallback(() => {
    return user?.role === USER_ROLES.CUSTOMER;
  }, [user]);

  // Check if user is tour provider
  const isTourProvider = useCallback(() => {
    return user?.role === USER_ROLES.TOUR_PROVIDER;
  }, [user]);

  // Check if user is tour guide
  const isTourGuide = useCallback(() => {
    return user?.role === USER_ROLES.TOUR_GUIDE;
  }, [user]);

  const value = {
    user,
    isAuthenticated,
    isLoading,
    accessToken,
    login,
    logout,
    updateUser,
    hasRole,
    isAdmin,
    isCustomer,
    isTourProvider,
    isTourGuide,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
