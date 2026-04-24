import { GenerationHistoryItem, DialogTableStyles } from "./types";

export interface ParsedAudioVariant {
  id?: string;
  url: string;
  streamUrl?: string;
  imageUrl?: string;
  duration?: number;
  title?: string;
  prompt?: string;
  tags?: string;
  modelName?: string;
}

interface MusicTaskResultPayload {
  id?: string;
  audio_url?: string;
  stream_audio_url?: string;
  image_url?: string;
  duration?: number;
  title?: string;
  tags?: string;
  prompt?: string;
  model_name?: string;
}

const AUDIO_URL_PATTERN = /\.(mp3|wav|ogg|m4a|aac|flac)(\?|#|$)/i;

const isHttpLikeUrl = (value: unknown): value is string =>
  typeof value === "string" &&
  value.trim().length > 0 &&
  (value.startsWith("http") || value.startsWith("/"));

const isLikelyAudioUrl = (value: string) => AUDIO_URL_PATTERN.test(value);

const uniqByUrl = (variants: ParsedAudioVariant[]) => {
  const seen = new Set<string>();
  return variants.filter((variant) => {
    if (!variant.url || seen.has(variant.url)) return false;
    seen.add(variant.url);
    return true;
  });
};

const parseMusicTaskResults = (
  payload: string | null | undefined
): MusicTaskResultPayload[] => {
  if (!payload || typeof payload !== "string") return [];

  try {
    const parsed = JSON.parse(payload);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(
      (item): item is MusicTaskResultPayload =>
        !!item && typeof item === "object"
    );
  } catch {
    return [];
  }
};

// 分页辅助函数
export function getPaginationItems(
  currentPage: number,
  totalPages: number,
  siblingCount = 1
): (number | "...")[] {
  const totalPageNumbers = siblingCount + 5; // siblings + first + last + current + 2*ellipsis

  if (totalPageNumbers >= totalPages) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
  const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

  const shouldShowLeftDots = leftSiblingIndex > 2;
  const shouldShowRightDots = rightSiblingIndex < totalPages - 1;

  const firstPageIndex = 1;
  const lastPageIndex = totalPages;

  if (!shouldShowLeftDots && shouldShowRightDots) {
    let leftItemCount = 3 + 2 * siblingCount;
    let leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
    return [...leftRange, "...", lastPageIndex];
  }

  if (shouldShowLeftDots && !shouldShowRightDots) {
    let rightItemCount = 3 + 2 * siblingCount;
    let rightRange = Array.from(
      { length: rightItemCount },
      (_, i) => totalPages - rightItemCount + 1 + i
    );
    return [firstPageIndex, "...", ...rightRange];
  }

  if (shouldShowLeftDots && shouldShowRightDots) {
    let middleRange = Array.from(
      { length: rightSiblingIndex - leftSiblingIndex + 1 },
      (_, i) => leftSiblingIndex + i
    );
    return [firstPageIndex, "...", ...middleRange, "...", lastPageIndex];
  }

  return Array.from({ length: totalPages }, (_, i) => i + 1); // Fallback
}

// 下载媒体文件（支持 CORS）
export async function downloadMediaWithCors(
  mediaUrl: string,
  filename: string,
  setIsDownloading: (id: number | null) => void,
  mediaId: number,
  showToast: (message: string, type: "success" | "error" | "info") => void
) {
  setIsDownloading(mediaId);
  try {
    const response = await fetch(mediaUrl, { mode: "cors" });

    if (!response.ok) {
      throw new Error(
        `HTTP error! status: ${response.status}. Failed to fetch media. Check CORS headers on the server.`
      );
    }

    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = objectUrl;
    link.download = filename || `media-${mediaId}.mp4`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(objectUrl);

    console.log("Media download initiated!");
    showToast("Media downloaded successfully!", "success");
  } catch (error: any) {
    console.error("Download failed:", error);
    const errorMessage = "Download failed!";
    const genericMessage = `Error: ${error.message}`;

    if (
      error.message.includes("Failed to fetch") ||
      error.name === "TypeError"
    ) {
      showToast(
        `${errorMessage} - CORS error. Check server configuration.`,
        "error"
      );
    } else {
      showToast(`${errorMessage} ${genericMessage}`, "error");
    }
  } finally {
    setIsDownloading(null);
  }
}

// 格式化时间戳
export const formatTimestamp = (timestamp: number): string => {
  if (!timestamp) return "N/A";
  try {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(timestamp * 1000));
  } catch (e) {
    console.error("Error formatting date:", e);
    return new Date(timestamp * 1000).toLocaleDateString();
  }
};

// 格式化变更类型
export const formatChangeType = (changeType: string): string => {
  const typeMap: Record<string, string> = {
    buy_package: "Buy Package",
    create_task_free: "Free Generation",
    month_free: "Monthly Free",
    register_give: "Registration Gift",
    invite_reward: "Invitation Reward",
    daily_check: "Daily Check-in",
    refund: "Refund",
  };
  return typeMap[changeType] || changeType;
};

// 格式化价格
export const formatPrice = (price: number): string => {
  return `$${price.toFixed(2)}`;
};

// 价格映射（wan2.2项目专用）
export const getPriceFromPriceId = (priceId?: string): string => {
  if (!priceId) return "-";
  const priceMap: Record<string, string> = {
    prod_7fdonUkiPn3dbbdtIl9MjJ: "$10",
    prod_1ZWneGWXC5HPWRKXfyXlXI: "$30",
    prod_6MXRQXBzDNk9Hyk3H4kweQ: "$99",
    price_1SDJrqRoNdNiAV0LoXl4yJlc: "$10",
    price_1SDJsURoNdNiAV0Lp7uz61a0: "$30",
    price_1SDJsVRoNdNiAV0LxfNvrYeb: "$99",
    price_1SJ9IWRoNdNiAV0LwlioZhXS: "$9.9",
    price_1SJ9IgRoNdNiAV0Lszh5inWx: "$29.9",
    price_1SJ9IqRoNdNiAV0LWBBd2NSn: "$49.9",
    price_1SJ9J0RoNdNiAV0LyeTZ0yb4: "$99.9",
    price_1761550235031_bbhz83y9: "$0.1",
  };
  return priceMap[priceId] || "-";
};

// 解析音频URL字符串（用 | 分割），并且过滤掉非URL的内容（如json元数据）
export const parseAudioUrls = (
  audioString: string | null | undefined
): string[] => {
  if (!audioString || typeof audioString !== "string") return [];
  return audioString
    .split("|")
    .map((url) => url.trim())
    .filter(isHttpLikeUrl);
};

export const parseAudioVariantsFromHistoryItem = (
  item: Partial<GenerationHistoryItem> | null | undefined
): ParsedAudioVariant[] => {
  if (!item) return [];

  const results = parseMusicTaskResults(item.msg);
  const resultById = new Map(
    results
      .filter((result) => typeof result.id === "string" && result.id.length > 0)
      .map((result) => [result.id as string, result])
  );

  const variants: ParsedAudioVariant[] = [];
  const hasStructuredResults = results.length > 0;
  const declaredSlots = [
    {
      url: item.generate_image,
      audioId: item.audio_id,
      fallbackIndex: 0,
    },
    {
      url: item.quality_image,
      audioId: item.audio_id2,
      fallbackIndex: 1,
    },
  ];

  declaredSlots.forEach(({ url, audioId, fallbackIndex }) => {
    if (!isHttpLikeUrl(url)) return;
    if (!hasStructuredResults && !isLikelyAudioUrl(url)) return;

    const matched =
      (audioId ? resultById.get(audioId) : undefined) ?? results[fallbackIndex];

    variants.push({
      id: matched?.id ?? audioId,
      url,
      streamUrl: isHttpLikeUrl(matched?.stream_audio_url)
        ? matched?.stream_audio_url
        : undefined,
      imageUrl: isHttpLikeUrl(matched?.image_url)
        ? matched?.image_url
        : undefined,
      duration:
        typeof matched?.duration === "number" ? matched.duration : undefined,
      title: matched?.title,
      prompt: matched?.prompt,
      tags: matched?.tags,
      modelName: matched?.model_name,
    });
  });

  if (variants.length === 0) {
    results.forEach((result) => {
      const fallbackUrl = isHttpLikeUrl(result.audio_url)
        ? result.audio_url
        : isHttpLikeUrl(result.stream_audio_url)
          ? result.stream_audio_url
          : undefined;

      if (!fallbackUrl) return;

      variants.push({
        id: result.id,
        url: fallbackUrl,
        streamUrl: isHttpLikeUrl(result.stream_audio_url)
          ? result.stream_audio_url
          : undefined,
        imageUrl: isHttpLikeUrl(result.image_url) ? result.image_url : undefined,
        duration:
          typeof result.duration === "number" ? result.duration : undefined,
        title: result.title,
        prompt: result.prompt,
        tags: result.tags,
        modelName: result.model_name,
      });
    });
  }

  parseAudioUrls(item.other_image).forEach((url) => {
    variants.push({ url });
  });

  if (variants.length === 0) {
    [item.quality_image, item.generate_image].forEach((url) => {
      if (isHttpLikeUrl(url) && isLikelyAudioUrl(url)) {
        variants.push({ url });
      }
    });
  }

  return uniqByUrl(variants);
};

// 统一弹窗表格样式
export const dialogTable: DialogTableStyles = {
  wrapper: "rounded-lg border border-border overflow-x-auto",
  table: "w-full table-fixed",
  headCell:
    "text-left px-6 py-3 md:py-4 text-sm font-semibold text-muted-foreground",
  cell: "px-6 py-3 md:py-4 text-sm",
  row: "border-b border-border hover:bg-muted/50",
  mono: "text-muted-foreground text-sm font-mono",
  pillBase:
    "inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium",
};

// Re-export model utils from new location
export { isAudioModel, getModelLabel, stripModelVersion } from '@/library/lib/aimodel/utils';
