'use client';

import { cn } from '@/library/lib/utils';

import { Button } from '@/library/ui/button';
import { useNavState } from '../menu-bar/NavStateContext';

import { useUserInfo } from '@/library/providers';

interface AuthButtonProps {
  enableSignUpButton?: boolean;
  variant?: 'default' | 'mobile';
  isOnlyButton?: boolean;
}

export default function AuthButton({
  enableSignUpButton = true,
  variant = 'default',
  isOnlyButton = false,
}: AuthButtonProps) {
  const hasClerk = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  if (!hasClerk) {
    return null;
  }

  return (
    <ClerkAuthButton
      enableSignUpButton={enableSignUpButton}
      variant={variant}
      isOnlyButton={isOnlyButton}
    />
  );
}

function ClerkAuthButton({
  enableSignUpButton = true,
  variant = 'default',
  isOnlyButton = false,
}: AuthButtonProps) {
  const { isLoadingUserInfo, isSignedIn, openSignIn } = useUserInfo();
  const isMobile = variant === 'mobile';
  const { isOverlay, isScrolled } = useNavState();
  const isDarkLocked = isOverlay && !isScrolled;

  if (isLoadingUserInfo || isSignedIn) {
    return null;
  }

  if (isMobile) {
    return (
      <Button
        variant="default"
        size="sm"
        className="h-8 px-3 rounded-full text-xs transition-colors font-medium bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm"
        onClick={() => openSignIn()}
      >
        <span>Login</span>
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant={isOnlyButton ? 'default' : 'ghost'}
        size="sm"
        className={cn(
          'h-8 rounded-full text-xs transition-colors font-medium',
          isOnlyButton
            ? 'px-4 bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm'
            : cn(
                'px-3',
                isDarkLocked
                  ? 'text-white/80 hover:text-white hover:bg-white/10'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              )
        )}
        onClick={() => openSignIn()}
      >
        Login
      </Button>
      {enableSignUpButton && (
        <Button
          variant="default"
          size="sm"
          className="h-8 px-4 rounded-full text-xs transition-colors font-medium bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm"
          onClick={() => openSignIn({ mode: 'sign-up' })}
        >
          Sign Up
        </Button>
      )}
    </div>
  );
}
