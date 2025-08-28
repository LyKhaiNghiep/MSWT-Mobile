import useSWRNative from '@nandorojo/swr-react-native';
import {API_URLS} from '../constants/api-urls';
import {swrFetcher} from '../utils/swr-fetcher';

// Interface cho employee attendance data
export interface EmployeeAttendance {
  userId: string;
  fullName: string;
  image?: string;
  email: string;
  phone: string;
  position: string;
  role: string;
  status: string;
  checkInTime?: string;
  checkOutTime?: string;
  attendanceStatus?: 'Present' | 'Absent' | 'Late' | 'Not Checked In' | string;
  attendanceDate?: string;
}

// Hook để lấy danh sách nhân viên và trạng thái điểm danh
export function useAttendanceEmployees() {
  const {data, error, isLoading, mutate} = useSWRNative<EmployeeAttendance[]>(
    API_URLS.CHECK_IN_OUT.EMPLOYEES,
    swrFetcher,
  );

  // Lọc nhân viên theo trạng thái điểm danh
  const getEmployeesByStatus = (status: string) => {
    if (!data) return [];
    return data.filter(employee => employee.attendanceStatus === status);
  };

  // Thống kê điểm danh
  const getAttendanceStats = () => {
    if (!data) {
      return {
        total: 0,
        present: 0,
        absent: 0,
        late: 0,
        notCheckedIn: 0,
      };
    }

    return {
      total: data.length,
      present: data.filter(emp => emp.attendanceStatus === 'Present').length,
      absent: data.filter(emp => emp.attendanceStatus === 'Absent').length,
      late: data.filter(emp => emp.attendanceStatus === 'Late').length,
      notCheckedIn: data.filter(emp => emp.attendanceStatus === 'Not Checked In' || !emp.attendanceStatus).length,
    };
  };

  // Hàm để lưu điểm danh
  const saveAttendance = async (presentEmployeeIds: string[], shift: string) => {
    try {
      const response = await swrFetcher(API_URLS.CHECK_IN_OUT.SAVE_ATTENDANCE, {
        method: 'POST',
        body: JSON.stringify({
          presentEmployeeIds,
          shift,
        }),
      });
      
      // Refresh data sau khi save thành công
      mutate();
      return response;
    } catch (error) {
      console.error('Error saving attendance:', error);
      throw error;
    }
  };

  return {
    employees: data ?? [],
    isLoading,
    error,
    mutate,
    getEmployeesByStatus,
    getAttendanceStats,
    saveAttendance,
  };
}
