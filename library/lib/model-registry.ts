import type {
  CostConfig,
  FreeTrialPolicy,
  FreeTrialRule,
} from "@/types/video-cost-types";
import type { ModelId } from "@/types/model-types";

const WAN25_COST_CONFIG: CostConfig = {
  type: "per_second",
  rates: {
    "480p": 1,
    "720p": 1,
    "1080p": 1,
  },
  minDuration: 1,
  maxDuration: 10,
};

const WAN26_COST_CONFIG: CostConfig = {
  type: "per_second",
  rates: {
    "480p": 1,
    "720p": 2,
    "1080p": 2,
  },
  minDuration: 1,
  maxDuration: 15,
};

const WAN27_COST_CONFIG: CostConfig = {
  type: "per_second",
  rates: {
    "480p": 2,
    "720p": 3,
    "1080p": 3,
  },
  minDuration: 1,
  maxDuration: 15,
};

const WAN25_FREE_TRIAL_RULE: FreeTrialRule = {
  type: "per_second",
  maxDuration: 10,
  resolutions: ["480p", "720p", "1080p"],
};

const WAN26_FREE_TRIAL_RULE: FreeTrialRule = {
  type: "per_second",
  maxDuration: 15,
  resolutions: ["480p", "720p", "1080p"],
};

const WAN27_FREE_TRIAL_RULE: FreeTrialRule = {
  type: "per_second",
  maxDuration: 15,
  resolutions: ["480p", "720p", "1080p"],
};

export const MODEL_COSTS: Partial<Record<ModelId, CostConfig>> = {
  "wan2.5": WAN25_COST_CONFIG,
  "wan2.6": WAN26_COST_CONFIG,
  "wan2.7": WAN27_COST_CONFIG,
  "skyreels-v3": WAN25_COST_CONFIG,
  "skyreels-v4": WAN26_COST_CONFIG,
};

export const FREE_TRIAL_POLICY: FreeTrialPolicy = {
  maxTrials: 3,
  perModel: {
    "wan2.5": WAN25_FREE_TRIAL_RULE,
    "wan2.6": WAN26_FREE_TRIAL_RULE,
    "wan2.7": WAN27_FREE_TRIAL_RULE,
    "skyreels-v3": WAN25_FREE_TRIAL_RULE,
    "skyreels-v4": WAN26_FREE_TRIAL_RULE,
  },
};
