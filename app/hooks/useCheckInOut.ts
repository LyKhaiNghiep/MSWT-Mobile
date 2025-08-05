import {CheckInOut} from '../config/models/check-in-out.model';
import {Area} from '../config/models/restroom.model';
import {API_URLS} from '../constants/api-urls';
import {swrFetcher} from '../utils/swr-fetcher';
import useSWRNative from '@nandorojo/swr-react-native';

// Hook to fetch areas for dropdown
export function useCheckInOut() {
  const {data, error, isLoading, mutate} = useSWRNative<CheckInOut[]>(
    API_URLS.CHECK_IN_OUT.MY,
    swrFetcher,
  );

  return {
    data: data ?? [],
    isLoading,
    error,
    mutate,
  };
}
