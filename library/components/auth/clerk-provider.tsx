'use client';

import { ClerkProvider } from '@clerk/nextjs';
import { enUS } from '@clerk/localizations';
import { dark } from '@clerk/themes';
import { useTheme } from 'next-themes';
import { cn } from '@/library/lib/utils';

export default function ClerkProviderWithLocale({
  children,
  modal = false,
}: {
  children: React.ReactNode;
  modal?: boolean;
}) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  if (!publishableKey) {
    return <>{children}</>;
  }

  return (
    <ClerkProvider
      localization={enUS}
      appearance={{
        baseTheme: isDark ? dark : undefined,
        layout: {
          socialButtonsVariant: "iconButton",
          socialButtonsPlacement: "top",
          showOptionalFields: false,
          shimmer: true
        },
        variables: {
          colorPrimary: isDark ? "#ffffff" : "#000000",
          borderRadius: "0.5rem",
          fontFamily: "system-ui, -apple-system, 'PingFang SC', 'Microsoft YaHei'"
        },
        elements: {
          rootBox: modal
            ? "flex justify-center items-start pt-0"
            : "flex justify-center items-start pt-10 sm:pt-14",
          main: "w-full max-w-[440px] px-0 font-sans",
          modalContent: "w-[calc(100vw-20px)] max-w-[440px] sm:w-[440px] px-1 sm:px-0",
          card: cn(
            "shadow-none w-full border px-3 sm:px-6",
            isDark ? "border-white/10" : "border-gray-200"
          ),
          footer: "hidden",
          formFieldInput: cn(
            "w-full rounded-md border transition-colors",
            isDark ? "border-white/10 bg-white/5 focus:border-white/20" : "border-gray-300 focus:border-black focus:ring-black"
          ),
          formButtonPrimary: cn(
            "w-full text-sm normal-case",
            isDark ? "bg-white text-black hover:bg-gray-200" : "bg-black hover:bg-gray-800"
          ),
          socialButtons: "w-full gap-3",
          socialButtonsBlockButton: "w-full",
          formFieldLabel: isDark ? "text-gray-400" : "text-gray-700",
          identityPreview: isDark ? "border-white/10" : "border-gray-200"
        }
      }}
    >
      {children}
    </ClerkProvider>
  );
}
