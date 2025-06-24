import axios, { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

// Configuration for logging - can be controlled via environment or browser console
let ENABLE_REQUEST_LOGGING = import.meta.env.VITE_ENABLE_API_LOGGING === 'true' || false;

// Add global function to toggle logging from browser console
if (typeof window !== 'undefined') {
  (window as any).toggleApiLogging = (enable?: boolean) => {
    ENABLE_REQUEST_LOGGING = enable !== undefined ? enable : !ENABLE_REQUEST_LOGGING;
    console.log(`🔧 API Request Logging ${ENABLE_REQUEST_LOGGING ? 'ENABLED' : 'DISABLED'}`);
    console.log('💡 Use toggleApiLogging() to toggle or toggleApiLogging(true/false) to set explicitly');
    return ENABLE_REQUEST_LOGGING;
  };
  
  // Log the current state and how to control it
  if (import.meta.env.DEV) {
    console.log(`🔧 API Request Logging is currently ${ENABLE_REQUEST_LOGGING ? 'ENABLED' : 'DISABLED'}`);
    console.log('💡 Use toggleApiLogging() in console to toggle logging');
  }
}

// Base API configuration
const API_BASE_URL = 'http://16.171.135.133/api';

// Create Axios instance with default config
const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    // Get token from local storage if it exists
    const token = localStorage.getItem('auth_token');

    // If token exists, add it to the headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (ENABLE_REQUEST_LOGGING && import.meta.env.DEV) {
      console.log('🚀 API Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        baseURL: config.baseURL,
        data: config.data,
        params: config.params,
      });
    }

    return config;
  },
  (error: AxiosError) => {
    if (ENABLE_REQUEST_LOGGING && import.meta.env.DEV) {
      console.error('❌ Request Error:', error);
    }
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    if (ENABLE_REQUEST_LOGGING && import.meta.env.DEV) {
      console.log('✅ API Response:', {
        status: response.status,
        statusText: response.statusText,
        url: response.config.url,
        data: response.data,
      });
    }
    return response;
  },
  (error: AxiosError) => {
    if (ENABLE_REQUEST_LOGGING && import.meta.env.DEV) {
      console.error('❌ Response Error:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        url: error.config?.url,
        message: error.message,
        data: error.response?.data,
      });
    }
    // Handle common error responses
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Handle unauthorized (token expired/invalid)
          console.error('Unauthorized - please login again');
          break;
        case 403:
          // Handle forbidden
          console.error('Forbidden - insufficient permissions');
          break;
        case 404:
          // Handle not found
          console.error('Resource not found');
          break;
        case 500:
          // Handle server error
          console.error('Server error - please try again later');
          break;
        default:
          console.error('Request failed with status:', error.response.status);
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received from server');
    } else {
      // Something happened in setting up the request
      console.error('Request setup error:', error.message);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
