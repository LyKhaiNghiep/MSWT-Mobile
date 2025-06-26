import api from './axiosConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ApiResponse, User } from '../types';

interface LoginResponse {
  user: User;
  token: string;
}

interface RegisterResponse {
  user: User;
  token: string;
}

export const authApi = {
  // Login user
  login: async (credentials: {
    email: string;
    password: string;
  }): Promise<ApiResponse<LoginResponse>> => {
    const response = await api.post('/auth/login', credentials);

    // Store token in AsyncStorage
    if (response.data.success && response.data.data.token) {
      await AsyncStorage.setItem('authToken', response.data.data.token);
    }

    return response.data;
  },

  // Register user
  register: async (userData: {
    name: string;
    email: string;
    password: string;
  }): Promise<ApiResponse<RegisterResponse>> => {
    const response = await api.post('/auth/register', userData);

    // Store token in AsyncStorage
    if (response.data.success && response.data.data.token) {
      await AsyncStorage.setItem('authToken', response.data.data.token);
    }

    return response.data;
  },

  // Logout user
  logout: async (): Promise<void> => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      // Always remove token from storage
      await AsyncStorage.removeItem('authToken');
    }
  },

  // Refresh token
  refreshToken: async (): Promise<ApiResponse<{ token: string }>> => {
    const response = await api.post('/auth/refresh');

    if (response.data.success && response.data.data.token) {
      await AsyncStorage.setItem('authToken', response.data.data.token);
    }

    return response.data;
  },

  // Verify token
  verifyToken: async (): Promise<ApiResponse<{ user: User }>> => {
    const response = await api.get('/auth/verify');
    return response.data;
  },

  // Forgot password
  forgotPassword: async (
    email: string
  ): Promise<ApiResponse<{ message: string }>> => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  // Reset password
  resetPassword: async (
    token: string,
    password: string
  ): Promise<ApiResponse<{ message: string }>> => {
    const response = await api.post('/auth/reset-password', {
      token,
      password,
    });
    return response.data;
  },
};
