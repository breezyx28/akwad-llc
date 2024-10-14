import useSWR, { mutate } from 'swr';
import { useCallback, useEffect, useMemo, useState } from 'react';
import axiosInstance, { authedFetcher, endpoints } from 'src/utils/axios';
import { IUserSuggestionsItem } from 'src/types/user-suggestions';
import { getAccessToken } from 'src/auth/context/sanctum';
import { toast } from 'sonner';

type UserSuggestionsData = {
  data: IUserSuggestionsItem[];
};

type UserSuggestionsParams = {
  start_date?: string;
  end_date?: string;
};

export const USER_SUGGESTIONS_ENDPOINT = endpoints.users.suggestions;

const swrOptions = {
  revalidateIfStale: true,
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
  revalidateOnMount: true, // Ensure data is revalidated when the component mounts
  dedupingInterval: 0, // Prevent SWR from deduping requests within the default time window
};

export function useGetUserSuggestions() {
  const [url, setUrl] = useState<any>(USER_SUGGESTIONS_ENDPOINT.list);

  // Custom function to update the date range and trigger a refetch
  const setNewUrl = useCallback((url: string) => {
    setUrl(url);
  }, []);

  // Use SWR to fetch the data with the constructed URL
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
      setNewUrl,
    }),
    [data?.data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function getUserSuggestionsSSR(dateData: string) {
  const url = `${USER_SUGGESTIONS_ENDPOINT.list}?${dateData}`;

  // Use SWR to fetch the data with the constructed URL
  const { data, error } = useSWR<UserSuggestionsData>(url, authedFetcher, swrOptions);

  if (error) {
    toast.error(error?.message || error?.error || 'something went wrong');
  }
  return data?.data ?? [];
}
