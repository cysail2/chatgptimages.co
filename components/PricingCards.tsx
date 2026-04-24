"use client";

import { useState, useCallback } from "react";
import { Check, Loader2 } from "lucide-react";
import { useUser, useClerk } from "@clerk/nextjs";
import { pricing, registerBonus } from "@/lib/site";
import Link from "next/link";

const planFeatures = [
  "All aspect ratios (1:1, 16:9, 9:16, 4:3, and more)",
  "1K, 2K, and 4K resolution outputs",
  "Text-to-image and image-to-image modes",
  "PNG and JPEG download formats",
  "Commercial use rights included",
  "No watermarks on any export",
  "Credits never expire",
];

function PlanCard({ plan }: { plan: typeof pricing[number] }) {
  const { isSignedIn } = useUser();
  const { openSignIn } = useClerk();
  const [isLoading, setIsLoading] = useState(false);

  const handleBuy = useCallback(async () => {
    if (!isSignedIn) {
      try {
        localStorage.setItem("selectedPlan", JSON.stringify({ id: plan.id, name: plan.name, ts: Date.now() }));
      } catch {}
      openSignIn();
      return;
    }

    // TODO: wire up checkout API when payment provider is configured
    // const res = await fetch("/api/checkout", { method: "POST", body: JSON.stringify({ planId: plan.id }) });
    // const { url } = await res.json();
    // window.location.href = url;
    alert("Payment coming soon. Contact support@chatgptimages.co to purchase.");
  }, [isSignedIn, openSignIn, plan]);

  return (
    <article
      className="relative p-8 rounded-2xl flex flex-col"
      style={{
        background: plan.popular ? "rgba(124,92,252,0.12)" : "var(--surface)",
        border: plan.popular ? "1px solid rgba(124,92,252,0.5)" : "1px solid var(--border)",
      }}
    >
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold text-white grad-bg whitespace-nowrap">
          Most Popular
        </div>
      )}
      <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
      <p className="text-sm mb-6" style={{ color: "var(--muted)" }}>{plan.description}</p>
      <div className="mb-1">
        <span className="text-5xl font-extrabold">${plan.price}</span>
      </div>
      <p className="text-sm mb-8" style={{ color: "var(--muted)" }}>
        {plan.credits.toLocaleString()} credits · ${plan.perCredit.toFixed(3)} per credit
      </p>
      <ul className="space-y-3 mb-8 flex-1">
        {planFeatures.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm" style={{ color: "var(--muted)" }}>
            <Check className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "var(--accent)" }} />
            {f}
          </li>
        ))}
      </ul>
      <button
        onClick={handleBuy}
        disabled={isLoading}
        title={`Buy the ${plan.name} pack for ChatGPT Images 2.0`}
        className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold transition-opacity hover:opacity-90 disabled:opacity-60 cursor-pointer ${plan.popular ? "text-white grad-bg" : ""}`}
        style={plan.popular ? {} : { border: "1px solid var(--border)", color: "var(--text)" }}
      >
        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
        Get {plan.name}
      </button>
    </article>
  );
}

export function PricingCards() {
  return (
    <div className="grid md:grid-cols-3 gap-5 mb-10">
      {pricing.map((plan) => (
        <PlanCard key={plan.id} plan={plan} />
      ))}
    </div>
  );
}

export function PricingCTA() {
  return (
    <p className="text-center text-sm" style={{ color: "var(--muted2)" }}>
      All packs are one-time purchases. No automatic renewal. Credits never expire.{" "}
      <Link href="/sign-up" title="Create a free ChatGPT Images 2.0 account" className="hover:underline" style={{ color: "var(--accent)" }}>
        Start with {registerBonus} free credits →
      </Link>
    </p>
  );
}
