"use client";

import {
  ListMusic,
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Repeat,
} from "lucide-react";
import { useAudioPlayer } from "./AudioPlayerProvider";
import { cn } from "@/library/lib/utils";

export function AudioPlayerDropdown() {
  const {
    track,
    isPlaying,
    currentTime,
    duration,
    togglePlay,
    seek,
    playPrevious,
    playNext,
    historyIndex,
    history,
  } = useAudioPlayer();

  if (!track) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
        <p className="text-sm">No track playing</p>
      </div>
    );
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const formatTime = (seconds: number) => {
    if (!Number.isFinite(seconds)) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="w-[320px] p-4 flex flex-col gap-4">
      {/* Header Info */}
      <div className="flex items-start gap-3">
        <div className="relative h-12 w-12 shrink-0 rounded-md overflow-hidden bg-neutral-800 shadow-md">
          {track.speakers && track.speakers.length > 0 ? (
            <img
              src={track.speakers[0].avatar || "/speaker/Default.jpeg"}
              alt={track.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-neutral-700 text-white/20">
              <span className="text-xs">♪</span>
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0 pt-0.5">
          <h4 className="font-semibold text-sm truncate text-foreground">
            {track.title}
          </h4>
          <p className="text-xs text-muted-foreground truncate">
            {track.speakers?.map((s) => s.name).join(", ") || track.artist}
          </p>
        </div>
        {/* Animated Visualizer Icon */}
        {isPlaying && (
          <div className="flex gap-0.5 items-end h-4 pb-1">
             <div className="w-0.5 bg-primary animate-[music-bar_0.5s_ease-in-out_infinite] h-full" />
             <div className="w-0.5 bg-primary animate-[music-bar_0.7s_ease-in-out_infinite] h-2/3" />
             <div className="w-0.5 bg-primary animate-[music-bar_0.4s_ease-in-out_infinite] h-full" />
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-6">
        <button
          onClick={playPrevious}
          disabled={historyIndex >= history.length - 1}
          className="text-foreground/70 hover:text-foreground disabled:opacity-30 transition-colors"
        >
          <SkipBack className="h-5 w-5 fill-current" />
        </button>

        <button
          onClick={togglePlay}
          className="text-foreground hover:scale-105 transition-transform"
        >
          {isPlaying ? (
            <Pause className="h-8 w-8 fill-current" />
          ) : (
            <Play className="h-8 w-8 fill-current" />
          )}
        </button>

        <button
          onClick={playNext}
          disabled={historyIndex <= 0}
          className="text-foreground/70 hover:text-foreground disabled:opacity-30 transition-colors"
        >
          <SkipForward className="h-5 w-5 fill-current" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5">
        <div
          className="h-1 bg-muted rounded-full w-full cursor-pointer relative group"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const percentage = x / rect.width;
            seek(percentage * duration);
          }}
        >
          <div
            className="absolute top-0 left-0 h-full bg-primary rounded-full transition-all group-hover:bg-primary/80"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-[10px] text-muted-foreground font-mono">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
}
