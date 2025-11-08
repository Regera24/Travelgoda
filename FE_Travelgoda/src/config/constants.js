// Application constants for TravelGoda

// Application info
export const APP_NAME = 'TravelGoda';
export const APP_VERSION = '1.0.0';
export const APP_DESCRIPTION = 'Nền tảng đặt tour du lịch trực tuyến';

// Local storage keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'travelgoda_access_token',
  REFRESH_TOKEN: 'travelgoda_refresh_token',
  USER_DATA: 'travelgoda_user_data',
  THEME: 'travelgoda_theme',
  LANGUAGE: 'travelgoda_language',
  CART: 'travelgoda_cart',
  WISHLIST: 'travelgoda_wishlist',
};

// User roles
export const USER_ROLES = {
  ADMIN: 'admin',
  CUSTOMER: 'customer',
  TOUR_PROVIDER: 'tour_provider',
  SUPPORT: 'support',
};

// Booking status
export const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
  REFUNDED: 'refunded',
};

// Payment status
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded',
};

// Payment methods
export const PAYMENT_METHODS = {
  CREDIT_CARD: 'credit_card',
  DEBIT_CARD: 'debit_card',
  PAYPAL: 'paypal',
  BANK_TRANSFER: 'bank_transfer',
  MOMO: 'momo',
  VNPAY: 'vnpay',
  ZALOPAY: 'zalopay',
};

// Tour categories
export const TOUR_CATEGORIES = {
  ADVENTURE: 'adventure',
  BEACH: 'beach',
  CITY: 'city',
  CULTURAL: 'cultural',
  FAMILY: 'family',
  HONEYMOON: 'honeymoon',
  LUXURY: 'luxury',
  NATURE: 'nature',
  CRUISE: 'cruise',
};

// Tour difficulty levels
export const DIFFICULTY_LEVELS = {
  EASY: 'easy',
  MODERATE: 'moderate',
  CHALLENGING: 'challenging',
  DIFFICULT: 'difficult',
};

// Date formats
export const DATE_FORMATS = {
  FULL: 'DD/MM/YYYY HH:mm:ss',
  DATE_ONLY: 'DD/MM/YYYY',
  TIME_ONLY: 'HH:mm',
  DATE_TIME: 'DD/MM/YYYY HH:mm',
  MONTH_YEAR: 'MM/YYYY',
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 12,
  PAGE_SIZE_OPTIONS: [12, 24, 36, 48],
};

// Sort options
export const SORT_OPTIONS = {
  NEWEST: 'newest',
  OLDEST: 'oldest',
  PRICE_LOW_HIGH: 'price_low_high',
  PRICE_HIGH_LOW: 'price_high_low',
  RATING_HIGH_LOW: 'rating_high_low',
  POPULARITY: 'popularity',
};

// Price range filters (VND)
export const PRICE_RANGES = [
  { label: 'Dưới 1 triệu', min: 0, max: 1000000 },
  { label: '1 - 3 triệu', min: 1000000, max: 3000000 },
  { label: '3 - 5 triệu', min: 3000000, max: 5000000 },
  { label: '5 - 10 triệu', min: 5000000, max: 10000000 },
  { label: 'Trên 10 triệu', min: 10000000, max: null },
];

// Duration filters (days)
export const DURATION_RANGES = [
  { label: '1-3 ngày', min: 1, max: 3 },
  { label: '4-7 ngày', min: 4, max: 7 },
  { label: '8-14 ngày', min: 8, max: 14 },
  { label: 'Trên 14 ngày', min: 15, max: null },
];

// Rating stars
export const RATING_STARS = [1, 2, 3, 4, 5];

// Notification types
export const NOTIFICATION_TYPES = {
  INFO: 'info',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error',
  BOOKING: 'booking',
  PAYMENT: 'payment',
  PROMOTION: 'promotion',
};

// Languages
export const LANGUAGES = {
  VI: 'vi',
  EN: 'en',
};

// Social media links
export const SOCIAL_LINKS = {
  FACEBOOK: 'https://facebook.com/travelgoda',
  INSTAGRAM: 'https://instagram.com/travelgoda',
  TWITTER: 'https://twitter.com/travelgoda',
  YOUTUBE: 'https://youtube.com/travelgoda',
};

// Contact info
export const CONTACT_INFO = {
  EMAIL: 'contact@travelgoda.com',
  PHONE: '1900-xxxx',
  HOTLINE: '0900-xxx-xxx',
  ADDRESS: 'Địa chỉ văn phòng TravelGoda',
};

// Validation rules
export const VALIDATION_RULES = {
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 50,
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 30,
  PHONE_REGEX: /^(0|\+84)[0-9]{9,10}$/,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
};

// File upload limits
export const UPLOAD_LIMITS = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'application/msword'],
};

// Toast notification duration
export const TOAST_DURATION = {
  SHORT: 2000,
  MEDIUM: 3000,
  LONG: 5000,
};

export default {
  APP_NAME,
  APP_VERSION,
  STORAGE_KEYS,
  USER_ROLES,
  BOOKING_STATUS,
  PAYMENT_STATUS,
  PAYMENT_METHODS,
  TOUR_CATEGORIES,
  DIFFICULTY_LEVELS,
  DATE_FORMATS,
  PAGINATION,
  SORT_OPTIONS,
  PRICE_RANGES,
  DURATION_RANGES,
  RATING_STARS,
  NOTIFICATION_TYPES,
  LANGUAGES,
  SOCIAL_LINKS,
  CONTACT_INFO,
  VALIDATION_RULES,
  UPLOAD_LIMITS,
  TOAST_DURATION,
};
