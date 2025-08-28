import axios from 'axios';
import {BASE_API_URL} from '../constants/api-urls';
import {StorageUtil} from '../utils/storage';

// Lấy biến môi trường với fallback

const TIMEOUT_MS = 60000; // Increased to 60 seconds for large responses

// Debug log
console.log('🔗 API Base URL:', BASE_API_URL);

const api = axios.create({
  baseURL: BASE_API_URL,
  timeout: TIMEOUT_MS,
  headers: {'Content-Type': 'application/json'},
});

// Thêm interceptor request (nếu cần token)
api.interceptors.request.use(async config => {
  const token = await StorageUtil.getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Thêm interceptor response (bắt lỗi chung)
api.interceptors.response.use(
  res => res,
  err => {
    // Log error for debugging
    console.log('🔍 API Error Interceptor:', {
      status: err.response?.status,
      data: err.response?.data,
      url: err.config?.url,
    });

    // Ví dụ: tự động redirect khi 401 (but not for login endpoint)
    if (err.response?.status === 401 && !err.config?.url?.includes('/login')) {
      // TODO: go to login page for other endpoints
    }

    // Return the full error object so authService can access response.status and response.data
    return Promise.reject(err);
  },
);

export default api;
