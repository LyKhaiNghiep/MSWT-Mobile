import {API_URLS} from '../constants/api-urls';
import {swrFetcher} from '../utils/swr-fetcher';
import useSWRNative from '@nandorojo/swr-react-native';

export interface IWorkStats {
  month: number;
  year: number;
  workedDays: number;
  totalDays: number;
  percentage: number;
}

export interface IDaysOff {
  status: number;
  message: string;
  data: string[];
}

export const useDashboard = () => {
  const month = new Date().getMonth() + 1;
  const year = new Date().getFullYear();

  // Fetch work status
  const {
    data: workStatus,
    error: workStatusError,
    isLoading: isLoadingWorkStatus,
  } = useSWRNative<IWorkStats>(
    API_URLS.DASHBOARD.MY_WORK_STATUS(month, year),
    swrFetcher,
  );

  // Fetch days off
  const {
    data: daysOff,
    error: daysOffError,
    isLoading: isLoadingDaysOff,
  } = useSWRNative<IDaysOff>(
    API_URLS.DASHBOARD.DAYS_OFF(month, year),
    swrFetcher,
  );

  // Fetch average rating
  const {
    data: averageRating,
    error: averageRatingError,
    isLoading: isLoadingAverageRating,
  } = useSWRNative<number>(
    API_URLS.DASHBOARD.AVERAGE_RATING(month, year),
    swrFetcher,
  );

  return {
    // Work status
    workStatus: workStatus || null,
    workStatusError,
    isLoadingWorkStatus,

    // Days off
    daysOff: daysOff || null,
    daysOffError,
    isLoadingDaysOff,

    // Average rating
    averageRating: averageRating || null,
    averageRatingError,
    isLoadingAverageRating,

    // Overall loading state
    isLoading:
      isLoadingWorkStatus || isLoadingDaysOff || isLoadingAverageRating,
    // Overall error state
    hasError: !!(workStatusError || daysOffError || averageRatingError),
  };
};
