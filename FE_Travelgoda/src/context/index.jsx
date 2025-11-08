import React from 'react';

// Export all context providers
export { AuthContext, AuthProvider } from './AuthContext';
export { ThemeContext, ThemeProvider } from './ThemeContext';
export { BookingContext, BookingProvider } from './BookingContext';
export { CartContext, CartProvider } from './CartContext';

// Import providers for use in AppProviders
import { AuthProvider } from './AuthContext';
import { ThemeProvider } from './ThemeContext';
import { BookingProvider } from './BookingContext';
import { CartProvider } from './CartContext';

// Combined provider component
export const AppProviders = ({ children }) => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <CartProvider>
          <BookingProvider>
            {children}
          </BookingProvider>
        </CartProvider>
      </ThemeProvider>
    </AuthProvider>
  );
};
