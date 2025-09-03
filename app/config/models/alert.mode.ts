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
  // New API returns areaName directly
  areaName: string;
  // Older payloads may include nested objects; keep them optional for compatibility
  trashBin?: TrashBin | null;
  workerGroup?: WorkerGroup | null;
  userId?: string | null;
  user?: User;
}
