import type { AxiosRequestConfig } from 'axios';

import axios from 'axios';
import { getAccessToken } from 'src/auth/context/sanctum';

import { CONFIG } from 'src/config-global';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: CONFIG.site.serverUrl, withCredentials: true });

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong!')
);

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async (args: string | [string, AxiosRequestConfig]) => {
  try {
    const [url, config] = Array.isArray(args) ? args : [args];

    const res = await axiosInstance.get(url, { ...config });

    return res.data;
  } catch (error) {
    console.error('Failed to fetch:', error);
    throw error;
  }
};

export const authedFetcher = async (args: string | [string, AxiosRequestConfig]) => {
  try {
    const [url, config] = Array.isArray(args) ? args : [args];

    // Add the Authorization header to the config, if not already present
    const token = getAccessToken(); // Replace with your token or retrieve it dynamically
    const authConfig = {
      ...config,
      headers: {
        ...config?.headers,
        Authorization: `Bearer ${token}`,
      },
    };

    const res = await axiosInstance.get(url, authConfig);

    return res.data;
  } catch (error) {
    console.error('Failed to fetch:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------

export const endpoints = {
  chat: '/api/chat',
  kanban: '/api/kanban',
  calendar: '/api/calendar',
  auth: {
    me: '/api/auth/me',
    signIn: '/api/login',
    signUp: '/api/register',
  },
  mail: {
    list: '/api/mail/list',
    details: '/api/mail/details',
    labels: '/api/mail/labels',
  },
  post: {
    list: '/api/post/list',
    details: '/api/post/details',
    latest: '/api/post/latest',
    search: '/api/post/search',
  },
  product: {
    list: '/api/product/list',
    details: '/api/product/details',
    search: '/api/product/search',
  },
  categories: {
    list: '/api/category/index',
  },
  verify: {
    checkOTP: '/api/user/verify-otp', //-----  /verify-otp?otp=356489
  },
  brands: {
    banners: {
      list: '/api/brand/banner/index',
      store: '/api/brand/banner/store',
      edit: '/api/brand/banner/edit/',
      delete: '/api/brand/banner/delete/',
      increaseBannerClicks: '/api/user/increase_clicks?type=3',
    },
    codes: {
      list: '/api/brand/code/index',
      store: '/api/brand/code/store',
      edit: '/api/brand/code/edit/',
      delete: '/api/brand/code/delete/',
      increaseCodeUses: '/api/user/increase_clicks?type=2',
      searchByName: '/api/brand/code/search',
      searchByCategory: '/api/brand/code/search?type=1',
      searchByStatus: '/api/brand/code/search?type=2',
    },
    list: '/api/brand/index',
    store: '/api/brand/store',
    edit: '/api/brand/edit/',
    delete: '/api/brand/delete/',
    increaseBrandOpen: '/api/user/increase_clicks?type=2',
    searchByName: '/api/brand/search',
    searchByCategory: '/api/brand/search?type=1',
    searchByStatus: '/api/brand/search?type=2',
  },
  users: {
    suggestions: {
      list: '/api/user/suggestions/index',
      store: '/api/user/suggestions/store',
    },
    searchLogs: {
      list: '/api/user/searchlogs/index',
      store: '/api/user/searchlogs/store',
    },
    list: '/api/user/index',
    show: '/api/user/show/',
  },
};
