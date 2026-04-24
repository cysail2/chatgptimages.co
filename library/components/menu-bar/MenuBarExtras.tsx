"use client";

import React from "react";
import { cn } from "@/library/lib/utils";
import { useUserInfo } from "@/library/providers";
import { useAudioPlayer } from "@/library/media/audio-player/AudioPlayerProvider";
import { SiteConfig } from "@/types/siteConfig";
import {
    AudioPlayerExtra,
    TaskCenterExtra,
    ThemeExtra,
    VolumeToggleExtra,
    UserBalanceExtra,
    UserAuthExtra,
    TrialToastExtra,
    MenuBarDivider,
} from "./extras";
import { isAudioSupportedModule } from "@/types/model-types";

interface MenuBarExtrasProps {
    siteConfig: SiteConfig;
    className?: string;
}

/**
 * MenuBarExtras - Right-side extra items for the menu bar
 * 
 * Composes individual MenuBar Extra Items in a macOS menu bar style:
 * - Unified view for both Mobile and Desktop: AudioPlayer, TaskCenter, Theme, Balance, Auth extras
 * 
 * Visibility logic is handled here, Extra Items just render their content.
 */
export function MenuBarExtras({ siteConfig, className }: MenuBarExtrasProps) {
    const { isSignedIn } = useUserInfo();
    const { isPlaying } = useAudioPlayer();
    const [isHydrated, setIsHydrated] = React.useState(false);

    React.useEffect(() => {
        setIsHydrated(true);
    }, []);

    const enableUserModule = siteConfig.features?.enableUserModule && !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
    const aiModules = siteConfig.aiModules || [];
    const hasAudioModule = aiModules.some((module) => isAudioSupportedModule(module));
    const showVolumeToggle = hasAudioModule;
    const showAudioPlayer = isPlaying;
    const showTaskCenter = isHydrated && enableUserModule && isSignedIn;
    const showUserSection = isHydrated && enableUserModule;

    return (
        <div className={cn("flex items-center gap-2", className)}>
            {/* Trial Toast (non-visual) */}
            <TrialToastExtra />

            {/* Controls - full macOS menu bar style, visible on all screens */}
            <div className="flex items-center p-1 gap-0.5 rounded-full">
                {showVolumeToggle && <VolumeToggleExtra />}

                {showVolumeToggle && showAudioPlayer && <MenuBarDivider />}

                {/* Audio Player - only shows when playing */}
                {showAudioPlayer && <AudioPlayerExtra />}

                {(showVolumeToggle || showAudioPlayer) && showTaskCenter && <MenuBarDivider />}

                {/* Task Center - only shows when user module enabled and signed in */}
                {showTaskCenter && <TaskCenterExtra />}

                <MenuBarDivider />

                {/* Theme Toggle - hidden when site forces a theme */}
                {(siteConfig.features?.enableThemeToggle ?? true) && <ThemeExtra />}

                {/* User Module section */}
                {showUserSection && (
                    <>
                        <MenuBarDivider />
                        <UserBalanceExtra />
                        <UserAuthExtra
                            siteName={siteConfig.site?.name}
                            enableFreeTryButton={siteConfig.features?.enableFreeTryButton ?? false}
                            freeTryButtonText={siteConfig.features?.freeTryButtonText}
                            enableSignUpButton={siteConfig.features?.enableSignUpButton ?? false}
                        />
                    </>
                )}
            </div>
        </div>
    );
}
