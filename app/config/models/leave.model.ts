export interface Leave {
  leaveId: string;
  workerId: string;
  leaveType: number; // 1: Xin nghỉ phép, 2: Xin nghỉ bệnh, 3: Cá nhân
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
  requestDate: string;
  approvalStatus: string;
  approvedBy: string | null;
  approvalDate: string | null;
  note: string | null;
  approvedByNavigation?: any | null;
  worker?: any | null;
}

export interface LeaveRequestData {
  leaveType: number;
  startDate: string; // Format: YYYY-MM-DD
  endDate: string; // Format: YYYY-MM-DD
  reason: string;
}
