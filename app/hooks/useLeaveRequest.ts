import useSWRNative from '@nandorojo/swr-react-native';
import {API_URLS} from '../constants/api-urls';
import {swrFetcher} from '../utils/swr-fetcher';
import {Leave} from '../config/models/leave.model';

// Hook to fetch leave requests
export function useLeaveRequest() {
  const {data, error, isLoading} = useSWRNative<Leave[]>(
    API_URLS.LEAVE_REQUEST.MY_LEAVES,
    swrFetcher,
  );
  
  const getLeaveById = (leaveId: string): Leave | undefined => {
    return data?.find(leave => leave.leaveId === leaveId);
  };

  const getLeaveTypeLabel = (leaveType: number): string => {
    switch (leaveType) {
      case 1:
        return 'Xin nghỉ phép';
      case 2:
        return 'Xin nghỉ bệnh';
      case 3:
        return 'Cá nhân';
      default:
        return 'Không xác định';
    }
  };

  return {
    all: data ?? [],
    myLeaves: data ?? [],
    getLeaveById,
    getLeaveTypeLabel,
    isLoading,
    error,
  };
}
