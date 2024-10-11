import type { IPostItem } from 'src/types/blog';

import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';
import axios, { fetcher, endpoints, authedFetcher } from 'src/utils/axios';
import { IUsersItem } from 'src/types/users';
import { getAccessToken } from 'src/auth/context/sanctum';
import { BRAND_ENDPOINT } from './brands';
import { BANNER_ENDPOINT } from './banners';
import { toast } from 'sonner';

// ----------------------------------------------------------------------

export const USER_ENDPOINT = endpoints.users;

const swrOptions = {
  revalidateIfStale: true,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

// ----------------------------------------------------------------------

type UsersData = {
  data: IUsersItem[];
};

export function useGetUsers() {
  const url = USER_ENDPOINT.list;

  const { data, isLoading, error, isValidating } = useSWR<UsersData>(
    url,
    authedFetcher,
    swrOptions
  );

  const memoizedValue = useMemo(
    () => ({
      users: data?.data || [],
      usersLoading: isLoading,
      usersError: error,
      usersValidating: isValidating,
      usersEmpty: !isLoading && !data?.data.length,
    }),
    [data?.data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

type uploadImagePayload = {
  image: any;
};

export async function uploadImage(payload: uploadImagePayload | any) {
  try {
    const response = await axios.post(USER_ENDPOINT.uploadImage, payload, {
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
      },
    });

    mutate(USER_ENDPOINT.list);
    mutate(BRAND_ENDPOINT.list);
    mutate(BANNER_ENDPOINT.list);

    toast.success('Image uploaded successfuly');

    return response;
  } catch (error) {
    toast.error((error.message || error.error) ?? 'Something went wrong');
    throw error;
  }
}
