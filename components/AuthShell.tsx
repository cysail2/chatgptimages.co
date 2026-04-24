"use client";

import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { SignIn, SignUp } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useSearchParams } from "next/navigation";
import { buildAuthCompleteRoute, buildAuthRoute, type AuthRouteMode, normalizeRedirectUrl } from "@/lib/auth-routing";

const commonAppearance = {
  baseTheme: dark,
  layout: {
    socialButtonsVariant: "iconButton" as const,
    socialButtonsPlacement: "top" as const,
    showOptionalFields: false,
    shimmer: true,
  },
  variables: {
    colorPrimary: "#7c5cfc",
    colorBackground: "#13131f",
    colorInputBackground: "rgba(255,255,255,0.04)",
    colorText: "#f1f0ff",
    colorTextSecondary: "#8b8aa0",
    borderRadius: "0.75rem",
    fontFamily: "system-ui, -apple-system, sans-serif",
  },
  elements: {
    rootBox: "w-full",
    main: "w-full",
    card: "shadow-none border rounded-2xl",
    footer: "hidden",
    formButtonPrimary:
      "w-full text-sm normal-case bg-gradient-to-br from-[#7c5cfc] to-[#38bdf8] hover:opacity-90",
    socialButtons: "w-full gap-3",
    socialButtonsBlockButton: "w-full",
  },
};

function AuthFrame({ mode, children }: { mode: AuthRouteMode; children: React.ReactNode }) {
  const title = mode === "sign-up" ? "Create your account" : "Welcome back";
  const description =
    mode === "sign-up"
      ? `Start creating with ChatGPT Images 2.0 — 12 free credits on signup.`
      : "Continue with your ChatGPT Images account.";

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-[460px] space-y-6">
        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          <p className="text-sm" style={{ color: "var(--muted)" }}>{description}</p>
        </div>
        {children}
      </div>
    </div>
  );
}

function AuthUnavailable() {
  return (
    <div className="text-center space-y-2">
      <p className="text-base font-medium">Authentication is unavailable</p>
      <p className="text-sm" style={{ color: "var(--muted)" }}>
        Clerk is not configured for this deployment.
      </p>
    </div>
  );
}

function AuthInner({ mode }: { mode: AuthRouteMode }) {
  const searchParams = useSearchParams();
  const redirectUrl = normalizeRedirectUrl(searchParams.get("redirect_url"));
  const completeUrl = buildAuthCompleteRoute(redirectUrl);
  const signInUrl = buildAuthRoute({ mode: "sign-in", redirectUrl });
  const signUpUrl = buildAuthRoute({ mode: "sign-up", redirectUrl });

  const props = {
    routing: "path" as const,
    path: mode === "sign-up" ? "/sign-up" : "/sign-in",
    forceRedirectUrl: completeUrl,
    fallbackRedirectUrl: completeUrl,
    signInUrl,
    signUpUrl,
    appearance: commonAppearance,
  };

  return mode === "sign-up" ? <SignUp {...props} /> : <SignIn {...props} />;
}

export function AuthShell({ mode }: { mode: AuthRouteMode }) {
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    return (
      <AuthFrame mode={mode}>
        <AuthUnavailable />
      </AuthFrame>
    );
  }

  return (
    <AuthFrame mode={mode}>
      <Suspense
        fallback={
          <div className="flex justify-center py-10">
            <Loader2 className="w-6 h-6 animate-spin" style={{ color: "var(--accent)" }} />
          </div>
        }
      >
        <AuthInner mode={mode} />
      </Suspense>
    </AuthFrame>
  );
}
