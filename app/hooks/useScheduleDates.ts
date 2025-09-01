import React from 'react';
import useSWRNative from '@nandorojo/swr-react-native';
import {API_URLS} from '../constants/api-urls';
import {swrFetcher} from '../utils/swr-fetcher';

export function useScheduleDates(userId: string | undefined) {
  const {data, error, isLoading, mutate} = useSWRNative<string[]>(
    userId ? API_URLS.SCHEDULE_DETAILS.GET_DATES_BY_USER(userId) : null,
    swrFetcher,
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      onError: err => {
        // Don't treat "No scheduleDetails found" as an error - it's a valid empty state
        if (err.message?.includes('No scheduleDetails found')) {
          return;
        }
        console.error('Error fetching schedule dates:', err);
      },
    },
  );

  const forceRefresh = React.useCallback(async () => {
    try {
      return await mutate(undefined, {revalidate: true});
    } catch (error) {
      console.error('Error refreshing schedule dates:', error);
      throw error;
    }
  }, [mutate]);

  return {
    dates: data || [],
    isLoading,
    error,
    mutate: forceRefresh,
  };
}
