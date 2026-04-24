export function WhatIs() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <p className="text-xs font-semibold uppercase tracking-widest text-center mb-4"
          style={{ color: "var(--accent)" }}>
          Overview
        </p>
        <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-center mb-10">
          What Is ChatGPT Images 2.0?
        </h2>
        <div className="space-y-5 text-base md:text-lg leading-relaxed" style={{ color: "var(--muted)" }}>
          <p>
            <strong className="text-white">ChatGPT Images 2.0</strong> is the latest generation of
            AI image generation built for real creative work — powered by the{" "}
            <strong className="text-white">gpt-image-2</strong> model. Unlike earlier text-to-image
            tools that produce generic stock-looking outputs, ChatGPT Images 2.0 understands
            nuanced prompts, respects compositional intent, and delivers photorealistic detail at
            production resolutions up to 4K.
          </p>
          <p>
            Whether you need a studio-quality product photograph, a social media ad creative,
            an editorial illustration, or concept art for a pitch deck, the model turns
            your words into a finished visual in seconds. Every image is yours to use
            commercially — no watermarks, no licensing complications, no subscription lock-in.
          </p>
          <p>
            Built for marketers, designers, content creators, and small business owners,
            this tool removes the friction between an idea and the visual you need to
            publish. Type a prompt, pick your settings, download your image. That&apos;s the entire
            workflow.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-14">
          {[
            { value: "4K", label: "Max Resolution" },
            { value: "<10s", label: "Generation Time" },
            { value: "10+", label: "Aspect Ratios" },
            { value: "0", label: "Watermarks" },
          ].map(({ value, label }) => (
            <div key={label} className="text-center p-5 rounded-xl"
              style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
              <div className="text-3xl font-extrabold grad-text mb-1">{value}</div>
              <div className="text-xs uppercase tracking-wider" style={{ color: "var(--muted2)" }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
