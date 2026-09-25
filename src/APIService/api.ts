import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import STORAGE_KEYS from '../Utilities/Constants';
import { resetAndNavigate } from '../Utilities/Helpers';
import { getLocalStorageData } from '../Utilities/Storage';
import { API_URL } from '@env';

type ApiResponse<T> = {
  data: T;
  message: string;
  success: boolean;
};

// Create the Axios instance
const api = axios.create({
  baseURL: API_URL,
  // baseURL: 'https://regular-passion-snagged.ngrok-free.dev/',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json', // Default content-type for JSON requests
  },
});

// Request interceptor to add auth token dynamically
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await getLocalStorageData(STORAGE_KEYS.token); // Fetch token from AsyncStorage
      const referralCode = await getLocalStorageData(
        STORAGE_KEYS.referralToken,
      ); // Fetch referral token from AsyncStorage

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        console.warn('No token found in storage'); // Debug log for missing token
      }
      if (referralCode) {
        config.headers['x-referral-code'] = referralCode;
      } else {
        console.warn('No referral code found in storage'); // Debug log for missing referral code
      }
      return config;
    } catch (error) {
      console.error('Error fetching token or referral code:', error); // Log errors during token/referral fetch
      return config; // Proceed with request even if token/referral fetch fails
    }
  },
  (error) => {
    console.error('Request Interceptor Error:', error);
    return Promise.reject(error);
  },
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data.message;

      console.error('API Error:', error.response.data);

      if (status === 401 && message === 'Unauthorized') {
        console.warn('Unauthorized (  401). Clearing auth data.');
        await AsyncStorage.clear();
        resetAndNavigate('authStack');
      }

      return Promise.reject({
        ...error.response.data,
        status,
      });
    } else {
      // Handle network or unexpected errors
      console.error('Network/Unexpected Error:', error.message);
      return Promise.reject({
        success: false,
        message: 'Something went wrong',
      });
    }
  },
);

// API methods with optional headers
export const fetchData = <T>(
  endpoint: string,
  params?: any,
  headers?: Record<string, string>,
) => api.get<ApiResponse<T>>(endpoint, { params, headers });

export const postData = <T>(
  endpoint: string,
  data?: any,
  headers?: Record<string, string>,
) =>
  api.post<ApiResponse<T>>(endpoint, data, {
    headers: { ...headers, 'Content-Type': 'application/json' },
  });

export const postFormData = <T>(
  endpoint: string,
  data: FormData,
  headers?: Record<string, string>,
) =>
  api.post<ApiResponse<T>>(endpoint, data, {
    headers: { ...headers, 'Content-Type': 'multipart/form-data' },
  });

export const patchData = <T>(
  endpoint: string,
  data?: any,
  headers?: Record<string, string>,
) => api.patch<ApiResponse<T>>(endpoint, data, { headers });

export const patchFormData = <T>(
  endpoint: string,
  data: FormData,
  headers?: Record<string, string>,
) =>
  api.patch<ApiResponse<T>>(endpoint, data, {
    headers: { ...headers, 'Content-Type': 'multipart/form-data' },
  });

export const putData = <T>(
  endpoint: string,
  data?: any,
  headers?: Record<string, string>,
) => api.put<ApiResponse<T>>(endpoint, data, { headers });

export const putFormData = <T>(
  endpoint: string,
  data: FormData,
  headers?: Record<string, string>,
) =>
  api.put<ApiResponse<T>>(endpoint, data, {
    headers: { ...headers, 'Content-Type': 'multipart/form-data' },
  });

export const deleteData = <T>(endpoint: string) =>
  api.delete<ApiResponse<T>>(endpoint);

export default api;
