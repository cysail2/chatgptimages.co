"use client";

import React from "react";
import { cn } from "@/library/lib/utils";
import { ThemeToggle } from "../../ThemeToggle";
import { MenuBarExtraItemProps, MENU_BAR_EXTRA_BUTTON_STYLES } from "./types";

/**
 * ThemeExtra - Menu bar extra item for theme toggle
 * 
 * Simple wrapper around ThemeToggle with menu bar extra styling.
 */
export function ThemeExtra({ className }: MenuBarExtraItemProps) {
    return (
        <ThemeToggle
            className={cn(MENU_BAR_EXTRA_BUTTON_STYLES.base, className)}
        />
    );
}
