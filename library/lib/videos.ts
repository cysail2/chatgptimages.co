export type ExploreModel = "wan2.5" | "wan2.6" | "wan2.7" | "seedance2" | "viduq3" | "kling" | "ltx";

export type ExploreVideo = {
  id: number;
  model: ExploreModel;
  prompt?: string;
  videoUrl: string;
  coverUrl?: string;
};

type AiVideoExample = {
  id?: string | number;
  aiModel?: string;
  model?: string;
  prompt?: string;
  description?: string;
  videoUrl?: string;
  url?: string;
  coverUrl?: string;
  posterUrl?: string;
};

const MODEL_ALIASES: Record<string, ExploreModel> = {
  "wan2.5": "wan2.5",
  "wan2.6": "wan2.6",
  "wan2.7": "wan2.7",
  "skyreels-v3": "wan2.5",
  "skyreels-v4": "wan2.6",
  skyreels: "wan2.6",
  wan: "wan2.6",
  seedance2: "seedance2",
  seedance: "seedance2",
  "seedance-2.0": "seedance2",
  viduq3: "viduq3",
  vidu: "viduq3",
  kling: "kling",
  ltx: "ltx",
  "ltx-2.3": "ltx",
  "ltx-2.3-fast": "ltx",
};

function resolveModel(raw?: string): ExploreModel {
  const key = String(raw || "").toLowerCase().trim();
  return MODEL_ALIASES[key] ?? "seedance2";
}

function toNumericId(raw: string | number | undefined, fallback: number): number {
  if (typeof raw === "number" && Number.isFinite(raw)) return raw;
  if (typeof raw === "string") {
    const n = Number.parseInt(raw, 10);
    if (Number.isFinite(n)) return n;
  }
  return fallback;
}

function normalizeVideoExamples(input?: unknown): ExploreVideo[] {
  const examples = Array.isArray((input as any)?.examples)
    ? ((input as any).examples as AiVideoExample[])
    : [];

  const normalized: ExploreVideo[] = [];
  examples.forEach((item, index) => {
    const videoUrl = item.videoUrl || item.url;
    if (!videoUrl) return;

    normalized.push({
      id: toNumericId(item.id, index + 1),
      model: resolveModel(item.aiModel || item.model),
      prompt: item.prompt,
      videoUrl,
      coverUrl: item.coverUrl || item.posterUrl,
    });
  });

  return normalized;
}

// 视频示例数据是可选能力。未提供数据文件时保持空数组，避免纯音频站点构建失败。
const defaultVideos: ExploreVideo[] = normalizeVideoExamples();

// 视频数据缓存
let cachedVideos: ExploreVideo[] | null = null;

// 同步方法：使用默认数据（用于需要同步加载的场景）
export const getExploreVideos = (model?: ExploreModel) => {
  const resolved = cachedVideos ?? defaultVideos;
  return model ? resolved.filter((v) => v.model === model) : resolved;
};

export const getExploreVideoById = (id: number) =>
  getExploreVideos().find((v) => v.id === id) || null;

// 异步方法：保持 async 兼容现有调用方，默认返回可选内置数据
export async function fetchExploreVideos(model?: ExploreModel): Promise<ExploreVideo[]> {
  if (!cachedVideos) {
    cachedVideos = defaultVideos;
  }
  return model ? cachedVideos.filter((v) => v.model === model) : cachedVideos;
}

// 清除缓存（配置更新后调用）
export function clearVideosCache() {
  cachedVideos = null;
}
