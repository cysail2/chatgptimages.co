export type ComponentType =
  | "container"
  | "text"
  | "html"
  | "button"
  | "image"
  | "card"
  | "row"
  | "col"
  // Business Components
  | "hero"
  | "hero-with-generator"
  | "features-list"
  | "feature-card"
  | "how-it-works"
  | "step-item"
  | "faq-list"
  | "faq-item"
  | "pricing"
  | "pricing-v2"
  | "cta"
  | "video-cases"
  | "use-cases"
  | "use-case-card"
  | "testimonials"
  | "testimonial-card"
  | "audio-examples"
  | "content-section" | "video" | "markdown" | "slot";

export interface ComponentNode {
  id: string;
  type: ComponentType;
  template?: string; // 模版名称，用于支持多套风格
  props?: Record<string, any>;
  children?: ComponentNode[] | Record<string, Omit<ComponentNode, 'id'> & { id?: string }>;
  [key: string]: any; // Allow arbitrary props at the root level for simplified JSON
}

// meta:robots: 选项
type RobotsMetaOption =
  | "index"
  | "noindex"
  | "follow"
  | "nofollow"
  | "noarchive"
  | "nosnippet"
  | "nocache";

export interface OpenGraphMeta {
  title: string;
  description: string;
  type: string;
  image: string;
  url: string;
}

export interface TwitterMeta {
  card: "summary" | "summary_large_image" | "app" | "player";
  site: string;
  image: string;
  description: string;
  title: string;
}

export interface PageMetadata {
  title: string;
  description: string;
  keywords?: string;
  canonical: string;
  og?: OpenGraphMeta;
  twitter?: TwitterMeta;
  robots: RobotsMetaOption[];
  hreflang?: Record<string, string>; // 语言代码到URL的映射
  scripts?: { type: string; content: string }[]; // 注入脚本 (e.g. JSON-LD)
}

// 主题配色
export interface ThemeColors {
  backgroundColor: string; // 背景色
  primaryColor: string; // 主色调
  textColor: string; // 文字颜色
  secondaryColor: string; // 次要颜色
  accentColor: string; // 强调色
}

export interface PageTheme extends Partial<ThemeColors> {
  preset?: string; // 预设主题名称
  mode?: 'light' | 'dark'; // 当前模式（用于预览或其他逻辑）
  light?: ThemeColors; // 浅色模式配置
  dark?: ThemeColors; // 深色模式配置
}

// 预设主题
export const presetThemes: Record<string, PageTheme> = {
  light: {
    preset: "light",
    backgroundColor: "#ffffff",
    primaryColor: "#6366f1",
    textColor: "#1f2937",
    secondaryColor: "#6b7280",
    accentColor: "#8b5cf6",
    light: {
      backgroundColor: "#ffffff",
      primaryColor: "#6366f1",
      textColor: "#1f2937",
      secondaryColor: "#6b7280",
      accentColor: "#8b5cf6",
    },
    dark: {
      backgroundColor: "#0f172a",
      primaryColor: "#818cf8",
      textColor: "#f1f5f9",
      secondaryColor: "#94a3b8",
      accentColor: "#a78bfa",
    },
  },
  dark: {
    preset: "dark",
    backgroundColor: "#0f172a",
    primaryColor: "#818cf8",
    textColor: "#f1f5f9",
    secondaryColor: "#94a3b8",
    accentColor: "#a78bfa",
    light: {
      backgroundColor: "#ffffff",
      primaryColor: "#6366f1",
      textColor: "#1f2937",
      secondaryColor: "#6b7280",
      accentColor: "#8b5cf6",
    },
    dark: {
      backgroundColor: "#0f172a",
      primaryColor: "#818cf8",
      textColor: "#f1f5f9",
      secondaryColor: "#94a3b8",
      accentColor: "#a78bfa",
    },
  },
};

export interface PageSchema {
  id: string;
  name: string;
  metadata: PageMetadata;
  theme?: PageTheme; // 页面主题配色
  root: ComponentNode | Record<string, Omit<ComponentNode, 'id'> & { id?: string }>;
}
