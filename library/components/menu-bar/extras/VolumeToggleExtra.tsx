"use client";

import React from "react";
import { Volume2, VolumeX } from "lucide-react";
import { useGlobalVolume } from "@/library/providers";
import { cn } from "@/library/lib/utils";
import { Button } from "@/library/ui/button";
import {
    MENU_BAR_EXTRA_BUTTON_STYLES,
    useMenuBarExtraStyles,
} from "./types";

export function VolumeToggleExtra() {
    const { isMuted, toggleMute } = useGlobalVolume();
    const { buttonColorClass } = useMenuBarExtraStyles();

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={toggleMute}
            className={cn(
                MENU_BAR_EXTRA_BUTTON_STYLES.base,
                !isMuted ? MENU_BAR_EXTRA_BUTTON_STYLES.active : buttonColorClass
            )}
            title={isMuted ? "Unmute All" : "Mute All"}
        >
            {isMuted ? (
                <VolumeX className={MENU_BAR_EXTRA_BUTTON_STYLES.icon} />
            ) : (
                <Volume2 className={MENU_BAR_EXTRA_BUTTON_STYLES.icon} />
            )}
        </Button>
    );
}
