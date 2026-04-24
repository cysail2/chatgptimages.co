'use client';

import { Suspense, useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import { useAuth, useUser } from '@clerk/nextjs';
import { useRouter, useSearchParams } from 'next/navigation';
import ClerkProviderWithLocale from '@/library/components/auth/clerk-provider';
import {
  buildAuthRoute,
  normalizeRedirectUrl,
} from '@/library/components/auth/auth-routing';
import { api } from '@/library/services/api';
import { useToast } from '@/library/ui/toast-provider';
import { useUserInfo } from '@/library/providers';

function AuthSyncInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const { refreshUserInfo } = useUserInfo();
  const { error: showErrorToast } = useToast();
  const hasStartedRef = useRef(false);

  const redirectUrl = normalizeRedirectUrl(searchParams.get('redirect_url'));
  const ivcode = searchParams.get('ivcode') || searchParams.get('i');

  useEffect(() => {
    if (!isLoaded || hasStartedRef.current) {
      return;
    }

    hasStartedRef.current = true;

    const run = async () => {
      if (!isSignedIn || !user?.id || !user.primaryEmailAddress?.emailAddress) {
        router.replace(buildAuthRoute({ mode: 'sign-in', redirectUrl, ivcode }));
        return;
      }

      try {
        const clerkToken = await getToken();

        if (!clerkToken) {
          throw new Error('Failed to get Clerk token');
        }

        await api.auth.syncUser({
          uuid: user.id,
          email: user.primaryEmailAddress.emailAddress,
          nickname: user.fullName || undefined,
          avatar: user.imageUrl || undefined,
          from_login: 'google',
          token: clerkToken,
          ivcode: ivcode || undefined,
        });

        await refreshUserInfo();
        window.location.replace(redirectUrl);
      } catch (error) {
        console.error('Auth sync failed:', error);
        api.auth.clearTokens();
        showErrorToast(
          error instanceof Error ? error.message : 'Failed to complete sign in'
        );
        router.replace(buildAuthRoute({ mode: 'sign-in', redirectUrl, ivcode }));
      }
    };

    void run();
  }, [
    getToken,
    isLoaded,
    isSignedIn,
    ivcode,
    redirectUrl,
    refreshUserInfo,
    router,
    showErrorToast,
    user,
  ]);

  return (
    <div className="flex min-h-[320px] items-center justify-center px-4 py-16 text-center">
      <div className="space-y-3">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
        <p className="text-base font-medium text-foreground">Completing sign in…</p>
        <p className="text-sm text-muted-foreground">
          We are syncing your session and preparing your account.
        </p>
      </div>
    </div>
  );
}

export function AuthSyncPage() {
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    return (
      <div className="flex min-h-[320px] items-center justify-center px-4 py-16 text-center">
        <div className="space-y-2">
          <p className="text-base font-medium text-foreground">Authentication is unavailable</p>
          <p className="text-sm text-muted-foreground">
            Clerk is not configured for this deployment.
          </p>
        </div>
      </div>
    );
  }

  return (
    <ClerkProviderWithLocale>
      <Suspense
        fallback={
          <div className="flex min-h-[320px] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        }
      >
        <AuthSyncInner />
      </Suspense>
    </ClerkProviderWithLocale>
  );
}
