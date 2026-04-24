'use client';

import { Clock, Download, Play, Trash2 } from 'lucide-react';
import { AudioTrack, useAudioPlayer } from '@/library/media/audio-player/AudioPlayerProvider';
import { GenerationHistoryItem } from '@/library/components/profile/types';
import { formatTimestamp } from '@/library/components/profile/utils';
import { cn } from '@/library/lib/utils';

interface AudioWorkCardProps {
    item: GenerationHistoryItem;
    audioTrack: AudioTrack;
    isDeleting: boolean;
    onDownload: (event: React.MouseEvent, audioTrack: AudioTrack) => void;
    onDelete: (event: React.MouseEvent, opusId: number) => void;
    onOpenDetail: (item: GenerationHistoryItem) => void;
}

export function AudioWorkCard({
    item,
    audioTrack,
    isDeleting,
    onDownload,
    onDelete,
    onOpenDetail,
}: AudioWorkCardProps) {
    const { playTrack, track } = useAudioPlayer();

    const handleClick = () => {
        onOpenDetail(item);
    };

    const handlePlayClick = (event: React.MouseEvent) => {
        event.stopPropagation();
        playTrack(audioTrack);
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            playTrack(audioTrack);
        }
    };

    return (
        <div
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            role="button"
            tabIndex={0}
            className={cn(
                'rounded-2xl border border-border bg-card p-5 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg cursor-pointer',
                track?.id === audioTrack.id && 'ring-2 ring-primary/60'
            )}
        >
            {/* Header with speakers or Audio badge */}
            <div className="h-28 w-full rounded-xl bg-gradient-to-br from-primary/15 via-primary/5 to-transparent p-4">
                <div className="flex h-full items-end justify-between">
                    {audioTrack.speakers && audioTrack.speakers.length > 0 ? (
                        <div className="flex -space-x-2 overflow-hidden">
                            {audioTrack.speakers.slice(0, 4).map((speaker, index) => (
                                <img
                                    key={`${audioTrack.id}-${index}`}
                                    src={speaker.avatar || '/speaker/Default.jpeg'}
                                    alt={speaker.name}
                                    className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover bg-white"
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="flex items-center gap-1 rounded-full bg-background/80 px-2 py-1 text-[10px] font-semibold text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            Audio
                        </div>
                    )}
                    <div
                        className="grid h-9 w-9 place-items-center rounded-full bg-card border border-border text-foreground shadow-sm cursor-pointer hover:bg-muted"
                        onClick={handlePlayClick}
                    >
                        <Play className="h-4 w-4 fill-foreground" />
                    </div>
                </div>
            </div>

            {/* Title and artist */}
            <div className="mt-4 space-y-1">
                <p className="text-sm font-semibold text-foreground line-clamp-2">
                    {audioTrack.title}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                    {audioTrack.speakers?.map((speaker) => speaker.name).join(', ') ||
                        audioTrack.artist}
                </p>
            </div>

            {/* Timestamp */}
            <div className="mt-4 flex items-center gap-2 text-[11px] text-muted-foreground">
                <span>{formatTimestamp(item.created_at || 0)}</span>
            </div>

            {/* Actions */}
            <div className="mt-4 flex items-center justify-between">
                <div className="text-[11px] text-muted-foreground">
                    {item.task_id ? `Task ${item.task_id.slice(0, 6)}` : 'Audio'}
                </div>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={(event) => onDownload(event, audioTrack)}
                        className="grid h-8 w-8 place-items-center rounded-full border border-border bg-card text-muted-foreground transition hover:bg-muted"
                        aria-label="Download audio"
                    >
                        <Download className="h-4 w-4" />
                    </button>
                    <button
                        type="button"
                        onClick={(event) => onDelete(event, item.id)}
                        className={cn(
                            'grid h-8 w-8 place-items-center rounded-full border border-border bg-card text-muted-foreground transition hover:bg-muted',
                            isDeleting && 'cursor-wait opacity-60'
                        )}
                        aria-label="Delete audio"
                        disabled={isDeleting}
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
