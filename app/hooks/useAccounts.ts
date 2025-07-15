import useSWRNative from '@nandorojo/swr-react-native';
import {User} from '../config/models/user.model';
import {userService} from '../services/userService';

// Hook to fetch users with proper mapping
export function useAccounts() {
  const {data, error, isLoading} = useSWRNative<User[]>('users-all', () =>
    userService.getAllUsers(),
  );

  return {
    users: data ?? [],
    isLoading,
    error,
  };
}
