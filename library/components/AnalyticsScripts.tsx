'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Script from 'next/script';
import {
  getFrontendSiteConfig,
  type SiteConfig,
} from '@/library/services/frontend-data.client';
import { setApiConfig } from '@/library/services/api-core';

type AnalyticsConfig = NonNullable<SiteConfig['analytics']>;

function normalizeAnalytics(config: SiteConfig | null): AnalyticsConfig | null {
  if (!config?.analytics) return null;
  return config.analytics;
}

/**
 * CNZZ Analytics Script Component
 */
function CnzzScripts({
  teamScriptId,
  siteScriptId,
}: {
  teamScriptId: string;
  siteScriptId: string;
}) {
  return (
    <>
      <Script id="cnzz-init" strategy="lazyOnload">
        {`var _czc = _czc || [];`}
      </Script>
      <Script id="cnzz-setAccount" strategy="lazyOnload">
        {`_czc.push(["_setAccount", ${JSON.stringify(siteScriptId)}]);`}
      </Script>
      <Script
        id="cnzz-site"
        strategy="lazyOnload"
        src={`https://v1.cnzz.com/z.js?id=${encodeURIComponent(siteScriptId)}&async=1`}
      />
      {teamScriptId && teamScriptId !== siteScriptId && (
        <Script
          id="cnzz-team"
          strategy="lazyOnload"
          src={`https://v1.cnzz.com/z.js?id=${encodeURIComponent(teamScriptId)}&async=1`}
        />
      )}
    </>
  );
}

/**
 * Google Analytics / Ads Script Component
 */
function GoogleAnalyticsScripts({ trackingId }: { trackingId: string }) {
  return (
    <>
      <Script
        id="google-gtag"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(trackingId)}`}
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${trackingId}');
        `}
      </Script>
    </>
  );
}

/**
 * Main Analytics Scripts Component
 * 
 * This component initializes all configured analytics providers:
 * - CNZZ (Chinese analytics)
 * - Google Ads / Analytics
 * 
 * Analytics tracking functions are available via:
 * - import { trackEvent, trackPurchase } from '@/library/lib/analytics';
 */
export function AnalyticsScripts() {
  const [siteConfig, setSiteConfig] = useState<SiteConfig | null>(null);

  useEffect(() => {
    getFrontendSiteConfig().then(setSiteConfig);
  }, []);

  // Set API config when site config is loaded
  useEffect(() => {
    if (!siteConfig?.api) return;
    setApiConfig({
      apiBase: siteConfig.api.apiBase,
      appId: siteConfig.api.appId,
    });
  }, [siteConfig]);

  const analytics = useMemo(() => normalizeAnalytics(siteConfig), [siteConfig]);

  const cnzz = analytics?.cnzz;
  const googleAds = analytics?.googleAds;

  const teamScriptId = cnzz?.teamScriptId?.trim() || '';
  const siteScriptId = cnzz?.siteScriptId?.trim() || '';
  const googleTrackingId = googleAds?.trackingId?.trim() || '';

  // CNZZ 启用条件：需要有网站ID（siteScriptId）
  const enableCnzz = !!cnzz?.enabled && siteScriptId.length > 0;
  const enableGoogleAds = !!googleAds?.enabled && googleTrackingId.length > 0;

  if (!enableCnzz && !enableGoogleAds) {
    return null;
  }

  return (
    <>
      {enableCnzz && (
        <CnzzScripts teamScriptId={teamScriptId} siteScriptId={siteScriptId} />
      )}
      {enableGoogleAds && (
        <GoogleAnalyticsScripts trackingId={googleTrackingId} />
      )}
    </>
  );
}

/**
 * Hook to check if analytics is ready
 */
export function useAnalyticsReady(): boolean {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const checkReady = () => {
      const hasCzc = !!(window as any)?._czc;
      const hasGtag = typeof (window as any)?.gtag === 'function';
      setReady(hasCzc || hasGtag);
    };

    // Check immediately
    checkReady();

    // Also check after a delay for lazy-loaded scripts
    const timer = setTimeout(checkReady, 2000);
    return () => clearTimeout(timer);
  }, []);

  return ready;
}
