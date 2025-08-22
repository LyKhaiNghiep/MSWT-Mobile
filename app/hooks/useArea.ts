import {Area} from '../config/models/area.model';
import {API_URLS} from '../constants/api-urls';
import {swrFetcher} from '../utils/swr-fetcher';
import useSWRNative from '@nandorojo/swr-react-native';

// Hook to fetch areas for dropdown - now includes rooms array
export function useAreas() {
  const {data, error, isLoading, mutate} = useSWRNative<Area[]>(
    API_URLS.AREA.GET_ALL,
    swrFetcher,
  );

  return {
    areas: data ?? [],
    isLoading,
    error,
    mutate,
  };
}

// Hook to get all rooms from all areas
export function useRooms() {
  const {areas, isLoading, error} = useAreas();

  const rooms = areas.flatMap(area =>
    area.rooms.map(room => ({
      ...room,
      areaName: area.areaName,
    })),
  );

  return {
    rooms,
    isLoading,
    error,
  };
}

// Hook to get rooms for a specific area
export function useAreaRooms(areaId: string) {
  const {areas, isLoading, error} = useAreas();

  const area = areas.find(a => a.areaId === areaId);
  const rooms = area?.rooms ?? [];

  return {
    rooms,
    area,
    isLoading,
    error,
  };
}
