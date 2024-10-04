import useSWR, { mutate } from 'swr';
import { useMemo, useState } from 'react';

import axios, { fetcher, endpoints, authedFetcher } from 'src/utils/axios';
import { IBrandItem } from 'src/types/brand';
import { getAccessToken } from 'src/auth/context/sanctum';
import { IDiscountCodeItem } from 'src/types/discount-code';

// ----------------------------------------------------------------------

const enableServer = false;

const BRAND_ENDPOINT = endpoints.brands.codes;
const DISCOUNT_CODE_ENDPOINT = endpoints.brands.codes;

const swrOptions = {
  revalidateIfStale: enableServer,
  revalidateOnFocus: enableServer,
  revalidateOnReconnect: enableServer,
};

// ----------------------------------------------------------------------

type DiscountCodesData = {
  data: IDiscountCodeItem[];
};

export function useGetDiscountCodes() {
  const url = endpoints.brands.codes.list;

  const { data, isLoading, error, isValidating } = useSWR<DiscountCodesData>(
    url,
    authedFetcher,
    swrOptions
  );

  const memoizedValue = useMemo(
    () => ({
      discountCodes: data?.data || [],
      discountCodesLoading: isLoading,
      discountCodesError: error,
      discountCodesValidating: isValidating,
      discountCodesEmpty: !isLoading && !data?.data?.length,
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
    // Create a new FormData object
    // const formData = new FormData();

    // // Assuming payload is an object, append each field to formData
    // Object.keys(payload).forEach((key: any) => {
    //   // @ts-ignore
    //   formData.append(key, payload[key]);
    // });

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

// ----------------------------
type addDiscountCodePayload = {
  brand_id: string | number;
  coupon: string;
  name: string;
  description: string;
  status: number | boolean;
};

export async function addDiscountCode(payload: addDiscountCodePayload) {
  try {
    const response = await axios.post(DISCOUNT_CODE_ENDPOINT.store, payload, {
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
