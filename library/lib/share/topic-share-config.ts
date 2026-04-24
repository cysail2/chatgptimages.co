const siteName = process;

export interface TopicShareConfig {
  sharePageUrl: string;
  shareText: string;
}

export const TOPIC_TAGS = {
  CHRISTMAS: 1,
} as const;

export const TOPIC_SHARE_CONFIGS: Record<number, TopicShareConfig> = {};

export const DEFAULT_SHARE_TEXT = `Check out this amazing content I created with ${siteName}!`;

export const getTopicShareConfig = (
  topicTag?: number | null
): TopicShareConfig | null => {
  if (topicTag === undefined || topicTag === null) {
    return null;
  }
  return TOPIC_SHARE_CONFIGS[topicTag] || null;
};
