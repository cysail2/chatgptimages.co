// 配置中心 - 服务端 API
import { promises as fs } from "fs";
import path from "path";
import type { PricingConfig } from "@/types/pricing-plans";
import {
  ConfigType,
  NavigationConfig,
  SiteConfig,
  SitesConfig,
  VideosConfig,
} from "@/types/siteConfig";

// 配置数据存储目录
const CONFIG_DATA_DIR = path.join(process.cwd(), "data", "config");
// 站点数据存储目录（去掉 config 层）
const SITES_DATA_DIR = path.join(process.cwd(), "data", "sites");
// 数据根目录
const DATA_DIR = path.join(process.cwd(), "data");

// 配置类型
export const PREDEFINED_DB_MODELS = [
  {
    id: "video_cases",
    name: "视频案例",
    description: "展示视频作品的案例库",
    fields: [
      { id: "title", name: "标题", type: "string", required: true },
      { id: "description", name: "描述", type: "string", required: false },
      { id: "videoUrl", name: "视频链接", type: "video", required: true },
      { id: "coverUrl", name: "封面图片", type: "image", required: false },
      { id: "model", name: "生成模型", type: "string", required: false },
      { id: "prompt", name: "提示词", type: "string", required: false },
      { id: "tags", name: "标签", type: "string", required: false },
    ],
  },
  {
    id: "posts",
    name: "文章/博客",
    description: "通用的内容文章模型",
    fields: [
      { id: "title", name: "标题", type: "string", required: true },
      { id: "slug", name: "URL Slug", type: "string", required: true },
      { id: "content", name: "内容", type: "string", required: true },
      { id: "excerpt", name: "摘要", type: "string", required: false },
      { id: "coverImage", name: "封面图", type: "image", required: false },
      { id: "publishedAt", name: "发布时间", type: "date", required: true },
      { id: "author", name: "作者", type: "string", required: false },
    ],
  },
  {
    id: "pricing_plans",
    name: "价格套餐",
    description: "产品定价套餐模型",
    fields: [
      { id: "title", name: "套餐名称", type: "string", required: true },
      { id: "price", name: "显示价格", type: "string", required: true },
      { id: "priceAmount", name: "价格数值", type: "number", required: true },
      { id: "credits", name: "点数/额度", type: "number", required: true },
      {
        id: "features",
        name: "特性列表",
        type: "string",
        required: true,
        description: "每行一个特性",
      },
      { id: "popular", name: "热门推荐", type: "boolean", required: false },
      { id: "buttonText", name: "按钮文字", type: "string", required: true },
      {
        id: "priceId",
        name: "Stripe Price ID",
        type: "string",
        required: false,
      },
    ],
  },
  {
    id: "site_policies",
    name: "网站政策",
    description: "隐私政策、服务条款等法律文档",
    fields: [
      {
        id: "type",
        name: "类型",
        type: "string",
        required: true,
        description: "例如: privacy, terms, refund",
      },
      { id: "title", name: "标题", type: "string", required: true },
      { id: "content", name: "内容", type: "string", required: true },
      { id: "updatedAt", name: "更新时间", type: "date", required: true },
    ],
  },
];

// 获取配置文件路径
function getConfigFilePath(configType: ConfigType, siteId?: string): string {
  // sites 配置在 data 根目录
  if (configType === "sites") {
    return path.join(DATA_DIR, `${configType}.json`);
  }

  // 如果有站点ID，使用站点专用目录（data/sites/{siteId}/）
  if (siteId) {
    const siteConfigDir = path.join(SITES_DATA_DIR, siteId);
    return path.join(siteConfigDir, `${configType}.json`);
  }

  // 默认使用根目录（向后兼容）
  return path.join(CONFIG_DATA_DIR, `${configType}.json`);
}

function createEmptySiteConfig(): SiteConfig {
  return {
    site: {
      name: "",
      logo: "",
      logoAlt: "",
      logoWidth: 0,
      logoHeight: 0,
      favicon: "",
      url: "",
      description: "",
    },
    contact: {
      email: "",
      twitter: "",
      discord: "",
    },
    seo: {
      defaultTitle: "",
      titleTemplate: "",
      defaultDescription: "",
      defaultKeywords: "",
    },
    features: {
      enableUserModule: false,
      enableBlogModule: false,
      enableOnlinePayment: false,
      enableShowcaseModule: false,
      enableReviewsModule: false,
      enableSolutionsModule: false,
      enableAiStudio: false,
      enableAudioPlayer: false,
    },
    analytics: {
      cnzz: {
        enabled: false,
        teamScriptId: "",
        siteScriptId: "",
      },
      googleAds: {
        enabled: false,
        trackingId: "",
      },
    },
    api: {
      apiBase: "",
      appId: "",
    },
    envText: "",
    useCdn: false,
    cdnUrl: "",
  };
}

function createEmptyNavigationConfig(): NavigationConfig {
  return {
    mainNav: [],
    footerNav: {
      resources: [],
      legal: [],
    },
  };
}

// 确保目录存在
async function ensureDirectoryExists() {
  try {
    await fs.mkdir(CONFIG_DATA_DIR, { recursive: true });
  } catch (error) {
    console.error("Error creating config directory:", error);
  }
}

// 读取配置
export async function getConfig<T = any>(
  configType: ConfigType,
  siteId?: string,
): Promise<T | null> {
  try {
    await ensureDirectoryExists();
    const filePath = getConfigFilePath(configType, siteId);

    // 如果有站点ID，确保站点配置目录存在
    if (siteId && configType !== "sites") {
      const siteConfigDir = path.join(SITES_DATA_DIR, siteId);
      await fs.mkdir(siteConfigDir, { recursive: true });
    }

    try {
      const fileContent = await fs.readFile(filePath, "utf-8");
      return JSON.parse(fileContent) as T;
    } catch (fileError: any) {
      if (fileError.code === "ENOENT") {
        // 如果站点配置不存在
        if (siteId && configType !== "sites") {
          // 对于某些配置类型，不自动复制默认配置，让每个站点有独立配置
          // pages、videos、products、pricing 等应该保持独立
          const shouldCopyDefault = ["site", "navigation"].includes(configType);

          if (shouldCopyDefault) {
            const defaultConfig =
              configType === "site"
                ? createEmptySiteConfig()
                : createEmptyNavigationConfig();
            await saveConfig(configType, defaultConfig, siteId);
            return defaultConfig as T;
          } else {
            // 对于 pages、videos、products、pricing，返回空配置结构
            if (configType === "pages") {
              return { pages: [] } as T;
            }
            if (configType === "videos") {
              return { models: [], videos: [] } as T;
            }
            if (configType === "products") {
              return { products: [] } as T;
            }
            if (configType === "pricing") {
              return { plans: [] } as T;
            }
            if (configType === "policies") {
              return [] as T;
            }
            if (configType === "databases") {
              return {
                models: PREDEFINED_DB_MODELS,
                databases: [
                  {
                    id: "video-cases",
                    name: "视频案例",
                    modelId: "video_cases",
                    description: "默认视频案例数据库",
                  },
                  {
                    id: "pricing-plans",
                    name: "价格套餐",
                    modelId: "pricing_plans",
                    description: "默认价格套餐数据库",
                  },
                  {
                    id: "site-policies",
                    name: "网站政策",
                    modelId: "site_policies",
                    description: "默认网站政策数据库",
                  },
                ],
              } as T;
            }
            if (configType === "models") {
              return {
                models: ["wan2.1", "midjourney", "sora", "runway", "luma"],
              } as T;
            }
          }
        }
        console.log(`Config file not found: ${filePath}`);
        return null;
      }
      throw fileError;
    }
  } catch (error) {
    console.error(`Error reading config (${configType}):`, error);
    return null;
  }
}

// 保存配置
export async function saveConfig<T = any>(
  configType: ConfigType,
  data: T,
  siteId?: string,
): Promise<boolean> {
  try {
    await ensureDirectoryExists();
    const filePath = getConfigFilePath(configType, siteId);

    // 如果有站点ID，确保站点配置目录存在
    if (siteId && configType !== "sites") {
      const siteConfigDir = path.join(SITES_DATA_DIR, siteId);
      await fs.mkdir(siteConfigDir, { recursive: true });
    }

    await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");

    return true;
  } catch (error) {
    console.error(`Error saving config (${configType}):`, error);
    return false;
  }
}

// 初始化新站点的配置文件
export async function initializeSiteConfig(siteId: string): Promise<boolean> {
  try {
    if (!siteId) {
      console.error("SiteId is required for initialization");
      return false;
    }

    const siteConfigDir = path.join(SITES_DATA_DIR, siteId);
    await fs.mkdir(siteConfigDir, { recursive: true });

    // 需要初始化的配置类型及其默认值
    const defaultConfigs: Record<ConfigType, any> = {
      sites: null, // sites 配置不在站点目录
      site: createEmptySiteConfig(),
      navigation: createEmptyNavigationConfig(),
      videos: { models: [], videos: [] },
      products: { products: [] },
      pricing: { plans: [] },
      pages: {
        pages: [
          {
            id: "home",
            title: "首页",
            path: "/",
            group: "marketing",
            visibility: "public",
            searchVisibility: "index",
          },
          {
            id: "pricing",
            title: "价格页面",
            path: "/pricing",
            group: "marketing",
            visibility: "public",
            searchVisibility: "index",
          },
          {
            id: "payment-success",
            title: "支付成功",
            path: "/payment/success",
            group: "payment",
            visibility: "public",
            searchVisibility: "index",
          },
          {
            id: "payment-result",
            title: "支付结果",
            path: "/payment/result",
            group: "payment",
            visibility: "public",
            searchVisibility: "index",
          },
          {
            id: "privacy-policy",
            title: "隐私政策",
            path: "/privacy-policy",
            group: "legal",
            visibility: "public",
            searchVisibility: "index",
          },
        ],
      },
      policies: [],
      databases: {
        models: PREDEFINED_DB_MODELS,
        databases: [
          {
            id: "video-cases",
            name: "视频案例",
            modelId: "video_cases",
            description: "默认视频案例数据库",
          },
        ],
      },
      models: { models: ["wan2.1", "midjourney", "sora", "runway", "luma"] },
    };

    // 初始化必要的配置文件
    const configTypesToInit: ConfigType[] = [
      "site",
      "navigation",
      "videos",
      "products",
      "pricing",
      "pages",
      "policies",
      "databases",
    ];

    for (const configType of configTypesToInit) {
      const filePath = getConfigFilePath(configType, siteId);
      const defaultData = defaultConfigs[configType];

      // 检查文件是否已存在
      try {
        await fs.access(filePath);
        // 文件已存在，跳过
        continue;
      } catch {
        // 文件不存在，创建空配置文件
        await fs.writeFile(
          filePath,
          JSON.stringify(defaultData, null, 2),
          "utf-8",
        );
        console.log(`Initialized ${configType} config for site ${siteId}`);
      }
    }

    // 创建 pages 目录
    const pagesDir = path.join(siteConfigDir, "pages");
    await fs.mkdir(pagesDir, { recursive: true });

    // 创建 resources 目录
    const resourcesDir = path.join(siteConfigDir, "resources");
    await fs.mkdir(resourcesDir, { recursive: true });

    // 初始化默认页面的物理文件 (SEO 数据结构)
    const DEFAULT_PAGES_LIST = [
      {
        id: "home",
        title: "首页",
        path: "/",
        group: "marketing",
        seo: { title: "首页", description: "欢迎访问我们的网站" },
      },
      {
        id: "pricing",
        title: "价格页面",
        path: "/pricing",
        group: "marketing",
        seo: { title: "产品价格", description: "了解我们的价格方案" },
      },
      {
        id: "payment-success",
        title: "支付成功",
        path: "/payment/success",
        group: "payment",
        seo: { title: "支付成功", description: "感谢您的购买" },
      },
      {
        id: "payment-result",
        title: "支付结果",
        path: "/payment/result",
        group: "payment",
        seo: { title: "支付结果", description: "支付处理结果" },
      },
      {
        id: "privacy-policy",
        title: "隐私政策",
        path: "/privacy-policy",
        group: "legal",
        seo: { title: "隐私政策", description: "我们的隐私政策" },
      },
    ];

    for (const page of DEFAULT_PAGES_LIST) {
      const pageFilePath = path.join(pagesDir, `${page.id}.json`);
      try {
        await fs.access(pageFilePath);
      } catch {
        // 创建页面初始数据
        const pageData = {
          id: page.id,
          name: page.title,
          metadata: {
            title: page.seo.title,
            description: page.seo.description,
            keywords: "",
            canonical: "",
            og: {
              title: page.seo.title,
              description: page.seo.description,
              type: "website",
              image: "",
              url: "",
            },
            twitter: {
              card: "summary",
              site: "",
              image: "",
              description: page.seo.description,
              title: page.seo.title,
            },
            robots: [],
            hreflang: {},
          },
          theme: {
            preset: "light",
            backgroundColor: "#ffffff",
            primaryColor: "#6366f1",
            textColor: "#1f2937",
            secondaryColor: "#6b7280",
            accentColor: "#8b5cf6",
          },
          root: {
            id: "root",
            type: "container",
            props: { className: "min-h-screen bg-background" },
            children: [],
          },
        };

        await fs.writeFile(
          pageFilePath,
          JSON.stringify(pageData, null, 2),
          "utf-8",
        );
      }
    }

    return true;
  } catch (error) {
    console.error(`Error initializing site config (${siteId}):`, error);
    return false;
  }
}

// 删除站点配置目录
export async function deleteSiteConfig(siteId: string): Promise<boolean> {
  try {
    const siteConfigDir = path.join(SITES_DATA_DIR, siteId);

    // 检查目录是否存在
    try {
      await fs.access(siteConfigDir);
    } catch {
      // 目录不存在，认为删除成功
      return true;
    }

    // 递归删除目录及其所有内容
    await fs.rm(siteConfigDir, { recursive: true, force: true });

    return true;
  } catch (error) {
    console.error(`Error deleting site config (${siteId}):`, error);
    return false;
  }
}

// 将站点配置同步到根目录（供前端使用）
export async function syncSiteConfigToRoot(siteId: string): Promise<boolean> {
  try {
    if (!siteId) {
      console.error("SiteId is required for syncing");
      return false;
    }

    // 需要同步的配置类型
    const configTypes: ConfigType[] = [
      "site",
      "navigation",
      "videos",
      "products",
      "pricing",
      "pages",
    ];

    // 遍历每个配置类型，从站点目录复制到根目录
    for (const configType of configTypes) {
      const siteConfigPath = getConfigFilePath(configType, siteId);
      const rootConfigPath = getConfigFilePath(configType);

      try {
        // 读取站点配置
        const siteConfigContent = await fs.readFile(siteConfigPath, "utf-8");
        const siteConfig = JSON.parse(siteConfigContent);

        // 写入根目录
        await fs.writeFile(
          rootConfigPath,
          JSON.stringify(siteConfig, null, 2),
          "utf-8",
        );

        console.log(`Synced ${configType} from site ${siteId} to root`);
      } catch (fileError: any) {
        if (fileError.code === "ENOENT") {
          // 站点配置不存在，跳过
          console.log(
            `Site config ${configType} not found for site ${siteId}, skipping`,
          );
          continue;
        }
        console.error(
          `Error syncing ${configType} for site ${siteId}:`,
          fileError,
        );
      }
    }

    return true;
  } catch (error) {
    console.error(`Error syncing site config to root (${siteId}):`, error);
    return false;
  }
}

// ============ 便捷方法 ============

// 注意：这些函数现在用于后台管理，需要传入 siteId
// 前端应该使用 frontend-data.server.ts 中的函数
export const getSiteConfig = (siteId?: string) =>
  getConfig<SitesConfig>("site", siteId);
export const getNavigationConfig = (siteId?: string) =>
  getConfig<NavigationConfig>("navigation", siteId);
export const getVideosConfig = (siteId?: string) =>
  getConfig<VideosConfig>("videos", siteId);
export const getPricingConfig = (siteId?: string) =>
  getConfig<PricingConfig>("pricing", siteId);

export const saveSiteConfig = (data: SiteConfig) => saveConfig("site", data);
export const saveNavigationConfig = (data: NavigationConfig) =>
  saveConfig("navigation", data);
export const saveVideosConfig = (data: VideosConfig) =>
  saveConfig("videos", data);
export const savePricingConfig = (data: PricingConfig) =>
  saveConfig("pricing", data);
