import useSWRNative from '@nandorojo/swr-react-native';
import {Floor} from '../config/models/floor.model';
import {API_URLS} from '../constants/api-urls';
import {swrFetcher} from '../utils/swr-fetcher';
import {TrashBin} from '../config/models/trashbin.model';
import {User} from '../config/models/user.model';

// Hook to fetch floors for dropdown
export function useAccounts() {
  const {data, error, isLoading} = useSWRNative<User[]>(
    API_URLS.USER.GET_ALL,
    swrFetcher,
  );

  return {
    users: data ?? [],
    isLoading,
    error,
  };
}
