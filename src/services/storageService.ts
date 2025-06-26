import AsyncStorage from '@react-native-async-storage/async-storage';
import { store } from '../store';
import { setCredentials, clearCredentials } from '../store/slices/authSlice';
import { authApi } from '../api/authApi';

export class StorageService {
  private static readonly TOKEN_KEY = 'authToken';
  private static readonly USER_KEY = 'userData';

  // Save auth data to storage
  static async saveAuthData(token: string, user: any): Promise<void> {
    try {
      await Promise.all([
        AsyncStorage.setItem(this.TOKEN_KEY, token),
        AsyncStorage.setItem(this.USER_KEY, JSON.stringify(user)),
      ]);
    } catch (error) {
      console.error('Error saving auth data:', error);
    }
  }

  // Load auth data from storage
  static async loadAuthData(): Promise<{ token: string; user: any } | null> {
    try {
      const [token, userData] = await Promise.all([
        AsyncStorage.getItem(this.TOKEN_KEY),
        AsyncStorage.getItem(this.USER_KEY),
      ]);

      if (token && userData) {
        return {
          token,
          user: JSON.parse(userData),
        };
      }
    } catch (error) {
      console.error('Error loading auth data:', error);
    }
    return null;
  }

  // Clear auth data from storage
  static async clearAuthData(): Promise<void> {
    try {
      await Promise.all([
        AsyncStorage.removeItem(this.TOKEN_KEY),
        AsyncStorage.removeItem(this.USER_KEY),
      ]);
    } catch (error) {
      console.error('Error clearing auth data:', error);
    }
  }

  // Initialize app - check for existing auth data
  static async initializeAuth(): Promise<void> {
    try {
      const authData = await this.loadAuthData();

      if (authData) {
        // Verify token is still valid
        try {
          const response = await authApi.verifyToken();
          if (response.success) {
            // Token is valid, restore auth state
            store.dispatch(
              setCredentials({
                user: response.data.user,
                token: authData.token,
              })
            );
          } else {
            // Token is invalid, clear storage
            await this.clearAuthData();
          }
        } catch (_error) {
          // Token verification failed, clear storage
          await this.clearAuthData();
          store.dispatch(clearCredentials());
        }
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
      await this.clearAuthData();
      store.dispatch(clearCredentials());
    }
  }

  // Save any data with key
  static async saveData(key: string, data: any): Promise<void> {
    try {
      const jsonData = typeof data === 'string' ? data : JSON.stringify(data);
      await AsyncStorage.setItem(key, jsonData);
    } catch (error) {
      console.error(`Error saving data for key ${key}:`, error);
    }
  }

  // Get data by key
  static async getData(key: string): Promise<any> {
    try {
      const data = await AsyncStorage.getItem(key);
      if (data) {
        try {
          return JSON.parse(data);
        } catch {
          return data; // Return as string if not JSON
        }
      }
    } catch (error) {
      console.error(`Error getting data for key ${key}:`, error);
    }
    return null;
  }

  // Remove data by key
  static async removeData(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing data for key ${key}:`, error);
    }
  }

  // Clear all app data
  static async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error clearing all data:', error);
    }
  }
}
