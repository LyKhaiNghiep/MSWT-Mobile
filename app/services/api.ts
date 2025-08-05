import axios from 'axios';
import {BASE_API_URL} from '../constants/api-urls';
import {StorageUtil} from '../utils/storage';

// Lấy biến môi trường với fallback

const TIMEOUT_MS = 10000;

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
    // Ví dụ: tự động redirect khi 401
    if (err.response?.status === 401) {
      // TODO: go to login page
    }
    return Promise.reject(err.response.data);
  },
);

export default api;
