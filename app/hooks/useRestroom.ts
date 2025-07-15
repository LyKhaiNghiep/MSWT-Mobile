import useSWRNative from '@nandorojo/swr-react-native';
import {
  Restroom,
  RestroomCreateRequest,
  RestroomUpdateRequest,
} from '../config/models/restroom.model';
import {API_URLS} from '../constants/api-urls';
import {swrFetcher} from '../utils/swr-fetcher';
import {colors} from '../theme';

export function useRestrooms() {
  const {data, error, isLoading, mutate} = useSWRNative<Restroom[]>(
    API_URLS.RESTROOM.GET_ALL,
    swrFetcher,
  );

  const createAsync = async (newRestroom: RestroomCreateRequest) => {
    try {
      const response = await swrFetcher(API_URLS.RESTROOM.CREATE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newRestroom),
      });
      mutate();
      return response;
    } catch (error) {
      console.error('Error creating restroom:', error);
      throw error;
    }
  };

  const updateAsync = async (
    id: string,
    updatedData: RestroomUpdateRequest,
  ) => {
    try {
      const response = await swrFetcher(API_URLS.RESTROOM.UPDATE(id), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });
      mutate();
      return response;
    } catch (error) {
      console.error('Error updating restroom:', error);
      throw error;
    }
  };

  const deleteAsync = async (id: string) => {
    try {
      await swrFetcher(API_URLS.RESTROOM.DELETE(id), {
        method: 'DELETE',
      });
      mutate();
    } catch (error) {
      console.error('Error deleting restroom:', error);
      throw error;
    }
  };

  return {
    restrooms: data ?? [],
    isLoading,
    error,
    createAsync,
    updateAsync,
    deleteAsync,
    mutate,
  };
}

export function getRestroomStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'hoạt động':
      return colors.success;
    case 'bảo trì':
      return colors.warning;
    case 'ngưng hoạt động':
      return colors.error;
    case 'đang hoạt động':
      return colors.success;
    default:
      return colors.subLabel;
  }
}

export function useRestroom(id: string) {
  const {data, error, isLoading, mutate} = useSWRNative<Restroom>(
    id ? `${API_URLS.RESTROOM.GET_ALL}/${id}` : null,
    swrFetcher,
  );

  return {
    restroom: data,
    isLoading,
    isError: error,
    mutate,
  };
}
