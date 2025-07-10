import useSWRNative from '@nandorojo/swr-react-native';
import {Floor} from '../config/models/floor.model';
import {API_URLS} from '../constants/api-urls';
import {swrFetcher} from '../utils/swr-fetcher';

// Hook to fetch floors for dropdown
export function useFloors() {
  const {data, error, isLoading} = useSWRNative<Floor[]>(
    API_URLS.FLOOR.GET_ALL,
    swrFetcher,
  );

  return {
    floors: data ?? [],
    isLoading,
    error,
  };
}
