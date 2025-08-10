import {TrashBin} from './trashbin.model';
import {User} from './user.model';

export interface AlertModel {
  alertId: string;
  trashBinId: string;
  timeSend: string;
  resolvedAt: string | null;
  userId: string | null;
  status: string;
  areaName: string;
  trashBin: TrashBin;
  user: User;
}
