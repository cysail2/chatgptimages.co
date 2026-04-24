import React from 'react';
import Link from 'next/link';
import { ComponentProps } from '../registry';
import { cn } from '@/lib/utils';
import { Check, DollarSign, Shield, MessageCircle } from 'lucide-react';
import pricingConfig from '@/data/pricing.json';
import siteConfig from '@/data/site.json';
import type { PricingPlan } from '@/types/pricing-plans';
import type { SiteConfig } from '@/types/siteConfig';
import { PricingPurchaseButton } from '@/components/pricing';

// Type assertions for imported JSON
const plans = (pricingConfig as { plans: PricingPlan[] }).plans;
const site = siteConfig as SiteConfig;

interface PricingUIProps {
  heading?: string;
  subtitle?: string;
}

/**
 * Pricing Block Template 1
 * Classic card-based pricing layout with trust badges.
 */
function PricingUI({ heading, subtitle }: PricingUIProps) {
  const onlinePaymentEnabled = site.features?.enableOnlinePayment ?? true;
  const paymentProvider = site.features?.paymentProvider;
  const contactEmail = site.contact?.email;
  const productFeatures = site.productFeatures ?? [];


  return (
    <section id="pricing" className="pricing-section bg-background text-foreground py-16 sm:py-24">
      <div className="pricing-container px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h2 className="pricing-title text-foreground text-center text-3xl font-bold mb-4">
          {heading || 'Choose Your Perfect Plan'}
        </h2>
        <p className="pricing-subtitle text-muted-foreground text-center text-lg mb-12">
          {subtitle || 'Get premium quality, higher speed & no limits.'}
        </p>

        {/* Pricing Cards Grid */}
        <div className="pricing-grid grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.key}
              className={cn(
                'pricing-card bg-card border border-border shadow-sm rounded-xl p-6 flex flex-col',
                plan.popular
                  ? 'pricing-card-popular border-primary ring-1 ring-primary relative'
                  : 'pricing-card-regular'
              )}
            >
              {plan.popular && (
                <div className="pricing-badge absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold">
                  Most Popular
                </div>
              )}

              <h3 className="pricing-card-title text-foreground text-xl font-bold mb-4">
                {plan.title}
              </h3>

              <div className="pricing-card-price mb-6">
                <span className="pricing-price-value text-foreground text-4xl font-bold">
                  {plan.price}
                </span>
                <div className="pricing-price-period text-muted-foreground text-sm mt-1">
                  One-Time Access
                </div>
              </div>

              {/* Action Button */}
              <PricingPurchaseButton
                plan={plan}
                onlinePaymentEnabled={onlinePaymentEnabled}
                paymentProvider={paymentProvider}
                contactEmail={contactEmail}
                loadingText="Processing..."
                className={cn(
                  'w-full mb-6 cursor-pointer',
                  plan.popular
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                    : 'border border-slate-300 bg-slate-100 text-slate-900 hover:bg-slate-200 hover:border-slate-400'
                )}
              >
                {plan.buttonText}
              </PricingPurchaseButton>

              {/* Features List */}
              <div className="pricing-features mt-auto">
                <div className="text-sm font-semibold text-foreground mb-4">
                  Plan Limits & Priority:
                </div>
                <ul className="space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="pricing-feature-item flex items-start gap-2">
                      <Check
                        className={cn(
                          'pricing-feature-icon w-5 h-5 flex-shrink-0 mt-0.5',
                          plan.popular ? 'text-primary' : 'text-foreground/70'
                        )}
                      />
                      <span className="pricing-feature-text text-foreground font-medium text-sm">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Common product features */}
                <div className="mt-6 pt-6 border-t border-border">
                  <div className="text-sm font-medium text-foreground mb-4">
                    Core Features included:
                  </div>
                  <ul className="space-y-3">
                    {productFeatures.map((feature, idx) => (
                      <li key={`common-${idx}`} className="pricing-feature-item flex items-start gap-2">
                        <Check
                          className={cn(
                            'pricing-feature-icon w-5 h-5 flex-shrink-0 mt-0.5',
                            plan.popular ? 'text-primary/80' : 'text-muted-foreground/80'
                          )}
                        />
                        <span className="pricing-feature-text text-muted-foreground text-sm">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="mt-16 mb-12">
          <div className="flex flex-wrap justify-center gap-8 max-w-4xl mx-auto">
            {/* 7-Day Refund Guarantee */}
            <Link href="/refund">
              <div className="flex items-center gap-3 px-6 py-4 bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20 rounded-xl backdrop-blur-sm hover:border-green-500/40 transition-colors">
                <div className="flex-shrink-0 w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-green-400" />
                </div>
                <div className="text-left">
                  <div className="text-foreground font-semibold">7‑Day Refund</div>
                  <div className="text-muted-foreground text-sm">Money-back guarantee</div>
                </div>
              </div>
            </Link>

            {/* Secure Payment */}
            <div className="flex items-center gap-3 px-6 py-4 bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-xl backdrop-blur-sm">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                <Shield className="w-5 h-5 text-blue-400" />
              </div>
              <div className="text-left">
                <div className="text-foreground font-semibold">Secure Payment</div>
                <div className="text-muted-foreground text-sm">Powered by Stripe</div>
              </div>
            </div>

            {/* 24/7 Support */}
            <a
              href={contactEmail ? `mailto:${contactEmail}` : '#'}
              className="flex items-center gap-3 px-6 py-4 bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20 rounded-xl backdrop-blur-sm hover:border-purple-500/40 transition-colors"
            >
              <div className="flex-shrink-0 w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-purple-400" />
              </div>
              <div className="text-left">
                <div className="text-foreground font-semibold">24/7 Support</div>
                <div className="text-muted-foreground text-sm">Always here to help</div>
              </div>
            </a>
          </div>
        </div>

        {/* Bottom Text */}
        <div className="mt-8 text-center">
          <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <span className="text-green-500 font-bold">✓</span>
              One-time payment
            </span>
            <span className="flex items-center gap-2">
              <span className="text-green-500 font-bold">✓</span>
              Credits never expire
            </span>
            <span className="flex items-center gap-2">
              <span className="text-green-500 font-bold">✓</span>
              Secure payments
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

export const Pricing = ({ node, selectedNodeId }: ComponentProps) => {
  const isSelected = selectedNodeId === node.id;
  return (
    <div
      data-node-id={node.id}
      className={cn(isSelected && 'ring-2 ring-primary ring-offset-2 transition-all duration-200 scroll-mt-20')}
    >
      <PricingUI heading={node.props?.heading} subtitle={node.props?.subtitle} />
    </div>
  );
};
