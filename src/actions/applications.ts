import useSWR from 'swr';
import { useMemo } from 'react';

import { endpoints, authedFetcher } from 'src/utils/axios';
import { IApplicationItem } from 'src/types/application';

// ----------------------------------------------------------------------

const enableServer = true;

const APPLICATION_ENDPOINT = endpoints.applications;

const swrOptions = {
  revalidateIfStale: enableServer,
  revalidateOnFocus: enableServer,
  revalidateOnReconnect: enableServer,
};

// ----------------------------------------------------------------------

type ApplicationsData = {
  data: IApplicationItem[];
};

type ApplicationsParams = {
  start_date?: string;
  end_date?: string;
};

export function useGetApplications(params?: ApplicationsParams) {
  // Build query string from params
  const queryParams = new URLSearchParams(params).toString();

  // Append query string to the endpoint URL
  const url = queryParams
    ? `${APPLICATION_ENDPOINT.list}?${queryParams}`
    : APPLICATION_ENDPOINT.list;

  const { data, isLoading, error, isValidating } = useSWR<ApplicationsData>(
    url,
    authedFetcher,
    swrOptions
  );

  const memoizedValue = useMemo(
    () => ({
      applications: data?.data || [],
      applicationsLoading: isLoading,
      applicationsError: error,
      applicationsValidating: isValidating,
      applicationsEmpty: !isLoading && !data?.data?.length,
    }),
    [data?.data, error, isLoading, isValidating]
  );

  return memoizedValue;
}
