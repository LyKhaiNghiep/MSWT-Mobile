export type TrashBin = {
  trashBinId: string;
  areaId: string;
  location: string;
  status: string;
  image: string | null;
  restroomId: string | null;
  trashBinName?: string | null;
  areaName?: string | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;
  description?: string | null;
  sensors: TrashBinSensor[];
};

export type TrashBinSensor = {
  sensorId: string;
  sensorName: string;
};
