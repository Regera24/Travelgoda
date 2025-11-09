import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';
import { STORAGE_KEYS } from '../config/constants';

/**
 * Ticket Service
 * Handles all ticket-related API calls for customer support
 */

class TicketService {
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
   * Get all unassigned tickets (status = OPEN)
   * @returns {Promise<{success: boolean, data: Array, message: string}>}
   */
  async getUnassignedTickets() {
    try {
      const response = await this.api.get(API_ENDPOINTS.tickets.unassigned);

      if (response.data && response.data.code === 200) {
        return {
          success: true,
          data: response.data.data || [],
          message: response.data.message || 'Tickets retrieved successfully',
        };
      }

      return {
        success: false,
        data: [],
        message: response.data?.message || 'Failed to retrieve tickets',
      };
    } catch (error) {
      console.error('Get unassigned tickets error:', error);

      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          'Không thể lấy danh sách phiếu hỗ trợ.';

      return {
        success: false,
        data: [],
        message: errorMessage,
      };
    }
  }

  /**
   * Assign a ticket to an agent
   * @param {Object} assignData - {ticketId, agentId}
   * @returns {Promise<{success: boolean, data: Object, message: string}>}
   */
  async assignTicket(assignData) {
    try {
      const response = await this.api.put(API_ENDPOINTS.tickets.assign, assignData);

      if (response.data && response.data.code === 200) {
        return {
          success: true,
          data: response.data.data,
          message: response.data.message || 'Ticket assigned successfully',
        };
      }

      return {
        success: false,
        data: null,
        message: response.data?.message || 'Failed to assign ticket',
      };
    } catch (error) {
      console.error('Assign ticket error:', error);

      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          'Không thể gán phiếu hỗ trợ.';

      return {
        success: false,
        data: null,
        message: errorMessage,
      };
    }
  }

  /**
   * Get tickets assigned to a specific agent
   * @param {number} agentId - Agent ID
   * @returns {Promise<{success: boolean, data: Array, message: string}>}
   */
  async getTicketsByAgent(agentId) {
    try {
      const response = await this.api.get(API_ENDPOINTS.tickets.byAgent(agentId));

      if (response.data && response.data.code === 200) {
        return {
          success: true,
          data: response.data.data || [],
          message: response.data.message || 'Agent tickets retrieved successfully',
        };
      }

      return {
        success: false,
        data: [],
        message: 'Failed to retrieve agent tickets',
      };
    } catch (error) {
      console.error('Get agent tickets error:', error);

      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          'Không thể lấy danh sách phiếu đã gán.';

      return {
        success: false,
        data: [],
        message: errorMessage,
      };
    }
  }

  /**
   * Get a specific ticket by ID
   * @param {number} ticketId - Ticket ID
   * @returns {Promise<{success: boolean, data: Object, message: string}>}
   */
  async getTicketById(ticketId) {
    try {
      const response = await this.api.get(API_ENDPOINTS.tickets.detail(ticketId));

      if (response.data && response.data.code === 200) {
        return {
          success: true,
          data: response.data.data,
          message: response.data.message || 'Ticket retrieved successfully',
        };
      }

      if (response.data && response.data.code === 404) {
        return {
          success: false,
          data: null,
          message: response.data.message || 'Ticket not found',
        };
      }

      return {
        success: false,
        data: null,
        message: 'Failed to retrieve ticket',
      };
    } catch (error) {
      console.error('Get ticket error:', error);

      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          'Không thể lấy thông tin phiếu hỗ trợ.';

      return {
        success: false,
        data: null,
        message: errorMessage,
      };
    }
  }
}

// Export singleton instance
const ticketService = new TicketService();
export default ticketService;
