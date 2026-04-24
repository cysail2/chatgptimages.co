'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/library/lib/utils';
import { Volume2, VolumeX } from 'lucide-react';
import { DeferredVideo } from '@/library/media/DeferredVideo';

export interface VideoItem {
    id: string;
    src: string;
    poster: string;
    alt: string;
    hasAudio?: boolean;
}

const VideoLayer = ({ video, isActive, isMuted }: { video: VideoItem; isActive: boolean; isMuted: boolean }) => {
    return (
        <div
            className={cn(
                "absolute inset-0 transition-opacity duration-1000 ease-in-out",
                isActive ? "opacity-100 z-0" : "opacity-0 -z-10"
            )}
        >
            <DeferredVideo
                src={video.src}
                poster={video.poster}
                alt={video.alt}
                wrapperClassName="absolute inset-0 h-full w-full"
                className="absolute inset-0 h-full w-full object-cover"
                muted={isMuted}
                playsInline
                loop
                preload="metadata"
                active={isActive}
                autoPlayWhenVisible
                disableVideoOnMobile
                loadWhenInView={false}
                priority={isActive}
                persistLoaded
            />
        </div>
    );
};

interface FullScreenVideoBackgroundProps {
    videos: VideoItem[];
    children?: React.ReactNode;
    className?: string;
    onHoverStart?: () => void;
    onHoverEnd?: () => void;
}

export const FullScreenVideoBackground: React.FC<FullScreenVideoBackgroundProps> = ({
    videos,
    children,
    className,
    onHoverStart,
    onHoverEnd
}) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isAutoPlay, setIsAutoPlay] = useState(true);
    const [isMuted, setIsMuted] = useState(true);
    const [isStaticMode, setIsStaticMode] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(max-width: 767px), (hover: none), (pointer: coarse)');
        const updateMode = () => setIsStaticMode(mediaQuery.matches);

        updateMode();
        mediaQuery.addEventListener?.('change', updateMode);

        return () => {
            mediaQuery.removeEventListener?.('change', updateMode);
        };
    }, []);

    useEffect(() => {
        if (isStaticMode) {
            setActiveIndex(0);
        }
    }, [isStaticMode]);

    // Handle auto-switching
    useEffect(() => {
        if (!isAutoPlay || isStaticMode) return;

        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % videos.length);
        }, 8000); // Switch every 8 seconds

        return () => clearInterval(interval);
    }, [isAutoPlay, isStaticMode, videos.length]);

    const handleManualSwitch = (index: number) => {
        setActiveIndex(index);
        setIsAutoPlay(false); // Disable auto-play on manual interaction
        // Re-enable auto-play after 15 seconds of inactivity
        setTimeout(() => setIsAutoPlay(true), 15000);
    };

    if (!videos || videos.length === 0) {
        return null; // Or some fallback
    }

    const renderedVideos = isStaticMode ? [videos[activeIndex]] : videos;

    return (
        <section className={cn("relative min-h-screen flex items-center justify-center overflow-hidden bg-black", className)}>
            {/* Background Video Layers */}
            {renderedVideos.map((video, idx) => (
                <VideoLayer
                    key={video.id}
                    video={video}
                    isActive={isStaticMode ? true : idx === activeIndex}
                    isMuted={isMuted}
                />
            ))}

            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/40 z-0 pointer-events-none" />

            {/* Content using children */}
            {children}

            {/* Right Side Video Navigation */}
            <div
                className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-20 hidden lg:flex group"
                onMouseEnter={onHoverStart}
                onMouseLeave={onHoverEnd}
            >
                {videos.map((video, idx) => (
                    <button
                        key={video.id}
                        onMouseEnter={() => handleManualSwitch(idx)}
                        className={cn(
                            "relative w-12 h-12 rounded-lg overflow-hidden transition-all duration-500 focus:outline-none",
                            idx === activeIndex
                                ? "border-2 border-primary scale-125 shadow-[0_0_20px] shadow-primary/50 opacity-100 z-10 ring-1 ring-black/50"
                                : "opacity-30 scale-75 grayscale border-0 group-hover:opacity-70 group-hover:scale-90 group-hover:grayscale-0 hover:!opacity-100 hover:!scale-110 hover:z-20"
                        )}
                        aria-label={`Switch to video background ${idx + 1}`}
                        title={video.alt}
                    >
                        <img
                            src={video.poster}
                            alt={video.alt}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover"
                        />
                    </button>
                ))}
            </div>

            {/* Mute Toggle Button - Only show if current video has audio */}
            {videos[activeIndex].hasAudio && (
                <div className="absolute bottom-8 right-8 z-30">
                    <button
                        onClick={() => setIsMuted(!isMuted)}
                        className="p-3 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full text-white/90 border border-white/20 transition-all duration-300 transform hover:scale-105 shadow-[0_0_20px_rgba(0,0,0,0.3)]"
                        aria-label={isMuted ? "Unmute video" : "Mute video"}
                    >
                        {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                    </button>
                </div>
            )}
        </section>
    );
};
