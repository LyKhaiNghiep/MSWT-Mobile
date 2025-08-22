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

  const getLeaveTypeLabel = (leaveType: string): string => {
    // Handle both string and legacy number formats
    if (typeof leaveType === 'number') {
      switch (leaveType) {
        case 1:
          return 'Nghỉ phép năm';
        case 2:
          return 'Nghỉ bệnh';
        case 3:
          return 'Nghỉ việc riêng';
        default:
          return 'Không xác định';
      }
    }

    // Handle string format from API
    switch (leaveType?.toLowerCase().trim()) {
      case 'nghỉ phép năm':
        return 'Nghỉ phép năm';
      case 'nghỉ bệnh':
        return 'Nghỉ bệnh';
      case 'nghỉ việc riêng':
        return 'Nghỉ việc riêng';
      case 'không xác định':
        return 'Không xác định';
      default:
        return leaveType || 'Không xác định';
    }
  };

  // Helper function to check if date is valid
  const isValidDate = (dateString: string): boolean => {
    const date = new Date(dateString);
    return date.getFullYear() > 1900 && !isNaN(date.getTime());
  };

  // Filter out invalid entries and normalize data
  const normalizedLeaves = (data ?? []).map(leave => ({
    ...leave,
    // Handle invalid dates by using requestDate as fallback
    startDate: isValidDate(leave.startDate)
      ? leave.startDate
      : leave.requestDate,
    endDate: isValidDate(leave.endDate) ? leave.endDate : leave.requestDate,
    // Handle null reasons
    reason: leave.reason || 'Không có lý do cụ thể',
  }));

  return {
    all: normalizedLeaves,
    myLeaves: normalizedLeaves,
    getLeaveById,
    getLeaveTypeLabel,
    isLoading,
    error,
  };
}
