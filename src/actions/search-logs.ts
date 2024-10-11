import type { IPostItem } from 'src/types/blog';

import useSWR from 'swr';
import { useMemo } from 'react';

import { fetcher, endpoints, authedFetcher } from 'src/utils/axios';
import { ISearchLogsItem } from 'src/types/search-logs';

// ----------------------------------------------------------------------

const swrOptions = {
  revalidateIfStale: true,
  revalidateOnFocus: true,
  revalidateOnReconnect: true,
};

// ----------------------------------------------------------------------

type SearchLogsData = {
  data: ISearchLogsItem[];
};

export function useGetSearchLogs() {
  const url = endpoints.users.searchLogs.list;

  const { data, isLoading, error, isValidating } = useSWR<SearchLogsData>(
    url,
    authedFetcher,
    swrOptions
  );

  const memoizedValue = useMemo(
    () => ({
      searchLogs: data?.data || [],
      searchLogsLoading: isLoading,
      searchLogsError: error,
      searchLogsValidating: isValidating,
      searchLogsEmpty: !isLoading && !data?.data?.length,
    }),
    [data?.data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------
