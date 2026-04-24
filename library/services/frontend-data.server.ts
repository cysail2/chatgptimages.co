// 前端数据读取 - 服务端 API
// 前端数据固定从 /data/ 目录读取
import { promises as fs } from 'fs';
import path from 'path';

// 前端数据存储目录
const FRONTEND_DATA_DIR = path.join(process.cwd(), 'data');
const FRONTEND_DATABASES_DIR = path.join(FRONTEND_DATA_DIR, 'databases');

// 配置类型
export type FrontendConfigType =
  | 'site'
  | 'navigation'
  | 'videos'
  | 'products'
  | 'pricing'
  | 'pages'
  | 'policies';

// 获取前端配置文件路径
function getFrontendConfigFilePath(configType: FrontendConfigType): string {
  return path.join(FRONTEND_DATA_DIR, `${configType}.json`);
}

function getFrontendDatabaseFilePath(databaseId: string): string {
  return path.join(FRONTEND_DATABASES_DIR, `${databaseId}.json`);
}

// 读取前端配置
export async function getFrontendConfig<T = any>(
  configType: FrontendConfigType
): Promise<T | null> {
  const filePath = getFrontendConfigFilePath(configType);
  try {
    const fileContent = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(fileContent) as T;
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      console.log(`Frontend config file not found: ${filePath}`);
      return null;
    }
    console.error(`Error reading frontend config (${configType}):`, error);
    return null;
  }
}

export async function getFrontendDatabaseConfig<T = any>(
  databaseId: string
): Promise<T | null> {
  const filePath = getFrontendDatabaseFilePath(databaseId);
  try {
    const fileContent = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(fileContent) as T;
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      console.log(`Frontend database file not found: ${filePath}`);
      return null;
    }
    console.error(`Error reading frontend database (${databaseId}):`, error);
    return null;
  }
}

// 获取前端页面数据文件路径
function getFrontendPageFilePath(pageId: string): string {
  const pagesDir = path.join(FRONTEND_DATA_DIR, 'pages');
  return path.join(pagesDir, `${pageId}.json`);
}

// 读取前端页面数据
export async function getFrontendPageData(pageId: string): Promise<any | null> {
  const filePath = getFrontendPageFilePath(pageId);
  try {
    const fileContent = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      console.log(`Frontend page data file not found: ${filePath}`);
      return null;
    }
    console.error(`Error reading frontend page data (${pageId}):`, error);
    return null;
  }
}

// ============ 便捷方法 ============

export const getFrontendSiteConfig = () => getFrontendConfig<any>('site');
export const getFrontendNavigationConfig = () => getFrontendConfig<any>('navigation');
export const getFrontendVideosConfig = () => getFrontendConfig<any>('videos');
export const getFrontendProductsConfig = () => getFrontendConfig<any>('products');
export const getFrontendPagesConfig = () => getFrontendConfig<any>('pages');
export const getFrontendPricingConfig = () => getFrontendConfig<any>('pricing');
export const getFrontendPoliciesConfig = () => getFrontendConfig<any>('policies');

export const getFrontendAssetBaseUrl = async (): Promise<string> => {
  const config = await getFrontendSiteConfig();
  if (!config) return '';
  const useCdn = config.useCdn ?? false;
  const cdnUrl = (config.cdnUrl ?? '').trim();
  if (!useCdn || !cdnUrl) return '';
  return cdnUrl.replace(/\/+$/, '');
};
