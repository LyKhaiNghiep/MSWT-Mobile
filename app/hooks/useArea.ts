import {Area} from '../config/models/restroom.model';
import {API_URLS} from '../constants/api-urls';
import {swrFetcher} from '../utils/swr-fetcher';
import useSWRNative from '@nandorojo/swr-react-native';

// Hook to fetch areas for dropdown
export function useAreas() {
  const {data, error, isLoading} = useSWRNative<Area[]>(
    API_URLS.AREA.GET_ALL,
    swrFetcher,
  );

  return {
    areas: data ?? [],
    isLoading,
    error,
  };
}
