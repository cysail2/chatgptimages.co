import { PayProvider } from "./pay";
import { PageTheme } from "./webpage";

export type ConfigType =
  | "sites"
  | "site"
  | "navigation"
  | "videos"
  | "products"
  | "pricing"
  | "pages"
  | "policies"
  | "databases"
  | "models";

export interface SiteConfig {
  site: {
    name: string;
    logo: string;
    logoAlt: string;
    logoWidth: number;
    logoHeight: number;
    url: string;
    favicon: string;
    description: string;
    siteType?: "multi" | "single";
  };
  productFeatures?: string[];
  contact: {
    email: string;
    twitter: string;
    discord: string;
  };
  seo: {
    defaultTitle: string;
    titleTemplate: string;
    defaultDescription: string;
    defaultKeywords: string;
  };
  features: {
    enableUserModule?: boolean;
    enableAiStudio?: boolean;
    enableOnlinePayment?: boolean;
    enablePoliciesModule?: boolean;
    enablePricingPage?: boolean;
    enableBlogModule?: boolean;
    enableShowcaseModule?: boolean;
    enableReviewsModule?: boolean;
    enableSolutionsModule?: boolean;
    enableAudioPlayer?: boolean;
    enableFreeTryButton?: boolean;
    freeTryButtonText?: string;
    enableSignUpButton?: boolean;
    paymentProvider?:  PayProvider;
    hideModelVersion?: string[];
    enableThemeToggle?: boolean;
  };
  analytics?: {
    cnzz?: {
      enabled: boolean;
      teamScriptId: string;
      siteScriptId: string;
    };
    googleAds?: {
      enabled: boolean;
      trackingId: string;
    };
  };
  api?: {
    apiBase: string;
    appId: string;
    generator?: string;
  };
  envText?: string;
  useCdn?: boolean;
  cdnUrl?: string;
  theme?: PageTheme;
  aiModules?: string[];
}

export interface NavItem {
  id: string;
  label: string;
  href: string;
  matchPath: string;
  matchExact?: boolean;
  visible: boolean;
  order: number;
  title?: string;
  description?: string;
  children?: NavItem[];
  follow?: boolean;
  badge?: {
    text: string;
    style: string;
  };
}

export interface FooterNavItem {
  label: string;
  href: string;
  title?: string;
  follow?: boolean;
}

export interface MobileNavItem {
  id: string;
  label: string;
  href: string;
  icon: string;  // lucide-react icon name (e.g., "Home", "Tag", "User", "house", "tag")
  visible: boolean;
  matchExact?: boolean;
  order?: number;
  placement?: "bar" | "right-floating";
  showLabel?: boolean;
  action?: "open-ai-studio";
  aiStudioModel?:
  | "seedance-2.0"
  | "seedance-1.5"
  | "kling"
  | "seedream"
  | "viduq3"
  | "suno"
  | "vibevoice"
  | "qwen3tts";
}

export interface NavigationConfig {
  mainNav: NavItem[];
  footerNav: {
    resources: FooterNavItem[];
    legal: FooterNavItem[];
    compare?: FooterNavItem[];
  };
  mobileNav?: MobileNavItem[];
}

export interface VideoItem {
  id: string; // Changed to string for UUID support
  title: string;
  description?: string;
  model: string;
  videoUrl: string;
  coverUrl?: string;
  prompt?: string;
  tags?: string[];
}

export interface VideosConfig {
  models: string[];
  videos: VideoItem[];
}

export interface PageItem {
  id: string;
  title: string;
  path: string;
  group?: string;
  visibility?: "public" | "auth" | "admin" | "draft";
  searchVisibility?: "index" | "noindex";
  // for sitemap
  priority?: number;
  changefreq?:
  | "always"
  | "hourly"
  | "daily"
  | "weekly"
  | "monthly"
  | "yearly"
  | "never";
}

export interface PagesConfig {
  pages: PageItem[];
}

export interface PricingPlan {
  key: string;
  priceId: string;
  popular: boolean;
  title: string;
  price: string;
  priceAmount: number;
  credits: number;
  features: string[];
  buttonText: string;
}

export interface ModelPricingConfig {
  cost?: number;
  costShort?: number;
  costLong?: number;
  resolutions?: Record<string, number>;
}

export interface PricingConfig {
  plans: PricingPlan[];
  models?: Record<string, ModelPricingConfig>;
}

export type PoliciesConfig = UserPolicy[];

export interface UserPolicy {
  id: string; // privacy, terms, refund
  name: string;
  content: string; // Markdown content
}

export interface DeployConfig {
  localPath?: string;
  gitRepo?: string;
  gitBranch?: string;
  lastDeployedAt?: string;
}

export interface SiteItem {
  id: string;
  name: string;
  domain: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  deploy?: DeployConfig;
}

export interface DatabaseField {
  id: string;
  name: string;
  type:
  | "string"
  | "number"
  | "boolean"
  | "date"
  | "image"
  | "video"
  | "url"
  | "relation";
  required: boolean;
  description?: string;
}

export interface DatabaseModel {
  id: string;
  name: string;
  description: string;
  fields: DatabaseField[];
}

export interface DatabaseItem {
  id: string;
  name: string;
  modelId: string;
  description?: string;
  enabled?: boolean;
}

export interface DatabasesConfig {
  models: DatabaseModel[];
  databases: DatabaseItem[];
}

export interface SitesConfig {
  sites: SiteItem[];
  currentSiteId?: string;
}
