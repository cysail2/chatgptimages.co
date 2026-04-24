'use client';

import { useEffect, Suspense } from 'react';
import { Loader2, X } from 'lucide-react';
import { SignIn, SignUp, useAuth } from '@clerk/nextjs';
import { useRouter, useSearchParams } from 'next/navigation';
import ClerkProviderWithLocale from '@/library/components/auth/clerk-provider';
import {
  buildAuthCompleteRoute,
  buildAuthRoute,
  normalizeRedirectUrl,
  type AuthRouteMode,
} from '@/library/components/auth/auth-routing';
import { useUserInfo } from '@/library/providers';
import { Button } from '@/library/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/library/ui/dialog';

interface AuthRouteContentProps {
  mode: AuthRouteMode;
  modal?: boolean;
}

function LoadingState({
  title,
  onCancel,
}: {
  title: string;
  onCancel?: () => void;
}) {
  return (
    <div className="flex min-h-[240px] w-full items-center justify-center">
      <div className="w-full max-w-[360px] rounded-2xl border border-border/70 bg-background/95 px-6 py-7 text-center shadow-xl">
        <div className="flex flex-col items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
          <div className="space-y-1.5">
            <p className="text-lg font-semibold text-foreground">{title}</p>
            <p className="text-sm text-muted-foreground">Preparing authentication…</p>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div className="h-full w-1/2 animate-pulse rounded-full bg-primary/70" />
          </div>
        </div>
        {onCancel ? (
          <Button variant="outline" size="sm" className="mt-5 min-w-28" onClick={onCancel}>
            Cancel
          </Button>
        ) : null}
      </div>
    </div>
  );
}

function AuthUnavailable() {
  return (
    <div className="flex min-h-[240px] w-full items-center justify-center text-center">
      <div className="space-y-2">
        <p className="text-base font-medium text-foreground">Authentication is unavailable</p>
        <p className="text-sm text-muted-foreground">
          Clerk is not configured for this deployment.
        </p>
      </div>
    </div>
  );
}

function useAuthRouteState(mode: AuthRouteMode) {
  const searchParams = useSearchParams();
  const { isLoaded, isSignedIn } = useAuth();
  const { isSignedIn: hasBackendSession, isLoadingUserInfo } = useUserInfo();

  const redirectUrl = normalizeRedirectUrl(searchParams.get('redirect_url'));
  const ivcode = searchParams.get('ivcode');
  const completeUrl = buildAuthCompleteRoute(redirectUrl, ivcode);
  const signInUrl = buildAuthRoute({ mode: 'sign-in', redirectUrl, ivcode });
  const signUpUrl = buildAuthRoute({ mode: 'sign-up', redirectUrl, ivcode });
  const shouldRedirectBack = hasBackendSession && !isLoadingUserInfo;
  const shouldCompleteAuth = isLoaded && isSignedIn && !hasBackendSession;
  const shouldShowAuthUi =
    isLoaded && !isSignedIn && !hasBackendSession && !isLoadingUserInfo;
  const isTransitioning =
    !shouldRedirectBack && !shouldCompleteAuth && !shouldShowAuthUi;

  return {
    hasBackendSession,
    completeUrl,
    isTransitioning,
    isLoaded,
    isLoadingUserInfo,
    isSignedIn,
    ivcode,
    redirectUrl,
    signInUrl,
    signUpUrl,
    shouldCompleteAuth,
    shouldRedirectBack,
    shouldShowAuthUi,
  };
}

function useAuthRouteController(mode: AuthRouteMode) {
  const router = useRouter();
  const { clearAuthRoutePending } = useUserInfo();
  const state = useAuthRouteState(mode);
  const {
    completeUrl,
    redirectUrl,
    shouldCompleteAuth,
    shouldRedirectBack,
    shouldShowAuthUi,
  } = state;

  useEffect(() => {
    if (shouldRedirectBack) {
      clearAuthRoutePending();
      router.replace(redirectUrl);
    }
  }, [clearAuthRoutePending, redirectUrl, router, shouldRedirectBack]);

  useEffect(() => {
    if (shouldCompleteAuth) {
      clearAuthRoutePending();
      window.location.replace(completeUrl);
    }
  }, [clearAuthRoutePending, completeUrl, shouldCompleteAuth]);

  useEffect(() => {
    if (shouldShowAuthUi) {
      clearAuthRoutePending();
    }
  }, [clearAuthRoutePending, shouldShowAuthUi]);

  return state;
}

function AuthRouteInner({ mode }: { mode: AuthRouteMode }) {
  const { completeUrl, signInUrl, signUpUrl } = useAuthRouteState(mode);
  const commonProps = {
    routing: 'path' as const,
    path: mode === 'sign-up' ? '/sign-up' : '/sign-in',
    forceRedirectUrl: completeUrl,
    fallbackRedirectUrl: completeUrl,
    signInUrl,
    signUpUrl,
  };

  return mode === 'sign-up' ? (
    <SignUp {...commonProps} />
  ) : (
    <SignIn {...commonProps} />
  );
}

function AuthPageContent({ mode }: { mode: AuthRouteMode }) {
  const { isTransitioning, shouldShowAuthUi } = useAuthRouteController(mode);

  if (!shouldShowAuthUi) {
    return <LoadingState title={mode === 'sign-up' ? 'Opening sign up' : 'Opening sign in'} />;
  }

  if (isTransitioning) {
    return <LoadingState title={mode === 'sign-up' ? 'Opening sign up' : 'Opening sign in'} />;
  }

  return <AuthRouteInner mode={mode} />;
}

function AuthPageFrame({
  mode,
  children,
}: {
  mode: AuthRouteMode;
  children: React.ReactNode;
}) {
  const title = mode === 'sign-up' ? 'Create your account' : 'Welcome back';
  const description =
    mode === 'sign-up'
      ? 'Finish account creation in a dedicated auth flow.'
      : 'Continue with your account to unlock user features.';

  return (
    <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center px-4 py-16 sm:px-6">
      <div className="w-full max-w-[460px] space-y-4">
        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h1>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        {children}
      </div>
    </div>
  );
}

function AuthModalFrame({ mode }: { mode: AuthRouteMode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fallbackUrl = normalizeRedirectUrl(searchParams.get('redirect_url'));
  const { clearAuthRoutePending } = useUserInfo();
  const { shouldShowAuthUi } = useAuthRouteController(mode);

  const handleClose = () => {
    clearAuthRoutePending();
    if (window.history.length > 1) {
      router.back();
      return;
    }
    router.replace(fallbackUrl);
  };

  if (!shouldShowAuthUi) {
    return null;
  }

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) {
          handleClose();
        }
      }}
    >
      <DialogContent
        hideCloseButton
        className="w-[calc(100vw-24px)] max-w-[460px] border-0 bg-transparent p-0 shadow-none"
      >
        <div className="sr-only">
          <DialogTitle>{mode === 'sign-up' ? 'Sign up' : 'Sign in'}</DialogTitle>
          <DialogDescription>
            {mode === 'sign-up' ? 'Create a new account.' : 'Sign in to your account.'}
          </DialogDescription>
        </div>
        <div className="relative mx-auto w-fit max-w-full">
          <DialogClose className="absolute top-3 right-3 z-10 rounded-full border border-border/60 bg-background/90 p-2 text-muted-foreground shadow-sm transition hover:text-foreground">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
          <AuthRouteInner mode={mode} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function AuthRouteContent({ mode, modal = false }: AuthRouteContentProps) {
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    return modal ? (
      <Dialog open>
        <DialogContent
          hideCloseButton
          className="w-[calc(100vw-24px)] max-w-[460px] border-0 bg-transparent p-0 shadow-none"
        >
          <AuthUnavailable />
        </DialogContent>
      </Dialog>
    ) : (
      <AuthPageFrame mode={mode}>
        <AuthUnavailable />
      </AuthPageFrame>
    );
  }

  return (
    <ClerkProviderWithLocale modal={modal}>
      <Suspense fallback={<LoadingState title="Opening authentication" />}>
        {modal ? (
          <AuthModalFrame mode={mode} />
        ) : (
          <AuthPageFrame mode={mode}>
            <AuthPageContent mode={mode} />
          </AuthPageFrame>
        )}
      </Suspense>
    </ClerkProviderWithLocale>
  );
}
