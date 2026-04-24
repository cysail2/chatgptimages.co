/**
 * Generic Audio Types
 * These types define a universal audio format that can be used across the app
 */

/**
 * AI Model identifiers for audio generation
 */
export type AudioAiModel =
    | "qwen3_tts_text_to_speech"
    | "qwen3_tts_voice_clone"
    | "qwen3_tts_voice_design"
    | "suno_v5"
    | "minimax_music"
    | "other";

/**
 * Audio category for organizational purposes
 */
export type AudioCategory =
    | "speech"
    | "voice_clone"
    | "voice_design"
    | "music"
    | "sound_effect"
    | "other";

/**
 * Generic Audio Item - can represent any audio in the system
 */
export interface AudioItem {
    /** Unique identifier */
    id: string;

    /** Display title */
    title: string;

    /** Description of the audio content */
    description: string;

    /** URL to the audio file */
    audioUrl: string;

    /** Duration in format "MM:SS" or "HH:MM:SS" */
    duration: string;

    /** Tags for categorization and display */
    tags: string[];

    /** Optional cover image URL */
    coverImage?: string;

    /** Optional category */
    category?: AudioCategory;

    /** Whether this audio was AI-generated */
    isAiGenerated?: boolean;

    /** The AI model that generated this audio (if AI-generated) */
    aiModel?: AudioAiModel;

    /** Optional artist/creator name */
    artist?: string;

    /** Optional creation timestamp */
    createdAt?: string;

    /** Source of the audio: 'demo' for examples, 'user' for user-generated */
    source?: "demo" | "user";
}

/**
 * Audio examples data structure - flat array with metadata
 */
export interface AudioExamplesData {
    examples: AudioItem[];
}

/**
 * Helper function type to filter audio by AI model
 */
export type AudioFilterFn = (items: AudioItem[], model: AudioAiModel) => AudioItem[];

/**
 * Filter audio items by AI model
 */
export function filterByAiModel(items: AudioItem[], model: AudioAiModel): AudioItem[] {
    return items.filter(item => item.aiModel === model);
}

/**
 * Filter audio items by category
 */
export function filterByCategory(items: AudioItem[], category: AudioCategory): AudioItem[] {
    return items.filter(item => item.category === category);
}

/**
 * Get all AI-generated audio items
 */
export function getAiGeneratedItems(items: AudioItem[]): AudioItem[] {
    return items.filter(item => item.isAiGenerated === true);
}
