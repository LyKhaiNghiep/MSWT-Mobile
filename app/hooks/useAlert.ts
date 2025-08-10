import {AlertModel} from '../config/models/alert.mode';
import {Area} from '../config/models/restroom.model';
import {API_URLS} from '../constants/api-urls';
import {swrFetcher} from '../utils/swr-fetcher';
import useSWRNative from '@nandorojo/swr-react-native';

// Hook to fetch areas for dropdown
export function useAlerts() {
  const {data, error, isLoading} = useSWRNative<AlertModel[]>(
    API_URLS.ALERT.MY_ALERTS,
    swrFetcher,
  );

  return {
    alerts: data ?? [],
    isLoading,
    error,
  };
}
