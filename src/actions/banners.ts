import useSWR from 'swr';
import { useMemo } from 'react';

import axios, { fetcher, endpoints } from 'src/utils/axios';
import { IBannerItem } from 'src/types/banner';
import { getAccessToken } from 'src/auth/context/sanctum';

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

type BannerData = {
  banner: IBannerItem;
};

export function useGetBanner(title: string) {
  const url = title ? [endpoints.post.details, { params: { title } }] : '';

  const { data, isLoading, error, isValidating } = useSWR<BannerData>(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      banner: data?.banner,
      bannerLoading: isLoading,
      bannerError: error,
      bannerValidating: isValidating,
    }),
    [data?.banner, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------
