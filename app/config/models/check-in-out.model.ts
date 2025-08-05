import {User} from './user.model';

export interface CheckInOut {
  id: string;
  employeeId: string;
  attendanceDate: string;
  checkInTime: string;
  checkOutTime: string;
  status: string;
  note: string | null;
  createdAt: string | null;
  updatedAt: string;
  user: User | null;
}
