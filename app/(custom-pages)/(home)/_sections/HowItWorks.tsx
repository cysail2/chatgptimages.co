import { PenLine, SlidersHorizontal, Sparkles, Download } from "lucide-react";

const steps = [
  {
    step: "01",
    icon: PenLine,
    title: "Write Your Prompt or Upload a Reference",
    desc: "Describe the image you want in plain English. Include subject, style, lighting, mood, and camera details if you like. For image-to-image mode, upload a reference image and describe the transformation.",
  },
  {
    step: "02",
    icon: SlidersHorizontal,
    title: "Set Your Output Parameters",
    desc: "Choose aspect ratio (1:1, 16:9, 9:16, 4:5, 3:2, or 21:9), resolution (1K for quick drafts, 2K for social posts, 4K for print and campaigns), and output format — PNG for transparency or JPEG for lighter files.",
  },
  {
    step: "03",
    icon: Sparkles,
    title: "Generate with ChatGPT Images 2.0",
    desc: "The model produces your image in under 10 seconds at 1K resolution. Higher resolutions take a few seconds longer. If the first result isn&apos;t perfect, tweak your prompt and regenerate.",
  },
  {
    step: "04",
    icon: Download,
    title: "Download & Use Anywhere",
    desc: "Your image is yours to use — no watermarks, no attribution required, full commercial rights included. Download instantly and drop it into your campaign, post, deck, or product listing.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-24 px-6" style={{ background: "var(--bg2)" }}>
      <div className="max-w-6xl mx-auto">
        <p className="text-xs font-semibold uppercase tracking-widest text-center mb-4"
          style={{ color: "var(--accent)" }}>
          Workflow
        </p>
        <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-center mb-4">
          How ChatGPT Images 2.0 Turns Text Into Images
        </h2>
        <p className="text-center text-lg mb-16 max-w-2xl mx-auto" style={{ color: "var(--muted)" }}>
          The entire workflow is four steps — no training, no fine-tuning, no
          ControlNets or LoRAs required. Just describe, configure, generate, download.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map(({ step, icon: Icon, title, desc }) => (
            <div key={step} className="relative p-7 rounded-2xl"
              style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
              <div className="text-5xl font-black mb-5 leading-none grad-text opacity-30 select-none">
                {step}
              </div>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                style={{ background: "rgba(124,92,252,0.15)" }}>
                <Icon className="w-4 h-4" style={{ color: "var(--accent)" }} />
              </div>
              <h3 className="text-sm font-bold mb-3 leading-snug">{title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
