'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { api } from '@/library/services/api';
import { useToast } from '@/library/ui/toast-provider';
import {
  buildAuthRoute,
  buildSignOutRoute,
  getCurrentReturnUrl,
  getIvcodeFromCurrentLocation,
  type AuthRouteMode,
} from '@/library/components/auth/auth-routing';

export interface UserInfo {
  uuid: string;
  email: string;
  from_login: string;
  nickname: string;
  avatar?: string;
  free_limit: number;
  free_times: number;
  remaining_limit: number;
  total_limit: number;
  use_limit: number;
  vip_last_time: number;
  level: number;
  created_at: number;
  updated_at: number;
  status: number;
  id: number;
  total_credits: number;
}

interface OpenSignInOptions {
  forceRedirectUrl?: string;
  mode?: AuthRouteMode;
}

interface UserContextType {
  userInfo: UserInfo | null;
  isLoadingUserInfo: boolean;
  isAuthRoutePending: boolean;
  refreshUserInfo: () => Promise<void>;
  clearUserState: () => void;
  clearAuthRoutePending: () => void;
  isSignedIn: boolean;
  openSignIn: (options?: OpenSignInOptions) => void;
  signOut: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

const mapUserInfo = (data: any): UserInfo => ({
  uuid: data.uuid,
  email: data.email,
  from_login: data.from_login,
  nickname: data.nickname,
  avatar: data.avatar,
  free_limit: data.free_limit,
  free_times: data.free_times ?? 0,
  remaining_limit: data.remaining_limit,
  total_limit: data.total_limit,
  use_limit: data.use_limit,
  vip_last_time: data.vip_last_time,
  level: data.level,
  created_at: data.created_at,
  updated_at: data.updated_at,
  status: data.status,
  id: data.id,
  total_credits: data.free_limit + data.remaining_limit,
});

const hasValidStoredToken = () => {
  if (typeof window === 'undefined') {
    return false;
  }
  return api.auth.isTokenValid();
};

const isUnauthorizedError = (error: unknown) => {
  const message = String((error as any)?.message || error);
  return /HTTP Error\s+(401|403)/i.test(message);
};

export function UserProvider({ children }: UserProviderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { error: showErrorToast } = useToast();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isLoadingUserInfo, setIsLoadingUserInfo] = useState(hasValidStoredToken);
  const [hasSessionToken, setHasSessionToken] = useState(hasValidStoredToken);
  const [isAuthRoutePending, setIsAuthRoutePending] = useState(false);

  const clearAuthRoutePending = useCallback(() => {
    setIsAuthRoutePending(false);
  }, []);

  const clearUserState = useCallback(() => {
    try {
      api.auth.clearTokens();
    } catch (error) {
      console.warn('clearUserState: failed to clear local auth tokens', error);
    }
    setHasSessionToken(false);
    setUserInfo(null);
    setIsLoadingUserInfo(false);
  }, []);

  const fetchUserInfo = useCallback(
    async (isInitialLoad = false) => {
      if (!hasValidStoredToken()) {
        setHasSessionToken(false);
        setUserInfo(null);
        setIsLoadingUserInfo(false);
        return;
      }

      setHasSessionToken(true);
      if (isInitialLoad) {
        setIsLoadingUserInfo(true);
      }

      try {
        const result = await api.user.getUserInfo();

        if (result.code === 200 && result.data) {
          setUserInfo(mapUserInfo(result.data));
          setHasSessionToken(true);
        } else {
          setUserInfo(null);
        }
      } catch (error) {
        console.error('Failed to fetch user info:', error);

        if (isUnauthorizedError(error)) {
          clearUserState();
          return;
        }

        setUserInfo(null);
        if (isInitialLoad) {
          const errorMessage =
            error instanceof Error ? error.message : 'Failed to fetch user info';
          showErrorToast(errorMessage);
        }
      } finally {
        if (isInitialLoad) {
          setIsLoadingUserInfo(false);
        }
      }
    },
    [clearUserState, showErrorToast]
  );

  const refreshUserInfo = useCallback(async () => {
    await fetchUserInfo(true);
  }, [fetchUserInfo]);

  useEffect(() => {
    void fetchUserInfo(true);
  }, [fetchUserInfo]);

  useEffect(() => {
    if (!hasSessionToken) {
      return;
    }

    const intervalId = window.setInterval(() => {
      if (hasValidStoredToken()) {
        void fetchUserInfo(false);
      } else {
        clearUserState();
      }
    }, 30000);

    return () => window.clearInterval(intervalId);
  }, [clearUserState, fetchUserInfo, hasSessionToken]);

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (
        event.key === null ||
        event.key === 'access_token' ||
        event.key === 'refresh_token' ||
        event.key === 'token_expire_at'
      ) {
        if (hasValidStoredToken()) {
          setHasSessionToken(true);
          void fetchUserInfo(false);
          return;
        }

        clearUserState();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [clearUserState, fetchUserInfo]);

  useEffect(() => {
    if (pathname?.startsWith('/sign-in') || pathname?.startsWith('/sign-up')) {
      return;
    }
    setIsAuthRoutePending(false);
  }, [pathname]);

  const openSignIn = useCallback(
    (options?: OpenSignInOptions) => {
      if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
        console.warn('openSignIn: Clerk is not configured');
        return;
      }

      setIsAuthRoutePending(true);
      const redirectUrl = options?.forceRedirectUrl || getCurrentReturnUrl();
      const ivcode = getIvcodeFromCurrentLocation();
      router.push(
        buildAuthRoute({
          mode: options?.mode ?? 'sign-in',
          redirectUrl,
          ivcode,
        })
      );
    },
    [router]
  );

  const signOut = useCallback(async () => {
    clearUserState();

    if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
      router.replace('/');
      router.refresh();
      return;
    }

    const target = buildSignOutRoute(getCurrentReturnUrl());
    window.location.assign(target);
  }, [clearUserState, router]);

  const value = useMemo<UserContextType>(
    () => ({
      userInfo,
      isLoadingUserInfo,
      isAuthRoutePending,
      refreshUserInfo,
      clearUserState,
      clearAuthRoutePending,
      isSignedIn: hasSessionToken,
      openSignIn,
      signOut,
    }),
    [
      clearUserState,
      clearAuthRoutePending,
      hasSessionToken,
      isAuthRoutePending,
      isLoadingUserInfo,
      openSignIn,
      refreshUserInfo,
      signOut,
      userInfo,
    ]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUserInfo() {
  const context = useContext(UserContext);
  if (context === undefined) {
    return {
      userInfo: null,
      isLoadingUserInfo: false,
      isAuthRoutePending: false,
      refreshUserInfo: async () => {},
      clearUserState: () => {},
      clearAuthRoutePending: () => {},
      isSignedIn: false,
      openSignIn: () => {},
      signOut: async () => {},
    };
  }
  return context;
}
