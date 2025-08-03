import useSWRNative from '@nandorojo/swr-react-native';
import {API_URLS} from '../constants/api-urls';
import {swrFetcher} from '../utils/swr-fetcher';
import {TrashBin} from '../config/models/trashbin.model';
import {Area} from '../config/models/restroom.model';
import {useMemo} from 'react';

// Hook to fetch trash bins with sensors and area names
export function useTrashBins() {
  // Fetch trash bins with sensors
  const {
    data: trashbinsResponse,
    error,
    isLoading,
  } = useSWRNative<{data: TrashBin[]}>(
    API_URLS.TRASHBIN.GET_ALL_WITH_SENSORS,
    swrFetcher,
  );

  // Fetch areas to map area names
  const {data: areas} = useSWRNative<Area[]>(API_URLS.AREA.GET_ALL, swrFetcher);

  // Map area names to trash bins
  const trashbinsWithAreaNames = useMemo(() => {
    if (!trashbinsResponse?.data || !areas) {
      return [];
    }

    return trashbinsResponse.data.map(trashbin => ({
      ...trashbin,
      areaName:
        areas.find(area => area.areaId === trashbin.areaId)?.areaName ||
        'Unknown Area',
      trashBinName: trashbin.location || `Thùng rác ${trashbin.trashBinId}`,
    }));
  }, [trashbinsResponse?.data, areas]);

  return {
    trashbins: trashbinsWithAreaNames,
    trashbins2: trashbinsWithAreaNames, // Keep for backward compatibility
    isLoading,
    error,
  };
}
