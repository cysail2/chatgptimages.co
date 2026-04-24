'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/library/lib/utils';
import Image from 'next/image';

export interface ImageItem {
    id: string;
    src: string;
    alt: string;
}

const ImageLayer = ({ image, isActive, isPrevious, isPriority }: { image: ImageItem; isActive: boolean; isPrevious: boolean; isPriority: boolean }) => {
    return (
        <div
            className={cn(
                "absolute inset-0 transition-opacity duration-700 ease-in-out",
                isActive ? "opacity-100 z-20" : (isPrevious ? "opacity-100 z-10" : "opacity-0 z-0")
            )}
        >
            <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="100vw"
                className="object-cover"
                priority={isPriority}
                quality={90}
            />
        </div>
    );
};

interface FullScreenImageBackgroundProps {
    images: ImageItem[];
    children?: React.ReactNode;
    className?: string;
    overlayClassName?: string;
    indicatorStyle?: 'dots' | 'thumbnails';
    onHoverStart?: () => void;
    onHoverEnd?: () => void;
}

export const FullScreenImageBackground: React.FC<FullScreenImageBackgroundProps> = ({
    images,
    children,
    className,
    overlayClassName,
    indicatorStyle = 'dots',
    onHoverStart,
    onHoverEnd
}) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [prevIndex, setPrevIndex] = useState<number | null>(null);
    const [isAutoPlay, setIsAutoPlay] = useState(true);

    const handleSwitch = (index: number) => {
        if (index === activeIndex) return;
        setPrevIndex(activeIndex);
        setActiveIndex(index);
    };

    useEffect(() => {
        if (!images || images.length === 0 || !isAutoPlay) return;

        const interval = setInterval(() => {
            handleSwitch((activeIndex + 1) % images.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [images, isAutoPlay, activeIndex]);

    if (!images || images.length === 0) {
        return null;
    }

    const isVisible = (idx: number) => {
        if (images.length <= 3) return true;
        return idx === activeIndex || idx === prevIndex;
    };

    return (
        <section className={cn("relative min-h-screen w-full overflow-hidden bg-black", className)}>
            {/* Background Image Layers */}
            {images.map((img, idx) => (
                isVisible(idx) && (
                    <ImageLayer
                        key={img.id}
                        image={img}
                        isActive={idx === activeIndex}
                        isPrevious={idx === prevIndex}
                        isPriority={idx === 0}
                    />
                )
            ))}

            {/* Dark Overlay */}
            <div className={cn("absolute inset-0 bg-black/40 z-30 pointer-events-none", overlayClassName)} />

            {/* Content wrapper handles centering */}
            <div className="relative z-40 w-full min-h-screen flex flex-col justify-center items-center py-20 px-6">
                {children}
            </div>

            {/* Slide Indicators - Dots (Bottom) */}
            {images.length > 1 && indicatorStyle === 'dots' && (
                <div
                    className="absolute bottom-10 left-0 right-0 z-50 flex items-center justify-center gap-3"
                    onMouseEnter={() => {
                        setIsAutoPlay(false);
                        onHoverStart?.();
                    }}
                    onMouseLeave={() => {
                        setIsAutoPlay(true);
                        onHoverEnd?.();
                    }}
                >
                    {images.map((_, idx) => (
                        <button
                            key={idx}
                            onMouseEnter={() => handleSwitch(idx)}
                            onClick={() => handleSwitch(idx)}
                            className={cn(
                                "h-1.5 transition-all duration-500 rounded-full",
                                idx === activeIndex
                                    ? "w-8 bg-white"
                                    : "w-2 bg-white/30 hover:bg-white/50"
                            )}
                            aria-label={`Go to slide ${idx + 1}`}
                        />
                    ))}
                </div>
            )}

            {/* Slide Indicators - Thumbnails (Right) */}
            {images.length > 1 && indicatorStyle === 'thumbnails' && (
                <div
                    className="hidden md:flex absolute right-4 md:right-8 top-1/2 -translate-y-1/2 flex-col gap-4 z-50 group/nav"
                    onMouseEnter={() => {
                        setIsAutoPlay(false);
                        onHoverStart?.();
                    }}
                    onMouseLeave={() => {
                        setIsAutoPlay(true);
                        onHoverEnd?.();
                    }}
                >
                    {images.map((img, idx) => (
                        <button
                            key={img.id}
                            onMouseEnter={() => handleSwitch(idx)}
                            onClick={() => handleSwitch(idx)}
                            className={cn(
                                "relative w-12 h-12 md:w-15 md:h-15 rounded-xl overflow-hidden transition-all duration-300 focus:outline-none border-2 shadow-2xl",
                                idx === activeIndex
                                    ? "border-white scale-110 md:scale-125 opacity-60 group-hover/nav:opacity-100 ring-2 ring-white/20"
                                    : "border-transparent opacity-30 scale-75 md:scale-90 grayscale group-hover/nav:opacity-60 group-hover/nav:grayscale-0 hover:!opacity-100 hover:!scale-105"
                            )}
                            aria-label={`Switch to image background ${idx + 1}`}
                        >
                            <Image
                                src={img.src}
                                alt={img.alt}
                                fill
                                sizes="(max-width: 768px) 48px, 60px"
                                className="object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}
        </section>
    );
};
