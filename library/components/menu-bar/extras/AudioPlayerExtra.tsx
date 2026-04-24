"use client";

import React from "react";
import { Play } from "lucide-react";
import { cn } from "@/library/lib/utils";
import { useAudioPlayer } from "@/library/media/audio-player/AudioPlayerProvider";
import { Button } from "@/library/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/library/ui/popover";
import { AudioPlayerDropdown } from "@/library/media/audio-player/AudioPlayerDropdown";
import {
    MenuBarExtraItemProps,
    MENU_BAR_EXTRA_BUTTON_STYLES,
    MENU_BAR_EXTRA_POPOVER_STYLES,
    useHoverPopover,
    useMenuBarExtraStyles,
} from "./types";

/**
 * AudioPlayerExtra - Menu bar extra item for audio player
 * 
 * Shows a play button that opens the audio player dropdown on hover.
 * Visibility should be controlled externally by the parent component.
 */
export function AudioPlayerExtra({ className }: MenuBarExtraItemProps) {
    const { isExpanded, isPlaying } = useAudioPlayer();
    const { isOpen, triggerProps, contentProps } = useHoverPopover();
    const { buttonColorClass } = useMenuBarExtraStyles();
    const isActive = isExpanded || isPlaying;

    return (
        <Popover open={isOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                        MENU_BAR_EXTRA_BUTTON_STYLES.base,
                        isActive || isOpen
                            ? MENU_BAR_EXTRA_BUTTON_STYLES.active
                            : buttonColorClass,
                        className
                    )}
                    title="Music Player"
                    {...triggerProps}
                >
                    <Play className={cn(
                        MENU_BAR_EXTRA_BUTTON_STYLES.icon,
                        isPlaying && "animate-pulse"
                    )} />
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className={MENU_BAR_EXTRA_POPOVER_STYLES.content}
                align={MENU_BAR_EXTRA_POPOVER_STYLES.align}
                sideOffset={MENU_BAR_EXTRA_POPOVER_STYLES.sideOffset}
                {...contentProps}
            >
                <AudioPlayerDropdown />
            </PopoverContent>
        </Popover>
    );
}
