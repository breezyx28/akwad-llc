import type { IPostItem } from 'src/types/blog';

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

type PostData = {
  post: IPostItem;
};

export function useGetPost(title: string) {
  const url = title ? [endpoints.post.details, { params: { title } }] : '';

  const { data, isLoading, error, isValidating } = useSWR<PostData>(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      post: data?.post,
      postLoading: isLoading,
      postError: error,
      postValidating: isValidating,
    }),
    [data?.post, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

type LatestPostsData = {
  latestPosts: IPostItem[];
};

export function useGetLatestPosts(title: string) {
  const url = title ? [endpoints.post.latest, { params: { title } }] : '';

  const { data, isLoading, error, isValidating } = useSWR<LatestPostsData>(
    url,
    fetcher,
    swrOptions
  );

  const memoizedValue = useMemo(
    () => ({
      latestPosts: data?.latestPosts || [],
      latestPostsLoading: isLoading,
      latestPostsError: error,
      latestPostsValidating: isValidating,
      latestPostsEmpty: !isLoading && !data?.latestPosts.length,
    }),
    [data?.latestPosts, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

type SearchResultsData = {
  results: IPostItem[];
};

export function useSearchPosts(query: string) {
  const url = query ? [endpoints.post.search, { params: { query } }] : '';

  const { data, isLoading, error, isValidating } = useSWR<SearchResultsData>(url, fetcher, {
    ...swrOptions,
    keepPreviousData: true,
  });

  const memoizedValue = useMemo(
    () => ({
      searchResults: data?.results || [],
      searchLoading: isLoading,
      searchError: error,
      searchValidating: isValidating,
      searchEmpty: !isLoading && !data?.results.length,
    }),
    [data?.results, error, isLoading, isValidating]
  );

  return memoizedValue;
}
