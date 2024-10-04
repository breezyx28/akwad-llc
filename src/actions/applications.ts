import type { IPostItem } from 'src/types/blog';

import useSWR, { mutate } from 'swr';
import { useMemo, useState } from 'react';

import axios, { fetcher, endpoints, authedFetcher } from 'src/utils/axios';
import { IBrandItem } from 'src/types/brand';
import { getAccessToken } from 'src/auth/context/sanctum';
import { IApplicationItem } from 'src/types/application';

// ----------------------------------------------------------------------

const enableServer = false;

const BRAND_ENDPOINT = endpoints.brands;

const swrOptions = {
  revalidateIfStale: enableServer,
  revalidateOnFocus: enableServer,
  revalidateOnReconnect: enableServer,
};

// ----------------------------------------------------------------------

type ApplicationsData = {
  data: IApplicationItem[];
};

export function useGetApplications() {
  const url = endpoints.brands.list;

  const { data, isLoading, error, isValidating } = useSWR<ApplicationsData>(
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
