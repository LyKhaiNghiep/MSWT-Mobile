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

  const {
    data: trashbins2,
    error: error2,
    isLoading: isLoading2,
  } = useSWRNative<any>(API_URLS.TRASHBIN.GET_ALL_WITH_SENSORS, swrFetcher);

  return {
    trashbins: data ?? [],
    trashbins2: (trashbins2?.data ?? []) as TrashBin[],
    isLoading,
    error,
  };
}
