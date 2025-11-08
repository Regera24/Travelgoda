import React, { createContext, useState, useEffect, useCallback } from 'react';
import { STORAGE_KEYS } from '../config/constants';
import { theme as defaultTheme } from '../config/theme';

export const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(defaultTheme);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Load theme preference from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME);
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
    }
  }, []);

  // Toggle dark mode
  const toggleDarkMode = useCallback(() => {
    setIsDarkMode((prev) => {
      const newMode = !prev;
      localStorage.setItem(STORAGE_KEYS.THEME, newMode ? 'dark' : 'light');
      return newMode;
    });
  }, []);

  // Get color by path (e.g., 'primary.500')
  const getColor = useCallback((colorPath) => {
    const parts = colorPath.split('.');
    let value = theme.colors;
    
    for (const part of parts) {
      value = value?.[part];
      if (!value) return null;
    }
    
    return value;
  }, [theme]);

  const value = {
    theme,
    isDarkMode,
    toggleDarkMode,
    getColor,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export default ThemeContext;
