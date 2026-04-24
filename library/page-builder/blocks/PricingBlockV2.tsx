import Link from 'next/link';
import { ComponentProps } from '../registry';
import { cn } from '@/lib/utils';
import {
    Check,
    DollarSign,
    Shield,
    MessageCircle,
    Zap,
} from 'lucide-react';
import pricingConfig from '@/data/pricing.json';
import siteConfig from '@/data/site.json';
import pagesConfig from '@/data/pages.json';
import type { PricingPlan } from '@/types/pricing-plans';
import type { SiteConfig, PagesConfig } from '@/types/siteConfig';
import { PricingPurchaseButton } from '@/components/pricing';

// Type assertions for imported JSON
const plans = (pricingConfig as { plans: PricingPlan[] }).plans;
const site = siteConfig as SiteConfig;
const pages = (pagesConfig as PagesConfig).pages;

interface PricingUIProps {
    heading?: string;
    subtitle?: string;
}

/**
 * Pricing Block Template 2
 * Premium card-based pricing layout with dark theme support.
 */
function PricingUI({ heading, subtitle }: PricingUIProps) {
    const onlinePaymentEnabled = site.features?.enableOnlinePayment ?? true;
    const paymentProvider = site.features?.paymentProvider;
    const contactEmail = site.contact?.email;
    const productFeatures = site.productFeatures ?? [];

    // Check for refund policy page
    const hasRefundPage = pages.some(
        (p) => p.id === 'refund' && p.group === 'policy' && p.visibility !== 'draft'
    );

    return (
        <section
            id="pricing"
            className="pricing-section bg-slate-50 dark:bg-background text-foreground py-16 sm:py-24 font-sans transition-colors duration-300"
        >
            <div className="pricing-container px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-4xl font-extrabold text-slate-900 dark:text-foreground mb-4 tracking-tight sm:text-5xl">
                        {heading || 'Simple, All-Inclusive Pricing'}
                    </h2>
                    <p className="text-lg text-slate-600 dark:text-muted-foreground">
                        {subtitle || 'All plans include full access. No locked features. Just choose your credit volume.'}
                    </p>
                </div>

                {/* Pricing Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                    {plans.map((plan) => {
                        const isDark = plan.theme === 'dark';
                        const isHighlight = plan.highlight || plan.popular;

                        return (
                            <div
                                key={plan.key}
                                className={cn(
                                    'relative rounded-2xl p-8 flex flex-col transition-all duration-300 group',
                                    // Dark Theme Plan (Pro) vs Standard Plan styling
                                    isDark
                                        ? 'bg-slate-900 text-white border border-slate-800 shadow-2xl dark:bg-slate-950 dark:border-slate-800'
                                        : 'bg-white text-slate-900 border border-slate-200 shadow-lg dark:bg-card dark:text-card-foreground dark:border-border',
                                    // Hover Effects
                                    'hover:scale-[1.02] hover:shadow-2xl hover:z-20',
                                    !isDark && 'hover:border-indigo-300/80 dark:hover:border-primary/50',
                                    // Highlight logic
                                    isHighlight && !isDark && 'border-2 border-indigo-500 shadow-xl transform md:-translate-y-4 z-10 hover:shadow-indigo-500/20',
                                    isHighlight && 'ring-0'
                                )}
                            >
                                {/* Badge */}
                                {plan.badge && (
                                    <div
                                        className={cn(
                                            'absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm',
                                            isDark ? 'bg-amber-400 text-slate-900' : 'bg-indigo-600 text-white'
                                        )}
                                    >
                                        {plan.badge}
                                    </div>
                                )}

                                {/* Header */}
                                <div className="mb-6">
                                    <h3
                                        className={cn(
                                            'text-lg font-bold uppercase tracking-wider mb-2',
                                            isDark ? 'text-amber-400' : 'text-indigo-600 dark:text-primary'
                                        )}
                                    >
                                        {plan.title}
                                    </h3>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-4xl font-extrabold">{plan.price}</span>
                                        {plan.originalPrice && (
                                            <span
                                                className={cn(
                                                    'text-sm line-through decoration-slate-400',
                                                    isDark ? 'text-slate-500' : 'text-slate-400 dark:text-muted-foreground'
                                                )}
                                            >
                                                {plan.originalPrice}
                                            </span>
                                        )}
                                    </div>
                                    {plan.pricePerPt && (
                                        <p
                                            className={cn(
                                                'text-xs font-medium mt-1',
                                                isDark ? 'text-slate-400' : 'text-slate-500 dark:text-muted-foreground'
                                            )}
                                        >
                                            {plan.pricePerPt}
                                        </p>
                                    )}
                                </div>

                                {/* Action Button */}
                                <PricingPurchaseButton
                                    plan={plan}
                                    onlinePaymentEnabled={onlinePaymentEnabled}
                                    paymentProvider={paymentProvider}
                                    contactEmail={contactEmail}
                                    loadingText="Processing..."
                                    className={cn(
                                        'w-full h-12 text-base font-bold rounded-xl transition-all duration-300 mb-8 cursor-pointer',
                                        isDark
                                            ? 'bg-white text-slate-900 hover:bg-slate-200 hover:scale-105 active:scale-95'
                                            : isHighlight
                                                ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg hover:shadow-indigo-500/30 hover:scale-105 active:scale-95 dark:bg-primary dark:hover:bg-primary/90'
                                                : 'bg-white text-slate-900 border-2 border-slate-200 hover:border-indigo-500 hover:text-indigo-600 hover:bg-indigo-50 hover:shadow-md dark:bg-transparent dark:text-foreground dark:border-border dark:hover:border-primary dark:hover:text-primary'
                                    )}
                                >
                                    {plan.buttonText}
                                </PricingPurchaseButton>

                                {/* Features */}
                                <div className="flex-grow mt-8">
                                    <ul className="space-y-4 mb-0">
                                        {/* Credits inside features */}
                                        <li className="flex items-center gap-3 pb-4 border-b border-dashed border-slate-200 dark:border-slate-800 mb-2">
                                            <div className={cn(
                                                'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
                                                isDark ? 'bg-amber-400 text-slate-900' : 'bg-indigo-600/10 text-indigo-600 dark:bg-primary/20 dark:text-primary'
                                            )}>
                                                <Zap className="w-4 h-4" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className={cn("text-lg font-extrabold leading-tight", isDark ? "text-white" : "text-slate-900 dark:text-foreground")}>
                                                    {plan.credits.toLocaleString()} Credits
                                                </span>
                                                {plan.creditsText && (
                                                    <span className={cn("text-xs font-semibold", isDark ? "text-indigo-300" : "text-indigo-600 dark:text-primary")}>
                                                        {plan.creditsText}
                                                    </span>
                                                )}
                                            </div>
                                        </li>

                                        {/* Plan-specific Features */}
                                        {plan.features.map((feature, idx) => (
                                            <li key={`feat-${idx}`} className="flex items-start gap-3">
                                                <div
                                                    className={cn(
                                                        'flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 transition-transform group-hover:scale-110 duration-300',
                                                        isDark
                                                            ? 'bg-amber-400/20 text-amber-300'
                                                            : 'bg-indigo-100 text-indigo-600 dark:bg-primary/20 dark:text-primary'
                                                    )}
                                                >
                                                    <Check className="w-3 h-3" strokeWidth={3} />
                                                </div>
                                                <span
                                                    className={cn(
                                                        'text-sm font-bold leading-tight',
                                                        isDark ? 'text-white' : 'text-slate-900 dark:text-card-foreground'
                                                    )}
                                                >
                                                    {feature}
                                                </span>
                                            </li>
                                        ))}

                                        {/* Common Features Divider */}
                                        {productFeatures.length > 0 && (
                                            <li className="pt-4 border-t border-dashed border-slate-300/50 dark:border-border">
                                                <span
                                                    className={cn(
                                                        'text-xs font-semibold uppercase tracking-wider opacity-70',
                                                        isDark ? 'text-slate-400' : 'text-slate-500 dark:text-muted-foreground'
                                                    )}
                                                >
                                                    Also Includes:
                                                </span>
                                            </li>
                                        )}

                                        {/* Common Features from site config */}
                                        {productFeatures.map((feature, idx) => (
                                            <li key={`common-${idx}`} className="flex items-start gap-3 opacity-80">
                                                <div
                                                    className={cn(
                                                        'flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5',
                                                        isDark
                                                            ? 'bg-slate-700 text-slate-400'
                                                            : 'bg-slate-100 text-slate-500 dark:bg-muted dark:text-muted-foreground'
                                                    )}
                                                >
                                                    <Check className="w-3 h-3" strokeWidth={3} />
                                                </div>
                                                <span
                                                    className={cn(
                                                        'text-sm font-medium leading-tight',
                                                        isDark ? 'text-slate-300' : 'text-slate-600 dark:text-muted-foreground'
                                                    )}
                                                >
                                                    {feature}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Trust Badges */}
                <div className="mt-20 border-t border-slate-200 dark:border-slate-800 pt-12">
                    <div className="flex flex-wrap justify-center gap-6 md:gap-12">
                        <div className="flex items-center gap-2 text-slate-500">
                            <Shield className="w-5 h-5 text-indigo-500" />
                            <span className="font-semibold text-sm">Secure Payment</span>
                        </div>

                        {/* 7-Day Refund Badge - Dynamic Link */}
                        {hasRefundPage ? (
                            <Link
                                href="/refund"
                                className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors cursor-pointer group"
                            >
                                <DollarSign className="w-5 h-5 text-green-500 group-hover:scale-110 transition-transform duration-300" />
                                <span className="font-semibold text-sm">7-Day Refund</span>
                            </Link>
                        ) : (
                            <div className="flex items-center gap-2 text-slate-500 opacity-80 cursor-not-allowed">
                                <DollarSign className="w-5 h-5 text-green-500" />
                                <span className="font-semibold text-sm">7-Day Refund</span>
                            </div>
                        )}

                        <div className="flex items-center gap-2 text-slate-500">
                            <Zap className="w-5 h-5 text-amber-500" />
                            <span className="font-semibold text-sm">Instant Delivery</span>
                        </div>

                        <a
                            href={contactEmail ? `mailto:${contactEmail}` : '#'}
                            className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors cursor-pointer"
                        >
                            <MessageCircle className="w-5 h-5 text-blue-500" />
                            <span className="font-semibold text-sm">Priority Support</span>
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}

export const PricingV2 = ({ node, selectedNodeId }: ComponentProps) => {
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

export function PricingSectionV2({
    heading,
    subtitle,
}: {
    heading?: string;
    subtitle?: string;
}) {
    return <PricingUI heading={heading} subtitle={subtitle} />;
}
