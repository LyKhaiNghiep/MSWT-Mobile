import useSWRNative from '@nandorojo/swr-react-native';
import {Shift} from '../config/models/shift.mode';
import {API_URLS} from '../constants/api-urls';
import {swrFetcher} from '../utils/swr-fetcher';

// Hook to fetch areas for dropdown
export function useShifts() {
  const {data, error, isLoading} = useSWRNative<Shift[]>(
    API_URLS.SHIFT.GET_ALL,
    swrFetcher,
  );

  return {
    shifts: data ?? [],
    isLoading,
    error,
  };
}
