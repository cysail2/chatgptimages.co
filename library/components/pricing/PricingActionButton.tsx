"use client";

import { useState, useCallback, type ReactNode } from "react";
import { services } from "@/services";
import { useUserInfo } from "@/library/providers";
import { trackPurchase, gtag_report_conversion } from "@/library/lib/analytics";
import { PayByEmailModal } from "@/library/components/PayByEmailModal";
import type { PricingPlan } from "@/types/pricing-plans";

import siteConfig from "@/data/site.json";
import type { SiteConfig } from "@/types/siteConfig";
import { PayProvider } from "@/types/pay";

// Type assertions for imported JSON
const site = siteConfig as unknown as SiteConfig;

export interface PricingActionState {
  isLoading: boolean;
  handleClick: () => void;
}

export interface PricingActionButtonProps {
  plan: PricingPlan;
  onlinePaymentEnabled?: boolean;
  contactEmail?: string;
  paymentProvider?: PayProvider;
  /**
   * Render prop to allow custom button styling.
   * Receives loading state and click handler.
   */
  children: (state: PricingActionState) => ReactNode;
}

/**
 * Headless pricing action component.
 * Handles all purchase logic without any styling.
 * Uses render props to allow custom button rendering from parent components.
 */
export function PricingActionButton({
  plan,
  onlinePaymentEnabled,
  contactEmail,
  paymentProvider,
  children,
}: PricingActionButtonProps) {
  const { userInfo, isSignedIn, openSignIn } = useUserInfo();
  const [isLoading, setIsLoading] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);

  // Get defaults from site config
  const effectiveOnlinePaymentEnabled =
    onlinePaymentEnabled ?? site.features?.enableOnlinePayment ?? true;
  const effectivePaymentProvider =
    paymentProvider ?? site.features?.paymentProvider ?? "stripe";
  const effectiveContactEmail = contactEmail ?? site.contact?.email;

  const isFree = plan.key === "free";

  const handleClick = useCallback(async () => {
    if (isFree) return;

    // Check online payment
    if (!effectiveOnlinePaymentEnabled) {
      setShowContactModal(true);
      return;
    }

    // Track the purchase attempt
    trackPurchase({
      key: plan.key,
      title: plan.title,
      priceAmount: plan.priceAmount,
      credits: plan.credits,
    });

    // Check sign in
    if (!isSignedIn) {
      openSignIn();
      return;
    }

    const userId = userInfo?.uuid || userInfo?.id;
    if (!userId) {
      console.error("User is signed in but user ID is missing.");
      alert("Could not get user information. Please try refreshing the page.");
      return;
    }

    // Save selected plan to cache
    localStorage.setItem(
      "selectedPlan",
      JSON.stringify({
        key: plan.key,
        title: plan.title,
        price: plan.price,
        features: plan.features,
        credits: plan.credits,
        timestamp: Date.now(),
      }),
    );

    setIsLoading(true);
    try {
      let data;
      if (effectivePaymentProvider === "paypal") {
        data = await services.pay.createPaypalSession(plan.priceId);
      } else if (effectivePaymentProvider === "creem") {
        data = await services.pay.createCreemSession(plan.priceId);
      } else if (effectivePaymentProvider === "square") {
        data = await services.pay.createSquareSession(plan.priceId);
      } else {
        // Default to Stripe
        data = await services.pay.createStripeSession(plan.priceId);
      }

      const checkoutUrl = data?.data?.url || data?.url;
      // ... rest of function

      if (checkoutUrl) {
        gtag_report_conversion(checkoutUrl);
      } else {
        console.error("Subscription response missing URL:", data);
        alert("Checkout URL is missing. Please try again later.");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error during subscription creation request:", error);
      if (error instanceof Error) {
        alert(error.message || "An error occurred. Please try again later.");
      } else {
        alert("Network error. Please check your connection and try again.");
      }
      setIsLoading(false);
    }
  }, [
    plan,
    isSignedIn,
    openSignIn,
    userInfo,
    onlinePaymentEnabled,
    isFree,
    paymentProvider,
  ]);

  return (
    <>
      {children({ isLoading, handleClick })}

      {showContactModal && (
        <PayByEmailModal
          open={showContactModal}
          onClose={() => setShowContactModal(false)}
          email={effectiveContactEmail}
        />
      )}
    </>
  );
}

// Re-export types for convenience
export type { PricingPlan };
