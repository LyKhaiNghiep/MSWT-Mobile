export interface Leave {
  leaveId: string;
  workerId: string;
  leaveType: string;
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
