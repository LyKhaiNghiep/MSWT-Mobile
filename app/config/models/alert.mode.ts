import {TrashBin} from './trashbin.model';
import {User} from './user.model';

export interface WorkerGroup {
  workerGroupId: string;
  name: string;
  // Add other worker group fields as needed
}

export interface AlertModel {
  alertId: string;
  trashBinId: string;
  timeSend: string;
  resolvedAt: string | null;
  workerGroupId: string | null;
  status: string;
  trashBin: TrashBin;
  workerGroup: WorkerGroup | null;
  // Computed fields for backward compatibility
  areaName?: string;
  userId?: string | null;
  user?: User;
}
