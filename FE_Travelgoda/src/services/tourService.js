import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';
import { STORAGE_KEYS } from '../config/constants';

/**
 * Tour Service
 * Handles all tour-related API calls
 */

class TourService {
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
   * Get tour information for tour guide
   * @param {number} tourId - Tour ID
   * @param {number} guideId - Tour Guide ID
   * @returns {Promise<{success: boolean, data: Object, message: string}>}
   */
  async getTourInfoForGuide(tourId, guideId) {
    try {
      const response = await this.api.get(API_ENDPOINTS.tours.guideInfo(tourId, guideId));

      // Backend returns: { code: 200, message: "...", data: {...} }
      if (response.data && response.data.code === 200) {
        return {
          success: true,
          data: response.data.data,
          message: response.data.message || 'Get tour information successfully',
        };
      }

      // If code is 404 (not found)
      if (response.data && response.data.code === 404) {
        return {
          success: false,
          data: null,
          message: response.data.message || 'Tour not found',
        };
      }

      return {
        success: false,
        data: null,
        message: 'Failed to get tour information',
      };
    } catch (error) {
      console.error('Get tour info error:', error);

      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          'Không thể lấy thông tin tour. Vui lòng thử lại.';

      return {
        success: false,
        data: null,
        message: errorMessage,
      };
    }
  }

  /**
   * Get all tours assigned to a tour guide
   * @param {number} guideId - Tour Guide ID
   * @returns {Promise<{success: boolean, data: Array, message: string}>}
   */
  async getToursForGuide(guideId) {
    try {
      const response = await this.api.get(API_ENDPOINTS.tours.guideList(guideId));

      // Backend returns: { code: 200, message: "...", data: [...] }
      if (response.data && response.data.code === 200) {
        return {
          success: true,
          data: response.data.data || [],
          message: response.data.message || 'Get tours successfully',
        };
      }

      return {
        success: false,
        data: [],
        message: 'Failed to get tours',
      };
    } catch (error) {
      console.error('Get tours error:', error);

      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          'Không thể lấy danh sách tour. Vui lòng thử lại.';

      return {
        success: false,
        data: [],
        message: errorMessage,
      };
    }
  }

  /**
   * Get all tours (public)
   * @returns {Promise<{success: boolean, data: Array, message: string}>}
   */
  async getAllTours() {
    try {
      const response = await this.api.get(API_ENDPOINTS.tours.list);

      if (response.data && response.data.code === 200) {
        return {
          success: true,
          data: response.data.data || [],
          message: response.data.message || 'Get tours successfully',
        };
      }

      return {
        success: false,
        data: [],
        message: 'Failed to get tours',
      };
    } catch (error) {
      console.error('Get all tours error:', error);

      return {
        success: false,
        data: [],
        message: 'Không thể lấy danh sách tour.',
      };
    }
  }

  /**
   * Get tour details (public)
   * @param {number} tourId - Tour ID
   * @returns {Promise<{success: boolean, data: Object, message: string}>}
   */
  async getTourDetails(tourId) {
    try {
      const response = await this.api.get(API_ENDPOINTS.tours.detail(tourId));

      if (response.data && response.data.code === 200) {
        return {
          success: true,
          data: response.data.data,
          message: response.data.message || 'Get tour details successfully',
        };
      }

      return {
        success: false,
        data: null,
        message: 'Failed to get tour details',
      };
    } catch (error) {
      console.error('Get tour details error:', error);

      return {
        success: false,
        data: null,
        message: 'Không thể lấy thông tin tour.',
      };
    }
  }
}

// Export singleton instance
const tourService = new TourService();
export default tourService;
