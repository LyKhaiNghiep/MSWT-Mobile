import React from 'react';
import useSWRNative from '@nandorojo/swr-react-native';
import {
  IUpdateScheduleRequest,
  Schedule,
} from '../config/models/schedule.model';
import {API_URLS} from '../constants/api-urls';
import {swrFetcher} from '../utils/swr-fetcher';
import {ScheduleDetails} from '../config/models/scheduleDetails.model';

export function useSchedules(userId: string | undefined) {
  const {data, error, isLoading, mutate} = useSWRNative<
    ScheduleDetails[] | ScheduleDetails
  >(
    userId ? API_URLS.SCHEDULE_DETAILS.GET_BY_USER_ID(userId) : null,
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

  // Normalize data to always be an array
  const normalizedSchedules = React.useMemo(() => {
    if (!data) return [];

    // If data is an array, use it as is
    if (Array.isArray(data)) {
      return data.sort((a, b) => b.date.localeCompare(a.date));
    }

    // If data is a single object, wrap it in an array
    return [data].sort((a, b) => b.date.localeCompare(a.date));
  }, [data]);

  return {
    schedules: normalizedSchedules,
    isLoading,
    error,
    updateSchedule,
    mutate,
  };
}
