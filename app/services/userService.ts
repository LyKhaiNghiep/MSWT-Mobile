import api from './api';
import {API_URLS, BASE_API_URL} from '../constants/api-urls';

// User Service for API interactions
export const userService = {
  // Get all users
  async getAllUsers(params: any = {}): Promise<any> {
    try {
      // Prepare query parameters
      const queryParams = new URLSearchParams();

      // Add roleId to query params if provided
      if (params.roleId && params.roleId !== 'all') {
        queryParams.append('roleId', params.roleId);
      }

      // Add search term if provided
      if (params.search) {
        queryParams.append('search', params.search);
      }

      // Build the URL with query parameters
      const url = `${API_URLS.USER.GET_ALL}${
        queryParams.toString() ? `?${queryParams.toString()}` : ''
      }`;
      console.log('🔍 Calling API with URL:', url);

      const response = await api.get(url);
      console.log('🔍 Raw API Response:', response.data);

      // Handle .NET API response format
      let users = response.data;

      // If data has $values property (from .NET API), extract the actual array
      if (users && users.$values) {
        users = users.$values;
      }

      // Validate that users is an array
      if (!Array.isArray(users)) {
        console.error('❌ API response is not an array:', users);
        console.error('❌ Type:', typeof users);
        return []; // Return empty array instead of throwing error
      }

      console.log('📋 Users array length:', users.length);

      // Map API fields to frontend expected format
      const mappedUsers = users
        .map((user, index) => {
          try {
            return {
              userId: user.userId || `temp-${index}`,
              userName: user.userName || 'unknown',
              fullName: user.fullName || user.userName || 'Unknown User',
              email: user.email || '',
              phone: user.phone || '',
              address: user.address || 'Chưa cập nhật',
              status: user.status || 'Hoạt động',
              image:
                user.image ||
                'https://i.pinimg.com/736x/65/d6/c4/65d6c4b0cc9e85a631cf2905a881b7f0.jpg',
              createAt: user.createAt || new Date().toISOString(),
              roleId: user.roleId,
              roleName: user.roleName || this.mapRoleIdToRoleName(user.roleId),
              description:
                user.description || this.mapRoleIdToDescription(user.roleId),
              rating: user.rating || null,
              reasonForLeave: user.reasonForLeave || null,
              // Keep these for backward compatibility
              id: user.userId || `temp-${index}`,
              name: user.fullName || user.userName || 'Unknown User',
              username: user.userName || 'unknown',
              avatar:
                user.image ||
                'https://i.pinimg.com/736x/65/d6/c4/65d6c4b0cc9e85a631cf2905a881b7f0.jpg',
              createdDate: user.createAt
                ? user.createAt.split('T')[0]
                : new Date().toISOString().split('T')[0],
              position: this.mapRoleToPosition(user.roleId),
              location: 'Chưa cập nhật',
              floor: 'Chưa cập nhật',
              role: {
                roleId: user.roleId,
                roleName:
                  user.roleName || this.mapRoleIdToRoleName(user.roleId),
                description:
                  user.description || this.mapRoleIdToDescription(user.roleId),
              },
            };
          } catch (err) {
            console.error(
              `❌ Error mapping user at index ${index}:`,
              user,
              err,
            );
            return null;
          }
        })
        .filter(user => user !== null); // Remove any failed mappings

      console.log('✅ Mapped users successfully:', mappedUsers.length);
      return mappedUsers;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  // Helper function to map roleId to position
  mapRoleToPosition(roleId: string) {
    const roleMap: {[key: string]: string} = {
      RL01: 'Quản lý',
      RL02: 'Quản trị hệ thống',
      RL03: 'Giám sát viên vệ sinh',
      RL04: 'Nhân viên vệ sinh',
    };
    return roleMap[roleId] || 'Nhân viên vệ sinh';
  },

  // Helper function to map roleId to role name
  mapRoleIdToRoleName(roleId: string) {
    const roleMap: {[key: string]: string} = {
      RL01: 'Manager',
      RL02: 'Leader',
      RL03: 'Supervisor',
      RL04: 'Worker',
    };
    return roleMap[roleId] || 'Worker';
  },

  // Helper function to map roleId to description
  mapRoleIdToDescription(roleId: string) {
    const roleMap: {[key: string]: string} = {
      RL01: 'Quản lý cấp cao',
      RL02: 'Quản trị hệ thống',
      RL03: 'Giám sát viên vệ sinh',
      RL04: 'Nhân viên vệ sinh',
    };
    return roleMap[roleId] || 'Nhân viên vệ sinh';
  },

  // Get user by ID
  async getUserById(id) {
    try {
      const response = await api.get(API_URLS.USER.GET_BY_ID(id));
      return response.data;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  },

  // Create new user
  async createUser(userData) {
    try {
      // Map frontend data to API expected format
      const apiUserData = {
        userName: userData.username,
        password: userData.password,
        fullName: userData.name,
        email: userData.email,
        phone: userData.phone,
        address: userData.address,
        status: userData.status || 'Hoạt động',
        image: userData.avatar,
        roleId: this.mapPositionToRoleId(userData.position),
      };

      const response = await api.post(API_URLS.USER.CREATE, apiUserData);

      // Map response back to frontend format
      const createdUser = response.data;
      return {
        id: createdUser.userId,
        name: createdUser.fullName || createdUser.userName,
        username: createdUser.userName,
        email: createdUser.email,
        phone: createdUser.phone,
        address: createdUser.address || 'Chưa cập nhật',
        status: createdUser.status || 'Hoạt động',
        avatar: createdUser.image || userData.avatar,
        createdDate: createdUser.createAt
          ? createdUser.createAt.split('T')[0]
          : new Date().toISOString().split('T')[0],
        position: this.mapRoleToPosition(createdUser.roleId),
        location: 'Chưa cập nhật',
        floor: 'Chưa cập nhật',
      };
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  // Helper function to map position to roleId
  mapPositionToRoleId(position: string) {
    const positionMap: {[key: string]: string} = {
      'Nhân viên vệ sinh': 'RL04',
      'Giám sát viên vệ sinh': 'RL03',
      'Quản lý cấp cao': 'RL01',
      'Quản trị hệ thống': 'RL02',
    };
    return positionMap[position] || 'RL04'; // Default to worker
  },

  // Update user
  async updateUser(id, userData) {
    try {
      const response = await api.put(API_URLS.USER.UPDATE(id), userData);
      return response.data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  // Update user status using specific API endpoint
  async updateUserStatus(id, statusData) {
    try {
      const endpoint = API_URLS.USER.UPDATE_STATUS(id);
      console.log('🚀 API Request Details:');
      console.log('📍 Endpoint:', endpoint);
      console.log('📦 Request Data:', statusData);
      console.log('🔗 Full URL:', `${BASE_API_URL}/${endpoint}`);

      const response = await api.put(endpoint, statusData);
      console.log('✅ API Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error updating user status:', error);
      console.error('❌ Error Response:', error.response?.data);
      console.error('❌ Error Status:', error.response?.status);
      console.error('❌ Error Headers:', error.response?.headers);
      throw error;
    }
  },

  // Delete user
  async deleteUser(id) {
    try {
      const response = await api.delete(API_URLS.USER.DELETE(id));
      return response.data;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },

  // Search users
  async searchUsers(searchParams) {
    try {
      // Add roleId to query params if provided
      const apiParams = {...searchParams};

      const response = await api.get(API_URLS.USER.GET_ALL, {
        params: apiParams,
      });

      console.log('🔍 Search API Response:', response.data);

      // Handle .NET API response format
      let users = response.data;

      // If data has $values property (from .NET API), extract the actual array
      if (users && users.$values) {
        users = users.$values;
      }

      // Validate that users is an array
      if (!Array.isArray(users)) {
        console.error('❌ Search API response is not an array:', users);
        console.error('❌ Type:', typeof users);
        return []; // Return empty array instead of throwing error
      }

      console.log('🔍 Search Users array length:', users.length);

      // Map API fields to frontend expected format
      const mappedUsers = users.map(user => ({
        id: user.userId,
        name: user.fullName || user.userName,
        username: user.userName,
        email: user.email,
        phone: user.phone,
        address: user.address || 'Chưa cập nhật',
        status: user.status || 'Hoạt động',
        avatar:
          user.image ||
          'https://i.pinimg.com/736x/65/d6/c4/65d6c4b0cc9e85a631cf2905a881b7f0.jpg',
        createdDate: user.createAt
          ? user.createAt.split('T')[0]
          : new Date().toISOString().split('T')[0],
        roleId: user.roleId, // Add roleId to the mapped user
        position: this.mapRoleToPosition(user.roleId),
        location: 'Chưa cập nhật',
        floor: 'Chưa cập nhật',
      }));

      return mappedUsers;
    } catch (error) {
      console.error('Error searching users:', error);
      throw error;
    }
  },
};

export default userService;
