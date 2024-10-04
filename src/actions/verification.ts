import type { IPostItem } from 'src/types/blog';

import useSWR, { mutate } from 'swr';
import { useMemo, useState } from 'react';

import axios, { fetcher, endpoints, authedFetcher } from 'src/utils/axios';
import { IBrandItem } from 'src/types/brand';
import { getAccessToken } from 'src/auth/context/sanctum';
import { IDiscountCodeItem as IVerificationItem } from 'src/types/discount-code';

// ----------------------------------------------------------------------

const enableServer = false;

const VERIFY_ENDPOINT = endpoints.verify;

const swrOptions = {
  revalidateIfStale: enableServer,
  revalidateOnFocus: enableServer,
  revalidateOnReconnect: enableServer,
};

// ----------------------------------------------------------------------
type checkVerificationData = {
  otp: number | string;
};

export async function checkOTP(payload: checkVerificationData) {
  try {
    const response = await axios.post(`${VERIFY_ENDPOINT.checkOTP}`, payload, {
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
      },
    });

    return response;
  } catch (error) {
    throw error;
  }
}
