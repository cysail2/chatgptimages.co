"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { ExploreModel } from "@/library/lib/videos";
import { useVideoPreview, useGlobalVolume } from "@/library/providers";
import { Button } from "@/library/ui/button";
import { useToast } from "@/library/ui/toast-provider";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Loader2,
  Play,
  Repeat,
  Repeat1,
  User,
  Volume2,
  VolumeX,
} from "lucide-react";
import { shareToSocial } from "@/library/lib/share/share-utils";
import { stripModelVersion } from "@/library/components/profile/utils";

export type VideoPreviewVideoSource = {
  url: string;
  poster?: string;
  source: "user" | "explore";
  model?: ExploreModel;
  prompt?: string;
  taskId?: string;
};

export function VideoPreview({
  playlist,
  className,
  maxVideos = 5,
  hidePrompt = false,
  hideToolbar = false,
  fitContainer = false,
}: {
  playlist: VideoPreviewVideoSource[];
  className?: string;
  maxVideos?: number;
  hidePrompt?: boolean;
  hideToolbar?: boolean;
  fitContainer?: boolean;
}) {
  const { playRequest, pinnedUserVideo, reportNowPlaying } = useVideoPreview();
  const { isMuted, toggleMute, activeExclusivePlayerId } = useGlobalVolume();
  const { success, error } = useToast();

  // If someone else has exclusive priority, we must mute locally
  const isPriorityMuted = activeExclusivePlayerId !== null && activeExclusivePlayerId !== "video-preview";
  const effectiveMuted = isMuted || isPriorityMuted;

  // 限制显示的视频数量
  const limitedPlaylist = useMemo(() => {
    return playlist.slice(0, maxVideos);
  }, [playlist, maxVideos]);

  const playlistModel = useMemo<ExploreModel | null>(() => {
    const models = new Set(limitedPlaylist.map((x) => x.model).filter(Boolean));
    if (models.size !== 1) return null;
    return Array.from(models)[0] ?? null;
  }, [limitedPlaylist]);

  const videoRef = useRef<HTMLVideoElement>(null);
  const userPausedRef = useRef(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            if (!video.paused) {
              video.pause();
            }
          } else {
            if (video.paused && !userPausedRef.current) {
              video.play().catch(() => { });
            }
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [queue, setQueue] = useState<VideoPreviewVideoSource[]>([]);
  const [index, setIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const [autoAdvance, setAutoAdvance] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const forcedSingleLoopForUserUrlRef = useRef<string | null>(null);
  const buildDownloadName = (prefix: string) => {
    const now = new Date();
    const pad = (value: number) => value.toString().padStart(2, "0");
    const stamp = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(
      now.getDate()
    )}_${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
    return `${prefix}_${stamp}.mp4`;
  };

  const resolvedActive = queue[0] ?? limitedPlaylist[index] ?? null;
  const resolvedSource = resolvedActive?.source ?? "explore";
  const FADE_MS = 320;

  useEffect(() => {
    setQueue([]);
    setIndex(0);
    setIsFading(false);
  }, [limitedPlaylist]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("wan_tv_auto_advance");
      if (raw === "0") setAutoAdvance(false);
      if (raw === "1") setAutoAdvance(true);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("wan_tv_auto_advance", autoAdvance ? "1" : "0");
    } catch {
      // ignore
    }
  }, [autoAdvance]);

  const fadeThen = useCallback(
    (fn: () => void) => {
      setIsFading(true);
      window.setTimeout(() => {
        fn();
        setIsFading(false);
      }, FADE_MS);
    },
    [FADE_MS]
  );

  const navigationItems = useMemo(() => {
    const byUrl = new Map<string, VideoPreviewVideoSource>();
    for (const item of queue) {
      if (!byUrl.has(item.url)) byUrl.set(item.url, item);
    }
    for (const item of limitedPlaylist) {
      if (!byUrl.has(item.url)) byUrl.set(item.url, item);
    }
    return Array.from(byUrl.values());
  }, [limitedPlaylist, queue]);

  const canNavigate = navigationItems.length > 1;
  const showHoverNavigation = canNavigate;

  const navigateToUrl = useCallback(
    (targetUrl: string) => {
      if (!targetUrl) return;
      if (!resolvedActive?.url) return;
      if (targetUrl === resolvedActive.url) return;

      fadeThen(() => {
        const queueIndex = queue.findIndex((x) => x.url === targetUrl);
        if (queueIndex >= 0) {
          setQueue((prev) => {
            const foundIndex = prev.findIndex((x) => x.url === targetUrl);
            if (foundIndex < 0) return prev;
            return [...prev.slice(foundIndex), ...prev.slice(0, foundIndex)];
          });
          return;
        }

        const playlistIndex = limitedPlaylist.findIndex(
          (x) => x.url === targetUrl
        );
        if (playlistIndex >= 0) {
          setQueue([]);
          setIndex(playlistIndex);
        }
      });
    },
    [fadeThen, limitedPlaylist, queue, resolvedActive?.url]
  );

  const navigateToOffset = useCallback(
    (offset: -1 | 1) => {
      if (!resolvedActive?.url) return;
      if (navigationItems.length < 2) return;

      const currentIndex = navigationItems.findIndex(
        (x) => x.url === resolvedActive.url
      );
      const safeCurrentIndex = currentIndex >= 0 ? currentIndex : 0;
      const nextIndex =
        (safeCurrentIndex + offset + navigationItems.length) %
        navigationItems.length;
      const targetUrl = navigationItems[nextIndex]?.url;
      if (!targetUrl) return;

      navigateToUrl(targetUrl);
    },
    [navigateToUrl, navigationItems, resolvedActive?.url]
  );

  useEffect(() => {
    if (!playRequest?.url) return;
    if (
      playRequest.model &&
      playlistModel &&
      playRequest.model !== playlistModel
    )
      return;
    fadeThen(() => {
      setQueue((prev) => [
        {
          url: playRequest.url,
          source: playRequest.source ?? "explore",
          model: playRequest.model,
          prompt: playRequest.prompt,
          taskId: playRequest.taskId,
        },
        ...prev.filter((x) => x.url !== playRequest.url),
      ]);
    });
  }, [fadeThen, playRequest, playlistModel]);

  useEffect(() => {
    if (!resolvedActive) {
      reportNowPlaying(null);
      return;
    }
    reportNowPlaying({
      url: resolvedActive.url,
      model: resolvedActive.model ?? playlistModel ?? undefined,
      source: resolvedSource,
      prompt: resolvedActive.prompt,
      taskId: resolvedActive.taskId,
    });
  }, [playlistModel, reportNowPlaying, resolvedActive, resolvedSource]);

  useEffect(() => {
    if (pinnedUserVideo) return;
    if (queue[0]?.source !== "user") return;
    fadeThen(() => {
      setQueue((prev) => prev.filter((x) => x.source !== "user"));
    });
  }, [fadeThen, pinnedUserVideo, queue]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !resolvedActive) return;

    if (video.src !== resolvedActive.url) {
      video.src = resolvedActive.url;
      if (resolvedActive.poster) {
        video.poster = resolvedActive.poster;
      } else {
        video.removeAttribute("poster");
      }
      setIsPlaying(false);

      // Initial play when source changes
      const playPromise = video.play();
      if (playPromise && typeof (playPromise as any).catch === "function") {
        let cancelled = false;
        (playPromise as Promise<void>)
          .then(() => {
            if (!cancelled && !userPausedRef.current) setIsPlaying(true);
          })
          .catch(() => {
            if (!cancelled) setIsPlaying(false);
          });
        return () => {
          cancelled = true;
        };
      }
    }
  }, [resolvedActive]);

  // Separate effect for muted state to avoid re-triggering play
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = effectiveMuted;
  }, [effectiveMuted]);

  useEffect(() => {
    if (resolvedActive?.source !== "user") return;
    if (!resolvedActive.url) return;
    if (forcedSingleLoopForUserUrlRef.current === resolvedActive.url) return;
    forcedSingleLoopForUserUrlRef.current = resolvedActive.url;
    setAutoAdvance(false);
  }, [resolvedActive?.source, resolvedActive?.url]);

  const handleEnded = () => {
    if (resolvedSource === "user") return;
    if (!autoAdvance) return;
    fadeThen(() => {
      if (queue.length > 0) {
        setQueue((prev) => prev.slice(1));
        return;
      }
      setIndex((prev) =>
        limitedPlaylist.length > 0 ? (prev + 1) % limitedPlaylist.length : 0
      );
    });
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;
    setCurrentTime(video.currentTime || 0);
    setDuration(video.duration || 0);
  };

  const videoProgress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const indicatorItems = useMemo(
    () => navigationItems.slice(0, 10),
    [navigationItems]
  );
  const activeIndicatorIndex = resolvedActive?.url
    ? Math.max(
      0,
      indicatorItems.findIndex((x) => x.url === resolvedActive.url)
    )
    : 0;

  const activePrompt = resolvedActive?.prompt?.trim() || "";
  const isUserVideo = resolvedSource === "user";
  const activeTaskId =
    resolvedActive?.taskId || pinnedUserVideo?.taskId || null;

  return (
    <div id="wan-tv" className={`w-full ${fitContainer ? "flex-1 min-h-0 flex flex-col" : ""} ${className || ""}`}>
      <div className={`group relative w-full ${fitContainer ? "flex-1 min-h-0" : "aspect-[4/3]"} bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 rounded-xl overflow-hidden`}>
        <div className="absolute top-3 left-3 z-20 text-white text-xs font-semibold tracking-wide bg-black/40 px-3 py-2 rounded-full backdrop-blur-sm uppercase">
          {(isUserVideo && resolvedActive?.model) ? stripModelVersion(resolvedActive.model) : "Demos"}
        </div>

        <video
          ref={videoRef}
          src={resolvedActive?.url}
          preload="metadata"
          className={`absolute inset-0 w-full h-full object-contain rounded-xl cursor-pointer transition-opacity duration-300 ${isFading ? "opacity-0" : "opacity-100"
            }`}
          autoPlay
          loop={resolvedSource === "user" ? true : !autoAdvance}
          muted={effectiveMuted}
          playsInline
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleTimeUpdate}
          onPlaying={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={handleEnded}
          onClick={() => {
            const video = videoRef.current;
            if (!video) return;
            if (video.paused) {
              userPausedRef.current = false;
              video.play();
            } else {
              userPausedRef.current = true;
              video.pause();
            }
          }}
        />

        {showHoverNavigation && (
          <>
            <button
              type="button"
              aria-label="Previous video"
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/65 text-white rounded-full p-2 backdrop-blur-sm transition-all opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto"
              onClick={(e) => {
                e.stopPropagation();
                navigateToOffset(-1);
              }}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              type="button"
              aria-label="Next video"
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/65 text-white rounded-full p-2 backdrop-blur-sm transition-all opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto"
              onClick={(e) => {
                e.stopPropagation();
                navigateToOffset(1);
              }}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        <div className="absolute top-3 right-3 z-20 flex items-center gap-2">
          <button
            type="button"
            aria-label={
              autoAdvance ? "Disable auto-advance" : "Enable auto-advance"
            }
            className="bg-black/50 hover:bg-black/65 text-white rounded-full p-2 backdrop-blur-sm transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setAutoAdvance((v) => !v);
            }}
          >
            {autoAdvance ? (
              <Repeat className="w-5 h-5" />
            ) : (
              <Repeat1 className="w-5 h-5" />
            )}
          </button>

          <button
            type="button"
            aria-label={isMuted ? "Unmute video" : "Mute video"}
            className="bg-black/50 hover:bg-black/65 text-white rounded-full p-2 backdrop-blur-sm transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              toggleMute();
            }}
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5" />
            ) : (
              <Volume2 className="w-5 h-5" />
            )}
          </button>
        </div>

        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-white/90 rounded-full p-6 shadow-2xl">
              <Play
                className="w-12 h-12 text-gray-800 ml-1"
                fill="currentColor"
              />
            </div>
          </div>
        )}

        {indicatorItems.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
            {indicatorItems.map((item, i) => (
              <button
                type="button"
                aria-label={`Go to video ${i + 1}`}
                key={i}
                className={
                  item.source === "user"
                    ? `h-3.5 w-3.5 rounded-full transition-all duration-200 grid place-items-center ${i === activeIndicatorIndex
                      ? "bg-emerald-400 ring-2 ring-white/70"
                      : "bg-gray-300 ring-1 ring-white/30"
                    }`
                    : `h-1.5 rounded-full transition-all duration-200 ${i === activeIndicatorIndex
                      ? "w-6 bg-white"
                      : "w-1.5 bg-white/45"
                    }`
                }
                onClick={(e) => {
                  e.stopPropagation();
                  navigateToUrl(item.url);
                }}
              >
                {item.source === "user" && (
                  <User
                    className={`w-2.5 h-2.5 ${i === activeIndicatorIndex
                      ? "text-white"
                      : "text-gray-600"
                      }`}
                  />
                )}
              </button>
            ))}
          </div>
        )}

        {(isPlaying || currentTime > 0) && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 pointer-events-none transition-opacity group-hover:opacity-100">
            <div className="mb-2">
              <div className="w-full bg-white/30 rounded-full h-1">
                <div
                  className="bg-white rounded-full h-1 transition-all duration-100"
                  style={{ width: `${videoProgress}%` }}
                />
              </div>
            </div>
            <div className="flex justify-between items-center text-white text-sm">
              <span>
                {Math.floor(currentTime / 60)}:
                {Math.floor(currentTime % 60)
                  .toString()
                  .padStart(2, "0")}
              </span>
              <span>
                {Math.floor(duration / 60)}:
                {Math.floor(duration % 60)
                  .toString()
                  .padStart(2, "0")}
              </span>
            </div>
          </div>
        )}
      </div>

      {activePrompt && !hidePrompt && (
        <div className="mt-3 bg-muted/50 p-3 rounded-xl border border-border">
          <div className="text-xs text-muted-foreground mb-1">Prompt</div>
          <div className="text-sm text-foreground leading-relaxed line-clamp-3">
            {activePrompt}
          </div>
        </div>
      )}

      {isUserVideo && resolvedActive?.url && !hideToolbar && (
        <div className="mt-3 flex gap-2 justify-center items-center">
          <Button
            onClick={async () => {
              setIsDownloading(true);
              try {
                const resp = await fetch(resolvedActive.url);
                const blob = await resp.blob();
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = buildDownloadName("video");
                document.body.appendChild(a);
                a.click();
                a.remove();
                URL.revokeObjectURL(url);
                success("Video downloaded successfully!");
              } catch {
                error("Download failed. Please try again.");
              } finally {
                setIsDownloading(false);
              }
            }}
            className="flex items-center gap-2"
            disabled={isDownloading}
          >
            {isDownloading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Downloading...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" /> Download
              </>
            )}
          </Button>

          {activeTaskId && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  shareToSocial("twitter", {
                    taskId: activeTaskId,
                    videoUrl: resolvedActive.url,
                  })
                }
                title="Share to Twitter"
                className="hover:bg-[#1DA1F2] hover:text-white hover:border-[#1DA1F2]"
              >
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  shareToSocial("facebook", {
                    taskId: activeTaskId,
                    videoUrl: resolvedActive.url,
                  })
                }
                title="Share to Facebook"
                className="hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2]"
              >
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  shareToSocial("whatsapp", {
                    taskId: activeTaskId,
                    videoUrl: resolvedActive.url,
                  })
                }
                title="Share to WhatsApp"
                className="hover:bg-[#25D366] hover:text-white hover:border-[#25D366]"
              >
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
