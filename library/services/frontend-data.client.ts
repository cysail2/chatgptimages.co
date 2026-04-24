import type { PricingConfig } from "@/types/pricing-plans";
import type { PagesConfig, PoliciesConfig, SiteConfig } from "@/types/siteConfig";

async function fetchFrontendConfig<T>(configType: string): Promise<T | null> {
  try {
    const response = await fetch(`/api/config/${configType}`, {
      method: "GET",
      cache: "no-store",
    });
    if (!response.ok) return null;
    const result = await response.json();
    return result.success ? (result.data as T) : null;
  } catch {
    return null;
  }
}

export const getFrontendSiteConfig = async (): Promise<SiteConfig | null> =>
  fetchFrontendConfig<SiteConfig>("site");

export const getFrontendPricingConfig = async (): Promise<PricingConfig | null> =>
  fetchFrontendConfig<PricingConfig>("pricing");

export const getFrontendPagesConfig = async (): Promise<PagesConfig | null> =>
  fetchFrontendConfig<PagesConfig>("pages");

export const getFrontendPoliciesConfig = async (): Promise<PoliciesConfig | null> =>
  fetchFrontendConfig<PoliciesConfig>("policies");

export const getFrontendAssetBaseUrl = async (): Promise<string> => {
  const config = await getFrontendSiteConfig();
  if (!config) return "";
  const useCdn = config.useCdn ?? false;
  const cdnUrl = (config.cdnUrl ?? "").trim();
  if (!useCdn || !cdnUrl) return "";
  return cdnUrl.replace(/\/+$/, "");
};

export type { SiteConfig };
