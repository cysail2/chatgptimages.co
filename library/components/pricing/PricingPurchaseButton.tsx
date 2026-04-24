"use client";

import type { ReactNode } from "react";
import { PricingActionButton } from "./PricingActionButton";
import type { PricingPlan } from "@/types/pricing-plans";
import type { PayProvider } from "@/types/pay";

export type PricingPurchaseButtonProps = {
  plan: PricingPlan;
  className?: string;
  children?: ReactNode;
  loadingText?: ReactNode;
  onlinePaymentEnabled?: boolean;
  contactEmail?: string;
  paymentProvider?: PayProvider;
};

export function PricingPurchaseButton({
  plan,
  className,
  children,
  loadingText,
  onlinePaymentEnabled,
  contactEmail,
  paymentProvider,
}: PricingPurchaseButtonProps) {
  return (
    <PricingActionButton
      plan={plan}
      onlinePaymentEnabled={onlinePaymentEnabled}
      contactEmail={contactEmail}
      paymentProvider={paymentProvider}
    >
      {({ isLoading, handleClick }) => (
        <button type="button" className={className} onClick={handleClick} disabled={isLoading}>
          {isLoading ? loadingText ?? children : children}
        </button>
      )}
    </PricingActionButton>
  );
}
