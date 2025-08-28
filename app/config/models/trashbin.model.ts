export type TrashBin = {
  trashBinId: string;
  status: string;
  areaId: string;
  location: string;
  image: string | null;
  restroomId: string;
  alerts: any[];
  area: any | null;
  requests: any[];
  restroom: any | null;
  sensorBins: any[];
};

export type TrashBinSensor = {
  sensorId: string;
  sensorName: string;
};
