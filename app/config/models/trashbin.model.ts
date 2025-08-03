export type TrashBin = {
  trashBinId: string;
  areaId: string;
  description: string | null;
  status: string;
  trashBinName: string | null;
  areaName: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  sensors: TrashBinSensor[];
};
export type TrashBinSensor = {
  sensorId: string;
  sensorName: string;
};
