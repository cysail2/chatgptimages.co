'use client';

import React from 'react';
import { ComponentProps } from '../registry';
import { cn } from '@/lib/utils';

export const VideoComponent = ({ node }: ComponentProps) => {
    const { src, poster, muted = true, autoPlay = true, loop = true, className, ...rest } = node.props || {};

    return (
        <div className={cn('relative overflow-hidden rounded-xl border border-border bg-black/5', className)}>
            <video
                src={src}
                poster={poster}
                className="w-full h-full object-cover"
                muted={muted}
                autoPlay={autoPlay}
                loop={loop}
                playsInline
                {...rest}
            />
        </div>
    );
};
