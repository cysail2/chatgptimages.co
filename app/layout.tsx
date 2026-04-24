import "./globals.css";
import { Suspense } from "react";
import type { Metadata } from "next";
import PaymentStatusModal from "@/components/payment-status-modal";
import { ToastProvider } from "@/components/ui/toast-provider";
import { TaskCenterWidget } from "@/components/task-center/TaskCenterWidget";
import { AnalyticsScripts } from "@/components/AnalyticsScripts";
import { AudioPlayerProvider } from "@/components/audio-player/AudioPlayerProvider";
import {
  getFrontendSiteConfig,
} from "@/services/frontend-data.server";
import { SiteThemeProvider } from "@/providers/SiteThemeProvider";
import { Navbar, NavbarConfigProvider } from "@/components/menu-bar";
import { Footer } from "@/components/Footer";
import { AnchorScrollHandler } from "@/components/AnchorScrollHandler";
import {
  AIStudioModal,
  AIStudioProvider,
  AIStudioTrigger,
} from "@/components/ai-studio";
import {
  ApiConfigProvider,
  UserProvider,
  TaskCenterProvider,
  VideoPreviewProvider,
  GlobalVolumeProvider,
} from "@/providers";
import siteConfigData from "@/data/site.json";

const site = siteConfigData.site;
const seo = siteConfigData.seo;

export const metadata: Metadata = {
  title: {
    default: seo.defaultTitle,
    template: seo.titleTemplate,
  },
  description: seo.defaultDescription,
  keywords: seo.defaultKeywords,
  metadataBase: new URL(site.url),
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: site.url,
    siteName: site.name,
    title: seo.defaultTitle,
    description: seo.defaultDescription,
    images: [{ url: "/og/home.webp", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: seo.defaultTitle,
    description: seo.defaultDescription,
    images: ["/og/home.webp"],
  },
  robots: { index: true, follow: true },
};


export default async function RootLayout({
  children,
  aiStudioModal,
  authModal,
}: {
  children: React.ReactNode;
  aiStudioModal?: React.ReactNode;
  authModal?: React.ReactNode;
}) {
  const siteConfig = await getFrontendSiteConfig();
  const enableAudioPlayer = siteConfig?.features?.enableAudioPlayer ?? false;
  const enableAiStudio = siteConfig?.features?.enableAiStudio ?? false;

  const siteChrome = (
    <div className="min-h-screen flex flex-col bg-background">
      <Suspense fallback={null}>
        <AnchorScrollHandler />
      </Suspense>
      <Navbar />
      <main className="flex-1 pb-[calc(5rem+env(safe-area-inset-bottom))] md:pb-0">
        {children}
      </main>
      <Footer />
      <Suspense fallback={null}>
        <PaymentStatusModal />
      </Suspense>
      <TaskCenterWidget />
      {authModal}
      {enableAiStudio && (
        <>
          <AIStudioModal />
          {aiStudioModal}
          <AIStudioTrigger />
        </>
      )}
    </div>
  );

  const content = (
    <NavbarConfigProvider>
      {enableAiStudio && AIStudioProvider ? (
        <AIStudioProvider>
          {siteChrome}
        </AIStudioProvider>
      ) : (
        siteChrome
      )}
    </NavbarConfigProvider>
  );

  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body className="bg-background text-foreground">
        <SiteThemeProvider theme={siteConfig?.theme}>
          <GlobalVolumeProvider>
            <ToastProvider>
              <ApiConfigProvider
                apiBase={siteConfig?.api?.apiBase}
                appId={siteConfig?.api?.appId}
              >
                <UserProvider>
                  <TaskCenterProvider>
                    <VideoPreviewProvider>
                      <AudioPlayerProvider>
                        {enableAudioPlayer ? content : content}
                      </AudioPlayerProvider>
                    </VideoPreviewProvider>
                  </TaskCenterProvider>
                </UserProvider>
              </ApiConfigProvider>
            </ToastProvider>
          </GlobalVolumeProvider>
        </SiteThemeProvider>
        <AnalyticsScripts />
      </body>
    </html>
  );
}
