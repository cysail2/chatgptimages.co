import { GenerationHistoryItem } from "./types";
import { getModelType } from "@/library/lib/aimodel/utils";
import { parseAudioUrls, parseAudioVariantsFromHistoryItem } from "./utils";

export interface UnifiedWorkVariant {
    id?: string;
    url: string;
    streamUrl?: string;
    coverUrl?: string;
    duration?: number;
    title?: string;
    prompt?: string;
    tags?: string;
    modelName?: string;
}

/**
 * Standardized Work Item structure to handle different model outputs uniformly.
 */
export interface UnifiedWorkItem {
    id: string | number;
    taskId: string;
    userId: number;

    // Content Type
    workType: 'image' | 'video' | 'audio';

    // Primary Media URL (Video source, Audio source, or Image URL)
    mediaUrl: string;

    // Cover/Thumbnail URL
    coverUrl: string;

    // List of media URLs (for batch results, variations, etc.)
    playlist: string[];

    // Structured media variants for multi-result tasks.
    variantItems: UnifiedWorkVariant[];

    // Original Input URLs (e.g. for Image-to-Video, can be multiple)
    originUrls: string[];

    // Metadata
    prompt: string;
    model: string;
    duration?: number; // in seconds
    width?: number;
    height?: number;
    aspectRatio?: string;

    // Timestamps
    createdAt: number;
    updatedAt: number;

    // Status
    status: number; // 1: success, -1: failed, 0: pending

    // Original raw item for fallback/debugging
    raw: GenerationHistoryItem;
}

/**
 * Normalizes a raw GenerationHistoryItem into a UnifiedWorkItem.
 * Use this to abstract away messy API fields.
 */
export function normalizeWorkItem(item: GenerationHistoryItem | null | undefined): UnifiedWorkItem | null {
    if (!item) return null;

    const modelType = getModelType(item.model || "");
    const isReferenceOrEditModel = /reference|video-edit/i.test(item.model || "");
    const audioVariants = parseAudioVariantsFromHistoryItem(item);
    const defaultAudioUrl =
        item.quality_image || item.generate_image || audioVariants[0]?.url || "";
    const mainUrl = defaultAudioUrl;

    // Determine Type
    let workType: 'image' | 'video' | 'audio' = 'video';

    if (modelType === 'Image') workType = 'image';
    else if (modelType === 'Audio' || modelType === 'Music') workType = 'audio';
    else if (/\.(jpg|jpeg|png|webp|gif)$/i.test(mainUrl)) workType = 'image';
    else if (audioVariants.length > 0 || /\.(mp3|wav|ogg|m4a|flac)$/i.test(mainUrl)) workType = 'audio';
    else workType = 'video';

    let playlist: string[] = [];
    let variantItems: UnifiedWorkVariant[] = [];
    let width: number | undefined;
    let height: number | undefined;

    if (workType === 'audio') {
        variantItems = audioVariants.map((variant) => ({
            id: variant.id,
            url: variant.url,
            streamUrl: variant.streamUrl,
            coverUrl: variant.imageUrl,
            duration: variant.duration,
            title: variant.title,
            prompt: variant.prompt,
            tags: variant.tags,
            modelName: variant.modelName,
        }));
        playlist = variantItems.map((variant) => variant.url);
    }

    // 1. Try gen_images_detail (Seedream batch images)
    if (workType !== 'audio' && item.gen_images_detail) {
        try {
            const details = typeof item.gen_images_detail === 'string'
                ? JSON.parse(item.gen_images_detail)
                : item.gen_images_detail;

            if (Array.isArray(details)) {
                // Map to URLs
                const urls = details.map((d: any) => d.image_url).filter(Boolean);
                if (urls.length > 0) playlist.push(...urls);

                // Parse size from first item
                if (details[0]?.size) {
                    const parts = details[0].size.split('x');
                    if (parts.length === 2) {
                        width = parseInt(parts[0], 10);
                        height = parseInt(parts[1], 10);
                    }
                }
            }
        } catch (e) {
            console.warn("Failed to parse gen_images_detail for item", item.task_id, e);
        }
    }

    // 2. Try other_image (Audio variations or extra images)
    if (item.other_image && workType !== 'audio') {
        const parts = parseAudioUrls(item.other_image);
        if (parts.length > 0 && !isReferenceOrEditModel) {
            playlist.push(...parts);
        }
    }

    // 3. Ensure validation and mainUrl inclusion
    // If playlist empty, add mainUrl
    if (playlist.length === 0 && mainUrl) {
        playlist.push(mainUrl);
    }

    // For Images: If playlist has items but mainUrl is missing, use first item as mainUrl?
    // Usually mainUrl is already set. 
    // If mainUrl was empty but playlist found, update mainUrl.
    if (!mainUrl && playlist.length > 0) {
        // safe cast because we assigned string
    }

    // Parse originUrls
    let originUrls: string[] = [];
    if (isReferenceOrEditModel && item.other_image) {
        originUrls = parseAudioUrls(item.other_image);
    } else if (item.origin_image) {
        originUrls = item.origin_image.split('|').filter(url =>
            url.trim().length > 0 && (url.startsWith('http') || url.startsWith('/'))
        );
    }

    // Decide Cover URL
    // For Audio: origin_image is often the cover art.
    // For Video: might need a dedicated cover field if APIs provide it, 
    // currently usually uses origin_image or user upload.
    let coverUrl = variantItems[0]?.coverUrl || originUrls[0] || "";
    if (workType === 'image') {
        coverUrl = mainUrl; // For image, cover is itself
    }

    return {
        id: item.id,
        taskId: item.task_id,
        userId: item.user_id,
        workType,
        mediaUrl: mainUrl || playlist[0] || "",
        coverUrl,
        playlist,
        variantItems,
        originUrls,
        prompt: item.prompt || "",
        model: item.model || "",
        duration: item.generation_time,
        width,
        height,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
        status: item.status,
        raw: item
    };
}
