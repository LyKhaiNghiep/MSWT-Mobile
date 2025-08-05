import useSWRNative from '@nandorojo/swr-react-native';
import {
  IUpdateScheduleRequest,
  Schedule,
} from '../config/models/schedule.model';
import {API_URLS} from '../constants/api-urls';
import {swrFetcher} from '../utils/swr-fetcher';
import {ScheduleDetails} from '../config/models/scheduleDetails.model';

export function useSchedules(userId: string | undefined) {
  const {data, error, isLoading, mutate} = useSWRNative<ScheduleDetails[]>(
    API_URLS.SCHEDULE_DETAILS.GET_BY_USER_ID(userId!),
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
    schedules: data?.sort((a, b) => b.date.localeCompare(a.date)) ?? [],
    isLoading,
    error,
    updateSchedule,
    mutate,
  };
}
