import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';
import { STORAGE_KEYS } from '../config/constants';

/**
 * Authentication Service
 * Handles all authentication-related API calls
 */

class AuthService {
  constructor() {
    this.api = axios.create({
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to include token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Add response interceptor to handle errors
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
          localStorage.removeItem(STORAGE_KEYS.USER_DATA);
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * Login user
   * @param {string} username - User's username
   * @param {string} password - User's password
   * @returns {Promise<{token: string, success: boolean}>}
   */
  async login(username, password) {
    try {
      const response = await this.api.post(API_ENDPOINTS.auth.login, {
        username,
        password,
      });

      // Backend returns: { code: 200, message: "Login successfully", data: { token, success } }
      if (response.data && response.data.data) {
        const { token, success } = response.data.data;
        
        if (success && token) {
          // Store token
          localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
          
          return {
            success: true,
            token,
            message: response.data.message || 'Login successfully',
          };
        }
      }

      return {
        success: false,
        message: 'Login failed',
      };
    } catch (error) {
      console.error('Login error:', error);
      
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.';
      
      return {
        success: false,
        message: errorMessage,
      };
    }
  }

  /**
   * Register new user
   * @param {Object} userData - User registration data
   * @param {string} userData.username - Username
   * @param {string} userData.password - Password
   * @param {string} userData.email - Email address
   * @param {string} userData.role - User role (customer, admin, etc.)
   * @returns {Promise<{success: boolean, message: string}>}
   */
  async register(userData) {
    try {
      const { username, password, email, role } = userData;
      
      const response = await this.api.post(API_ENDPOINTS.auth.register, {
        username,
        password,
        email,
        role: role || 'customer', // Default to customer if not specified
      });

      // Backend returns: { code: 201, message: "Created account successfully" }
      if (response.data) {
        return {
          success: true,
          message: response.data.message || 'Đăng ký thành công',
        };
      }

      return {
        success: false,
        message: 'Đăng ký thất bại',
      };
    } catch (error) {
      console.error('Register error:', error);
      
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          'Đăng ký thất bại. Vui lòng thử lại.';
      
      return {
        success: false,
        message: errorMessage,
      };
    }
  }

  /**
   * Logout user
   * @param {string} token - User's access token
   * @returns {Promise<{success: boolean, message: string}>}
   */
  async logout(token) {
    try {
      const response = await this.api.post(API_ENDPOINTS.auth.logout, {
        token,
      });

      // Backend returns: { code: 200, message: "Logout successfully" }
      if (response.data) {
        // Clear local storage
        localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER_DATA);
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
        
        return {
          success: true,
          message: response.data.message || 'Đăng xuất thành công',
        };
      }

      return {
        success: false,
        message: 'Đăng xuất thất bại',
      };
    } catch (error) {
      console.error('Logout error:', error);
      
      // Even if API call fails, clear local storage
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER_DATA);
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      
      return {
        success: true,
        message: 'Đã đăng xuất',
      };
    }
  }

  /**
   * Get current user token from storage
   * @returns {string|null}
   */
  getToken() {
    return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  }

  /**
   * Check if user is authenticated
   * @returns {boolean}
   */
  isAuthenticated() {
    return !!this.getToken();
  }
}

// Export singleton instance
const authService = new AuthService();
export default authService;
