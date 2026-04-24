import Link from "next/link";
import { ArrowRight, Zap, Shield, ImageIcon } from "lucide-react";
import { ImagePlaceholder } from "../../_shared/ImagePlaceholder";

const badges = [
  { icon: Zap, label: "Fast Generation" },
  { icon: ImageIcon, label: "1K / 2K / 4K" },
  { icon: Shield, label: "No Watermark" },
];

const galleryIds = [
  "gallery-landscape",
  "gallery-scifi",
  "gallery-anime",
  "gallery-product",
  "gallery-abstract",
];

export function Hero() {
  return (
    <section className="relative min-h-[100vh] flex flex-col items-center justify-center px-6 pt-10 pb-20 overflow-hidden text-center">
      {/* Background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(ellipse, rgba(124,92,252,0.22) 0%, transparent 70%)" }} />
      <div className="absolute top-1/3 left-[60%] w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(ellipse, rgba(56,189,248,0.1) 0%, transparent 70%)" }} />

      {/* Badge */}
      <div className="relative inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8 text-sm font-medium"
        style={{ background: "rgba(124,92,252,0.12)", border: "1px solid rgba(124,92,252,0.3)", color: "var(--accent)" }}>
        <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
        Powered by ChatGPT Images 2.0
      </div>

      {/* H1 */}
      <h1 className="relative text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.08] max-w-4xl mb-6">
        Create Stunning AI Images{" "}
        <span className="grad-text">in Seconds</span>
      </h1>

      {/* Description */}
      <p className="relative text-lg md:text-xl max-w-xl mb-10 leading-relaxed" style={{ color: "var(--muted)" }}>
        ChatGPT Images 2.0 turns any text prompt into realistic photos and
        creative artwork — for marketing, design, and content.
      </p>

      {/* CTA */}
      <div className="relative flex flex-wrap items-center justify-center gap-4 mb-12">
        <Link
          href="/gpt-image-2"
          title="Try ChatGPT Images 2.0 Generator Free"
          className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-base font-bold text-white grad-bg"
        >
          Try ChatGPT Images 2.0 Free
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          href="/gpt-image-2-review"
          title="Read the ChatGPT Images 2.0 Review"
          className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-base transition-colors"
          style={{ border: "1px solid var(--border)", color: "var(--muted)" }}
        >
          Read Review
        </Link>
      </div>

      {/* Trust badges */}
      <div className="relative flex flex-wrap items-center justify-center gap-3 mb-16">
        {badges.map(({ icon: Icon, label }) => (
          <div key={label} className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm"
            style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--muted)" }}>
            <Icon className="w-3.5 h-3.5" style={{ color: "var(--accent)" }} />
            {label}
          </div>
        ))}
      </div>

      {/* Sample image strip */}
      <div className="relative grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 justify-center w-full max-w-5xl">
        {galleryIds.map((id) => (
          <ImagePlaceholder
            key={id}
            resourceId={id}
            alt="AI generated image example"
            aspectRatio="1/1"
            className="w-full shadow-lg"
          />
        ))}
      </div>
    </section>
  );
}
