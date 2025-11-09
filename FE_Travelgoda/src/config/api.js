// API configuration for TravelGoda
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export const API_ENDPOINTS = {
  // Authentication
  auth: {
    login: `${API_BASE_URL}/auth/login`,
    register: `${API_BASE_URL}/auth/register`,
    logout: `${API_BASE_URL}/auth/logout`,
    refreshToken: `${API_BASE_URL}/auth/refresh`,
    forgotPassword: `${API_BASE_URL}/auth/forgot-password`,
    resetPassword: `${API_BASE_URL}/auth/reset-password`,
    verifyEmail: `${API_BASE_URL}/auth/verify-email`,
    profile: `${API_BASE_URL}/auth/profile`,
  },
  
  // Users
  users: {
    list: `${API_BASE_URL}/users`,
    detail: (id) => `${API_BASE_URL}/users/${id}`,
    update: (id) => `${API_BASE_URL}/users/${id}`,
    delete: (id) => `${API_BASE_URL}/users/${id}`,
  },
  
  // Tours
  tours: {
    list: `${API_BASE_URL}/tours`,
    detail: (id) => `${API_BASE_URL}/tours/${id}`,
    search: `${API_BASE_URL}/tours/search`,
    featured: `${API_BASE_URL}/tours/featured`,
    popular: `${API_BASE_URL}/tours/popular`,
    categories: `${API_BASE_URL}/tours/categories`,
    byCategory: (categoryId) => `${API_BASE_URL}/tours/category/${categoryId}`,
  },
  
  // Bookings
  bookings: {
    list: `${API_BASE_URL}/bookings`,
    detail: (id) => `${API_BASE_URL}/bookings/${id}`,
    create: `${API_BASE_URL}/bookings`,
    update: (id) => `${API_BASE_URL}/bookings/${id}`,
    cancel: (id) => `${API_BASE_URL}/bookings/${id}/cancel`,
    myBookings: `${API_BASE_URL}/bookings/my-bookings`,
  },
  
  // Payments
  payments: {
    create: `${API_BASE_URL}/payments`,
    verify: `${API_BASE_URL}/payments/verify`,
    methods: `${API_BASE_URL}/payments/methods`,
    history: `${API_BASE_URL}/payments/history`,
  },
  
  // Reviews
  reviews: {
    list: `${API_BASE_URL}/reviews`,
    create: `${API_BASE_URL}/reviews`,
    update: (id) => `${API_BASE_URL}/reviews/${id}`,
    delete: (id) => `${API_BASE_URL}/reviews/${id}`,
    byTour: (tourId) => `${API_BASE_URL}/reviews/tour/${tourId}`,
  },
  
  // Promotions
  promotions: {
    list: `${API_BASE_URL}/promotions`,
    detail: (id) => `${API_BASE_URL}/promotions/${id}`,
    validate: `${API_BASE_URL}/promotions/validate`,
    active: `${API_BASE_URL}/promotions/active`,
  },
  
  // Wishlist
  wishlist: {
    list: `${API_BASE_URL}/wishlist`,
    add: `${API_BASE_URL}/wishlist`,
    remove: (id) => `${API_BASE_URL}/wishlist/${id}`,
  },
  
  // Support
  support: {
    tickets: `${API_BASE_URL}/support/tickets`,
    createTicket: `${API_BASE_URL}/support/tickets`,
    ticketDetail: (id) => `${API_BASE_URL}/support/tickets/${id}`,
    faq: `${API_BASE_URL}/support/faq`,
  },
  
  // Notifications
  notifications: {
    list: `${API_BASE_URL}/notifications`,
    markAsRead: (id) => `${API_BASE_URL}/notifications/${id}/read`,
    markAllAsRead: `${API_BASE_URL}/notifications/read-all`,
    delete: (id) => `${API_BASE_URL}/notifications/${id}`,
  },
};

export const API_CONFIG = {
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};

export default API_ENDPOINTS;
