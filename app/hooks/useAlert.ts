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

  // Transform the data to add computed fields for backward compatibility
  const transformedAlerts = (data ?? []).map(alert => ({
    ...alert,
    areaName: alert.trashBin?.location || 'Không có thông tin vị trí',
    // Add other computed fields if needed
  }));

  return {
    alerts: transformedAlerts,
    isLoading,
    error,
  };
}
