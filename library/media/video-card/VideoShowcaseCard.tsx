"use client";

import React, { useRef } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { cn } from "@/library/lib/utils";
import { useGlobalVolume } from "@/library/providers";

interface VideoShowcaseCardProps {
    src: string;
    poster?: string;
    className?: string;
    aspectRatio?: string; // e.g. "aspect-[9/16]" or "aspect-video"
    autoPlayOnHover?: boolean;
    showMuteToggle?: boolean;
}

export function VideoShowcaseCard({
    src,
    poster,
    className,
    aspectRatio,
    autoPlayOnHover = true,
    showMuteToggle = true,
}: VideoShowcaseCardProps) {
    const { isMuted, toggleMute, requestExclusiveAudio } = useGlobalVolume();
    const videoRef = useRef<HTMLVideoElement>(null);
    const posterUrl = poster || src.replace(".mp4", ".cover.webp");

    const handleMouseEnter = () => {
        requestExclusiveAudio(src);
        if (autoPlayOnHover && videoRef.current) {
            videoRef.current.play().catch(() => { });
        }
    };

    const handleMouseLeave = () => {
        requestExclusiveAudio(null);
        if (autoPlayOnHover && videoRef.current) {
            videoRef.current.pause();
        }
    };

    const handleToggleMute = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        toggleMute();
    };

    return (
        <div
            className={cn(
                "group relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-900 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5",
                className
            )}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className={cn("w-full h-full bg-black", aspectRatio)}>
                <video
                    ref={videoRef}
                    src={src}
                    poster={posterUrl}
                    className="w-full h-full object-cover"
                    muted={isMuted}
                    playsInline
                    loop
                    preload="metadata"
                />
            </div>

            {showMuteToggle && (
                <button
                    onClick={handleToggleMute}
                    className="absolute bottom-4 right-4 z-10 p-2 rounded-full bg-black/40 backdrop-blur-md text-white border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/60"
                    aria-label={isMuted ? "Unmute" : "Mute"}
                >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
            )}
        </div>
    );
}
