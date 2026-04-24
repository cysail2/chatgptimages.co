"use client";

import { Suspense, useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";
import { useAuth, useUser } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import { services } from "@/lib/services";
import { buildAuthRoute, normalizeRedirectUrl } from "@/lib/auth-routing";

function AuthCompleteInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const startedRef = useRef(false);

  const redirectUrl = normalizeRedirectUrl(searchParams.get("redirect_url"));

  useEffect(() => {
    if (!isLoaded || startedRef.current) return;
    startedRef.current = true;

    const run = async () => {
      if (!isSignedIn || !user?.id || !user.primaryEmailAddress?.emailAddress) {
        router.replace(buildAuthRoute({ mode: "sign-in", redirectUrl }));
        return;
      }

      try {
        const clerkToken = await getToken();
        if (!clerkToken) throw new Error("Failed to get Clerk token");

        await services.auth.syncUser({
          uuid: user.id,
          email: user.primaryEmailAddress.emailAddress,
          nickname: user.fullName || undefined,
          avatar: user.imageUrl || undefined,
          from_login: "clerk",
          token: clerkToken,
        });

        window.location.replace(redirectUrl);
      } catch (err) {
        console.error("Auth sync failed:", err);
        services.auth.clearTokens();
        router.replace(buildAuthRoute({ mode: "sign-in", redirectUrl }));
      }
    };

    void run();
  }, [getToken, isLoaded, isSignedIn, redirectUrl, router, user]);

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-16">
      <div className="space-y-4 text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto" style={{ color: "var(--accent)" }} />
        <div className="space-y-1">
          <p className="text-base font-medium">Completing sign in…</p>
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            Syncing your session and preparing your account.
          </p>
        </div>
      </div>
    </div>
  );
}

export function AuthCompleteClient() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: "var(--accent)" }} />
        </div>
      }
    >
      <AuthCompleteInner />
    </Suspense>
  );
}
