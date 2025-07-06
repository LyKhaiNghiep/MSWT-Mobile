import AsyncStorage from '@react-native-async-storage/async-storage';

type StorageKey = 'accessToken' | 'userData' | 'settings';

export class StorageUtil {
  static async set(key: StorageKey, value: any): Promise<void> {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
      console.error(`Error storing ${key}:`, error);
      throw error;
    }
  }

  static async get<T>(key: StorageKey): Promise<T | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error(`Error retrieving ${key}:`, error);
      throw error;
    }
  }

  static async remove(key: StorageKey): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing ${key}:`, error);
      throw error;
    }
  }

  static async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
      throw error;
    }
  }

  // Specific methods for auth data
  static async getToken(): Promise<string | null> {
    return this.get<string>('accessToken');
  }

  static async setToken(token: string): Promise<void> {
    return this.set('accessToken', token);
  }

  static async getUserData<T>(): Promise<T | null> {
    return this.get<T>('userData');
  }

  static async setUserData<T>(data: T): Promise<void> {
    return this.set('userData', data);
  }
}
