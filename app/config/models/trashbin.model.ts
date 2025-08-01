import {SensorBin} from './sensor.model';

export type TrashBin = {
  trashBinId: string;
  areaId: string;
  description: string | null;
  status: string;
  trashBinName: string | null;
  areaName: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  sensorBins: SensorBin[];
};
