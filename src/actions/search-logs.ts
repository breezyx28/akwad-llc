
import type { ISearchLogsItem } from 'src/types/search-logs';

import useSWR from 'swr';
import { useMemo, useState, useCallback } from 'react';

import { endpoints, authedFetcher } from 'src/utils/axios';

// ----------------------------------------------------------------------

export const SEARCH_LOGS_ENDPOINT = endpoints.users.searchLogs;

const swrOptions = {
  revalidateIfStale: true,
  revalidateOnFocus: true,
  revalidateOnReconnect: true,
};

// ----------------------------------------------------------------------

type SearchLogsData = {
  data: ISearchLogsItem[];
};

type SearchLogsParams = {
  start_date?: string;
  end_date?: string;
};

export function useGetSearchLogs() {
  const [url, setUrl] = useState<any>(SEARCH_LOGS_ENDPOINT.list);

  // Custom function to update the date range and trigger a refetch
  const setNewUrl = useCallback((url: string) => {
    setUrl(url);
  }, []);

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
      setNewUrl,
    }),
    [data?.data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------
