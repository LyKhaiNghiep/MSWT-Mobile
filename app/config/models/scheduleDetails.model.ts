export interface ScheduleDetails {
  scheduleDetailId: string;
  scheduleId: string;
  assignmentId: string;
  assignmentName: string;
  description: string;
  date: string;
  status: string;
  supervisorId: string;
  rating: number | string | null;
  workerId: string;
  evidenceImage: string | null;
  startTime: string;
  endTime: string;
  isBackup: boolean | null;
  backupForUserId: string | null;
  schedule: Schedule;
  areaName: string;
  scheduleName: string;
}

export interface Schedule {
  scheduleId: string;
  scheduleName: string;
  areaId: string;
  startDate: string;
  endDate: string;
  trashBinId: string | null;
  restroomId: string;
  restroomNumber: string;
  scheduleType: string;
  shiftId: string;
  supervisorId: string | null;
  areaName: string;
  trashBin: TrashBin | null;
  restroom: Restroom;
  areaRestrooms: any[];
  areaTrashBins: TrashBin[];
}

export interface TrashBin {
  trashBinId: string;
  status: string;
  areaId: string;
  location: string;
  image: string | null;
}

export interface Restroom {
  restroomId: string;
  description: string;
  areaId: string;
  status: string;
  restroomNumber: string;
  areaName: string | null;
}

export interface User {
  userId: string;
  userName: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  status: string;
  image: string;
  roleId: string;
  roleName: string;
} 