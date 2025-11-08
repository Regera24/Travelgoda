import React, { createContext, useState, useEffect, useCallback } from 'react';
import { STORAGE_KEYS } from '../config/constants';

export const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  // Load cart and wishlist from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem(STORAGE_KEYS.CART);
    const savedWishlist = localStorage.getItem(STORAGE_KEYS.WISHLIST);
    
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart:', error);
      }
    }
    
    if (savedWishlist) {
      try {
        setWishlist(JSON.parse(savedWishlist));
      } catch (error) {
        console.error('Error loading wishlist:', error);
      }
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cartItems));
  }, [cartItems]);

  // Save wishlist to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(wishlist));
  }, [wishlist]);

  // Add item to cart
  const addToCart = useCallback((tour, options = {}) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex(item => item.tour.id === tour.id);
      
      if (existingIndex > -1) {
        // Update existing item
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: (updated[existingIndex].quantity || 1) + 1,
          ...options,
        };
        return updated;
      }
      
      // Add new item
      return [...prev, {
        tour,
        quantity: 1,
        addedAt: new Date().toISOString(),
        ...options,
      }];
    });
  }, []);

  // Remove item from cart
  const removeFromCart = useCallback((tourId) => {
    setCartItems((prev) => prev.filter(item => item.tour.id !== tourId));
  }, []);

  // Update cart item quantity
  const updateQuantity = useCallback((tourId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(tourId);
      return;
    }
    
    setCartItems((prev) => 
      prev.map(item => 
        item.tour.id === tourId 
          ? { ...item, quantity }
          : item
      )
    );
  }, [removeFromCart]);

  // Clear cart
  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  // Get cart total
  const getCartTotal = useCallback(() => {
    return cartItems.reduce((total, item) => {
      return total + (item.tour.price * (item.quantity || 1));
    }, 0);
  }, [cartItems]);

  // Get cart count
  const getCartCount = useCallback(() => {
    return cartItems.reduce((count, item) => count + (item.quantity || 1), 0);
  }, [cartItems]);

  // Check if item is in cart
  const isInCart = useCallback((tourId) => {
    return cartItems.some(item => item.tour.id === tourId);
  }, [cartItems]);

  // Add to wishlist
  const addToWishlist = useCallback((tour) => {
    setWishlist((prev) => {
      if (prev.some(item => item.id === tour.id)) {
        return prev;
      }
      return [...prev, { ...tour, addedAt: new Date().toISOString() }];
    });
  }, []);

  // Remove from wishlist
  const removeFromWishlist = useCallback((tourId) => {
    setWishlist((prev) => prev.filter(item => item.id !== tourId));
  }, []);

  // Toggle wishlist
  const toggleWishlist = useCallback((tour) => {
    setWishlist((prev) => {
      const exists = prev.some(item => item.id === tour.id);
      if (exists) {
        return prev.filter(item => item.id !== tour.id);
      }
      return [...prev, { ...tour, addedAt: new Date().toISOString() }];
    });
  }, []);

  // Check if item is in wishlist
  const isInWishlist = useCallback((tourId) => {
    return wishlist.some(item => item.id === tourId);
  }, [wishlist]);

  // Clear wishlist
  const clearWishlist = useCallback(() => {
    setWishlist([]);
  }, []);

  const value = {
    cartItems,
    wishlist,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
    isInCart,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist,
    clearWishlist,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export default CartContext;
