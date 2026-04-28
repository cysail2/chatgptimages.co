"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { MoreHorizontal, Smile } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { cn } from "@/library/lib/utils";
import { NavigationConfig } from "@/types/siteConfig";
import { useAIStudio } from "@/library/components/ai-studio";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/library/ui/popover";

interface MobileBottomNavProps {
    navConfig: NavigationConfig | null;
    className?: string;
}

/**
 * MobileBottomNav - iOS-style bottom navigation bar for mobile devices
 * 
 * Features:
 * - Fixed at bottom of screen
 * - Glassmorphism design with blur effect
 * - Dynamic icon support from lucide-react
 * - Max 5 visible items, overflow shows "More" popover
 * - Safe area inset support for notched devices
 */
export function MobileBottomNav({ navConfig, className }: MobileBottomNavProps) {
    const pathname = usePathname();
    const { openAIStudio, isOpen, activeModel } = useAIStudio();

    // Prepare mobile items
    const allMobileItems = navConfig?.mobileNav
        ?.filter((item) => item.visible)
        .sort((a, b) => (a.order ?? 999) - (b.order ?? 999)) || [];
    const mobileItems = allMobileItems.filter((item) => item.placement !== "right-floating");
    const rightFloatingItem = allMobileItems.find((item) => item.placement === "right-floating");

    // If no items and no floating item, do not render anything
    if (mobileItems.length === 0 && !rightFloatingItem) {
        return null;
    }

    // Dynamic icon getter using lucide-react icons
    const getIcon = (iconName: string) => {
        // Check if icon exists directly (e.g. "DollarSign")
        if ((LucideIcons as any)[iconName]) {
            return (LucideIcons as any)[iconName];
        }

        // Convert kebab-case or snake_case to PascalCase
        const pascalCase = iconName
            .split(/[-_]/)
            .map((word) =>
                word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
            )
            .join("");

        // Try to get from icons object
        const IconComponent = (LucideIcons as any)[pascalCase];
        return IconComponent || Smile;
    };

    // Max 5 items visible, if more than 5, show first 4 + More
    const MAX_VISIBLE = 5;
    const hasMore = mobileItems.length > MAX_VISIBLE;
    const visibleItems = hasMore ? mobileItems.slice(0, 4) : mobileItems;
    const moreItems = hasMore ? mobileItems.slice(4) : [];

    const renderNavItem = (
        item: typeof mobileItems[0],
        isPopoverItem = false,
    ) => {
        const IconComponent = getIcon(item.icon);
        const isAiStudioAction = item.action === "open-ai-studio";
        const isActive = isAiStudioAction
            ? isOpen && (!item.aiStudioModel || activeModel === item.aiStudioModel)
            : item.matchExact || item.href === "/"
                ? pathname === item.href
                : pathname.startsWith(item.href);

        if (isPopoverItem) {
            if (isAiStudioAction) {
                return (
                    <button
                        key={item.id}
                        type="button"
                        onClick={() => openAIStudio(item.aiStudioModel)}
                        className={cn(
                            "flex w-full items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left",
                            isActive
                                ? "bg-primary/10 text-primary"
                                : "text-foreground hover:bg-muted",
                        )}
                    >
                        <IconComponent className="h-5 w-5" />
                        <span className="font-medium">{item.label}</span>
                    </button>
                );
            }

            return (
                <Link
                    key={item.id}
                    href={item.href}
                    className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                        isActive
                            ? "bg-primary/10 text-primary"
                            : "text-foreground hover:bg-muted",
                    )}
                >
                    <IconComponent className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                </Link>
            );
        }

        if (isAiStudioAction) {
            return (
                <button
                    key={item.id}
                    type="button"
                    onClick={() => openAIStudio(item.aiStudioModel)}
                    className={cn(
                        "relative z-10 flex flex-1 items-center justify-center px-0.5 py-0.5 text-[10px] font-medium transition-colors",
                    )}
                >
                    <span
                        className={cn(
                            "inline-flex my-0.5 flex-col items-center justify-center gap-0.5 rounded-full px-4 py-1 transition-colors",
                            isActive
                                ? "bg-primary/12 text-primary"
                                : "text-muted-foreground/80 hover:text-foreground",
                        )}
                    >
                        <IconComponent
                            className={cn(
                                "h-4 w-4 [stroke-width:2.4]",
                                isActive ? "text-primary" : "text-muted-foreground"
                            )}
                        />
                        <span>{item.label}</span>
                    </span>
                </button>
            );
        }

        return (
            <Link
                key={item.id}
                href={item.href}
                className={cn(
                    "relative z-10 flex flex-1 items-center justify-center px-0.5 py-0.5 text-[10px] font-medium transition-colors",
                )}
            >
                <span
                    className={cn(
                        "inline-flex my-0.5 flex-col items-center justify-center gap-0.5 rounded-full px-4 py-1 transition-colors",
                        isActive
                            ? "bg-primary/12 text-primary"
                            : "text-muted-foreground/80 hover:text-foreground",
                    )}
                >
                    <IconComponent
                        className={cn(
                            "h-4 w-4 [stroke-width:2.4]",
                            isActive ? "text-primary" : "text-muted-foreground"
                        )}
                    />
                    <span>{item.label}</span>
                </span>
            </Link>
        );
    };

    const renderFloatingItem = (item: typeof allMobileItems[0]) => {
        const IconComponent = getIcon(item.icon);
        const isAiStudioAction = item.action === "open-ai-studio";
        const isActive = isAiStudioAction
            ? isOpen && (!item.aiStudioModel || activeModel === item.aiStudioModel)
            : item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

        const buttonClassName = cn(
            "inline-flex h-14 w-14 items-center justify-center rounded-full border transition-all",
            isActive
                ? "bg-primary/15 border-primary/40 text-primary shadow-[0_8px_30px_rgba(99,102,241,0.35)]"
                : "bg-background/80 border-border/60 text-foreground shadow-[0_8px_24px_rgba(0,0,0,0.2)] backdrop-blur-xl"
        );

        if (isAiStudioAction) {
            return (
                <button
                    key={item.id}
                    type="button"
                    onClick={() => openAIStudio(item.aiStudioModel)}
                    className={buttonClassName}
                    aria-label={item.label}
                    title={item.label}
                >
                    <IconComponent className="h-6 w-6" />
                </button>
            );
        }

        return (
            <Link
                key={item.id}
                href={item.href}
                className={buttonClassName}
                aria-label={item.label}
                title={item.label}
            >
                <IconComponent className="h-6 w-6" />
            </Link>
        );
    };

    return (
        <div className={cn("md:hidden fixed bottom-0 left-0 right-0 z-50 pb-[env(safe-area-inset-bottom)]", className)}>
            <div className="mx-auto max-w-[1400px] px-4 pb-2 flex items-end gap-3">
                {mobileItems.length > 0 && (
                    <div className="flex-1 min-w-0">
                        <div className="relative h-14 flex items-center justify-between rounded-full border border-border/50 bg-background/70 px-2 py-1 shadow-[0_10px_30px_rgba(0,0,0,0.12)] backdrop-blur-2xl backdrop-saturate-150">
                            {/* Gradient overlay */}
                            <div className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-br from-background/40 via-background/20 to-background/30 opacity-100" />
                            {/* Inner border highlight */}
                            <div className="pointer-events-none absolute inset-[1px] rounded-full border border-white/10 dark:border-white/5" />

                            {/* Navigation items */}
                            {visibleItems.map((item) => renderNavItem(item))}

                            {/* More button with popover */}
                            {hasMore && (
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <button
                                            className={cn(
                                                "relative z-10 flex flex-1 flex-col items-center gap-0.5 rounded-xl px-1 py-0.5 text-[10px] font-medium transition-colors",
                                                "text-muted-foreground/80 hover:text-foreground",
                                            )}
                                        >
                                            <span
                                                className={cn(
                                                    "flex h-7 w-7 items-center justify-center rounded-full transition-colors bg-transparent",
                                                )}
                                            >
                                                <MoreHorizontal className="h-4 w-4" />
                                            </span>
                                            <span>More</span>
                                        </button>
                                    </PopoverTrigger>
                                    <PopoverContent
                                        align="end"
                                        side="top"
                                        sideOffset={12}
                                        className="w-48 p-2"
                                    >
                                        <div className="flex flex-col gap-1">
                                            {moreItems.map((item) => renderNavItem(item, true))}
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            )}
                        </div>
                    </div>
                )}
                {rightFloatingItem && (
                    <div className="shrink-0 pb-0.5">
                        {renderFloatingItem(rightFloatingItem)}
                    </div>
                )}
            </div>
        </div>
    );
}
