'use client';

import { Suspense, useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import { useClerk } from '@clerk/nextjs';
import { useRouter, useSearchParams } from 'next/navigation';
import ClerkProviderWithLocale from '@/library/components/auth/clerk-provider';
import { normalizeRedirectUrl } from '@/library/components/auth/auth-routing';
import { useUserInfo } from '@/library/providers';

function SignOutInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signOut } = useClerk();
  const { clearUserState } = useUserInfo();
  const hasStartedRef = useRef(false);
  const redirectUrl = normalizeRedirectUrl(searchParams.get('redirect_url'));

  useEffect(() => {
    if (hasStartedRef.current) {
      return;
    }

    hasStartedRef.current = true;

    const run = async () => {
      clearUserState();

      try {
        await signOut();
      } catch (error) {
        console.error('Failed to sign out from Clerk:', error);
      } finally {
        window.location.replace(redirectUrl);
      }
    };

    void run();
  }, [clearUserState, redirectUrl, signOut]);

  return (
    <div className="flex min-h-[320px] items-center justify-center px-4 py-16 text-center">
      <div className="space-y-3">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
        <p className="text-base font-medium text-foreground">Signing out…</p>
        <p className="text-sm text-muted-foreground">Clearing your session.</p>
      </div>
    </div>
  );
}

export function SignOutPage() {
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    return (
      <div className="flex min-h-[320px] items-center justify-center px-4 py-16 text-center">
        <div className="space-y-2">
          <p className="text-base font-medium text-foreground">Signed out</p>
          <p className="text-sm text-muted-foreground">
            No Clerk session is configured for this deployment.
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
        <SignOutInner />
      </Suspense>
    </ClerkProviderWithLocale>
  );
}
