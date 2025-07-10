import useSWRNative from '@nandorojo/swr-react-native';
import {Floor} from '../config/models/floor.model';
import {API_URLS} from '../constants/api-urls';
import {swrFetcher} from '../utils/swr-fetcher';
import {TrashBin} from '../config/models/trashbin.model';

// Hook to fetch floors for dropdown
export function useTrashBins() {
  const {data, error, isLoading} = useSWRNative<TrashBin[]>(
    API_URLS.TRASHBIN.GET_ALL,
    swrFetcher,
  );

  return {
    trashbins: data ?? [],
    isLoading,
    error,
  };
}
