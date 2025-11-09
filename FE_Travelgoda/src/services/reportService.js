import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';
import { STORAGE_KEYS } from '../config/constants';

/**
 * Report Service
 * Handles all financial report-related API calls
 */

class ReportService {
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
          localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
          localStorage.removeItem(STORAGE_KEYS.USER_DATA);
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * Generate a new financial report
   * @param {Object} reportData - Report generation parameters
   * @returns {Promise<{success: boolean, data: Object, message: string}>}
   */
  async generateReport(reportData) {
    try {
      const response = await this.api.post(API_ENDPOINTS.reports.generate, reportData);

      if (response.data && response.data.code === 200) {
        return {
          success: true,
          data: response.data.data,
          message: response.data.message || 'Report generated successfully',
        };
      }

      return {
        success: false,
        data: null,
        message: response.data?.message || 'Failed to generate report',
      };
    } catch (error) {
      console.error('Generate report error:', error);

      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          'Không thể tạo báo cáo. Vui lòng thử lại.';

      return {
        success: false,
        data: null,
        message: errorMessage,
      };
    }
  }

  /**
   * Get all reports for a specific user
   * @param {number} userId - User ID
   * @returns {Promise<{success: boolean, data: Array, message: string}>}
   */
  async getReportsByUser(userId) {
    try {
      const response = await this.api.get(API_ENDPOINTS.reports.byUser(userId));

      if (response.data && response.data.code === 200) {
        return {
          success: true,
          data: response.data.data || [],
          message: response.data.message || 'Reports retrieved successfully',
        };
      }

      return {
        success: false,
        data: [],
        message: 'Failed to retrieve reports',
      };
    } catch (error) {
      console.error('Get reports error:', error);

      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          'Không thể lấy danh sách báo cáo.';

      return {
        success: false,
        data: [],
        message: errorMessage,
      };
    }
  }

  /**
   * Get a specific report by ID
   * @param {number} reportId - Report ID
   * @returns {Promise<{success: boolean, data: Object, message: string}>}
   */
  async getReportById(reportId) {
    try {
      const response = await this.api.get(API_ENDPOINTS.reports.detail(reportId));

      if (response.data && response.data.code === 200) {
        return {
          success: true,
          data: response.data.data,
          message: response.data.message || 'Report retrieved successfully',
        };
      }

      if (response.data && response.data.code === 404) {
        return {
          success: false,
          data: null,
          message: response.data.message || 'Report not found',
        };
      }

      return {
        success: false,
        data: null,
        message: 'Failed to retrieve report',
      };
    } catch (error) {
      console.error('Get report error:', error);

      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          'Không thể lấy thông tin báo cáo.';

      return {
        success: false,
        data: null,
        message: errorMessage,
      };
    }
  }
}

// Export singleton instance
const reportService = new ReportService();
export default reportService;
