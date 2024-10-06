import useSWR from 'swr';
import { useMemo } from 'react';

import axios, { fetcher, endpoints } from 'src/utils/axios';
import { IBannerItem } from 'src/types/banner';
import { getAccessToken } from 'src/auth/context/sanctum';
import { toast } from 'sonner';

// ----------------------------------------------------------------------

const swrOptions = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

const BANNER_ENDPOINT = endpoints.brands.banners;

// ----------------------------------------------------------------------

type BannersData = {
  data: IBannerItem[];
};

export function useGetBanners() {
  const url = BANNER_ENDPOINT.list;

  const { data, isLoading, error, isValidating } = useSWR<BannersData>(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      banners: data?.data || [],
      bannersLoading: isLoading,
      bannersError: error,
      bannersValidating: isValidating,
      bannersEmpty: !isLoading && !data?.data?.length,
    }),
    [data?.data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

type addBannerPayload = {
  name: string;
  type: string;
  image: any;
  brand_id: boolean | number;
  link: string;
  expiry_date: string;
};

export async function addBanner(payload: addBannerPayload) {
  try {
    const response = await axios.post(`${BANNER_ENDPOINT.store}`, payload, {
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
      },
    });

    return response;
  } catch (error) {
    throw error;
  }
}

// ----------------------------------------------------------------------
type updateBannerPayload = {
  expiry_date: string;
  type: string;
  link: string;
  image: string;
};

export async function updateBanner(bannerID: string | number, payload: updateBannerPayload) {
  try {
    const response = await axios.patch(BANNER_ENDPOINT.edit + bannerID, payload, {
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
      },
    });

    if (response.status === 200) {
      toast.success('Updated successfuly');
    }
    return response;
  } catch (error) {
    toast.error((error.message || error.error) ?? 'Something went wrong');
    throw error;
  }
}

// ----------------------------------------------------------------------

export async function deleteBanner(bannerID: string | number) {
  try {
    const response = await axios.delete(BANNER_ENDPOINT.delete + bannerID, {
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
      },
    });

    if (response.status === 200) {
      toast.success('deleted successfuly');
    }
    return response;
  } catch (error) {
    toast.error((error.message || error.error) ?? 'Something went wrong');
    throw error;
  }
}

// ----------------------------------------------------------------------
