"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { ExploreModel } from "@/library/lib/videos";

type PlayRequest = {
  id: number;
  url: string;
  model?: ExploreModel;
  source?: "user" | "explore";
  prompt?: string;
  taskId?: string;
};

type NowPlaying = {
  url: string;
  model?: ExploreModel;
  source: "user" | "explore";
  prompt?: string;
  taskId?: string;
};

type VideoPreviewContextValue = {
  playRequest: PlayRequest | null;
  pinnedUserVideo: {
    url: string;
    model?: ExploreModel;
    prompt?: string;
    taskId?: string;
  } | null;
  nowPlaying: NowPlaying | null;
  requestPlay: (
    url: string,
    options?: {
      model?: ExploreModel;
      source?: "user" | "explore";
      prompt?: string;
      taskId?: string;
    }
  ) => void;
  clearPinnedUserVideo: () => void;
  reportNowPlaying: (value: NowPlaying | null) => void;
};

const VideoPreviewContext = createContext<VideoPreviewContextValue | undefined>(undefined);

export function VideoPreviewProvider({ children }: { children: ReactNode }) {
  const [playRequest, setPlayRequest] = useState<PlayRequest | null>(null);
  const [pinnedUserVideo, setPinnedUserVideo] = useState<{
    url: string;
    model?: ExploreModel;
    prompt?: string;
    taskId?: string;
  } | null>(null);
  const [nowPlaying, setNowPlaying] = useState<NowPlaying | null>(null);

  const requestPlay = useCallback(
    (
      url: string,
      options?: {
        model?: ExploreModel;
        source?: "user" | "explore";
        prompt?: string;
        taskId?: string;
      }
    ) => {
      setPlayRequest((prev) => ({
        id: (prev?.id ?? 0) + 1,
        url,
        model: options?.model,
        source: options?.source,
        prompt: options?.prompt,
        taskId: options?.taskId,
      }));
      if (options?.source === "user") {
        setPinnedUserVideo({
          url,
          model: options?.model,
          prompt: options?.prompt,
          taskId: options?.taskId,
        });
      }
    },
    []
  );

  const clearPinnedUserVideo = useCallback(() => setPinnedUserVideo(null), []);

  const reportNowPlaying = useCallback((value: NowPlaying | null) => {
    setNowPlaying((prev) => {
      if (!prev && !value) return prev;
      if (
        prev &&
        value &&
        prev.url === value.url &&
        prev.model === value.model &&
        prev.source === value.source
      ) {
        return prev;
      }
      return value;
    });
  }, []);

  const value = useMemo<VideoPreviewContextValue>(
    () => ({
      playRequest,
      pinnedUserVideo,
      nowPlaying,
      requestPlay,
      clearPinnedUserVideo,
      reportNowPlaying,
    }),
    [
      clearPinnedUserVideo,
      nowPlaying,
      pinnedUserVideo,
      playRequest,
      reportNowPlaying,
      requestPlay,
    ]
  );

  return <VideoPreviewContext.Provider value={value}>{children}</VideoPreviewContext.Provider>;
}

export function useVideoPreview() {
  const ctx = useContext(VideoPreviewContext);
  if (!ctx) {
    throw new Error("useVideoPreview must be used within VideoPreviewProvider");
  }
  return ctx;
}
