export interface Leave {
  leaveId: string;
  workerId: string;
  leaveType: string; // API returns string values like "Nghỉ phép năm", "Nghỉ bệnh", "Nghỉ việc riêng", "Không xác định"
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string | null;
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
