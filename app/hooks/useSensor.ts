import useSWRNative from '@nandorojo/swr-react-native';
import {Sensor} from '../config/models/sensor.model';
import {API_URLS} from '../constants/api-urls';
import {swrFetcher} from '../utils/swr-fetcher';

// Hook to fetch floors for dropdown
export function useSensor() {
  const {data, error, isLoading} = useSWRNative<Sensor[]>(
    API_URLS.SENSOR.GET_ALL,
    swrFetcher,
  );

  return {
    sensors: data ?? [],
    isLoading,
    error,
  };
}
