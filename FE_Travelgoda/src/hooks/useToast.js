import { useState, useCallback } from 'react';
import { TOAST_DURATION } from '../config/constants';

export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  // Add toast
  const addToast = useCallback((message, type = 'info', duration = TOAST_DURATION.MEDIUM) => {
    const id = Date.now();
    const toast = { id, message, type, duration };

    setToasts((prev) => [...prev, toast]);

    // Auto remove after duration
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  }, []);

  // Remove toast
  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  // Success toast
  const success = useCallback((message, duration) => {
    return addToast(message, 'success', duration);
  }, [addToast]);

  // Error toast
  const error = useCallback((message, duration) => {
    return addToast(message, 'error', duration);
  }, [addToast]);

  // Warning toast
  const warning = useCallback((message, duration) => {
    return addToast(message, 'warning', duration);
  }, [addToast]);

  // Info toast
  const info = useCallback((message, duration) => {
    return addToast(message, 'info', duration);
  }, [addToast]);

  // Clear all toasts
  const clearAll = useCallback(() => {
    setToasts([]);
  }, []);

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info,
    clearAll,
  };
};

export default useToast;
