'use client';

import { useEffect, useRef, useState } from 'react';
import { ComponentProps } from '../registry';
import { cn } from '@/lib/utils';
import { fetchExploreVideos, type ExploreModel, type ExploreVideo } from '@/lib/videos';

export const VideoCases = ({ node, selectedNodeId }: ComponentProps) => {
  const { heading, title, summary, subtitle, product, limit = 8, className } = node.props || {};
  const [videoSources, setVideoSources] = useState<ExploreVideo[]>([]);
  const [playingVideo, setPlayingVideo] = useState<number | null>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const isSelected = selectedNodeId === node.id;

  const resolvedLimit =
    typeof limit === 'number' ? limit : Number.parseInt(String(limit), 10) || 8;
  const resolvedModel = (product || 'wan2.6') as ExploreModel;

  useEffect(() => {
    let cancelled = false;
    fetchExploreVideos(resolvedModel).then((videos) => {
      if (cancelled) return;
      // Truncate to the resolved limit immediately (e.g., 8)
      setVideoSources(videos.slice(0, resolvedLimit));
    });
    return () => {
      cancelled = true;
    };
  }, [resolvedLimit, resolvedModel]);

  if (videoSources.length === 0) {
    return null;
  }

  const handleMouseEnter = (index: number) => {
    const video = videoRefs.current[index];
    if (video) {
      video.muted = false;
      video.play();
      setPlayingVideo(index);
    }
  };

  const handleMouseLeave = (index: number) => {
    const video = videoRefs.current[index];
    if (video) {
      video.pause();
      video.currentTime = 0;
      video.muted = true;
      setPlayingVideo(null);
    }
  };

  const handleClick = (index: number) => {
    const video = videoRefs.current[index];
    if (!video) return;
    if (playingVideo === index) {
      video.pause();
      video.muted = true;
      setPlayingVideo(null);
      return;
    }
    video.muted = false;
    video.play();
    setPlayingVideo(index);
  };

  return (
    <section
      id={node.id}
      data-node-id={node.id}
      className={cn("py-20 bg-background/50", className, isSelected && 'ring-2 ring-primary ring-offset-2 transition-all duration-200 scroll-mt-20')}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          {(heading || title) && (
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-center font-poppins text-foreground">
              {heading || title}
            </h2>
          )}
          {(summary || subtitle) && (
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-12 text-center">
              {summary || subtitle}
            </p>
          )}

          {/* Masonry Layout */}
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {videoSources.map((item, idx) => (
              <div
                key={item.videoUrl}
                className="break-inside-avoid bg-black rounded-xl overflow-hidden border border-border/50 relative group cursor-pointer shadow-md hover:shadow-xl transition-all duration-300"
                onMouseEnter={() => handleMouseEnter(idx)}
                onMouseLeave={() => handleMouseLeave(idx)}
                onClick={() => handleClick(idx)}
              >
                <video
                  ref={(el) => {
                    videoRefs.current[idx] = el;
                  }}
                  src={item.videoUrl}
                  muted
                  playsInline
                  loop
                  preload="metadata"
                  poster={item.coverUrl || undefined}
                  className="w-full h-auto object-cover"
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
