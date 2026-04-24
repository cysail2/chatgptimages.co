'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/library/lib/utils';

type DeferredVideoProps = {
  src: string;
  poster?: string;
  alt?: string;
  title?: string;
  ariaLabel?: string;
  wrapperClassName?: string;
  className?: string;
  muted?: boolean;
  loop?: boolean;
  playsInline?: boolean;
  controls?: boolean;
  preload?: 'none' | 'metadata' | 'auto';
  priority?: boolean;
  active?: boolean;
  loadWhenInView?: boolean;
  loadRootMargin?: string;
  loadThreshold?: number;
  autoPlayWhenVisible?: boolean;
  playOnHover?: boolean;
  playWhenInView?: boolean;
  playWhenInViewThreshold?: number;
  disableVideoOnMobile?: boolean;
  resetOnPause?: boolean;
  persistLoaded?: boolean;
};

const MOBILE_MEDIA_QUERY = '(max-width: 767px), (hover: none), (pointer: coarse)';

export function DeferredVideo({
  src,
  poster,
  alt = '',
  title,
  ariaLabel,
  wrapperClassName,
  className,
  muted = true,
  loop = true,
  playsInline = true,
  controls = false,
  preload = 'metadata',
  priority = false,
  active = false,
  loadWhenInView = true,
  loadRootMargin = '240px 0px',
  loadThreshold = 0.15,
  autoPlayWhenVisible = false,
  playOnHover = false,
  playWhenInView = false,
  playWhenInViewThreshold = 0.5,
  disableVideoOnMobile = false,
  resetOnPause = true,
  persistLoaded = true,
}: DeferredVideoProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [hasEnteredView, setHasEnteredView] = useState(priority || !loadWhenInView);
  const [hasRequestedLoad, setHasRequestedLoad] = useState(priority);
  const [hasLoadedFrame, setHasLoadedFrame] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [isMobileLike, setIsMobileLike] = useState(false);
  const [hasResolvedMediaState, setHasResolvedMediaState] = useState(!disableVideoOnMobile);

  useEffect(() => {
    const mediaQuery = window.matchMedia(MOBILE_MEDIA_QUERY);
    const updateMediaState = () => {
      setIsMobileLike(mediaQuery.matches);
      setHasResolvedMediaState(true);
    };

    updateMediaState();
    mediaQuery.addEventListener?.('change', updateMediaState);

    return () => {
      mediaQuery.removeEventListener?.('change', updateMediaState);
    };
  }, []);

  useEffect(() => {
    if (!loadWhenInView || hasEnteredView || !containerRef.current) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) {
          return;
        }

        setHasEnteredView(true);
        observer.disconnect();
      },
      {
        rootMargin: loadRootMargin,
        threshold: loadThreshold,
      }
    );

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, [hasEnteredView, loadRootMargin, loadThreshold, loadWhenInView]);

  useEffect(() => {
    if (!playWhenInView || !containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry?.isIntersecting ?? false),
      { threshold: playWhenInViewThreshold }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [playWhenInView, playWhenInViewThreshold]);

  const videoDisabled = disableVideoOnMobile && (!hasResolvedMediaState || isMobileLike);
  const shouldRequestLoad =
    !videoDisabled &&
    (!disableVideoOnMobile || hasResolvedMediaState) &&
    (priority || active || hasEnteredView || isHovered);

  useEffect(() => {
    if (shouldRequestLoad) {
      setHasRequestedLoad(true);
      return;
    }

    if (!persistLoaded) {
      setHasRequestedLoad(false);
      setHasLoadedFrame(false);
    }
  }, [persistLoaded, shouldRequestLoad]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !hasRequestedLoad || videoDisabled) {
      return;
    }

    const shouldHoverPlay = playOnHover && !isMobileLike;
    const shouldAutoPlay = autoPlayWhenVisible && active && !isMobileLike;
    const shouldPlayInView = playWhenInView && isInView && !isMobileLike;
    const shouldPlay = shouldHoverPlay ? isHovered : (shouldPlayInView || shouldAutoPlay);

    if (shouldPlay) {
      video.play().catch(() => {});
      return;
    }

    video.pause();
    if (resetOnPause) {
      video.currentTime = 0;
    }
  }, [
    active,
    autoPlayWhenVisible,
    hasRequestedLoad,
    isHovered,
    isInView,
    isMobileLike,
    playOnHover,
    playWhenInView,
    resetOnPause,
    videoDisabled,
  ]);

  return (
    <div
      ref={containerRef}
      className={cn('relative overflow-hidden bg-black', wrapperClassName)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {poster ? (
        <img
          src={poster}
          alt={alt}
          width={1280}
          height={720}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          decoding="async"
          className={cn(
            'absolute inset-0 h-full w-full object-cover transition-opacity duration-300',
            hasLoadedFrame && hasRequestedLoad && !videoDisabled ? 'opacity-0' : 'opacity-100'
          )}
        />
      ) : null}

      {hasRequestedLoad && !videoDisabled ? (
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          title={title}
          aria-label={ariaLabel || alt}
          width={1280}
          height={720}
          className={cn(
            'h-full w-full object-cover transition-opacity duration-300',
            hasLoadedFrame ? 'opacity-100' : 'opacity-0',
            className
          )}
          muted={muted}
          loop={loop}
          playsInline={playsInline}
          controls={controls}
          preload={preload}
          onLoadedData={() => setHasLoadedFrame(true)}
        />
      ) : null}
    </div>
  );
}
