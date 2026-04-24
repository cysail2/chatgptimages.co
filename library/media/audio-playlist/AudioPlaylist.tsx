"use client";

import React, { useMemo } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/library/lib/utils";
import { useAudioPlayer, type AudioTrack } from "@/library/media/audio-player/AudioPlayerProvider";
import type { AudioItem } from "@/types/audio-examples";

export type AudioPlaylistItem = AudioItem;

interface AudioPlaylistProps {
    playlist: AudioPlaylistItem[];
    title?: string;
    subtitle?: string;
    className?: string;
    maxItems?: number;
    emptyMessage?: string;
}

/**
 * AudioPlaylist - A playlist component that integrates with the global audio player
 * Clicking on an item will play it through the global AudioPlayerProvider
 */
export function AudioPlaylist({
    playlist,
    title = "Audio Examples",
    subtitle = "Explore AI-generated audio samples",
    className,
    maxItems = 10,
    emptyMessage = "No audio examples available",
}: AudioPlaylistProps) {
    const {
        track: globalTrack,
        isPlaying: globalIsPlaying,
        currentTime,
        duration,
        playTrack,
        togglePlay,
        seek,
    } = useAudioPlayer();

    // Limit displayed items
    const limitedPlaylist = useMemo(() => {
        return playlist.slice(0, maxItems);
    }, [playlist, maxItems]);

    // Convert AudioPlaylistItem to AudioTrack for the global player
    const toAudioTrack = (item: AudioPlaylistItem): AudioTrack => ({
        id: item.id,
        title: item.title,
        artist: item.tags.join(", ") || "AI Generated",
        src: item.audioUrl,
        cover: item.coverImage,
    });

    // Check if a specific item is the currently playing track
    const isItemPlaying = (item: AudioPlaylistItem) => {
        return globalTrack?.src === item.audioUrl && globalIsPlaying;
    };

    // Check if a specific item is the current (but maybe paused) track
    const isCurrentItem = (item: AudioPlaylistItem) => {
        return globalTrack?.src === item.audioUrl;
    };

    // Find current item from playlist
    const currentPlaylistItem = limitedPlaylist.find(item => globalTrack?.src === item.audioUrl);

    // Display the global playing track, or fallback to the first item in the playlist
    const activeTrack = globalTrack || (limitedPlaylist.length > 0 ? toAudioTrack(limitedPlaylist[0]) : null);

    const handleItemClick = (item: AudioPlaylistItem) => {
        if (isCurrentItem(item)) {
            // Toggle play/pause for current track
            togglePlay();
        } else {
            // Play new track through global player
            playTrack(toAudioTrack(item));
        }
    };

    const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!duration) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        seek(percent * duration);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

    // Navigate to next/prev in playlist
    const playNextInPlaylist = () => {
        if (!currentPlaylistItem) {
            if (limitedPlaylist.length > 0) {
                playTrack(toAudioTrack(limitedPlaylist[0]));
            }
            return;
        }
        const currentIndex = limitedPlaylist.findIndex(item => item.id === currentPlaylistItem.id);
        const nextIndex = (currentIndex + 1) % limitedPlaylist.length;
        playTrack(toAudioTrack(limitedPlaylist[nextIndex]));
    };

    const playPrevInPlaylist = () => {
        if (!currentPlaylistItem) {
            if (limitedPlaylist.length > 0) {
                playTrack(toAudioTrack(limitedPlaylist[limitedPlaylist.length - 1]));
            }
            return;
        }
        const currentIndex = limitedPlaylist.findIndex(item => item.id === currentPlaylistItem.id);
        const prevIndex = (currentIndex - 1 + limitedPlaylist.length) % limitedPlaylist.length;
        playTrack(toAudioTrack(limitedPlaylist[prevIndex]));
    };

    if (limitedPlaylist.length === 0) {
        return (
            <div className={cn("flex flex-col h-full", className)}>
                <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>
                </div>
                <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm">
                    {emptyMessage}
                </div>
            </div>
        );
    }

    return (
        <div className={cn("flex flex-col h-full", className)}>
            {/* Header */}
            <div className="text-center mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>
            </div>

            {/* Top Player - shows current playing or first item */}
            <div className="mb-4 p-4 rounded-xl bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 shadow-sm">
                <div className="flex gap-4">
                    {/* Cover Image - fixed aspect ratio */}
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gradient-to-br from-primary/30 to-primary/10 flex-shrink-0">
                        {activeTrack?.cover ? (
                            <img
                                src={activeTrack.cover}
                                alt={activeTrack.title}
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <span className="text-2xl">🎧</span>
                            </div>
                        )}
                    </div>

                    {/* Info & Controls */}
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                        <h4 className="font-semibold text-sm text-gray-900 dark:text-white truncate">
                            {activeTrack?.title || "Select a track"}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {activeTrack?.artist || ""}
                        </p>
                    </div>
                </div>

                {/* Progress bar */}
                <div
                    className="mt-3 h-1.5 bg-gray-200 dark:bg-zinc-700 rounded-full cursor-pointer overflow-hidden"
                    onClick={handleSeek}
                >
                    <div
                        className="h-full bg-primary rounded-full transition-all duration-100"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                {/* Time & Controls */}
                <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                        {formatTime(currentTime)}
                    </span>

                    {/* Playback controls */}
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
                            onClick={playPrevInPlaylist}
                        >
                            <SkipBack className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                        </button>

                        <button
                            type="button"
                            className="p-2 rounded-full bg-primary text-white hover:bg-primary/90 transition-colors"
                            onClick={() => {
                                if (globalTrack) {
                                    togglePlay();
                                } else if (activeTrack) {
                                    playTrack(activeTrack);
                                }
                            }}
                        >
                            {globalIsPlaying && !!globalTrack ? (
                                <Pause className="w-4 h-4 fill-current" />
                            ) : (
                                <Play className="w-4 h-4 fill-current ml-0.5" />
                            )}
                        </button>

                        <button
                            type="button"
                            className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
                            onClick={playNextInPlaylist}
                        >
                            <SkipForward className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                        </button>
                    </div>

                    <span className="text-xs text-gray-500 dark:text-gray-400">
                        {formatTime(duration)}
                    </span>
                </div>
            </div>

            {/* Playlist items */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                {limitedPlaylist.map((item) => {
                    const isCurrent = isCurrentItem(item);
                    const isPlaying = isItemPlaying(item);

                    return (
                        <div
                            key={item.id}
                            className={cn(
                                "flex gap-3 p-3 rounded-xl cursor-pointer transition-all group",
                                isCurrent
                                    ? "bg-primary/10 border border-primary/30"
                                    : "bg-white dark:bg-zinc-800/80 hover:bg-gray-50 dark:hover:bg-zinc-800 border border-gray-100 dark:border-zinc-700/50 shadow-sm"
                            )}
                            onClick={() => handleItemClick(item)}
                        >
                            {/* Thumbnail with play button - square aspect ratio */}
                            <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5 flex-shrink-0">
                                {item.coverImage ? (
                                    <img
                                        src={item.coverImage}
                                        alt={item.title}
                                        className="absolute inset-0 w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <span className="text-lg">🎧</span>
                                    </div>
                                )}

                                {/* Play/Pause overlay */}
                                <div className={cn(
                                    "absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity",
                                    "opacity-0 group-hover:opacity-100"
                                )}>
                                    {isPlaying ? (
                                        <Pause className="w-5 h-5 text-white fill-white" />
                                    ) : (
                                        <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                                    )}
                                </div>

                                {isPlaying && (
                                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5 transition-opacity group-hover:opacity-0">
                                        <div className="w-0.5 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: "0ms" }} />
                                        <div className="w-0.5 h-3 bg-white rounded-full animate-pulse" style={{ animationDelay: "150ms" }} />
                                        <div className="w-0.5 h-1.5 bg-white rounded-full animate-pulse" style={{ animationDelay: "300ms" }} />
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0 flex flex-col justify-center">
                                <div className="flex items-center gap-2">
                                    <h4 className={cn(
                                        "font-semibold text-sm truncate",
                                        isCurrent ? "text-primary" : "text-gray-900 dark:text-gray-100"
                                    )}>
                                        {item.title}
                                    </h4>
                                    <span className="text-xs text-gray-400 dark:text-gray-500 flex-shrink-0">
                                        {item.duration}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                                    {item.description}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div >
    );
}

export default AudioPlaylist;
