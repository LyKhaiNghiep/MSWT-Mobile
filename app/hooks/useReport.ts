import useSWRNative from '@nandorojo/swr-react-native';
import {API_URLS, BASE_API_URL} from '../constants/api-urls';
import {swrFetcher} from '../utils/swr-fetcher';

// Report interface based on backend API
export interface Report {
  reportId: string;
  reportName: string;
  description: string;
  status: string;
  priority: string;
  reportType: string;
  location: string;
  reportedBy: string;
  contactInfo: string;
  createdDate: string;
  timeCreated: string;
  createdBy: string;
  assignedTo: string;
  image?: string;
  userId?: string;
}

export interface ReportWithRole extends Report {
  roleName: string;
  userName: string;
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
