import {ILoginRequest} from '../config/models/auth.model';
import {UserData} from '../config/models/user.model';
import {API_URLS} from '../constants/api-urls';
import {StorageUtil} from '../utils/storage';
import api from './api';
import {jwtDecode} from 'jwt-decode';

// JWT payload interface based on the screenshot
interface JWTPayload {
  sub: string;
  jti: string;
  User_Id: string;
  Username: string;
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role': string;
  exp: number;
  iss: string;
  aud: string;
}

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

      // Backend trả về JWT token string
      if (response.data && typeof response.data === 'string') {
        const token = response.data;
        console.log('🔑 Received JWT token:', token.substring(0, 50) + '...');

        try {
          // Decode JWT token to get user information
          const decodedToken = jwtDecode<JWTPayload>(token);
          console.log('🔓 Decoded JWT payload:', decodedToken);

          const userId = decodedToken.User_Id;
          const username = decodedToken.Username;
          const role =
            decodedToken[
              'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
            ];

          console.log('📋 Extracted from JWT:', {
            userId,
            username,
            role,
            exp: new Date(decodedToken.exp * 1000),
          });

          // Store token first
          await StorageUtil.setToken(token);

          // Fetch full user data using userId from JWT
          console.log('📋 Fetching user data with userId:', userId);
          const userResponse = await api.get(API_URLS.USER.GET_BY_ID(userId));

          console.log('✅ User data API response:', userResponse.data);

          if (userResponse.data) {
            const user = userResponse.data;

            // Process the user data from API response
            const userData = {
              userId: user.userId,
              userName: user.userName,
              fullName: user.fullName,
              email: user.email,
              phone: user.phone,
              address: user.address,
              status: user.status,
              image: user.image,
              roleId: user.roleId,
              createAt: user.createAt || new Date().toISOString(),
              roleName: user.roleName || this.mapRoleIdToRoleName(user.roleId),
              description:
                user.description || this.mapRoleIdToDescription(user.roleId),
              rating: user.rating || null,
              reasonForLeave: user.reasonForLeave || null,
              password: user.password || '',
              role: user.roleName || this.mapRoleIdToRoleName(user.roleId),
              position: this.mapRoleIdToPosition(user.roleId),
            } as UserData;

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
            throw new Error('No user data returned from API');
          }
        } catch (jwtError) {
          console.error('❌ JWT decoding or user fetching error:', jwtError);

          // Fallback: create basic user data from JWT if API call fails
          try {
            const decodedToken = jwtDecode<JWTPayload>(token);
            const userId = decodedToken.User_Id;
            const username = decodedToken.Username;
            const jwtRole =
              decodedToken[
                'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
              ];

            const fallbackUserData = {
              userId: userId,
              userName: username,
              fullName: username,
              email: '',
              phone: '',
              address: '',
              status: 'Hoạt động',
              image: '',
              roleId: this.mapRoleNameToRoleId(jwtRole),
              createAt: new Date().toISOString(),
              roleName: jwtRole,
              description: this.mapRoleNameToDescription(jwtRole),
              rating: null,
              reasonForLeave: null,
              password: '',
              role: jwtRole,
              position: this.mapRoleNameToPosition(jwtRole),
            } as UserData;

            console.log(
              '⚠️ Using fallback user data from JWT:',
              fallbackUserData,
            );
            await StorageUtil.setUserData(fallbackUserData);

            return {
              success: true,
              data: {
                token,
                user: fallbackUserData,
              },
            };
          } catch (fallbackError) {
            console.error('❌ Fallback also failed:', fallbackError);
            return {
              success: false,
              error: 'Không thể xử lý thông tin đăng nhập',
            };
          }
        }
      }
      // Legacy case: Backend trả về user object trực tiếp
      else if (
        response.data &&
        typeof response.data === 'object' &&
        response.data.userId
      ) {
        const user = response.data;

        console.log('🔍 Backend user data (legacy):', user);

        // Generate a token for storage (you might want to get this from headers or another endpoint)
        const token = `user_token_${user.userId}_${Date.now()}`;

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
          roleId: user.roleId,
          createAt: user.createAt || new Date().toISOString(),
          roleName: user.roleName || this.mapRoleIdToRoleName(user.roleId),
          description:
            user.description || this.mapRoleIdToDescription(user.roleId),
          rating: user.rating || null,
          reasonForLeave: user.reasonForLeave || null,
          password: user.password || '',
          role: user.roleName || this.mapRoleIdToRoleName(user.roleId),
          position: this.mapRoleIdToPosition(user.roleId),
        } as UserData;

        console.log('✅ Processed user data (legacy):', userData);

        await StorageUtil.setUserData(userData);

        return {
          success: true,
          data: {
            token,
            user: userData,
          },
        };
      }
      // Legacy case: Backend trả về object với token và user
      else if (response.data && response.data.token && response.data.user) {
        const {token, user} = response.data;

        console.log('🔍 Backend user data (legacy token+user):', user);

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
          roleId: user.roleId,
          createAt: user.createAt || new Date().toISOString(),
          roleName: user.roleName || this.mapRoleIdToRoleName(user.roleId),
          description:
            user.description || this.mapRoleIdToDescription(user.roleId),
          rating: user.rating || null,
          reasonForLeave: user.reasonForLeave || null,
          password: user.password || '',
          role: user.roleName || this.mapRoleIdToRoleName(user.roleId),
          position: this.mapRoleIdToPosition(user.roleId),
        };

        console.log('✅ Processed user data (legacy token+user):', userData);

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
          error:
            'Phản hồi từ server không hợp lệ - không có dữ liệu người dùng',
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

  // Helper function to map role name to roleId
  mapRoleNameToRoleId(roleName: string) {
    const roleIdMap: any = {
      Leader: '0ecdd2e4-d5dc-48b4-8006-03e6b4868e75',
      Manager: '5b7a2bcd-9f5e-4f0e-8e47-2a15bcf85e37',
      Supervisor: '7dcd71ae-17c3-4e84-bb9f-dd96fa401976',
      Worker: 'c2a66975-420d-4961-9edd-d5bdff89be58',
    };
    return roleIdMap[roleName] || 'c2a66975-420d-4961-9edd-d5bdff89be58';
  },

  // Helper function to map role name to description
  mapRoleNameToDescription(roleName: string) {
    const descriptionMap: any = {
      Leader: 'Quản trị hệ thống',
      Manager: 'Quản lý cấp cao',
      Supervisor: 'Giám sát viên và sinh',
      Worker: 'Nhân viên vệ sinh',
    };
    return descriptionMap[roleName] || 'Nhân viên vệ sinh';
  },

  // Helper function to map role name to position
  mapRoleNameToPosition(roleName: string) {
    const positionMap: any = {
      Leader: 'Quản trị hệ thống',
      Manager: 'Quản lý cấp cao',
      Supervisor: 'Giám sát viên và sinh',
      Worker: 'Nhân viên vệ sinh',
    };
    return positionMap[roleName] || 'Nhân viên vệ sinh';
  },
};

export default authService;
