import { FREE_TRIAL_POLICY, MODEL_COSTS } from "@/library/lib/model-registry";
import type { ModelId } from "@/types/model-types";
import type { Resolution } from "@/types/video-types";

const normalizeResolution = (resolution: Resolution): Resolution => resolution;

export const clampModelDuration = (
  modelId: ModelId,
  duration: number
): { duration: number; clamped: boolean } => {
  const cfg = MODEL_COSTS[modelId];
  if (!cfg) return { duration, clamped: false };
  const min = "minDuration" in cfg && cfg.minDuration ? cfg.minDuration : 1;
  const max =
    "maxDuration" in cfg && cfg.maxDuration ? cfg.maxDuration : Infinity;
  const clampedDuration = Math.min(Math.max(duration, min), max);
  return { duration: clampedDuration, clamped: clampedDuration !== duration };
};

export const computeModelCost = (
  modelId: ModelId,
  resolution: Resolution,
  duration: number
): number => {
  const cfg = MODEL_COSTS[modelId];
  if (!cfg) return 0;
  const res = normalizeResolution(resolution);
  if (cfg.type === "per_second") {
    const rate = cfg.rates[res] ?? cfg.rates["720p"];
    return Math.ceil(duration) * rate;
  }

  // fixed_by_duration
  const table = cfg.fixed[res] ?? cfg.fixed["720p"];
  const rounded = duration <= 5 ? 5 : 10;
  return table[rounded] ?? 0;
};

export const isFreeTrialEligible = (
  modelId: ModelId,
  resolution: Resolution,
  duration: number
): boolean => {
  const rule = FREE_TRIAL_POLICY.perModel[modelId];
  if (!rule) return false;
  const res = normalizeResolution(resolution);
  if (!rule.resolutions.includes(res)) return false;

  if (rule.type === "per_second") {
    return duration <= rule.maxDuration;
  }

  return rule.durations.includes(Math.ceil(duration));
};

export { MODEL_COSTS };


export type { ModelId } from "@/types/model-types";
export type { Resolution } from "@/types/video-types";
