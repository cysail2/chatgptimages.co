'use client';

import {
  ListMusic,
  Pause,
  Play,
  Repeat,
  SkipBack,
  SkipForward,
  X,
} from 'lucide-react';
import { useAudioPlayer } from './AudioPlayerProvider';
import { useEffect, useState } from 'react';
import { cn } from '@/library/lib/utils';

const formatTime = (seconds: number) => {
  if (!Number.isFinite(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export default function GlobalAudioPlayer() {
  return null;
}
