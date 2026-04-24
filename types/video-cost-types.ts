import type { Resolution } from "@/types/video-types";
import type { ModelId } from "@/types/model-types";

export type PerSecondCost = {
  type: "per_second";
  rates: Record<Lowercase<Resolution>, number>;
  maxDuration?: number;
  minDuration?: number;
};

export type FixedCost = {
  type: "fixed_by_duration";
  fixed: Record<Lowercase<Resolution>, Record<number, number>>;
};

export type CostConfig = PerSecondCost | FixedCost;

export type FreeTrialRule =
  | {
    type: "per_second";
    maxDuration: number;
    resolutions: Lowercase<Resolution>[];
  }
  | {
    type: "fixed_durations";
    durations: number[];
    resolutions: Lowercase<Resolution>[];
  };

export type FreeTrialPolicy = {
  maxTrials: number;
  perModel: Partial<Record<ModelId, FreeTrialRule>>;
};
