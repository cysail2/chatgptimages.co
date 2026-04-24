// 配置中心 - 客户端 API
import type { PricingConfig } from "@/types/pricing-plans";

import {
  ConfigType,
  NavigationConfig,
  SiteConfig,
  VideosConfig,
} from "@/types/siteConfig";

// 获取配置
export async function getConfig<T = any>(
  configType: ConfigType,
): Promise<T | null> {
  try {
    const res = await fetch(`/api/config/${configType}`, {
      cache: "no-store",
    });

    if (!res.ok) return null;

    const data = await res.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error(`Error fetching config (${configType}):`, error);
    return null;
  }
}

// 保存配置
export async function saveConfig<T = any>(
  configType: ConfigType,
  data: T,
): Promise<boolean> {
  try {
    const res = await fetch(`/api/config/${configType}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    return result.success;
  } catch (error) {
    console.error(`Error saving config (${configType}):`, error);
    return false;
  }
}

// ============ 便捷方法 ============

export const getSiteConfig = () => getConfig<SiteConfig>("site");
export const getNavigationConfig = () =>
  getConfig<NavigationConfig>("navigation");
export const getVideosConfig = () => getConfig<VideosConfig>("videos");
export const getPricingConfig = () => getConfig<PricingConfig>("pricing");
