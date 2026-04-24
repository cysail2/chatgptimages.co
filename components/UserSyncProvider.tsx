"use client";

import { useEffect, useRef } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { services } from "@/lib/services";

/**
 * Bridges Clerk auth → backend access_token.
 * When Clerk reports signedIn and we have no valid backend token,
 * call syncUser to exchange the Clerk JWT for a backend access_token.
 * Runs once per mount; also re-runs if the user signs out then back in.
 */
export function UserSyncProvider({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const { user } = useUser();
  const syncedUserIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      services.auth.clearTokens();
      syncedUserIdRef.current = null;
      return;
    }

    if (!user?.id || !user.primaryEmailAddress?.emailAddress) return;
    if (syncedUserIdRef.current === user.id && services.auth.isTokenValid()) return;

    const run = async () => {
      try {
        const clerkToken = await getToken();
        if (!clerkToken) return;

        await services.auth.syncUser({
          uuid: user.id,
          email: user.primaryEmailAddress!.emailAddress,
          nickname: user.fullName || undefined,
          avatar: user.imageUrl || undefined,
          from_login: "clerk",
          token: clerkToken,
        });
        syncedUserIdRef.current = user.id;
      } catch (err) {
        console.error("User sync failed:", err);
      }
    };

    void run();
  }, [isLoaded, isSignedIn, user, getToken]);

  return <>{children}</>;
}
