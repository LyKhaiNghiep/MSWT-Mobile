import React from 'react';
import useSWRNative from '@nandorojo/swr-react-native';
import {ScheduleDetails} from '../config/models/scheduleDetails.model';
import {API_URLS} from '../constants/api-urls';
import {swrFetcher} from '../utils/swr-fetcher';

export function useScheduleDetailsByDate(
  userId: string | undefined,
  date: string | undefined,
) {
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const {data, error, isLoading, mutate} = useSWRNative<ScheduleDetails[]>(
    userId && date
      ? API_URLS.SCHEDULE_DETAILS.GET_BY_USER_AND_DATE(userId, date)
      : null,
    swrFetcher,
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      onError: err => {
        // Don't treat "No scheduleDetails found" as an error - it's a valid empty state
        if (err.message?.includes('No scheduleDetails found')) {
          return;
        }
        console.error('Error fetching schedule details:', err);
      },
    },
  );

  // Enhanced mutate function that forces revalidation
  const forceRefresh = React.useCallback(async () => {
    setIsRefreshing(true);
    try {
      return await mutate(undefined, {revalidate: true});
    } finally {
      setIsRefreshing(false);
    }
  }, [mutate]);

  return {
    scheduleDetails: data || [],
    isLoading,
    isRefreshing,
    error,
    mutate: forceRefresh,
  };
}
