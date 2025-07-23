import useSWRNative from '@nandorojo/swr-react-native';
import {ScheduleDetails} from '../config/models/scheduleDetails.model';
import {API_URLS} from '../constants/api-urls';
import {swrFetcher} from '../utils/swr-fetcher';

export function useScheduleDetails(userId?: string) {
  // Sử dụng endpoint GET_ALL và filter theo userId ở client side
  const {data, error, isLoading, mutate} = useSWRNative<ScheduleDetails[]>(
    'scheduledetails', // Sử dụng endpoint GET_ALL
    swrFetcher,
  );

  // Debug logging
  console.log('🔍 useScheduleDetails - userId:', userId);
  console.log('🔍 useScheduleDetails - all data length:', data?.length);
  console.log('🔍 useScheduleDetails - isLoading:', isLoading);
  console.log('🔍 useScheduleDetails - error:', error);

  // Filter data theo userId (có thể là supervisorId hoặc workerId)
  const filteredData = userId && data 
    ? data.filter(item => 
        item.supervisorId === userId || 
        item.workerId === userId ||
        item.schedule?.supervisorId === userId
      )
    : data ?? [];

  console.log('🔍 useScheduleDetails - filtered data length:', filteredData?.length);
  console.log('🔍 useScheduleDetails - sample item:', filteredData?.[0]);

  return {
    scheduleDetails: filteredData,
    isLoading,
    error,
    mutate,
  };
} 