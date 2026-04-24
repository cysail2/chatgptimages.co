'use client';

import React, { useState, useRef, useEffect } from 'react';
import { X, Play, Pause, Scissors, RotateCcw } from 'lucide-react';
import { Button } from '@/library/ui/button';
import { trimAudioFile } from '@/library/lib/audio/audio-trim';

interface AudioTrimModalProps {
    isOpen: boolean;
    onClose: () => void;
    audioFile: File | null;
    targetDuration: number; // Target video duration in seconds
    onConfirm: (trimmedAudio: File) => void;
    onDurationChange?: (duration: number) => void;
    isWans2v?: boolean;
    durationOptions?: number[];
}

export function AudioTrimModal({ isOpen, onClose, audioFile, targetDuration, onConfirm, onDurationChange, isWans2v = false, durationOptions }: AudioTrimModalProps) {
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [audioDuration, setAudioDuration] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [startTime, setStartTime] = useState(0);
    const [endTime, setEndTime] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isDragging, setIsDragging] = useState<'start' | 'end' | 'seek' | null>(null);
    const [selectedDuration, setSelectedDuration] = useState(targetDuration);
    const audioRef = useRef<HTMLAudioElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const barsRef = useRef<number[]>([]);
    const selectionRef = useRef({ startTime: 0, endTime: 0 });

    // Initialize audio when file changes
    useEffect(() => {
        if (!audioFile || !isOpen) return;

        const url = URL.createObjectURL(audioFile);
        setAudioUrl(url);

        const audio = new Audio(url);
        audio.onloadedmetadata = () => {
            const duration = audio.duration;
            setAudioDuration(duration);
            setStartTime(0);
            // For wans2v, use full audio duration; for wan2.5, use selectedDuration
            if (isWans2v) {
                const end = duration;
                setEndTime(end);
                setSelectedDuration(duration);
                selectionRef.current = { startTime: 0, endTime: end };
            } else {
                const end = Math.min(duration, selectedDuration);
                setEndTime(end);
                selectionRef.current = { startTime: 0, endTime: end };
            }
            // Generate a stable set of bars for this audio load
            const barCount = 120;
            barsRef.current = Array.from({ length: barCount }, () => Math.random());
        };

        audioRef.current = audio;

        return () => {
            URL.revokeObjectURL(url);
        };
    }, [audioFile, isOpen, selectedDuration, isWans2v]);

    // Sync external duration changes
    useEffect(() => {
        if (isWans2v) {
            // For wans2v, use audio duration
            if (audioDuration > 0) {
                setSelectedDuration(audioDuration);
                setStartTime(0);
                setEndTime(audioDuration);
                selectionRef.current = { startTime: 0, endTime: audioDuration };
            }
        } else {
            // For wan2.5, use targetDuration (5 or 10 seconds)
            setSelectedDuration(targetDuration);
            setStartTime(0);
            setEndTime((prevEnd) => {
                const nextEnd = Math.min(audioDuration || targetDuration, targetDuration);
                selectionRef.current = { startTime: 0, endTime: nextEnd === 0 ? prevEnd : nextEnd };
                return nextEnd === 0 ? prevEnd : nextEnd;
            });
        }
    }, [targetDuration, audioDuration, isWans2v]);

    // Update current time while playing
    useEffect(() => {
        if (!audioRef.current || !isPlaying) return;

        const interval = setInterval(() => {
            if (audioRef.current) {
                const time = audioRef.current.currentTime;
                setCurrentTime(time);
                if (time >= endTime) {
                    audioRef.current.pause();
                    audioRef.current.currentTime = startTime;
                    setIsPlaying(false);
                }
            }
        }, 100);

        return () => clearInterval(interval);
    }, [isPlaying, startTime, endTime]);

    // Draw waveform and selection
    useEffect(() => {
        if (!canvasRef.current || !audioUrl || audioDuration === 0) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const draw = () => {
            // Clear canvas
            ctx.fillStyle = 'rgb(17, 24, 39)'; // gray-900
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw simple waveform placeholder (bars)
            const barCount = barsRef.current.length || 120;
            const barWidth = canvas.width / barCount;
            for (let i = 0; i < barCount; i++) {
                const intensity = barsRef.current[i] ?? 0.5;
                const barHeight = intensity * canvas.height * 0.6 + canvas.height * 0.2;
                const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
                gradient.addColorStop(0, '#f59e0b'); // amber-500
                gradient.addColorStop(1, '#dc2626'); // red-600
                ctx.fillStyle = gradient;
                ctx.fillRect(i * barWidth, canvas.height - barHeight, barWidth - 1, barHeight);
            }

            // Draw selection area
            const startX = (startTime / audioDuration) * canvas.width;
            const endX = (endTime / audioDuration) * canvas.width;
            ctx.fillStyle = 'rgba(245, 158, 11, 0.25)'; // slightly lighter overlay
            ctx.fillRect(startX, 0, endX - startX, canvas.height);

            // Draw selection borders
            ctx.strokeStyle = '#fbbf24'; // amber-400
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(startX, 0);
            ctx.lineTo(startX, canvas.height);
            ctx.moveTo(endX, 0);
            ctx.lineTo(endX, canvas.height);
            ctx.stroke();

            // Draw current time indicator
            if (isPlaying || currentTime > 0) {
                const currentX = (currentTime / audioDuration) * canvas.width;
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(currentX, 0);
                ctx.lineTo(currentX, canvas.height);
                ctx.stroke();
            }

            // Draw draggable handles
            const handleWidth = 10;
            const handleRadius = 6;
            ctx.fillStyle = '#111827';
            ctx.strokeStyle = '#fbbf24';
            ctx.lineWidth = 2;

            // Start handle
            ctx.beginPath();
            ctx.roundRect(startX - handleWidth / 2, 8, handleWidth, canvas.height - 16, handleRadius);
            ctx.fill();
            ctx.stroke();

            // End handle
            ctx.beginPath();
            ctx.roundRect(endX - handleWidth / 2, 8, handleWidth, canvas.height - 16, handleRadius);
            ctx.fill();
            ctx.stroke();
        };

        draw();
    }, [audioUrl, isPlaying, currentTime, startTime, endTime, audioDuration]);

    const handlePlayPause = () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            audioRef.current.currentTime = startTime;
            audioRef.current.play();
            setIsPlaying(true);
        }
    };


    const repositionSelection = (centerTime: number) => {
        if (isWans2v) {
            // For wans2v, allow free selection - keep current selection width, just reposition it
            const currentDuration = selectionRef.current.endTime - selectionRef.current.startTime;
            const half = currentDuration / 2;
            const newStart = Math.max(0, Math.min(audioDuration - currentDuration, centerTime - half));
            const newEnd = Math.min(audioDuration, newStart + currentDuration);
            setStartTime(newStart);
            setEndTime(newEnd);
            selectionRef.current = { startTime: newStart, endTime: newEnd };
            if (audioRef.current) {
                audioRef.current.currentTime = newStart;
                setCurrentTime(newStart);
            }
        } else {
            // For wan2.5, maintain fixed duration
            const half = selectedDuration / 2;
            const start = Math.max(0, Math.min(audioDuration - selectedDuration, centerTime - half));
            const end = Math.min(audioDuration, start + selectedDuration);
            setStartTime(start);
            setEndTime(end);
            selectionRef.current = { startTime: start, endTime: end };
            if (audioRef.current) {
                audioRef.current.currentTime = start;
                setCurrentTime(start);
            }
        }
    };

    const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!canvasRef.current || audioDuration === 0) return;
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const scale = canvas.width / rect.width;
        const x = (e.clientX - rect.left) * scale;
        const clickTime = (x / canvas.width) * audioDuration;
        const startX = (startTime / audioDuration) * canvas.width;
        const endX = (endTime / audioDuration) * canvas.width;
        const threshold = 14; // pixels

        if (Math.abs(x - startX) < threshold) {
            setIsDragging('start');
        } else if (Math.abs(x - endX) < threshold) {
            setIsDragging('end');
        } else {
            // Reposition selection keeping duration constant, centered around click
            repositionSelection(clickTime);
            setIsDragging('seek');
        }
    };

    const updateDragPosition = (clientX: number) => {
        if (!canvasRef.current || !isDragging || audioDuration === 0) return;
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const scale = canvas.width / rect.width;
        const x = (clientX - rect.left) * scale;
        const newTime = Math.max(0, Math.min(audioDuration, (x / canvas.width) * audioDuration));

        if (isDragging === 'start') {
            if (newTime < endTime) {
                setStartTime(newTime);
                selectionRef.current.startTime = newTime;
            }
        } else if (isDragging === 'end') {
            if (newTime > startTime) {
                setEndTime(newTime);
                selectionRef.current.endTime = newTime;
            }
        } else if (isDragging === 'seek') {
            repositionSelection(newTime);
        }
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        updateDragPosition(e.clientX);
    };

    const handleMouseUp = () => {
        setIsDragging(null);
    };

    useEffect(() => {
        if (!isDragging) return;
        const handleGlobalMouseMove = (event: MouseEvent) => {
            event.preventDefault();
            updateDragPosition(event.clientX);
        };
        const handleGlobalMouseUp = () => setIsDragging(null);
        window.addEventListener('mousemove', handleGlobalMouseMove);
        window.addEventListener('mouseup', handleGlobalMouseUp);
        return () => {
            window.removeEventListener('mousemove', handleGlobalMouseMove);
            window.removeEventListener('mouseup', handleGlobalMouseUp);
        };
    }, [isDragging, audioDuration, startTime, endTime]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleConfirm = async () => {
        if (!audioFile || !audioRef.current) return;

        setIsProcessing(true);
        try {
            const trimmedFile = await trimAudioFile({
                audioFile,
                startTime,
                endTime,
            });
            onConfirm(trimmedFile);
            onClose();
        } catch (error) {
            console.error('Error trimming audio:', error);
            alert('Failed to trim audio. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleReset = () => {
        setStartTime(0);
        if (isWans2v) {
            setEndTime(audioDuration);
            selectionRef.current = { startTime: 0, endTime: audioDuration };
        } else {
            const end = Math.min(audioDuration, selectedDuration);
            setEndTime(end);
            selectionRef.current = { startTime: 0, endTime: end };
        }
        if (audioRef.current) {
            audioRef.current.currentTime = 0;
            setCurrentTime(0);
        }
    };

    if (!isOpen || !audioFile) return null;

    const trimmedDuration = endTime - startTime;
    const handleDurationSelect = (duration: number) => {
        setSelectedDuration(duration);
        setStartTime(0);
        const end = Math.min(audioDuration, duration);
        setEndTime(end);
        selectionRef.current = { startTime: 0, endTime: end };
        onDurationChange?.(duration);
    };
    const durationOptionsToRender =
        durationOptions && durationOptions.length > 0 ? durationOptions : [5, 10];

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-2xl shadow-2xl max-w-2xl w-full border border-gray-700">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-700">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Scissors className="w-5 h-5" />
                        {isWans2v ? 'Trim Audio' : `Trim Audio to ${selectedDuration}s`}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors p-1"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Duration selection */}
                    {!isWans2v && (
                        <div className="flex flex-wrap items-center gap-3 mb-4">
                            <span className="text-sm text-gray-300">Video length:</span>
                            {durationOptionsToRender.length > 1 ? (
                                durationOptionsToRender.map((option) => (
                                    <button
                                        key={option}
                                        onClick={() => handleDurationSelect(option)}
                                        className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-all ${
                                            selectedDuration === option
                                                ? 'bg-amber-500 text-gray-900 shadow-lg shadow-amber-500/30'
                                                : 'bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-750'
                                        }`}
                                    >
                                        {option}s
                                    </button>
                                ))
                            ) : (
                                <span className="text-sm text-gray-200 font-semibold">
                                    {selectedDuration}s
                                </span>
                            )}
                        </div>
                    )}
                    {isWans2v && (
                        <div className="mb-4 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                            <p className="text-sm text-gray-300">
                                Audio length: {formatTime(audioDuration)} ({audioDuration.toFixed(1)}s)
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                                💡 For wans2v model, video duration will match audio length (max 600s)
                            </p>
                        </div>
                    )}

                    {/* Waveform */}
                    <div className="mb-4">
                        <canvas
                            ref={canvasRef}
                            width={800}
                            height={120}
                            className="w-full h-30 bg-gray-800 rounded-lg cursor-pointer border border-gray-700"
                            onMouseDown={handleMouseDown}
                            onMouseMove={handleMouseMove}
                            onMouseUp={handleMouseUp}
                        />
                    </div>

                    {/* Time indicators */}
                    <div className="flex justify-between items-center mb-4 text-sm text-gray-400">
                        <div className="flex items-center gap-4">
                            <span>Start: {formatTime(startTime)}</span>
                            <span>End: {formatTime(endTime)}</span>
                        </div>
                        <div className="text-gray-500">
                            Total: {formatTime(audioDuration)}
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center justify-center gap-4 mb-6">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handlePlayPause}
                            className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
                        >
                            {isPlaying ? (
                                <>
                                    <Pause className="w-4 h-4 mr-2" />
                                    Pause
                                </>
                            ) : (
                                <>
                                    <Play className="w-4 h-4 mr-2" />
                                    Play
                                </>
                            )}
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleReset}
                            className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
                        >
                            <RotateCcw className="w-4 h-4 mr-2" />
                            Reset
                        </Button>
                    </div>

                    {/* Warning if duration doesn't match - only for wan2.5 */}
                    {!isWans2v && Math.abs(trimmedDuration - selectedDuration) > 0.1 && (
                        <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                            <p className="text-amber-400 text-sm">
                                ⚠️ The trimmed duration ({formatTime(trimmedDuration)}) doesn't match the target ({selectedDuration}s).
                                Please adjust the selection.
                            </p>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            className="flex-1"
                            onClick={onClose}
                            disabled={isProcessing}
                        >
                            Cancel
                        </Button>
                        <Button
                            className="flex-1 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white"
                            onClick={handleConfirm}
                            disabled={isProcessing || (!isWans2v && Math.abs(trimmedDuration - selectedDuration) > 0.1)}
                        >
                            {isProcessing ? 'Processing...' : 'Confirm Trim'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
