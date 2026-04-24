import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { registerBonus } from "../../_shared/site-content";

export function CTA() {
  return (
    <section className="py-28 px-6 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 60%, rgba(124,92,252,0.18) 0%, transparent 70%)" }} />
      <div className="relative max-w-3xl mx-auto text-center">
        <p className="text-xs font-semibold uppercase tracking-widest mb-4"
          style={{ color: "var(--accent)" }}>
          Get Started
        </p>
        <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-6">
          Ready to Create With{" "}
          <span className="grad-text">ChatGPT Images 2.0</span>?
        </h2>
        <p className="text-lg mb-4 leading-relaxed" style={{ color: "var(--muted)" }}>
          Join the thousands of marketers, designers, and creators already generating
          production-quality visuals with ChatGPT Images 2.0. No subscription required —
          every new account gets {registerBonus} free credits to get started.
        </p>
        <p className="text-base mb-10 leading-relaxed max-w-2xl mx-auto" style={{ color: "var(--muted2)" }}>
          Describe what you want. Pick your settings. Download your image in seconds.
          That&apos;s the entire ChatGPT Images 2.0 workflow.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            href="/gpt-image-2"
            title="Try ChatGPT Images 2.0 Generator Free"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-bold text-white grad-bg"
          >
            Try Free — {registerBonus} Credits Included
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/gpt-image-2-review"
            title="Read ChatGPT Images 2.0 Review"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base transition-colors"
            style={{ border: "1px solid var(--border)", color: "var(--muted)" }}
          >
            Read the Review
          </Link>
        </div>
      </div>
    </section>
  );
}
