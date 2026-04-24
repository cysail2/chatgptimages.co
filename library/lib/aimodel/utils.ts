import siteConfig from '@/data/site.json';
import type { SiteConfig } from '@/types/siteConfig';

export type AIModelType = 'Image' | 'Video' | 'Audio' | 'Music' | 'Other';

export const getModelType = (model?: string): AIModelType => {
    const m = (model || '').toLowerCase();
    if (!m) return 'Other';
    if (m.includes('seedream')) return 'Image';
    if (m.includes('seedance')) return 'Video';
    if (m.includes('ltx')) return 'Video';
    if (m.includes('vibevoice')) return 'Audio';
    if (m.includes('kie_music') || m.includes('suno') || m.includes('minimax_music')) return 'Music';
    if (m.includes('qwen') || m.includes('tts') || m.includes('voice')) return 'Audio';
    if (m.includes('kling')) return 'Video';
    if (m.includes('vidu')) return 'Video';
    if (m.includes('skyreels')) return 'Video';
    if (m.includes('happyhorse')) return 'Video';
    if (m.includes('wan') || m.includes('aliyun_wan')) return 'Video';
    if (m.includes('nanobanana') || m.includes('nano-banana')) return 'Image';
    return 'Other';
};

export const isAudioModel = (model?: string): boolean => {
    const type = getModelType(model);
    return type === 'Audio' || type === 'Music';
};

export const getModelLabel = (model?: string): string | null => {
    const m = (model || '').toLowerCase();
    if (!m) return null;
    if (m.includes('seedream')) {
        return model?.replace(/^seedream[-_]?v?/i, 'Seedream ').trim() || 'Seedream';
    }
    if (m.includes('seedance')) {
        return model?.replace(/^seedance[-_]?v?/i, 'Seedance ').trim() || 'Seedance 1.5';
    }
    if (m.includes('ltx')) {
        return model?.replace(/^ltx[-_]?/i, 'LTX ').trim() || 'LTX 2.3';
    }
    if (m.includes('vibevoice')) return 'VibeVoice';
    if (m.includes('kie_music') || m.includes('suno')) {
        if (m.includes('suno')) {
            return model?.replace(/^suno[-_]?v?/i, 'Suno V').trim() || 'Suno V5';
        }
        return 'Suno V5';
    }
    if (m.includes('skyreels-v4') || m.includes('skyreels_v4')) {
        return 'SkyReels V4';
    }
    if (m.includes('skyreels-v3') || m.includes('skyreels_v3')) {
        return 'SkyReels V3';
    }
    if (m.includes('skyreels')) return 'SkyReels';
    if (m.includes('happyhorse')) return 'HappyHorse 1.0';
    if (m.includes('wan2.7') || m.includes('wan2_7') || m.includes('wan2-7')) {
        return 'Wan 2.7';
    }
    if (m.includes('wan2.6') || m.includes('wan2_6') || m.includes('wan2-6')) {
        return 'Wan 2.6';
    }
    if (m.includes('wan2.5') || m.includes('wan2_5') || m.includes('wan2-5')) {
        return 'Wan 2.5';
    }
    if (m.includes('wan')) return 'Wan';
    if (m.includes('qwen3-tts-voice-clone')) return 'Qwen3 Voice Clone';
    if (m.includes('qwen3-tts-voice-design')) return 'Qwen3 Voice Design';
    if (m.includes('qwen')) return 'Qwen3 TTS';
    if (m === 'nanobanana2' || m === 'nano-banana-2' || m === 'nanobanana-2') return 'Nano Banana 2';
    if (m.includes('nanobanana') || m.includes('nano-banana')) return 'Nano Banana 1.0 Pro';
    return model || null;
};

/**
 * Strip version information from model label if the model is in hideModelVersion list.
 * For example: "Kling (kling-v2.6-pro)" -> "Kling AI" if kling is in hideModelVersion.
 * 
 * @param modelLabel - The full model label (e.g., "Kling (kling-v2.6-pro)" or "Kling AI")
 * @param hideModelVersion - Optional. Array of model names to hide version for. If not provided, uses siteConfig.
 * @returns The processed model label (version stripped if applicable)
 */
export const stripModelVersion = (
    modelLabel: string | undefined,
    hideModelVersion?: string[]
): string => {
    const configList = hideModelVersion || (siteConfig as SiteConfig).features?.hideModelVersion;

    if (!modelLabel || !configList || configList.length === 0) {
        return modelLabel || '';
    }

    const labelLower = modelLabel.toLowerCase();

    for (const model of configList) {
        const modelLower = model.toLowerCase();
        if (labelLower.includes(modelLower)) {
            // Check if label contains version info in parentheses like "Kling (kling-v2.6-pro)"
            const parenMatch = modelLabel.match(/^([^(]+)\s*\([^)]+\)$/);
            if (parenMatch) {
                return parenMatch[1].trim();
            }

            // Check for patterns like "Kling v2.6 Pro" or "Kling-v2.6-pro"
            // Match version patterns with optional preceding separator: -v2.6, _v2.6, v2.6, 2.6
            const versionPattern = /(?:[-_\s]+)?[vV]?\d+(?:\.\d+)?(?:[.-]?(std|pro|standard|professional|lite|max|plus))?/gi;
            let stripped = modelLabel.replace(versionPattern, '').trim();

            // Clean up accidental remaining separators
            stripped = stripped.replace(/^[-_\s]+|[-_\s]+$/g, '');

            // If nothing meaningful left or too short, return a base name
            if (!stripped || stripped.length < 2) {
                // Map common models to their base name
                if (modelLower.includes('kling')) return 'Kling';
                if (modelLower.includes('seedance')) return 'Seedance';
                if (modelLower.includes('vidu')) return 'Vidu';
                if (modelLower.includes('wan')) return 'Wan';
                return modelLabel || ''; // fallback to original
            }

            // Check for known models to ensure proper casing (e.g. kling -> Kling)
            const lowerStripped = stripped.toLowerCase();
            if (lowerStripped === 'kling') return 'Kling';
            if (lowerStripped === 'seedance') return 'Seedance';
            if (lowerStripped === 'vidu') return 'Vidu';
            if (lowerStripped === 'wan') return 'Wan';

            return stripped;
        }
    }

    return modelLabel;
};
