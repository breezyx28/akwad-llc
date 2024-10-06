import useSWR, { mutate } from 'swr';
import { useMemo, useState } from 'react';

import axios, { fetcher, endpoints, authedFetcher } from 'src/utils/axios';
import { IBrandItem } from 'src/types/brand';
import { getAccessToken } from 'src/auth/context/sanctum';
import { IDiscountCodeItem } from 'src/types/discount-code';
import { toast } from 'sonner';

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

// ------------------------------------------------------

type updateDiscountCodePayload = {
  name: string;
  description: string;
  brand_id: number | string;
  keywords: string;
  coupon: string;
};

export async function updateDiscountCode(
  discountCodeID: string | number,
  payload: updateDiscountCodePayload
) {
  try {
    const response = await axios.patch(DISCOUNT_CODE_ENDPOINT.edit + discountCodeID, payload, {
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

export async function deleteDiscountCode(discountCodeID: string | number) {
  try {
    const response = await axios.delete(DISCOUNT_CODE_ENDPOINT.delete + discountCodeID, {
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
