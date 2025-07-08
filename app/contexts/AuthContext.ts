import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import authService from '../services/authenService';
import {UserData} from '../config/models/user.model';
import {ILoginRequest} from '../config/models/auth.model';
import {StorageUtil} from '../utils/storage';
import {IResponse, IResponseWithData} from '../config/types';

export interface AuthContextType {
  isAuthenticated: boolean;
  user: UserData | null;
  login: (
    request: ILoginRequest,
  ) => Promise<IResponse | IResponseWithData<UserData>>;
  logout: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  login: async () =>
    Promise.resolve({success: false, error: 'Not implemented'}),
  logout: async () => {},
  loading: false,
  error: null,
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({children}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  // Check authentication status on app load
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = await StorageUtil.getToken();
        const userData = await StorageUtil.getUserData<UserData>();

        if (token && userData) {
          // Parse stored user data
          const storedUser = userData;
          setIsAuthenticated(true);
          setUser(storedUser);

          console.log('✅ Auth initialized from storage:', storedUser);
          console.log('🎭 User role:', storedUser?.role);
          console.log('💼 User position:', storedUser?.position);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        // Clear any corrupted data
        await StorageUtil.remove('accessToken');
        await StorageUtil.remove('userData');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Login function using backend API
  const login = async (
    request: ILoginRequest,
  ): Promise<IResponse | IResponseWithData<UserData>> => {
    try {
      const {username, password} = request;
      console.log('🔐 AuthContext: Starting login process...');
      setLoading(true);

      const result = await authService.login({username, password});

      console.log('🔍 AuthContext: AuthService result:', result);

      if (result.success) {
        const userData = result.data!.user as UserData;

        console.log('✅ AuthContext: Setting authentication state...');
        setIsAuthenticated(true);
        setUser(userData as UserData);

        console.log('✅ AuthContext: User logged in successfully:', userData);
        console.log('🎭 AuthContext: User role:', userData.role);
        console.log('💼 AuthContext: User position:', userData.position);
        console.log('🔐 AuthContext: Authentication state updated:', {
          isAuthenticated: true,
        });

        return {success: true, data: userData};
      } else {
        console.log('❌ AuthContext: Login failed:', result.error);
        return {
          success: false,
          error: result.error,
        };
      }
    } catch (error) {
      return {
        success: false,
        error: 'Đã có lỗi xảy ra trong quá trình đăng nhập',
      };
    } finally {
      console.log('🔄 AuthContext: Setting loading to false...');
      setLoading(false);
    }
  };

  // Register function using backend API
  const register = async (userData: UserData) => {
    try {
      setLoading(true);

      const result = await authService.register(userData);

      if (result.success) {
        return {success: true, data: result.data};
      } else {
        return {
          success: false,
          error: result.error,
        };
      }
    } catch (error) {
      console.error('Registration error in context:', error);
      return {
        success: false,
        error: 'Đã có lỗi xảy ra trong quá trình đăng ký',
      };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  // Get user role information
  const getUserRole = () => {
    if (!user) return null;

    return {
      roleId: user.roleId,
      role: user.role,
      position: user.position,
      isLeader: user.role === 'Leader',
      isManager: user.role === 'Manager',
      isSupervisor: user.role === 'Supervisor',
      isWorker: user.role === 'Worker',
    };
  };

  // Check if user has specific role
  const hasRole = (role: string) => {
    if (!user) return false;
    return user.role === role;
  };

  // Check if user has permission (role hierarchy)
  const hasPermission = (requiredRole: string) => {
    if (!user) return false;

    const roleHierarchy: any = {
      Worker: 1, // Nhân viên vệ sinh
      Supervisor: 2, // Giám sát viên và sinh
      Manager: 3, // Quản lý cấp cao
      Leader: 4, // Quản trị hệ thống
    };

    const userLevel = roleHierarchy[user.role] || 0;
    const requiredLevel = roleHierarchy[requiredRole] || 0;

    return userLevel >= requiredLevel;
  };

  const value: any = {
    isAuthenticated,
    user,
    loading,
    login,
    register,
    logout,
    getUserRole,
    hasRole,
    hasPermission,
  };

  return React.createElement(AuthContext.Provider, {value: value}, children);
};
