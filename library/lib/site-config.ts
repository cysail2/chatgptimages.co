import { notFound } from 'next/navigation';
import { promises as fs } from 'fs';
import path from 'path';
import { ConfigType, SiteConfig } from '@/types/siteConfig';

const DATA_DIR = path.join(process.cwd(), 'data');
const CONFIG_DATA_DIR = DATA_DIR;


/**
 * Get configuration for a specific site or global config
 * Replicates logic from src/app/website/lib/config-api.server.ts but for read-only access
 */
export async function getSiteConfig<T>(configType: ConfigType): Promise<T | null> {
  try {
    let configPath: string;

    configPath = path.join(CONFIG_DATA_DIR, `${configType}.json`);

    const content = await fs.readFile(configPath, 'utf8');
    return JSON.parse(content) as T;
  } catch (error) {
    // console.error(`Failed to read config ${configType}:`, error);
    return null;
  }
}

/**
 * 获取站点配置，如果不存在则直接触发 404
 */
export async function getRequiredSiteConfig<T>(configType: ConfigType): Promise<T> {
  const config = await getSiteConfig<T>(configType);
  if (!config) notFound();
  return config as T;
}

/**
 * Get API configuration from site config
 */
export async function getApiConfig() {
  const config = await getSiteConfig<SiteConfig>('site');
  return config?.api;
}
