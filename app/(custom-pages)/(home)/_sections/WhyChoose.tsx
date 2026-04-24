const reasons = [
  {
    title: "Quality you can actually ship",
    desc: "Most AI image tools produce outputs that look almost right — skin textures that turn waxy under scrutiny, hands with six fingers, edges that fall apart at print size. This model solves the publishable-quality problem. Outputs land ready for campaigns, product pages, and editorial contexts without touch-ups.",
  },
  {
    title: "Prompts that behave predictably",
    desc: "The same prompt gives you consistent results in style, mood, and composition. You can iterate on a concept — adjust lighting, swap subjects, change camera angle — without the entire image collapsing into a different style. The generator treats your prompt as a brief, not a suggestion.",
  },
  {
    title: "Full creative control per image",
    desc: "Every generation lets you pick aspect ratio, resolution, and format — on a per-image basis. You&apos;re not locked into one setting for an entire session. Switch between a 9:16 Instagram Story and a 16:9 YouTube thumbnail in consecutive generations without leaving the page.",
  },
  {
    title: "Transparent pricing that respects your budget",
    desc: "Three credit packs, clearly marked per-credit cost, no hidden fees, no automatic renewals, no tiered feature gates. You see exactly what you pay and exactly what you get. Credits don&apos;t expire — use them at your own pace. This is the pricing model creators actually want.",
  },
  {
    title: "Privacy that matters",
    desc: "Your prompts and your generated images are private by default. The service does not use your content for model training, does not share your prompts with third parties, and does not surface your outputs in any public gallery. What you generate stays yours.",
  },
  {
    title: "Seamless image-to-image workflow",
    desc: "Upload a reference image and transform it with a prompt. Refine product photography, transfer styles, iterate on concept art, or generate variations of an existing visual — all in the same interface, at the same quality as text-to-image. No model switching, no separate tools.",
  },
];

export function WhyChoose() {
  return (
    <section className="py-24 px-6" style={{ background: "var(--bg2)" }}>
      <div className="max-w-5xl mx-auto">
        <p className="text-xs font-semibold uppercase tracking-widest text-center mb-4"
          style={{ color: "var(--accent)" }}>
          Why Choose
        </p>
        <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-center mb-4">
          Why Creators Choose ChatGPT Images 2.0
        </h2>
        <p className="text-center text-lg mb-14 max-w-2xl mx-auto" style={{ color: "var(--muted)" }}>
          Six reasons professional creators switch to this AI image generator — and stay.
        </p>

        <div className="space-y-4">
          {reasons.map(({ title, desc }, i) => (
            <div key={title} className="flex gap-5 p-6 rounded-2xl"
              style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
              <div className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm grad-bg text-white">
                {i + 1}
              </div>
              <div>
                <h3 className="text-base font-bold mb-2">{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
