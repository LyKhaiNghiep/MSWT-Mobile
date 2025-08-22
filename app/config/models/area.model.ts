// Room interface for the new API structure
export interface Room {
  roomId: string;
  description: string;
  areaId: string;
  status: string;
  roomNumber: string;
  roomType: string;
}

// Updated Area interface to match new API structure
export interface Area {
  areaId: string;
  buildingId: string;
  description: string;
  status: string;
  areaName: string;
  rooms: Room[];
}

export interface ICreateAreaRequest {
  buildingId: string;
  description: string;
  status: string;
  areaName: string;
}

export interface IUpdateAreaRequest {
  description: string;
  status: string;
  areaName: string;
}
