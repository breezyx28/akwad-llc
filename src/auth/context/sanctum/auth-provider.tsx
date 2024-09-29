'use client';

import { useMemo, useEffect, useCallback } from 'react';

import { useSetState } from 'src/hooks/use-set-state';

import axios, { endpoints } from 'src/utils/axios';

import { STORAGE_KEY } from './constant';
import { setSession, isValidToken } from './utils';

import { AuthContext } from '../auth-context';

import type { AuthState } from '../../types';
import { LocalStorageCache } from '@auth0/auth0-react';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: Props) {
  const { state, setState } = useSetState<AuthState>({
    user: null,
    loading: true,
  });

  const checkUserSession = useCallback(async () => {
    try {
      // Check if a Sanctum session exists
      const accessToken = sessionStorage.getItem(STORAGE_KEY);

      // Make sure the Sanctum session is valid
      if (accessToken && (await isValidToken())) {
        // Set session in axios for authorization headers
        setSession(accessToken);

        // Get the current authenticated user
        // const res = await axios.get(endpoints.auth.me);

        // const { user } = res.data;

        const user = JSON.parse(localStorage.getItem('authed-user-data') ?? "{}");

        // Update state with user data and stop loading
        setState({ user: { ...user, accessToken }, loading: false });
      } else {
        // No valid session, reset state
        setState({ user: null, loading: false });
      }
    } catch (error) {
      console.error(error);
      setState({ user: null, loading: false });
    }
  }, [setState]);

  useEffect(() => {
    checkUserSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ----------------------------------------------------------------------

  const checkAuthenticated = state.user ? 'authenticated' : 'unauthenticated';

  const status = state.loading ? 'loading' : checkAuthenticated;

  const memoizedValue = useMemo(
    () => ({
      user: state.user
        ? {
            ...state.user,
            role: state.user?.role ?? 'admin',
          }
        : null,
      checkUserSession,
      loading: status === 'loading',
      authenticated: status === 'authenticated',
      unauthenticated: status === 'unauthenticated',
    }),
    [checkUserSession, state.user, status]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}
