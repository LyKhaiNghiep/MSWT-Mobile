import {Floor} from './floor.model';
import {Area, Room} from './area.model';

export type {Floor, Area, Room};

export interface Schedule {
  scheduleId: string;
  startTime: string;
  endTime: string;
  dayOfWeek: string;
  userId: string;
  restroomId: string;
}

export interface Restroom {
  restroomId: string;
  restroomNumber: string;
  description: string;
  areaId: string;
  status: string;
  areaName: string;
  // Legacy fields for backward compatibility
  createdAt?: string;
  updatedAt?: string;
  area?: Area;
  schedules?: Schedule[];
}

export interface RestroomCreateRequest {
  restroomNumber: string;
  description: string;
  areaId: string;
  status: string;
}

export interface RestroomUpdateRequest {
  restroomNumber?: string;
  description?: string;
  areaId?: string;
  status?: string;
}
