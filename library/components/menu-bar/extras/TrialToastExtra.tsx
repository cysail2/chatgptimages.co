"use client";

import React, { useEffect } from "react";
import { useUserInfo } from "@/library/providers";
import { useToast } from "@/library/ui/toast-provider";

/**
 * TrialToastExtra - Menu bar extra item for trial voucher notification
 * 
 * This is a non-visual component that triggers a toast notification
 * when a user first logs in with available trial vouchers.
 * 
 * Should be included once in the menu bar to enable the notification.
 */
export function TrialToastExtra() {
    const { userInfo, isLoadingUserInfo, isSignedIn } = useUserInfo();
    const { info } = useToast();

    const hasUserInfo = !isLoadingUserInfo && !!userInfo;
    const freeTimes = userInfo?.free_times ?? 0;
    const shouldShowTrial =
        isSignedIn && hasUserInfo && userInfo.level === 0 && freeTimes > 0;

    useEffect(() => {
        if (!isSignedIn || !userInfo || isLoadingUserInfo) return;
        if (!shouldShowTrial || freeTimes <= 0) return;
        if (typeof window === "undefined") return;

        const storageKey = `trial-voucher-toast-${userInfo.uuid}`;
        const hasShown = localStorage.getItem(storageKey);
        if (!hasShown) {
            info(
                `🎁 ${freeTimes} trial vouchers for you.\nYou can use a trial voucher to try out the WanAI model.`,
            );
            localStorage.setItem(storageKey, "true");
        }
    }, [
        freeTimes,
        info,
        isLoadingUserInfo,
        isSignedIn,
        shouldShowTrial,
        userInfo,
    ]);

    // Non-visual component
    return null;
}
