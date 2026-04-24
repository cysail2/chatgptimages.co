// 分享工具函数

import { DEFAULT_SHARE_TEXT, getTopicShareConfig } from "./topic-share-config";

export type SocialPlatform = "twitter" | "facebook" | "whatsapp";

export interface ShareContext {
  taskId?: string;
  videoUrl?: string;
  topicTag?: number | null;
}

export const buildShareTarget = (context: ShareContext) => {
  const topicConfig = getTopicShareConfig(context.topicTag);
  const shareText = topicConfig?.shareText ?? DEFAULT_SHARE_TEXT;

  let shareUrl: string;
  if (topicConfig) {
    if (context.videoUrl) {
      // https://cf.wan-ai.co/topic_1/wanai/2512/15/63660.mp4
      // Match 3-4 numeric segments at the end of the path
      const videoPathMatch = context.videoUrl.match(
        /\/(\d+(?:\/\d+){2,3})\.mp4$/
      );

      if (videoPathMatch) {
        const parts = videoPathMatch[1].split("/");
        const basePath = parts.slice(0, -1).join("");
        const lastSegment = parts[parts.length - 1];
        const videoPath = `${basePath}-${lastSegment}`;
        // 需要从视频地址中提取视频路径并组合分享链接
        // https://www.wanai1.com/christmas/share/251215-63660.html
        shareUrl = `${topicConfig.sharePageUrl}/${videoPath}.html`;
      } else {
        shareUrl = `${topicConfig.sharePageUrl}.html?v=${encodeURIComponent(
          context.videoUrl
        )}`;
      }
    } else {
      shareUrl = topicConfig.sharePageUrl;
    }
  } else {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    shareUrl = context.taskId ? `${origin}/share/${context.taskId}` : origin;
  }

  return { shareUrl, shareText };
};

/**
 * 生成分享链接
 */
export const generateShareUrl = (
  platform: SocialPlatform,
  context: ShareContext
): string => {
  const { shareUrl, shareText } = buildShareTarget(context);

  switch (platform) {
    case "twitter":
      return `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        shareUrl
      )}&text=${encodeURIComponent(shareText)}`;

    case "facebook":
      return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        shareUrl
      )}`;

    case "whatsapp":
      return `https://wa.me/?text=${encodeURIComponent(
        `${shareText} ${shareUrl}`
      )}`;

    default:
      return shareUrl;
  }
};

/**
 * 打开分享窗口
 */
export const shareToSocial = (
  platform: SocialPlatform,
  context: ShareContext
): void => {
  const shareUrl = generateShareUrl(platform, context);

  window.open(
    shareUrl,
    "_blank",
    "width=600,height=400,menubar=no,toolbar=no,location=no"
  );
};

/**
 * 复制分享链接到剪贴板
 */
export const copyShareLink = async (
  context: ShareContext
): Promise<boolean> => {
  const { shareUrl } = buildShareTarget(context);

  try {
    await navigator.clipboard.writeText(shareUrl);
    return true;
  } catch (error) {
    console.error("Failed to copy link:", error);
    return false;
  }
};
