import useSWRNative from '@nandorojo/swr-react-native';
import {Sensor} from '../config/models/sensor.model';
import {API_URLS} from '../constants/api-urls';
import {swrFetcher} from '../utils/swr-fetcher';
import {Leave} from '../config/models/leave.model';

// Hook to fetch floors for dropdown
export function useLeaveRequest() {
  const {data, error, isLoading} = useSWRNative<Leave[]>(
    API_URLS.LEAVE_REQUEST.MY_LEAVES,
    swrFetcher,
  );
  const getLeaveById = (leaveId: string): Leave | undefined => {
    return data?.find(leave => leave.leaveId === leaveId);
  };

  return {
    all: data ?? [],
    myLeaves: data ?? [],
    getLeaveById,
    isLoading,
    error,
  };
}
