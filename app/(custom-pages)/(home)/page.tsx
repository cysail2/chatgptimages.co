import type { Metadata } from "next";
import { Hero } from "./_sections/Hero";
import { WhatIs } from "./_sections/WhatIs";
import { WhatMakesDifferent } from "./_sections/WhatMakesDifferent";
import { SeeInAction } from "./_sections/SeeInAction";
import { HowItWorks } from "./_sections/HowItWorks";
import { UseCases } from "./_sections/UseCases";
import { WhyChoose } from "./_sections/WhyChoose";
import { Comparison } from "./_sections/Comparison";
import { Testimonials } from "./_sections/Testimonials";
import { PricingPreview } from "./_sections/PricingPreview";
import { FAQ } from "./_sections/FAQ";
import { CTA } from "./_sections/CTA";

export const metadata: Metadata = {
  title: {
    absolute: "ChatGPT Image - AI Image Generator for Photos and Art",
  },
  description:
    "ChatGPT Image helps you create realistic AI photos, product visuals, and artwork from text prompts for marketing, design, and content.",
  keywords: [
    "ChatGPT Image",
    "ChatGPT image generator",
    "AI image generator",
    "text to image AI",
  ],
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <div className="site-marketing">
      <Hero />
      <WhatIs />
      <WhatMakesDifferent />
      <SeeInAction />
      <HowItWorks />
      <UseCases />
      <WhyChoose />
      <Comparison />
      <Testimonials />
      <PricingPreview />
      <FAQ />
      <CTA />
    </div>
  );
}
