"use client";

import Link from "next/link";
import { Check, Loader2 } from "lucide-react";
import { PricingPurchaseButton } from "@/components/pricing";
import type { PricingPlan } from "@/types/pricing-plans";
import { pricing, registerBonus, type MarketingPlan } from "./site-content";

function toCheckoutPlan(plan: MarketingPlan): PricingPlan {
  return {
    key: plan.key,
    title: plan.title,
    price: `$${plan.priceAmount.toFixed(2)}`,
    priceAmount: plan.priceAmount,
    priceId: plan.priceId,
    credits: plan.credits,
    creditsText: `${plan.credits.toLocaleString()} credits`,
    pricePerPt: `$${plan.perCredit.toFixed(3)} / credit`,
    features: plan.features,
    buttonText: plan.buttonText,
    popular: plan.popular,
  };
}

function PlanCard({ plan }: { plan: MarketingPlan }) {
  return (
    <article
      className="relative flex flex-col rounded-2xl p-8"
      style={{
        background: plan.popular ? "rgba(124,92,252,0.12)" : "var(--surface)",
        border: plan.popular
          ? "1px solid rgba(124,92,252,0.5)"
          : "1px solid var(--border)",
      }}
    >
      {plan.popular && (
        <div className="grad-bg absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-4 py-1 text-xs font-bold text-white">
          Most Popular
        </div>
      )}
      <h3 className="mb-1 text-xl font-bold">{plan.name}</h3>
      <p className="mb-6 text-sm" style={{ color: "var(--muted)" }}>
        {plan.description}
      </p>
      <div className="mb-1">
        <span className="text-5xl font-extrabold">
          ${plan.priceAmount.toFixed(2)}
        </span>
      </div>
      <p className="mb-8 text-sm" style={{ color: "var(--muted)" }}>
        {plan.credits.toLocaleString()} credits · $
        {plan.perCredit.toFixed(3)} per credit
      </p>
      <ul className="mb-8 flex-1 space-y-3">
        {plan.features.map((feature) => (
          <li
            key={feature}
            className="flex items-start gap-2 text-sm"
            style={{ color: "var(--muted)" }}
          >
            <Check
              className="mt-0.5 h-4 w-4 shrink-0"
              style={{ color: "var(--accent)" }}
            />
            {feature}
          </li>
        ))}
      </ul>
      <PricingPurchaseButton
        plan={toCheckoutPlan(plan)}
        className={`w-full cursor-pointer rounded-xl py-3.5 text-sm font-bold transition-opacity hover:opacity-90 disabled:opacity-60 ${
          plan.popular
            ? "grad-bg text-white"
            : ""
        }`}
        loadingText={
          <span className="inline-flex items-center justify-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Processing...
          </span>
        }
      >
        <span
          className="inline-flex items-center justify-center gap-2"
          style={
            plan.popular
              ? undefined
              : { color: "var(--text)" }
          }
        >
          Get {plan.name}
        </span>
      </PricingPurchaseButton>
    </article>
  );
}

export function PricingCards() {
  return (
    <div className="mb-10 grid gap-5 md:grid-cols-3">
      {pricing.map((plan) => (
        <PlanCard key={plan.id} plan={plan} />
      ))}
    </div>
  );
}

export function PricingCTA() {
  return (
    <p className="text-center text-sm" style={{ color: "var(--muted2)" }}>
      All packs are one-time purchases. No automatic renewal. Credits never
      expire.{" "}
      <Link
        href="/sign-up"
        title="Create a free ChatGPT Image 2.0 account"
        className="hover:underline"
        style={{ color: "var(--accent)" }}
      >
        Start with {registerBonus} free credits →
      </Link>
    </p>
  );
}
