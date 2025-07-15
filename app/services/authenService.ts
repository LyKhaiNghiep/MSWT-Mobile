import {ILoginRequest} from '../config/models/auth.model';
import {UserData} from '../config/models/user.model';
import {API_URLS} from '../constants/api-urls';
import {StorageUtil} from '../utils/storage';
import api from './api';

// Authentication Service - Backend xử lý authentication trong USER endpoints
export const authService = {
  // Login with username and password - Sử dụng USER.LOGIN endpoint
  async login(credentials: ILoginRequest) {
    try {
      console.log('🔐 Attempting login with backend API...', credentials);

      const response = await api.post(API_URLS.USER.LOGIN, {
        userName: credentials.username,
        password: credentials.password,
      });

      console.log('✅ Login API Response:', response.data);

      // Log toàn bộ structure để debug
      console.log(
        '🔍 Full response structure:',
        JSON.stringify(response.data, null, 2),
      );

      // Backend trả về token string trực tiếp
      if (response.data && typeof response.data === 'string') {
        const token = response.data;
        console.log('🔑 Received token:', token.substring(0, 50) + '...');

        // Store token
        await StorageUtil.setToken(token);

        // Sau khi có token, gọi API để lấy thông tin user hiện tại
        try {
          console.log('📋 Fetching current user data with token...');

          // Gọi API để lấy thông tin user (có thể là GET /api/User/profile hoặc tương tự)
          // Tạm thời dùng credentials để tạo userData, sau đó sẽ update từ API
          const userData = {
            userId: Date.now().toString(),
            userName: credentials.username,
            fullName: credentials.username,
            email: '',
            phone: '',
            address: '',
            status: 'Hoạt động',
            image: '',
            password: '',
            // Tạm thời set roleId dựa trên username pattern
            roleId: this.guessRoleFromUsername(credentials.username),
            createAt: new Date().toISOString(),
            roleName: this.mapRoleIdToRoleName(
              this.guessRoleFromUsername(credentials.username),
            ),
            description: this.mapRoleIdToDescription(
              this.guessRoleFromUsername(credentials.username),
            ),
            rating: null,
            reasonForLeave: null,
          } as UserData;

          // Map role info
          userData.role = this.mapRoleIdToRoleName(userData.roleId);
          userData.position = this.mapRoleIdToPosition(userData.roleId);

          console.log('✅ Created user data based on username:', userData);
          console.log('🎭 Guessed role:', userData.role);
          console.log('💼 Guessed position:', userData.position);

          await StorageUtil.setUserData(userData);

          return {
            success: true,
            data: {
              token,
              user: userData,
            },
          };
        } catch (userFetchError) {
          console.error(
            '⚠️ Could not fetch user data, using fallback:',
            userFetchError,
          );

          // Fallback với Worker role
          const fallbackUserData = {
            userId: Date.now().toString(),
            userName: credentials.username,
            fullName: credentials.username,
            email: '',
            phone: '',
            address: '',
            status: 'Hoạt động',
            image: '',
            roleId: 'c2a66975-420d-4961-9edd-d5bdff89be58', // Default Worker
            createAt: new Date().toISOString(),
            roleName: 'Worker',
            description: 'Nhân viên vệ sinh',
            rating: null,
            reasonForLeave: null,
            password: '',
            role: 'Worker',
            position: 'Nhân viên vệ sinh',
          };
          await StorageUtil.setUserData(fallbackUserData);

          return {
            success: true,
            data: {
              token,
              user: fallbackUserData,
            },
          };
        }
      }
      // Case hiếm: Backend trả về object với token và user
      else if (response.data && response.data.token && response.data.user) {
        const {token, user} = response.data;

        console.log('🔍 Backend user data:', user);
        console.log('🔍 User object keys:', Object.keys(user));
        console.log('🎭 User roleId from backend:', user.roleId);
        console.log('🎭 User role object from backend:', user.role);

        // Kiểm tra xem có role object nested không
        if (user.role && typeof user.role === 'object') {
          console.log('🔍 Nested role object:', user.role);
          console.log('🔍 Nested role keys:', Object.keys(user.role));
        }

        // Store token
        await StorageUtil.setToken(token);

        // Xử lý user data từ backend response
        const userData = {
          userId: user.userId,
          userName: user.userName,
          fullName: user.fullName,
          email: user.email,
          phone: user.phone,
          address: user.address,
          status: user.status,
          image: user.image,
          roleId: user.roleId, // Lấy roleId từ backend
          createAt: user.createAt || new Date().toISOString(),
          roleName: user.roleName || this.mapRoleIdToRoleName(user.roleId),
          description:
            user.description || this.mapRoleIdToDescription(user.roleId),
          rating: user.rating || null,
          reasonForLeave: user.reasonForLeave || null,
          password: user.password || '',
          role: this.mapRoleIdToRoleName(user.roleId), // Map roleId thành role name
          position: this.mapRoleIdToPosition(user.roleId), // Map roleId thành position
          // Thêm role object nếu có
          roleObject: user.role || null,
        };

        // Map role info
        userData.role = this.mapRoleIdToRoleName(userData.roleId);
        userData.position = this.mapRoleIdToPosition(userData.roleId);

        console.log('✅ Processed user data:', userData);
        console.log('🎭 Final role:', userData.role);
        console.log('💼 Final position:', userData.position);

        await StorageUtil.setUserData(userData);

        return {
          success: true,
          data: {
            token,
            user: userData,
          },
        };
      } else {
        return {
          success: false,
          error: 'Phản hồi từ server không hợp lệ - không có token',
        };
      }
    } catch (error: any) {
      // Handle different error responses
      if (error.response) {
        const status = error.response.status;
        const message =
          error.response.data?.message || error.response.data?.errors?.[0];

        switch (status) {
          case 400:
            return {
              success: false,
              error: message || 'Dữ liệu đăng nhập không hợp lệ',
            };
          case 401:
            return {
              success: false,
              error: message || 'Tài khoản hoặc mật khẩu không đúng',
            };
          case 403:
            return {
              success: false,
              error:
                message || 'Tài khoản bị khóa hoặc không có quyền truy cập',
            };
          case 500:
            return {
              success: false,
              error: message || 'Lỗi hệ thống, vui lòng thử lại sau',
            };
          default:
            return {
              success: false,
              error: message || 'Đăng nhập thất bại',
            };
        }
      } else if (error.request) {
        return {
          success: false,
          error:
            'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.',
        };
      } else {
        return {
          success: false,
          error: 'Đã có lỗi xảy ra trong quá trình đăng nhập',
        };
      }
    }
  },

  // Register new user - Sử dụng USER.REGISTER endpoint
  async register(userData: UserData) {
    try {
      console.log('📝 Attempting registration with backend API...', userData);

      const response = await api.post(API_URLS.USER.REGISTER, {
        userName: userData.userName,
        password: userData.password,
        fullName: userData.fullName,
        email: userData.email,
        phone: userData.phone,
        address: userData.address,
        roleId: userData.roleId || 'c2a66975-420d-4961-9edd-d5bdff89be58', // Default to worker role
      });

      console.log('✅ Registration API Response:', response.data);

      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      console.error('❌ Registration API Error:', error);

      if (error.response) {
        const message =
          error.response.data?.message || error?.response.data?.errors?.[0];
        return {
          success: false,
          error: message || 'Đăng ký thất bại',
        };
      }

      return {
        success: false,
        error: 'Không thể kết nối đến server',
      };
    }
  },

  async logout() {
    try {
      console.log('🚪 Logging out - clearing local storage...');
    } catch (error) {
      console.error('Logout error (non-critical):', error);
    } finally {
      // Always clear local storage
      await StorageUtil.clear();
    }
  },

  // Get current user profile - Có thể sử dụng USER.GET_BY_ID nếu cần
  async getCurrentUser() {
    try {
      const userData = await StorageUtil.getUserData<UserData>();
      if (userData) {
        const user = userData;

        return {
          success: true,
          data: user,
        };
      } else {
        return {
          success: false,
          error: 'Không tìm thấy thông tin người dùng',
        };
      }
    } catch (error) {
      console.error('Get current user error:', error);
      return {
        success: false,
        error: 'Không thể lấy thông tin người dùng',
      };
    }
  },

  // Helper function to map roleId to role name
  mapRoleIdToRoleName(roleId: string) {
    const roleMap: any = {
      '0ecdd2e4-d5dc-48b4-8006-03e6b4868e75': 'Leader', // Quản trị hệ thống
      '5b7a2bcd-9f5e-4f0e-8e47-2a15bcf85e37': 'Manager', // Quản lý cấp cao
      '7dcd71ae-17c3-4e84-bb9f-dd96fa401976': 'Supervisor', // Giám sát viên và sinh
      'c2a66975-420d-4961-9edd-d5bdff89be58': 'Worker', // Nhân viên vệ sinh
    };
    return roleMap[roleId] || 'Worker';
  },

  // Helper function to map roleId to position (Vietnamese)
  mapRoleIdToPosition(roleId: string) {
    const positionMap: any = {
      '0ecdd2e4-d5dc-48b4-8006-03e6b4868e75': 'Quản trị hệ thống',
      '5b7a2bcd-9f5e-4f0e-8e47-2a15bcf85e37': 'Quản lý cấp cao',
      '7dcd71ae-17c3-4e84-bb9f-dd96fa401976': 'Giám sát viên và sinh',
      'c2a66975-420d-4961-9edd-d5bdff89be58': 'Nhân viên vệ sinh',
    };
    return positionMap[roleId] || 'Nhân viên vệ sinh';
  },

  // Helper function to map roleId to description
  mapRoleIdToDescription(roleId: string) {
    const descriptionMap: any = {
      '0ecdd2e4-d5dc-48b4-8006-03e6b4868e75': 'Quản trị hệ thống',
      '5b7a2bcd-9f5e-4f0e-8e47-2a15bcf85e37': 'Quản lý cấp cao',
      '7dcd71ae-17c3-4e84-bb9f-dd96fa401976': 'Giám sát viên và sinh',
      'c2a66975-420d-4961-9edd-d5bdff89be58': 'Nhân viên vệ sinh',
    };
    return descriptionMap[roleId] || 'Nhân viên vệ sinh';
  },

  // Helper function to map position to roleId
  mapPositionToRoleId(position: string) {
    const roleIdMap: any = {
      'Quản trị hệ thống': '0ecdd2e4-d5dc-48b4-8006-03e6b4868e75',
      'Quản lý cấp cao': '5b7a2bcd-9f5e-4f0e-8e47-2a15bcf85e37',
      'Giám sát viên và sinh': '7dcd71ae-17c3-4e84-bb9f-dd96fa401976',
      'Nhân viên vệ sinh': 'c2a66975-420d-4961-9edd-d5bdff89be58',
    };
    return roleIdMap[position] || 'c2a66975-420d-4961-9edd-d5bdff89be58';
  },

  // Check if user is authenticated
  async isAuthenticated() {
    const token = await StorageUtil.getToken();
    const userData = await StorageUtil.getUserData<UserData>();

    if (!token || !userData) {
      return false;
    }

    // Additional check: Only Leaders can access this system
    try {
      const user = userData;
      if (user.role !== 'Leader') {
        console.log('❌ Authentication failed - User is not a Leader');
        // Clear invalid user data
        this.logout();
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return false;
    }
  },

  async getCurrentUserFromStorage() {
    try {
      const userData = await StorageUtil.getUserData<UserData>;
      return userData;
    } catch (error) {
      console.error('Error parsing user data from storage:', error);
      return null;
    }
  },

  // Helper function to guess role based on username pattern
  guessRoleFromUsername(username: string) {
    const lowerUsername = username.toLowerCase();

    // Pattern matching cho role dựa trên username
    if (
      lowerUsername.includes('leader') ||
      lowerUsername.includes('admin') ||
      lowerUsername.includes('system')
    ) {
      return '0ecdd2e4-d5dc-48b4-8006-03e6b4868e75'; // Leader - Quản trị hệ thống
    } else if (
      lowerUsername.includes('manager') ||
      lowerUsername.includes('quanly')
    ) {
      return '5b7a2bcd-9f5e-4f0e-8e47-2a15bcf85e37'; // Manager - Quản lý cấp cao
    } else if (
      lowerUsername.includes('supervisor') ||
      lowerUsername.includes('giamsat')
    ) {
      return '7dcd71ae-17c3-4e84-bb9f-dd96fa401976'; // Supervisor - Giám sát viên
    } else {
      return 'c2a66975-420d-4961-9edd-d5bdff89be58'; // Default Worker - Nhân viên vệ sinh
    }
  },
};

export default authService;
