import type { IPostItem } from 'src/types/blog';

import useSWR from 'swr';
import { useMemo } from 'react';

import { fetcher, endpoints, authedFetcher } from 'src/utils/axios';
import { IUserSuggestionsItem } from 'src/types/user-suggestions';

// ----------------------------------------------------------------------

const swrOptions = {
  revalidateIfStale: true,
  revalidateOnFocus: true,
  revalidateOnReconnect: true,
};

// ----------------------------------------------------------------------

type UserSuggestionsData = {
  data: IUserSuggestionsItem[];
};

export function useGetUserSuggestions() {
  const url = endpoints.users.suggestions.list;

  const { data, isLoading, error, isValidating } = useSWR<UserSuggestionsData>(
    url,
    authedFetcher,
    swrOptions
  );

  const memoizedValue = useMemo(
    () => ({
      userSuggestions: data?.data || [],
      userSuggestionsLoading: isLoading,
      userSuggestionsError: error,
      userSuggestionsValidating: isValidating,
      userSuggestionsEmpty: !isLoading && !data?.data?.length,
    }),
    [data?.data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------
