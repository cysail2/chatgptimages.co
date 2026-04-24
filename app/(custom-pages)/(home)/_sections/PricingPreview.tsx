import Link from "next/link";
import { Check } from "lucide-react";
import { pricing, registerBonus } from "../../_shared/site-content";
import { cn } from "@/lib/utils";

const planFeatures = [
  "All aspect ratios (1:1, 16:9, 9:16...)",
  "1K / 2K / 4K resolution",
  "Image-to-image mode",
  "PNG & JPEG download",
  "No subscription — pay once",
];

export function PricingPreview() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <p className="text-xs font-semibold uppercase tracking-widest text-center mb-4"
          style={{ color: "var(--accent)" }}>
          Pricing
        </p>
        <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-center mb-4">
          ChatGPT Images 2.0 Simple, Transparent Pricing
        </h2>
        <p className="text-center text-lg mb-4 max-w-2xl mx-auto" style={{ color: "var(--muted)" }}>
          No subscriptions. No tiered feature gates. Buy credits once with ChatGPT Images 2.0,
          use them whenever you need a new image. Credits never expire.
        </p>
        <p className="text-center text-sm mb-14" style={{ color: "var(--accent)" }}>
          🎁 Register now and get {registerBonus} free credits to try it out
        </p>

        <div className="grid md:grid-cols-3 gap-5 mb-10">
          {pricing.map((plan) => (
            <div key={plan.id}
              className={cn("relative p-8 rounded-2xl flex flex-col")}
              style={{
                background: plan.popular ? "rgba(124,92,252,0.12)" : "var(--surface)",
                border: plan.popular ? "1px solid rgba(124,92,252,0.5)" : "1px solid var(--border)",
              }}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold text-white grad-bg">
                  Most Popular
                </div>
              )}
              <p className="font-bold text-lg mb-1">{plan.name}</p>
              <p className="text-xs mb-6" style={{ color: "var(--muted)" }}>{plan.description}</p>
              <div className="mb-2">
                <span className="text-4xl font-extrabold">${plan.price}</span>
              </div>
              <p className="text-sm mb-6" style={{ color: "var(--muted)" }}>
                {plan.credits.toLocaleString()} credits · ${plan.perCredit}/credit
              </p>
              <ul className="space-y-2.5 mb-8 flex-1">
                {planFeatures.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm" style={{ color: "var(--muted)" }}>
                    <Check className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "var(--accent)" }} />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/pricing"
                title={`Get the ${plan.name} credit pack for ChatGPT Images 2.0`}
                className={cn(
                  "text-center py-3 rounded-xl text-sm font-semibold transition-opacity hover:opacity-90",
                  plan.popular ? "text-white grad-bg" : "border"
                )}
                style={plan.popular ? {} : { border: "1px solid var(--border)", color: "var(--text)" }}>
                Get Started
              </Link>
            </div>
          ))}
        </div>

        <p className="text-center text-sm" style={{ color: "var(--muted2)" }}>
          <Link href="/pricing" title="View full ChatGPT Images 2.0 pricing" className="hover:underline" style={{ color: "var(--accent)" }}>
            View full pricing details →
          </Link>
        </p>
      </div>
    </section>
  );
}
