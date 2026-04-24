"use client";

import React from "react";
import { cn } from "@/library/lib/utils";
import { useUserInfo } from "@/library/providers";
import AuthButton from "../../auth/auth-button";
import FreeTrySignUpButton from "../../auth/free-try-signup-button";
import { MenuBarExtraItemProps } from "./types";
import { UserAccountExtra } from "./UserAccountExtra";

interface UserAuthExtraProps extends MenuBarExtraItemProps {
    /** Site name for display */
    siteName?: string;
    /** Enable free try button */
    enableFreeTryButton?: boolean;
    /** Free try button text */
    freeTryButtonText?: string;
    /** Enable sign up button */
    enableSignUpButton?: boolean;
}

/**
 * UserAuthExtra - Menu bar extra item for user authentication
 * 
 * Shows authentication button and optional free try button.
 * Visibility should be controlled externally by the parent component.
 */
export function UserAuthExtra({
    className,
    siteName,
    enableFreeTryButton = false,
    freeTryButtonText,
    enableSignUpButton = false,
}: UserAuthExtraProps) {
    const { isSignedIn } = useUserInfo();
    const shouldShowFreeTryButton = enableFreeTryButton;
    const shouldShowSignUpButton = enableSignUpButton && !shouldShowFreeTryButton;
    const isOnlyLoginButton = !shouldShowFreeTryButton && !shouldShowSignUpButton;

    // If signed in, show the UserAccountExtra component (Avatar with hover menu)
    if (isSignedIn) {
        return (
            <div className={cn("flex items-center pl-1", className)}>
                <UserAccountExtra className={className} />
            </div>
        );
    }

    // If not signed in, show Auth buttons
    return (
        <div className={cn("flex items-center gap-2 pl-1 pr-0", className)}>
            <AuthButton enableSignUpButton={shouldShowSignUpButton} isOnlyButton={isOnlyLoginButton} />
            {shouldShowFreeTryButton && (
                <FreeTrySignUpButton
                    siteName={siteName}
                    text={freeTryButtonText}
                />
            )}
        </div>
    );
}
