import { useState, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './useAuth';
import { API_CONFIG } from '../config/api';

export const useApi = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { accessToken } = useAuth();

  // Create axios instance with default config
  const createAxiosInstance = useCallback(() => {
    const instance = axios.create({
      timeout: API_CONFIG.timeout,
      headers: {
        ...API_CONFIG.headers,
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      },
    });

    // Response interceptor for error handling
    instance.interceptors.response.use(
      (response) => response,
      (error) => {
        const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
        return Promise.reject(new Error(errorMessage));
      }
    );

    return instance;
  }, [accessToken]);

  // Generic request function
  const request = useCallback(async (method, url, data = null, config = {}) => {
    setIsLoading(true);
    setError(null);

    try {
      const axiosInstance = createAxiosInstance();
      const response = await axiosInstance({
        method,
        url,
        data,
        ...config,
      });

      return { data: response.data, error: null };
    } catch (err) {
      const errorObj = { message: err.message, status: err.response?.status };
      setError(errorObj);
      return { data: null, error: errorObj };
    } finally {
      setIsLoading(false);
    }
  }, [createAxiosInstance]);

  // GET request
  const get = useCallback((url, config = {}) => {
    return request('GET', url, null, config);
  }, [request]);

  // POST request
  const post = useCallback((url, data, config = {}) => {
    return request('POST', url, data, config);
  }, [request]);

  // PUT request
  const put = useCallback((url, data, config = {}) => {
    return request('PUT', url, data, config);
  }, [request]);

  // PATCH request
  const patch = useCallback((url, data, config = {}) => {
    return request('PATCH', url, data, config);
  }, [request]);

  // DELETE request
  const deleteRequest = useCallback((url, config = {}) => {
    return request('DELETE', url, null, config);
  }, [request]);

  return {
    isLoading,
    error,
    get,
    post,
    put,
    patch,
    delete: deleteRequest,
    request,
  };
};

export default useApi;
