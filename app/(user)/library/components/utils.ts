import { TOPIC_TAGS } from '@/library/lib/share/topic-share-config';

export const HISTORY_FETCH_SIZE = 10000;
export const HISTORY_PAGE_SIZE = 16;
export const EXPIRING_SOON_DAYS = 30;

export { isAudioModel, getModelLabel } from '@/library/lib/aimodel/utils';

export const getTopicLabel = (tag: number): string => {
    if (tag === TOPIC_TAGS.CHRISTMAS) return 'Christmas';
    return `Topic ${tag}`;
};

export const isVideoUrl = (url: string | null | undefined): boolean =>
    !!url && /\.(mp4|webm|mov|m4v)$/i.test(url);

export const getExpiryTimestampMs = (createdAtSeconds?: number | null): number | null => {
    if (!createdAtSeconds) return null;
    const date = new Date(createdAtSeconds * 1000);
    date.setMonth(date.getMonth() + 6);
    return date.getTime();
};
