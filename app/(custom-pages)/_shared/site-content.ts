import pricingData from "@/data/pricing.json";
import siteConfigData from "@/data/site.json";

const siteConfig = siteConfigData as typeof siteConfigData;
const pricingConfig = pricingData as typeof pricingData;

const planDescriptions: Record<string, string> = {
  starter: "Perfect for trying out ChatGPT Image 2.0",
  pro: "Great for regular creators",
  max: "Best value for power users and teams",
};

export const site = {
  name: siteConfig.site.name,
  productName: "ChatGPT Image 2.0",
  url: siteConfig.site.url,
  description: siteConfig.site.description,
  email: siteConfig.contact.email,
  logo: siteConfig.site.logo,
  logoAlt: siteConfig.site.logoAlt,
  favicon: siteConfig.site.favicon,
} as const;

export const seo = {
  defaultTitle: siteConfig.seo.defaultTitle,
  titleTemplate: siteConfig.seo.titleTemplate,
  defaultDescription: siteConfig.seo.defaultDescription,
  defaultKeywords: siteConfig.seo.defaultKeywords,
} as const;

export const registerBonus = 12;

export const pricing = (pricingConfig.plans ?? []).map((plan) => ({
  id: plan.key,
  key: plan.key,
  name: plan.title,
  title: plan.title,
  priceId: plan.priceId,
  price: plan.priceAmount,
  priceAmount: plan.priceAmount,
  credits: plan.credits,
  creditsText: plan.creditsText,
  perCredit: plan.credits > 0 ? plan.priceAmount / plan.credits : 0,
  popular: Boolean(plan.popular),
  description: planDescriptions[plan.key] ?? "",
  features: plan.features,
  buttonText: plan.buttonText,
}));

export type MarketingPlan = (typeof pricing)[number];
