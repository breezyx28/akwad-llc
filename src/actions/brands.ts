import useSWR, { mutate } from 'swr';
import { useMemo, useState } from 'react';

import axios, { fetcher, endpoints, authedFetcher } from 'src/utils/axios';
import { IBrandItem } from 'src/types/brand';
import { getAccessToken } from 'src/auth/context/sanctum';

// ----------------------------------------------------------------------

const enableServer = false;

const BRAND_ENDPOINT = endpoints.brands;

const swrOptions = {
  revalidateIfStale: enableServer,
  revalidateOnFocus: enableServer,
  revalidateOnReconnect: enableServer,
};

// ----------------------------------------------------------------------

type BrandsData = {
  data: IBrandItem[];
};

export function useGetBrands() {
  const url = endpoints.brands.list;

  const { data, isLoading, error, isValidating } = useSWR<BrandsData>(
    url,
    authedFetcher,
    swrOptions
  );

  const memoizedValue = useMemo(
    () => ({
      brands: data?.data || [],
      brandsLoading: isLoading,
      brandsError: error,
      brandsValidating: isValidating,
      brandsEmpty: !isLoading && !data?.data?.length,
    }),
    [data?.data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------
type updateBrandStatus = {
  name: string;
  description: string;
  status: number;
};

export async function updateBrandStatus(brandId: string | number, payload: updateBrandStatus) {
  try {
    const response = await axios.patch(BRAND_ENDPOINT.edit + brandId, payload, {
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
type addBrandPayload = {
  name: string;
  category_id: number | string;
  description: string;
  keywords: string;
  link: string;
  image: any;
};

export async function addBrand(payload: addBrandPayload) {
  try {
    const response = await axios.post(BRAND_ENDPOINT.store, payload, {
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
