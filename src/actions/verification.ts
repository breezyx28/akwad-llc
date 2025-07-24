
import axios, { endpoints } from 'src/utils/axios';

import { getAccessToken } from 'src/auth/context/sanctum';


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
