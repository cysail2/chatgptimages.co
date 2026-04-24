'use client';

import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { useGlobalVolume } from '@/library/providers';

export type AudioTrack = {
  id: string;
  title: string;
  artist: string;
  src: string;
  cover?: string;
  speakers?: { name: string; avatar: string }[];
};

type AudioPlayerContextValue = {
  track: AudioTrack | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  history: AudioTrack[];
  isExpanded: boolean;
  historyIndex: number;
  isLooping: boolean;
  playTrack: (track: AudioTrack) => void;
  togglePlay: () => void;
  toggleLoop: () => void;
  seek: (time: number) => void;
  setExpanded: (next: boolean) => void;
  playPrevious: () => void;
  playNext: () => void;
};

const AudioPlayerContext = createContext<AudioPlayerContextValue | undefined>(undefined);

export function AudioPlayerProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [track, setTrack] = useState<AudioTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [history, setHistory] = useState<AudioTrack[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [isLooping, setIsLooping] = useState(false);
  const { isMuted, unmuteForUserPlayback } = useGlobalVolume();

  // Load history from local storage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const savedHistory = localStorage.getItem('heartmula_player_history');
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        if (Array.isArray(parsed)) {
          setHistory(parsed);
          // Optionally set the last played track as current (paused)
          if (parsed.length > 0) {
            setTrack(parsed[0]);
            setHistoryIndex(0);
          }
        }
      } catch (e) {
        console.error('Failed to parse history from local storage', e);
      }
    }
  }, []);

  // Save history to local storage whenever it changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (history.length > 0) {
      localStorage.setItem('heartmula_player_history', JSON.stringify(history));
    }
  }, [history]);

  const playTrack = (next: AudioTrack) => {
    unmuteForUserPlayback();
    setTrack(next);
    setIsPlaying(true);
    setIsExpanded(true);
    setHistory(prev => {
      const filtered = prev.filter(item => item.src !== next.src);
      const nextHistory = [next, ...filtered].slice(0, 10);
      setHistoryIndex(0);
      return nextHistory;
    });
  };

  const togglePlay = () => {
    if (!track || !audioRef.current) return;
    setIsPlaying(prev => {
      if (!prev) {
        unmuteForUserPlayback();
      }
      return !prev;
    });
  };

  const toggleLoop = () => {
    setIsLooping(prev => !prev);
  };

  const seek = (time: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const playFromHistoryIndex = (index: number) => {
    const nextTrack = history[index];
    if (!nextTrack) return;
    unmuteForUserPlayback();
    setTrack(nextTrack);
    setIsPlaying(true);
    setHistoryIndex(index);
  };

  const playPrevious = () => {
    if (historyIndex + 1 >= history.length) return;
    playFromHistoryIndex(historyIndex + 1);
  };

  const playNext = () => {
    if (historyIndex - 1 < 0) return;
    playFromHistoryIndex(historyIndex - 1);
  };

  const value = useMemo<AudioPlayerContextValue>(
    () => ({
      track,
      isPlaying,
      currentTime,
      duration,
      history,
      isExpanded,
      historyIndex,
      isLooping,
      playTrack,
      togglePlay,
      toggleLoop,
      seek,
      setExpanded: setIsExpanded,
      playPrevious,
      playNext,
    }),
    [track, isPlaying, currentTime, duration, history, isExpanded, historyIndex]
  );

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime || 0);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
  };

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.muted = isMuted;
  }, [isMuted]);

  useEffect(() => {
    if (!audioRef.current || !track) return;

    if (audioRef.current.src !== track.src) {
      audioRef.current.src = track.src;
      audioRef.current.load();
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
    }

    if (isPlaying) {
      audioRef.current.play().catch(() => { });
    } else {
      audioRef.current.pause();
    }
  }, [track, isPlaying]);

  return (
    <AudioPlayerContext.Provider value={value}>
      {children}
      <audio
        ref={audioRef}
        preload="metadata"
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />
    </AudioPlayerContext.Provider>
  );
}

export function useAudioPlayer() {
  const context = useContext(AudioPlayerContext);
  if (!context) {
    // Return a safe fallback to prevent crashes in environments like Page Builder
    // where the provider might not be available
    console.warn('useAudioPlayer called without AudioPlayerProvider. Using mock fallback.');
    return {
      track: null,
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      history: [],
      isExpanded: false,
      historyIndex: 0,
      isLooping: false,
      playTrack: () => console.warn('playTrack called without AudioPlayerProvider'),
      togglePlay: () => console.warn('togglePlay called without AudioPlayerProvider'),
      toggleLoop: () => console.warn('toggleLoop called without AudioPlayerProvider'),
      seek: () => console.warn('seek called without AudioPlayerProvider'),
      setExpanded: () => console.warn('setExpanded called without AudioPlayerProvider'),
      playPrevious: () => console.warn('playPrevious called without AudioPlayerProvider'),
      playNext: () => console.warn('playNext called without AudioPlayerProvider'),
    };
  }
  return context;
}
