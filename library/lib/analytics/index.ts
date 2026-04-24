/**
 * Unified Analytics Module
 * 
 * This module provides a centralized interface for all analytics tracking.
 * It supports multiple analytics providers (CNZZ, Google Ads, etc.) and
 * provides type-safe event tracking utilities.
 */

// Re-export individual provider utilities
export { trackCnzzEvent, type CnzzEventParams } from './cnzz';
export { gtag_report_conversion, GOOGLE_ADS_ADD_TO_CART_SEND_TO } from './gtag-report-conversion';

// Unified event types
export type AnalyticsEventCategory =
    | 'User Action'
    | 'System Modal'
    | 'Navigation'
    | 'Purchase'
    | 'Error';

export type AnalyticsEventAction =
    | 'Click Generate Button'
    | 'Purchase Plan'
    | 'Insufficient Credits Modal'
    | 'Page View'
    | 'Sign In'
    | 'Sign Up'
    | string;

export interface AnalyticsEvent {
    category: AnalyticsEventCategory;
    action: AnalyticsEventAction;
    label?: string;
    value?: string | number;
}

/**
 * Track an event across all enabled analytics providers
 */
export function trackEvent(event: AnalyticsEvent): void {
    if (typeof window === 'undefined') return;

    // Track via CNZZ
    const czc = (window as any)?._czc;
    if (czc && typeof czc.push === 'function') {
        czc.push([
            '_trackEvent',
            event.category,
            event.action,
            event.label || '',
            String(event.value || '1'),
            '',
        ]);
    }

    // Track via Google Analytics (if gtag is available)
    const gtag = (window as any)?.gtag;
    if (typeof gtag === 'function') {
        gtag('event', event.action, {
            event_category: event.category,
            event_label: event.label,
            value: event.value,
        });
    }
}

/**
 * Track a purchase event with plan details
 */
export function trackPurchase(plan: {
    key: string;
    title: string;
    priceAmount: number;
    credits: number;
}): void {
    trackEvent({
        category: 'Purchase',
        action: 'Purchase Plan',
        label: plan.title,
        value: plan.priceAmount,
    });

    // Additional CNZZ tracking with specific format
    if (typeof window !== 'undefined') {
        const czc = (window as any)?._czc;
        if (czc && typeof czc.push === 'function') {
            czc.push([
                '_trackEvent',
                '用户操作',
                '购买积分套餐',
                '一次性套餐',
                plan.priceAmount,
                '',
            ]);
        }
    }
}

/**
 * Track insufficient credits modal display
 */
export function trackInsufficientCredits(location: string): void {
    trackEvent({
        category: 'System Modal',
        action: 'Insufficient Credits Modal',
        label: location,
    });
}

/**
 * Check if analytics is available
 */
export function isAnalyticsAvailable(): boolean {
    if (typeof window === 'undefined') return false;
    return !!(
        (window as any)?._czc ||
        (window as any)?.gtag
    );
}
