export const site = {
  name: "ChatGPT Images",
  productName: "ChatGPT Images 2.0",
  url: "https://chatgptimages.co",
  description:
    "ChatGPT Images is an AI image generator. It creates realistic photos and creative artwork for marketing, design, and content use with fast, simple control.",
  email: "support@chatgptimages.co",
  logo: "/logo.png",
  logoAlt: "ChatGPT Images",
  favicon: "/favicon.ico",
} as const;

export const seo = {
  defaultTitle: "ChatGPT Images 2.0 Generator — Create Realistic AI Photos",
  titleTemplate: "%s | ChatGPT Images",
  defaultDescription:
    "ChatGPT Images 2.0 is an AI image generator. Create realistic photos and creative artwork for marketing, design, and content use with fast, simple control.",
  defaultKeywords:
    "ChatGPT Images 2.0, ChatGPT images, AI image generator, text to image, AI art generator, gpt-image-2",
} as const;

export const nav = [
  { label: "Generator", href: "/gpt-image-2" },
  { label: "Review", href: "/gpt-image-2-review" },
  { label: "Pricing", href: "/pricing" },
] as const;

export const pricing = [
  {
    id: "starter",
    name: "Starter",
    price: 9.9,
    credits: 400,
    perCredit: 0.025,
    popular: false,
    description: "Perfect for trying out ChatGPT Images 2.0",
  },
  {
    id: "pro",
    name: "Pro",
    price: 29.9,
    credits: 1300,
    perCredit: 0.023,
    popular: true,
    description: "Best value for regular creators",
  },
  {
    id: "max",
    name: "Max",
    price: 99.9,
    credits: 5000,
    perCredit: 0.02,
    popular: false,
    description: "For power users and teams",
  },
] as const;

export const registerBonus = 12;
