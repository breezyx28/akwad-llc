import type { IPostItem } from 'src/types/blog';

import useSWR from 'swr';
import { useMemo } from 'react';

import { fetcher, endpoints } from 'src/utils/axios';
import { IBannerItem } from 'src/types/banner';

// ----------------------------------------------------------------------

const swrOptions = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

// ----------------------------------------------------------------------

type BannersData = {
  banners: IBannerItem[];
};

export function useGetBanners() {
  const url = endpoints.brands.banners.list;

  const { data, isLoading, error, isValidating } = useSWR<BannersData>(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      banners: data?.banners || [],
      bannersLoading: isLoading,
      bannersError: error,
      bannersValidating: isValidating,
      bannersEmpty: !isLoading && !data?.banners.length,
    }),
    [data?.banners, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

type BannerData = {
  banner: IBannerItem;
};

export function useGetBanner(title: string) {
  const url = title ? [endpoints.post.details, { params: { title } }] : '';

  const { data, isLoading, error, isValidating } = useSWR<BannerData>(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      banner: data?.banner,
      bannerLoading: isLoading,
      bannerError: error,
      bannerValidating: isValidating,
    }),
    [data?.banner, error, isLoading, isValidating]
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
