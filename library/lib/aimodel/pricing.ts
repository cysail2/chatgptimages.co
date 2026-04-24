import pricingConfig from "@/data/pricing.json";
import type { ModelPricingConfig } from "@/types/pricing-plans";

const modelPricing = (pricingConfig as any).models as Record<string, ModelPricingConfig> || {};

export const PricingCalculator = {
    /**
     * Calculate cost based on a fixed per-item cost. Good for image generation.
     * @param modelId The ID of the model in pricing config
     * @param count The number of items (e.g. max_images)
     * @param defaultCost Fallback cost if config is missing
     */
    calculateImageCost(modelId: string, count: number, defaultCost: number = 5): number {
        const config = modelPricing[modelId] || {};
        const costPerImage = config.cost || defaultCost;
        return count * costPerImage;
    },

    /**
     * Calculate cost based on short vs long duration thresholds. Good for Kling.
     * @param modelId The ID of the model in pricing config 
     * @param durationInSeconds The video duration
     * @param thresholdInSeconds The threshold considered "long"
     * @param defaultShort Fallback short cost
     * @param defaultLong Fallback long cost
     */
    calculateTieredDurationCost(modelId: string, durationInSeconds: number, thresholdInSeconds: number = 5, defaultShort: number = 5, defaultLong: number = 10): number {
        const config = modelPricing[modelId] || {};
        const isLong = durationInSeconds > thresholdInSeconds;
        return isLong ? (config.costLong || defaultLong) : (config.costShort || defaultShort);
    },

    /**
     * Calculate cost based on resolution and duration multipliers. Good for Seedance and ViduQ3.
     * @param modelId The ID of the model in pricing config
     * @param resolution The resolution string (e.g. "1080p")
     * @param duration The duration in seconds
     * @param durationDivisor The divisor to apply to duration (e.g. 5 for per-5-seconds, 1 for per-second)
     * @param defaultMultiplier Fallback multiplier if resolution is not in config
     */
    calculateResolutionDurationCost(modelId: string, resolution: string, duration: number, durationDivisor: number = 1, defaultMultiplier: number = 2): number {
        const config = modelPricing[modelId] || {};
        const resolutionsMap = config.resolutions || {};
        const multiplier = resolutionsMap[resolution] || defaultMultiplier;
        return (duration / durationDivisor) * multiplier;
    },

    /**
     * Return model config or empty object
     * @param modelId 
     */
    getModelConfig(modelId: string): ModelPricingConfig {
        return modelPricing[modelId] || {};
    }
};
