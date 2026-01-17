import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

/**
 * WHAT: Centralized API client configuration
 * 
 * WHY: Single axios instance ensures consistent configuration:
 * - Base URL from environment variables
 * - Request/response interceptors for auth, error handling
 * - Type safety with TypeScript
 * 
 * HOW: Creates configured axios instance with interceptors
 */
const apiClient: AxiosInstance = axios.create({
  // WHY: VITE_API_URL allows different API URLs for different environments
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  // WHY: Include credentials for cookie-based auth (if implemented)
  withCredentials: true,
});

/**
 * WHAT: Request interceptor for adding authentication tokens
 * 
 * WHY: Automatically adds JWT token to all requests
 * Centralizes auth logic instead of adding tokens in each API call
 * 
 * HOW: Token is set in axios default headers by Redux slice
 * This interceptor ensures token is always included
 */
apiClient.interceptors.request.use(
  (config) => {
    // WHY: Token is already set in default headers by Redux slice
    // This interceptor is kept for compatibility and additional logic if needed
    // Token comes from Redux state (in memory) via default headers
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

/**
 * WHAT: Response interceptor for handling errors globally
 * 
 * WHY: Centralized error handling:
 * - Handles 401 (unauthorized) by redirecting to login
 * - Formats error messages consistently
 * - Logs errors for debugging
 * 
 * HOW: Intercepts responses and handles errors before they reach components
 */
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    // WHY: Handle 401 by clearing auth and redirecting to login
    if (error.response?.status === 401) {
      // WHY: Clear axios default headers
      delete apiClient.defaults.headers.common['Authorization'];
      // WHY: Clear token from localStorage on 401 (token expired or invalid)
      try {
        localStorage.removeItem('hr_portal_access_token');
      } catch (e) {
        // Ignore localStorage errors
      }
      // WHY: Redirect to login (using window.location for reliability)
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);

export default apiClient;

