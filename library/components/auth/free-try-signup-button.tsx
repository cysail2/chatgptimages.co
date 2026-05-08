import React from "react";
import { Button } from "@/library/ui/button";
import { useUserInfo } from "@/library/providers";

interface FreeTrySignUpButtonProps {
    siteName?: string;
    text?: string;
}

export default function FreeTrySignUpButton({ siteName, text }: FreeTrySignUpButtonProps) {
    const { openSignIn } = useUserInfo();
    const mobileText = "Start for free";
    const desktopText = text || `Free Try ${siteName || "App"}`;
    return (
        <Button
            variant="default"
            onClick={() => openSignIn({ mode: 'sign-up' })}
            aria-label={desktopText}
            title={desktopText}
            className="h-8 pl-4 pr-3 sm:px-4 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground border-0 text-sm leading-none font-semibold shadow-sm hover:shadow-md transition-all inline-flex items-center"
        >
            <span className="sm:hidden">{mobileText}</span>
            <span className="hidden sm:inline">{desktopText}</span>
        </Button>
    );
}
