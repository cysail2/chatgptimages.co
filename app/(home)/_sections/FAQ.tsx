"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    q: "What is ChatGPT Images 2.0 and how is it different from previous versions?",
    a: "ChatGPT Images 2.0 is the latest generation of AI image generation powered by the gpt-image-2 model. Compared to earlier versions, it offers native 4K resolution (not upscaled), significantly improved photorealism, more reliable prompt understanding, and faster generation times — typically under 10 seconds at 1K resolution. The prompt parser also handles nuanced creative briefs more consistently, preserving your specified style, lighting, and composition across iterations. If you used an earlier text-to-image tool and gave up on it, the new model is worth another look.",
  },
  {
    q: "Is ChatGPT Images 2.0 free to use?",
    a: "Every new account receives 12 free credits on signup — enough to generate 2 images at 1K medium resolution so you can try the tool before buying a credit pack. Beyond the free credits, you purchase credit packs starting at $9.90 for 400 credits. There is no monthly subscription, no automatic renewal, and credits never expire.",
  },
  {
    q: "Can I use ChatGPT Images 2.0 generated images commercially?",
    a: "Yes. Every image you generate with ChatGPT Images 2.0 is yours to use for personal and commercial projects — marketing campaigns, client deliverables, product listings, ad creatives, editorial content, and more. There are no watermarks, no attribution requirements, and no hidden licensing fees. Full commercial rights are included with every generation.",
  },
  {
    q: "Does ChatGPT Images 2.0 support image-to-image generation?",
    a: "Yes. The tool includes full image-to-image mode — upload a reference image and describe how you want it transformed via a text prompt. This is ideal for style transfers, product variations, concept refinement, photo re-lighting, and iterative design work. Image-to-image uses the same quality engine as text-to-image, so outputs maintain production-grade detail.",
  },
  {
    q: "How much does it cost per image with ChatGPT Images 2.0?",
    a: "Credit cost depends on resolution. A 1K medium image costs 6 credits, a 1K high image costs 22 credits, a 2K medium image costs 9 credits, and a 2K high image costs 33 credits. With the $29.90 Pro pack (1300 credits at $0.023 per credit), a typical 1K image costs around 14 cents. Larger packs reduce the per-credit price further.",
  },
  {
    q: "What image formats, resolutions, and aspect ratios does ChatGPT Images 2.0 support?",
    a: "Outputs come in PNG (for transparency support) or JPEG (for smaller file sizes). Resolutions available are 1K, 2K, and 4K — all native, not upscaled. Aspect ratios include 1:1 (square), 16:9 (widescreen), 9:16 (vertical), 4:3, 3:2, 4:5 (Instagram portrait), 5:4, 2:3, 3:4, and 21:9 (cinematic).",
  },
  {
    q: "How do I write effective prompts for ChatGPT Images 2.0?",
    a: "Good prompts combine subject, style, lighting, composition, and camera details. Example: “A luxury watch on dark marble, soft box studio lighting, macro lens, shallow depth of field, commercial product photography.” Be specific about what you want and what you don’t want. The prompt parser handles long, detailed briefs well — treat it like briefing a photographer.",
  },
  {
    q: "Does ChatGPT Images 2.0 use my prompts or images for training?",
    a: "No. Your prompts, uploaded reference images, and generated outputs are private by default. The service does not use your content for model training, does not share your prompts with third parties, and does not surface your generations in any public gallery. What you create stays yours.",
  },
  {
    q: "Is there an API for ChatGPT Images 2.0?",
    a: "API access is on our roadmap. For now, the service is available through the web interface with a credit-based payment model. If you have a specific integration use case in mind, reach out via support@chatgptimages.co and we can discuss access.",
  },
  {
    q: "What is the refund policy for ChatGPT Images 2.0 credit packs?",
    a: "If you’re unsatisfied, contact support@chatgptimages.co within 7 days of purchase and we’ll review your refund request. Refunds generally apply to unused credit balances. See our full Refund Policy for complete terms.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="py-24 px-6" style={{ background: "var(--bg2)" }}>
      <div className="max-w-3xl mx-auto">
        <p className="text-xs font-semibold uppercase tracking-widest text-center mb-4"
          style={{ color: "var(--accent)" }}>
          FAQ
        </p>
        <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-center mb-4">
          Frequently Asked Questions About ChatGPT Images 2.0
        </h2>
        <p className="text-center text-lg mb-12 max-w-xl mx-auto" style={{ color: "var(--muted)" }}>
          Everything you need to know before you start using ChatGPT Images 2.0.
        </p>

        <div className="space-y-3">
          {faqs.map(({ q, a }, i) => (
            <div key={i} className="rounded-xl overflow-hidden"
              style={{ border: "1px solid var(--border)", background: "var(--surface)" }}>
              <button
                className="w-full flex items-center justify-between px-6 py-5 text-left"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <h3 className="font-semibold text-sm md:text-base pr-4 m-0">{q}</h3>
                <ChevronDown
                  className={cn("w-5 h-5 shrink-0 transition-transform duration-200", open === i && "rotate-180")}
                  style={{ color: "var(--muted)" }}
                />
              </button>
              <div
                className={cn("text-sm leading-relaxed overflow-hidden transition-all", open === i ? "max-h-[500px]" : "max-h-0")}
                style={{ color: "var(--muted)" }}
              >
                <p className="px-6 pb-5">{a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
