import {TrashBin} from './trashbin.model';

export type Sensor = {
  sensorId: string;
  sensorName: string;
  status: string;
  sensorBins: SensorBin[];
};

export type SensorBin = {
  sensorId: string;
  binId: string;
  status: string;
  bin: TrashBin;
  sensor: Sensor;
};
