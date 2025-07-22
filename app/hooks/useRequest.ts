import useSWRNative from '@nandorojo/swr-react-native';
import {API_URLS} from '../constants/api-urls';
import swrFetcher from '../utils/swr-fetcher';

export type TRequest = {
  requestId: string;
  workerId: string;
  description: string;
  status: string;
  requestDate: string;
  resolveDate: string;
  location: string;
  supervisorId: string | null;
  trashBinId: string | null;
  supervisor: string | null;
  trashBin: string | null;
  worker: string | null;
};

export type TCreateRequest = {
  description: string;
  location: string;
  requestDate: Date;
};

export function useRequest() {
  const {data, error, isLoading} = useSWRNative<TRequest[]>(
    API_URLS.REQUEST.GET_ALL,
    swrFetcher,
  );

  return {
    data: data || [],
    isLoading,
    error,
  };
}
