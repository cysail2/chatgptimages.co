'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { useAuth, useClerk, useUser } from '@clerk/nextjs';
import { api } from '@/library/services/api';
import { useToast } from '@/library/ui/toast-provider';

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
  mode?: 'sign-in' | 'sign-up';
  forceRedirectUrl?: string;
}

interface UserContextType {
  userInfo: UserInfo | null;
  isLoadingUserInfo: boolean;
  refreshUserInfo: () => Promise<void>;
  clearUserState: () => void;
  /**
   * No-op kept for backward compatibility with the legacy /sign-in route
   * components. The new modal-based flow has no "auth route pending" state.
   */
  clearAuthRoutePending: () => void;
  isSignedIn: boolean;
  openSignIn: (options?: OpenSignInOptions) => void;
  signOut: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

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
  if (typeof window === 'undefined') return false;
  return api.auth.isTokenValid();
};

const isUnauthorizedError = (error: unknown) => {
  const message = String((error as any)?.message || error);
  return /HTTP Error\s+(401|403)/i.test(message);
};

const isAccountDisabledError = (error: unknown) => {
  const message = String((error as any)?.message || error);
  if (/API Business Error 331\b/.test(message)) return true;
  if (/account\b[^.]*\bdisabled/i.test(message)) return true;
  return false;
};

const IVCODE_CACHE_KEY = 'pending_ivcode';

const saveIvcodeToCache = (ivcode: string) => {
  try {
    localStorage.setItem(IVCODE_CACHE_KEY, ivcode);
  } catch {
    /* noop */
  }
};

const getIvcodeFromCache = (): string | null => {
  try {
    return localStorage.getItem(IVCODE_CACHE_KEY);
  } catch {
    return null;
  }
};

const clearIvcodeCache = () => {
  try {
    localStorage.removeItem(IVCODE_CACHE_KEY);
  } catch {
    /* noop */
  }
};

function ClerkUserProvider({ children }: { children: ReactNode }) {
  const { user, isSignedIn, isLoaded } = useUser();
  const { getToken } = useAuth();
  const {
    openSignIn: clerkOpenSignIn,
    openSignUp: clerkOpenSignUp,
    signOut: clerkSignOut,
  } = useClerk();
  const { error: showErrorToast } = useToast();

  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isLoadingUserInfo, setIsLoadingUserInfo] = useState(hasValidStoredToken);
  const [hasSessionToken, setHasSessionToken] = useState(hasValidStoredToken);
  const syncedUserIdsRef = useRef<Set<string>>(new Set());

  // Snapshot ivcode from URL on first mount so it survives the OAuth round-trip.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const ivcode = new URLSearchParams(window.location.search).get('ivcode');
      if (ivcode) saveIvcodeToCache(ivcode);
    } catch {
      /* noop */
    }
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
      if (isInitialLoad) setIsLoadingUserInfo(true);

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

        if (isAccountDisabledError(error)) {
          clearUserState();
          showErrorToast('Your account is no longer available. Signing you out.');
          try {
            await clerkSignOut();
          } catch {
            /* noop */
          }
          if (typeof window !== 'undefined') window.location.assign('/');
          return;
        }

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
        if (isInitialLoad) setIsLoadingUserInfo(false);
      }
    },
    [clearUserState, clerkSignOut, showErrorToast]
  );

  const refreshUserInfo = useCallback(async () => {
    await fetchUserInfo(true);
  }, [fetchUserInfo]);

  // Sync Clerk session to backend, then load user info.
  const syncUserToBackend = useCallback(async () => {
    if (!isSignedIn || !user?.id || !user?.primaryEmailAddress?.emailAddress) {
      return;
    }
    const userId = user.id;
    const email = user.primaryEmailAddress.emailAddress;
    if (syncedUserIdsRef.current.has(userId)) return;
    syncedUserIdsRef.current.add(userId);

    let clerkToken: string | null = null;
    try {
      clerkToken = await getToken();
    } catch (tokenError) {
      console.error('Failed to get Clerk token:', tokenError);
      syncedUserIdsRef.current.delete(userId);
      showErrorToast('Failed to get user token, please sign in again');
      try {
        await clerkSignOut();
      } catch {
        /* noop */
      }
      return;
    }
    if (!clerkToken) {
      console.warn('Clerk token empty, signing out');
      syncedUserIdsRef.current.delete(userId);
      api.auth.clearTokens();
      showErrorToast('User token is empty, please sign in again');
      try {
        await clerkSignOut();
      } catch {
        /* noop */
      }
      return;
    }

    let ivcode = getIvcodeFromCache();
    if (!ivcode && typeof window !== 'undefined') {
      try {
        const params = new URLSearchParams(window.location.search);
        ivcode = params.get('ivcode') || params.get('i');
        if (ivcode) saveIvcodeToCache(ivcode);
      } catch {
        /* noop */
      }
    }

    try {
      const responseData = await api.auth.syncUser({
        uuid: userId,
        email,
        nickname: user.fullName || undefined,
        avatar: user.imageUrl || undefined,
        from_login: 'google',
        token: clerkToken,
        ivcode: ivcode || undefined,
      });

      if (!responseData || responseData.code !== 200) {
        throw new Error(
          `Sync failed: ${responseData?.message || responseData?.msg || 'Unknown error'}`
        );
      }
      if (!responseData.data?.access_token) {
        throw new Error('Sync succeeded but no access_token received');
      }

      if (ivcode) clearIvcodeCache();

      // syncUser writes the backend token into localStorage internally.
      // Pull /api/user/info now that the token is live.
      await fetchUserInfo(true);
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      console.error('Failed to sync user to backend:', msg);
      syncedUserIdsRef.current.delete(userId);
      try {
        api.auth.clearTokens();
      } catch {
        /* noop */
      }
      setUserInfo(null);
      setHasSessionToken(false);
      showErrorToast(`Sign in failed: ${msg}`);
      try {
        await clerkSignOut();
      } catch {
        /* noop */
      }
    }
  }, [clerkSignOut, fetchUserInfo, getToken, isSignedIn, user, showErrorToast]);

  // React to Clerk session changes (login / logout).
  useEffect(() => {
    if (!isLoaded) return;

    if (isSignedIn && user?.id) {
      // If we already have a valid backend token (e.g. page refresh), skip
      // re-sync — the bootstrap effect below will fetch /api/user/info.
      if (hasValidStoredToken()) {
        syncedUserIdsRef.current.add(user.id);
        return;
      }
      void syncUserToBackend();
    } else {
      // Clerk says user is signed out — drop any stale local session.
      if (hasValidStoredToken()) {
        clearUserState();
      } else {
        setUserInfo(null);
        setHasSessionToken(false);
      }
      syncedUserIdsRef.current.clear();
    }
  }, [clearUserState, isLoaded, isSignedIn, syncUserToBackend, user?.id]);

  // Bootstrap: load /api/user/info if a backend token is already stored.
  useEffect(() => {
    let timeoutId: number | undefined;
    if (typeof window !== 'undefined') {
      // Safety net so a hung fetch can't pin the loading shell forever.
      timeoutId = window.setTimeout(() => {
        setIsLoadingUserInfo(false);
      }, 15000);
    }
    void fetchUserInfo(true).finally(() => {
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
    });
    return () => {
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
    };
  }, [fetchUserInfo]);

  // 30s background refresh while signed in.
  useEffect(() => {
    if (!hasSessionToken) return;
    const intervalId = window.setInterval(() => {
      if (hasValidStoredToken()) {
        void fetchUserInfo(false);
      } else {
        clearUserState();
      }
    }, 30000);
    return () => window.clearInterval(intervalId);
  }, [clearUserState, fetchUserInfo, hasSessionToken]);

  // Cross-tab token sync.
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
        } else {
          clearUserState();
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [clearUserState, fetchUserInfo]);

  const openSignIn = useCallback(
    (options?: OpenSignInOptions) => {
      if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
        console.warn('openSignIn: Clerk is not configured');
        return;
      }
      const mode = options?.mode ?? 'sign-in';
      const clerkProps: Record<string, unknown> = {};
      if (options?.forceRedirectUrl) {
        clerkProps.forceRedirectUrl = options.forceRedirectUrl;
      }
      if (mode === 'sign-up') {
        clerkOpenSignUp(clerkProps as any);
      } else {
        clerkOpenSignIn(clerkProps as any);
      }
    },
    [clerkOpenSignIn, clerkOpenSignUp]
  );

  const signOut = useCallback(async () => {
    clearUserState();
    try {
      await clerkSignOut();
    } catch (error) {
      console.warn('Clerk signOut failed:', error);
    }
    if (typeof window !== 'undefined') {
      window.location.assign('/');
    }
  }, [clearUserState, clerkSignOut]);

  const value = useMemo<UserContextType>(
    () => ({
      userInfo,
      isLoadingUserInfo,
      refreshUserInfo,
      clearUserState,
      clearAuthRoutePending: () => {},
      isSignedIn: hasSessionToken,
      openSignIn,
      signOut,
    }),
    [
      clearUserState,
      hasSessionToken,
      isLoadingUserInfo,
      openSignIn,
      refreshUserInfo,
      signOut,
      userInfo,
    ]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

function MockUserProvider({ children }: { children: ReactNode }) {
  const value: UserContextType = {
    userInfo: null,
    isLoadingUserInfo: false,
    refreshUserInfo: async () => {},
    clearUserState: () => {},
    clearAuthRoutePending: () => {},
    isSignedIn: false,
    openSignIn: () => {
      console.warn('Sign in not available without NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY');
    },
    signOut: async () => {},
  };
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function UserProvider({ children }: { children: ReactNode }) {
  const hasClerkKey = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  if (hasClerkKey) {
    return <ClerkUserProvider>{children}</ClerkUserProvider>;
  }
  return <MockUserProvider>{children}</MockUserProvider>;
}

export function useUserInfo() {
  const context = useContext(UserContext);
  if (context === undefined) {
    return {
      userInfo: null,
      isLoadingUserInfo: false,
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
