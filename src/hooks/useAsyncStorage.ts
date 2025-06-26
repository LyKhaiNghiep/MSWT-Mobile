import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useAsyncStorage = <T>(
  key: string,
  defaultValue: T
): [T, (value: T) => Promise<void>, boolean] => {
  const [storedValue, setStoredValue] = useState<T>(defaultValue);
  const [loading, setLoading] = useState(true);

  // Get value from storage on mount
  useEffect(() => {
    const getValue = async () => {
      try {
        const item = await AsyncStorage.getItem(key);
        if (item !== null) {
          setStoredValue(JSON.parse(item));
        }
      } catch (error) {
        console.error(`Error getting ${key} from AsyncStorage:`, error);
      } finally {
        setLoading(false);
      }
    };

    getValue();
  }, [key]);

  // Set value in storage
  const setValue = async (value: T) => {
    try {
      setStoredValue(value);
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting ${key} in AsyncStorage:`, error);
    }
  };

  return [storedValue, setValue, loading];
};
