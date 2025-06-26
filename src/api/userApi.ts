import api from './axiosConfig';
import { ApiResponse, User } from '../types';

export const userApi = {
  // Get user profile
  getProfile: async (userId: string): Promise<ApiResponse<User>> => {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  },

  // Get current user profile
  getCurrentProfile: async (): Promise<ApiResponse<User>> => {
    const response = await api.get('/users/me');
    return response.data;
  },

  // Update user profile
  updateProfile: async (
    userData: Partial<User>
  ): Promise<ApiResponse<User>> => {
    const response = await api.put('/users/me', userData);
    return response.data;
  },

  // Get all users (admin/public list)
  getUsers: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<ApiResponse<User[]>> => {
    const response = await api.get('/users', { params });
    return response.data;
  },

  // Delete user (admin only)
  deleteUser: async (
    userId: string
  ): Promise<ApiResponse<{ message: string }>> => {
    const response = await api.delete(`/users/${userId}`);
    return response.data;
  },

  // Upload avatar
  uploadAvatar: async (
    imageFile: any
  ): Promise<ApiResponse<{ avatar: string }>> => {
    const response = await api.post('/users/avatar', imageFile, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Change password
  changePassword: async (passwords: {
    currentPassword: string;
    newPassword: string;
  }): Promise<ApiResponse<{ message: string }>> => {
    const response = await api.post('/users/change-password', passwords);
    return response.data;
  },

  // Update user settings
  updateSettings: async (settings: {
    notifications?: boolean;
    theme?: 'light' | 'dark';
    language?: string;
  }): Promise<ApiResponse<{ message: string }>> => {
    const response = await api.put('/users/settings', settings);
    return response.data;
  },
};
