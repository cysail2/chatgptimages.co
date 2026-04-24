"use client";

/**
 * MenuBar Extra Item Types
 * 
 * Standard interface for MenuBar extra items, similar to macOS menu bar extras.
 */

import React, { useState, useRef, useCallback } from "react";
import { useNavState } from "../NavStateContext";

/**
 * Base props for all MenuBar extra items
 */
export interface MenuBarExtraItemProps {
    /** Custom class name */
    className?: string;
}

/**
 * Standard button styles for MenuBar extra items
 */
export const MENU_BAR_EXTRA_BUTTON_STYLES = {
    base: "h-8 w-8 rounded-full transition-colors cursor-pointer focus-visible:ring-0 focus-visible:ring-offset-0 flex items-center justify-center",
    active: "text-primary bg-primary/10",
    inactive: "hover:bg-muted font-medium",
    inactiveHover: "hover:text-foreground",
    icon: "h-4 w-4",
} as const;

/**
 * Hook to get dynamic styles for MenuBar extra items based on nav state
 */
export function useMenuBarExtraStyles() {
    const { isOverlay, isScrolled } = useNavState();
    const isDarkLocked = isOverlay && !isScrolled;

    return {
        isDarkLocked,
        isScrolled,
        isOverlay,
        buttonColorClass: isDarkLocked
            ? "text-white/80 hover:text-white hover:bg-white/10"
            : "text-muted-foreground hover:text-foreground hover:bg-muted",
        dividerColorClass: isDarkLocked
            ? "bg-white/20"
            : "bg-border/50"
    };
}

/**
 * Standard popover styles for MenuBar extra items
 */
export const MENU_BAR_EXTRA_POPOVER_STYLES = {
    content: "w-auto p-0 bg-background/80 backdrop-blur-xl border-border/40 shadow-2xl rounded-2xl overflow-hidden mt-2",
    align: "center" as const,
    sideOffset: 2,
} as const;

/**
 * Divider component for separating MenuBar extra items
 */
export function MenuBarDivider() {
    const { dividerColorClass } = useMenuBarExtraStyles();
    return <div className={cn("w-px h-4 mx-1.5", dividerColorClass)} />;
}

import { cn } from "@/library/lib/utils";

/**
 * Hook for hover-triggered popover with delay to prevent flickering
 * 
 * @param closeDelay - Delay in ms before closing popover (default: 150ms)
 */
export function useHoverPopover(closeDelay: number = 150) {
    const [isOpen, setIsOpen] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleMouseEnter = useCallback(() => {
        // Cancel any pending close
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
        setIsOpen(true);
    }, []);

    const handleMouseLeave = useCallback(() => {
        // Set delayed close
        timeoutRef.current = setTimeout(() => {
            setIsOpen(false);
        }, closeDelay);
    }, [closeDelay]);

    const handleClick = useCallback((e: React.SyntheticEvent) => {
        // If the popover is already open via hover, prevent the click 
        // from toggling it closed. This improves UX for users who click.
        if (isOpen) {
            e.preventDefault();
        }
    }, [isOpen]);

    // Cleanup on unmount
    React.useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return {
        isOpen,
        setIsOpen,
        triggerProps: {
            onMouseEnter: handleMouseEnter,
            onMouseLeave: handleMouseLeave,
            onClick: handleClick,
            onPointerDown: handleClick,
        },
        contentProps: {
            onMouseEnter: handleMouseEnter,
            onMouseLeave: handleMouseLeave,
        },
    };
}
