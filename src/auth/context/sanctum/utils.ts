import { paths } from 'src/routes/paths';
import axios from 'src/utils/axios';
import { STORAGE_KEY } from './constant';

// ----------------------------------------------------------------------

export function csrfCookie() {
  return axios.get('/sanctum/csrf-cookie');
}

// ----------------------------------------------------------------------

export function setAuthorizationHeader(accessToken: string | null) {
  if (accessToken) {
    axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
  } else {
    delete axios.defaults.headers.common.Authorization;
  }
}

// ----------------------------------------------------------------------

export async function setSession(accessToken: string | null) {
  try {
    if (accessToken) {
      sessionStorage.setItem(STORAGE_KEY, accessToken);

      // Set authorization header for future requests
      setAuthorizationHeader(accessToken);

      // Optionally, call Sanctum's CSRF cookie endpoint if needed
      // await csrfCookie();
    } else {
      // Clear session storage and axios authorization header
      sessionStorage.removeItem(STORAGE_KEY);
      setAuthorizationHeader(null);
    }
  } catch (error) {
    console.error('Error during set session:', error);
    throw error;
  }
}

export function getAccessToken(): string | null {
  try {
    const accessToken = sessionStorage.getItem(STORAGE_KEY);
    return accessToken;
  } catch (error) {
    console.error('Error retrieving access token:', error);
    return null;
  }
}

// ----------------------------------------------------------------------
// Function to check if the Sanctum token is valid by calling a protected route
export async function isValidToken(): Promise<boolean> {
  try {
    // Make a request to a Sanctum-protected endpoint to check token validity
    const response = await axios.get('/api/user/index'); // Adjust this endpoint to your protected route

    // If the request succeeds, the token is valid
    return response.status === 200;
  } catch (error) {
    console.error('Error during token validation:', error);
    return false;
  }
}

// ----------------------------------------------------------------------

export function tokenExpired() {
  try {
    alert('Token expired!');
    sessionStorage.removeItem(STORAGE_KEY);
    window.location.href = paths.auth.sanctum.signIn;
  } catch (error) {
    console.error('Error during token expiration:', error);
    throw error;
  }
}
