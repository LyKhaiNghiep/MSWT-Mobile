import useSWRNative from '@nandorojo/swr-react-native';
import {
  IUpdateScheduleRequest,
  Schedule,
} from '../config/models/schedule.model';
import {API_URLS} from '../constants/api-urls';
import {swrFetcher} from '../utils/swr-fetcher';

export function useSchedules() {
  const {data, error, isLoading, mutate} = useSWRNative<Schedule[]>(
    API_URLS.SCHEDULE.GET_ALL,
    swrFetcher,
  );

  const updateSchedule = async (
    id: string,
    updatedData: IUpdateScheduleRequest,
  ) => {
    try {
      const response = await swrFetcher(API_URLS.SCHEDULE.UPDATE(id), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });
      mutate();
      return response;
    } catch (error) {
      console.error('Error updating schedule:', error);
      throw error;
    }
  };

  return {
    schedules: data ?? [],
    isLoading,
    error,
    updateSchedule,
    mutate,
  };
}
