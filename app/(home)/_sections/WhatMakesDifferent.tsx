import { Zap, Maximize, Image as ImageIcon, Type, Layers, Lock } from "lucide-react";

const items = [
  {
    icon: Maximize,
    title: "Native 4K Resolution Output",
    desc: "ChatGPT Images 2.0 generates native 4K images — not upscaled approximations. Print-ready detail, sharp text edges, and accurate textures suitable for large-format campaigns and editorial use.",
  },
  {
    icon: Layers,
    title: "Text-to-Image & Image-to-Image",
    desc: "Start from a blank canvas with a prompt, or upload a reference image and describe how to transform it. Both modes share the same quality engine — ideal for product variations, style transfers, and concept refinement.",
  },
  {
    icon: ImageIcon,
    title: "Every Aspect Ratio You Need",
    desc: "Square 1:1 for social posts, 16:9 for YouTube thumbnails, 9:16 for Reels and Stories, 4:5 for Instagram, 3:2 for print, 21:9 for cinematic banners. Choose before you generate — no cropping required.",
  },
  {
    icon: Zap,
    title: "Sub-10-Second Generation",
    desc: "From the moment you hit Generate, your image is ready in under 10 seconds on 1K resolution, typically 15–30 seconds at 4K. No queues, no rate limits, no waiting for someone else&apos;s job to finish.",
  },
  {
    icon: Type,
    title: "Nuanced Prompt Understanding",
    desc: "The model parses long, detailed prompts correctly — including camera specifications, lighting conditions, composition rules, and style references. You can write the way a creative director briefs a photographer.",
  },
  {
    icon: Lock,
    title: "Credit-Based, No Subscription",
    desc: "Buy credits once — use them whenever you need. No recurring charges, no tiered access to features, no credit expiration. Every feature of the tool is unlocked for every paying user.",
  },
];

export function WhatMakesDifferent() {
  return (
    <section className="py-24 px-6" style={{ background: "var(--bg2)" }}>
      <div className="max-w-6xl mx-auto">
        <p className="text-xs font-semibold uppercase tracking-widest text-center mb-4"
          style={{ color: "var(--accent)" }}>
          What&apos;s New
        </p>
        <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-center mb-4">
          What Makes ChatGPT Images 2.0 Different
        </h2>
        <p className="text-center text-lg mb-14 max-w-2xl mx-auto" style={{ color: "var(--muted)" }}>
          Six engineering decisions that separate this AI image generator from the rest of the market.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="card-hover p-7 rounded-2xl"
              style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
                style={{ background: "rgba(124,92,252,0.12)" }}>
                <Icon className="w-5 h-5" style={{ color: "var(--accent)" }} />
              </div>
              <h3 className="font-bold text-base mb-2">{title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
