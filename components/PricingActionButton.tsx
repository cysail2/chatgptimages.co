"use client";

import { useState, useCallback, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useUser, useClerk } from "@clerk/nextjs";

export interface PricingActionState {
  isLoading: boolean;
  handleClick: () => void;
}

interface PricingActionButtonProps {
  planId: string;
  planName: string;
  priceId?: string; // Stripe/Creem price ID — set once payment is configured
  children: (state: PricingActionState) => ReactNode;
}

/**
 * Headless purchase button.
 * If signed out → redirects to /sign-up with plan context.
 * If signed in → calls the checkout API (wired up when payment is configured).
 */
export function PricingActionButton({
  planId,
  planName,
  priceId,
  children,
}: PricingActionButtonProps) {
  const { isSignedIn } = useUser();
  const { openSignIn } = useClerk();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = useCallback(async () => {
    if (!isSignedIn) {
      // Save the intended plan so post-signup can pick it up
      try {
        localStorage.setItem("selectedPlan", JSON.stringify({ id: planId, name: planName, ts: Date.now() }));
      } catch {}
      openSignIn();
      return;
    }

    if (!priceId) {
      // Payment not configured yet — redirect to contact
      router.push(`mailto:support@chatgptimages.co?subject=Purchase ${planName} plan`);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId, planId }),
      });
      const data = await res.json();
      const url = data?.url;
      if (url) {
        window.location.href = url;
      } else {
        alert("Checkout unavailable. Please try again or contact support.");
        setIsLoading(false);
      }
    } catch {
      alert("Network error. Please check your connection and try again.");
      setIsLoading(false);
    }
  }, [isSignedIn, openSignIn, router, planId, planName, priceId]);

  return <>{children({ isLoading, handleClick })}</>;
}
