export interface ScheduleDetails {
  scheduleDetailId: string;
  scheduleId: string;
  description: string;
  date: string;
  status: string;
  supervisorId: string;
  supervisorName: string;
  rating: number | string | null;
  comment: string | null;
  workerGroupId: string;
  workerGroupName: string;
  backupForUserId: string | null;
  endTime: string | null;
  startTime: string;
  isBackup: boolean | null;
  groupAssignmentId: string;
  groupAssignmentName: string;
  areaId: string;
  areaName: string;
  schedule: Schedule;
  workers: Worker[];
  assignments: Assignment[];
}

export interface Schedule {
  scheduleId: string;
  startDate: string;
  endDate: string;
  scheduleType: string;
  shiftId: string;
  scheduleName: string;
}

export interface Worker {
  workGroupMemberId: string;
  workGroupId: string;
  userId: string;
  roleId: string;
  joinedAt: string;
  leftAt: string | null;
  fullName: string;
}

export interface Assignment {
  assignmentId: string;
  description: string;
  status: string;
  assigmentName: string; // Note: API has typo "assigmentName"
  groupAssignmentId: string;
}
