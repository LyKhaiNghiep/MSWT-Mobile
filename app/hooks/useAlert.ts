import {AlertModel} from '../config/models/alert.mode';
import {API_URLS} from '../constants/api-urls';
import {swrFetcher} from '../utils/swr-fetcher';
import useSWRNative from '@nandorojo/swr-react-native';

// Hook to fetch alerts
export function useAlerts() {
  const {data, error, isLoading} = useSWRNative<AlertModel[]>(
    API_URLS.ALERT.MY_ALERTS,
    swrFetcher,
  );

  // Transform for backward compatibility: prefer areaName from API, fallback to trashBin.location
  const transformedAlerts = (data ?? []).map(alert => ({
    ...alert,
    areaName:
      alert.areaName || alert.trashBin?.location || 'Không có thông tin vị trí',
  }));

  return {
    alerts: transformedAlerts,
    isLoading,
    error,
  };
}
