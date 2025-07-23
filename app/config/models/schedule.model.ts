import {Restroom} from './restroom.model';

export interface Schedule {
  scheduleId: string;
  areaId: string;
  assignmentId: string;
  startDate: string;
  endDate: string;
  trashBinId: string;
  restroomId: string;
  scheduleType: string;
  shiftId: string;
  scheduleName: string;
  restroomNumber: string;
  supervisorId: string | null;
  areaName: string;
  trashBin: null;
  restroom: Restroom;
  status?: string;
  areaRestrooms: any[];
  areaTrashBins: any[];


}

export interface IUpdateScheduleRequest {
  areaId?: string;
  assignmentId?: string;
  startDate?: string;
  endDate?: string;
  trashBinId?: string;
  restroomId?: string;
  scheduleType?: string;
  shiftId?: string;
}