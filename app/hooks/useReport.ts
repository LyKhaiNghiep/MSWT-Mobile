import useSWRNative from '@nandorojo/swr-react-native';
import {API_URLS} from '../constants/api-urls';
import {swrFetcher} from '../utils/swr-fetcher';
import {colors} from '../theme';

// Report interface based on new backend API structure
export interface Report {
  reportId: string;
  reportName: string;
  description: string;
  status: string;
  priority: string;
  reportType: string;
  userId: string;
  createdAt: string;
  image?: string | null;
  resolvedAt?: string | null;
  userName: string; // The one who created the report
}

export interface ReportWithRole extends Report {
  roleName: string;
}

// Create report data interface for leader
export interface CreateReportData {
  description: string;
  reportName: string;
  image?: string;
  priority: number; // 1, 2, 3 cho Low, Medium, High
  reportType: number; // Loại báo cáo
}

// Update report data interface
export interface UpdateReportData {
  title?: string;
  description?: string;
  status?: string;
  priority?: string;
  reportType?: string;
  location?: string;
  assignedTo?: string;
}

// Priority mapping
export const PRIORITY_MAPPING = {
  Thấp: 1,
  'Trung bình': 2,
  Cao: 3,
};

// Consistent status color function for both pages
export const getReportStatusColor = (status: string) => {
  switch (status) {
    case 'Đã gửi':
      return colors.success;
    case 'Đang xử lý':
      return colors.warning;
    case 'Đã xử lý':
      return colors.primary;
    case 'Đã đóng':
      return colors.subLabel;
    default:
      return colors.error;
  }
};

// Priority color function
export const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'Thấp':
      return colors.success;
    case 'Trung bình':
    case 'Trung Bình':
      return colors.yellow;
    case 'Cao':
      return colors.error;
    default:
      return colors.subLabel;
  }
};

// Hook to get all reports (Báo cáo tổng)
export const useReports = () => {
  const {data, error, isLoading, mutate} = useSWRNative<Report[]>(
    API_URLS.REPORT.GET_ALL,
    swrFetcher,
  );

  return {
    reports: data || [],
    isLoading,
    isError: error,
    refresh: () => mutate(),
  };
};

// Hook to get reports with role filtering
export const useReportsWithRole = () => {
  const {data, error, isLoading, mutate} = useSWRNative<ReportWithRole[]>(
    API_URLS.REPORT.GET_WITH_ROLE,
    swrFetcher,
  );

  return {
    reports: data || [],
    isLoading,
    isError: error,
    refresh: () => mutate(),
  };
};

// Hook to get single report by ID
export const useReport = (id: string) => {
  const {data, error, isLoading, mutate} = useSWRNative<Report>(
    id ? API_URLS.REPORT.GET_BY_ID(id) : null,
    swrFetcher,
  );

  return {
    report: data,
    isLoading,
    isError: error,
    refresh: () => mutate(),
  };
};
