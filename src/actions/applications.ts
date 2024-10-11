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

export function useGetApplications() {
  const url = APPLICATION_ENDPOINT.list;

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
