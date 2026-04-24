export interface PricingPlan {
  key: string;
  priceId: string;
  popular?: boolean;
  highlight?: boolean;
  highlightColor?: string;
  theme?: 'light' | 'dark';
  badge?: string;
  originalPrice?: string;
  title: string;
  price: string;
  priceAmount: number;
  credits: number;
  creditsText?: string;
  pricePerPt?: string;
  features: string[];
  commonFeatures?: string[];
  buttonText: string;
}

export interface ModelPricingConfig {
  cost?: number; // Base cost for images/audio
  costShort?: number; // Cost for short duration (e.g., <=5s)
  costLong?: number; // Cost for long duration (e.g., >5s)
  resolutions?: Record<string, number>; // Costs mapped by resolution
}

export interface PricingConfig {
  plans: PricingPlan[];
  models?: Record<string, ModelPricingConfig>;
}
