'use client';

import { useState, useMemo } from 'react';
import { ImagePreview } from '@/library/media/image-preview/ImagePreview';
import { VideoPreview } from '@/library/media/video-preview/VideoPreview';
import { WorkActionsToolbar } from './WorkActionsToolbar';
import { AudioPlayerDropdown } from '@/library/media/audio-player/AudioPlayerDropdown';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/library/ui/dialog";
import Image from 'next/image';
import { GenerationHistoryItem } from './types';
import { formatTimestamp } from './utils';
import { DeleteConfirmDialog } from './DeleteConfirmDialog';
import { getModelLabel, stripModelVersion } from '@/library/lib/aimodel/utils';
import { normalizeWorkItem } from './normalization';


interface WorkDetailDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    item: GenerationHistoryItem | null;
    onDeleteSuccess?: () => void;
    showDelete?: boolean;
}

export function WorkDetailDialog({
    open,
    onOpenChange,
    item,
    onDeleteSuccess,
    showDelete = true,
}: WorkDetailDialogProps) {
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

    const unifiedItem = useMemo(() => normalizeWorkItem(item), [item]);

    // Safe derived values from unified item
    const mediaUrl = unifiedItem?.mediaUrl || "";
    const isImage = unifiedItem?.workType === 'image';
    const isAudio = unifiedItem?.workType === 'audio';

    const rawModelLabel = getModelLabel(unifiedItem?.model || "") || unifiedItem?.model || "";
    const modelLabel = stripModelVersion(rawModelLabel || undefined);

    const imagePlaylist = useMemo(() => {
        if (!unifiedItem || !isImage) return [];
        return unifiedItem.playlist.map(url => ({
            url,
            source: 'user' as const,
            model: modelLabel,
            prompt: unifiedItem.prompt,
            taskId: unifiedItem.taskId
        }));
    }, [unifiedItem, isImage, modelLabel]);

    const videoPlaylist = useMemo(() => {
        if (!unifiedItem || isImage || isAudio) return [];

        // Ensure playlist has at least one item (mainUrl) if empty, 
        // though normalization handles this usually.
        const list = unifiedItem.playlist.length > 0 ? unifiedItem.playlist : [mediaUrl].filter(Boolean);

        return list.map(url => ({
            url,
            source: 'user' as const,
            model: unifiedItem.model as any,
            prompt: unifiedItem.prompt,
            taskId: unifiedItem.taskId
        }));
    }, [unifiedItem, isImage, isAudio, mediaUrl]);

    if (!item) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className="max-w-[95vw] w-[95vw] lg:max-w-7xl h-fit lg:h-[85vh] max-h-[95vh] overflow-y-auto lg:overflow-hidden rounded-2xl border border-border shadow-2xl bg-card/95 backdrop-blur-xl lg:flex lg:flex-col lg:min-h-0 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-muted/50 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:bg-muted"
            >
                <DialogHeader className="pb-4 border-b border-border">
                    <DialogTitle className="text-2xl font-semibold text-card-foreground">
                        {isAudio ? 'Audio Details' : isImage ? 'Image Details' : 'Video Details'}
                    </DialogTitle>
                </DialogHeader>

                <div className="pt-3 lg:pt-2 lg:flex-1 lg:overflow-hidden min-h-0">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:h-full min-h-0">
                        {/* Left: Player */}
                        <div className="flex flex-col justify-between lg:col-span-7 xl:col-span-8 lg:h-full min-h-0">
                            <div className="flex-1 min-h-0 flex flex-col justify-center overflow-hidden">
                                {isAudio ? (
                                    <div className="flex-1 min-h-0 bg-muted/30 rounded-lg overflow-hidden flex items-center justify-center border border-border relative px-4 py-6">
                                        <div className="bg-card/80 backdrop-blur-sm border border-border rounded-xl shadow-sm p-1">
                                            <AudioPlayerDropdown />
                                        </div>
                                    </div>
                                ) : isImage ? (
                                    <ImagePreview playlist={imagePlaylist} className="h-full" hidePrompt={true} hideToolbar={true} fitContainer={true} hideUserIndicator={true} />
                                ) : (
                                    <VideoPreview playlist={videoPlaylist} className="h-full" hidePrompt={true} hideToolbar={true} fitContainer={true} />
                                )}
                            </div>

                            {/* Actions Toolbar */}
                            {unifiedItem && (
                                <div className="shrink-0 pt-4">
                                    <WorkActionsToolbar
                                        item={unifiedItem}
                                        onDeleteClick={() => setIsDeleteConfirmOpen(true)}
                                        showDelete={showDelete}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Right: Info */}
                        <div className="lg:col-span-5 xl:col-span-4 lg:h-full min-h-0 flex flex-col">
                            <div className="space-y-3 lg:space-y-2 max-h-full overflow-y-auto pr-1 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-muted/50 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:bg-muted">
                                {/* Created At */}
                                <div className="bg-muted/50 rounded-lg p-3 lg:p-2.5">
                                    <h3 className="text-xs font-semibold text-muted-foreground mb-1.5 lg:mb-1">Created At</h3>
                                    <p className="text-card-foreground text-sm">{formatTimestamp(item.created_at)}</p>
                                </div>

                                {/* Generation Time */}
                                {item.generation_time !== undefined && (
                                    <div className="bg-muted/50 rounded-lg p-3 lg:p-2.5">
                                        <h3 className="text-xs font-semibold text-muted-foreground mb-1.5 lg:mb-1">Generation Time</h3>
                                        <p className="text-card-foreground text-sm">{item.generation_time || 0} seconds</p>
                                    </div>
                                )}

                                {/* Model */}
                                {modelLabel && (
                                    <div className="bg-muted/50 rounded-lg p-3 lg:p-2.5">
                                        <h3 className="text-xs font-semibold text-muted-foreground mb-1.5 lg:mb-1">Model</h3>
                                        <p className="text-card-foreground text-sm">{modelLabel}</p>
                                    </div>
                                )}

                                {/* Prompt */}
                                {item.prompt && (
                                    <div className="bg-muted/50 rounded-lg p-3 lg:p-2.5">
                                        <h3 className="text-xs font-semibold text-muted-foreground mb-1.5 lg:mb-1">Prompt</h3>
                                        <p className="text-card-foreground text-sm whitespace-pre-wrap break-words">
                                            {item.prompt}
                                        </p>
                                    </div>
                                )}

                                {/* Original Media */}
                                {unifiedItem?.originUrls && unifiedItem.originUrls.length > 0 && (
                                    <div className="bg-muted/50 rounded-lg p-3 lg:p-2.5">
                                        <h3 className="text-xs font-semibold text-muted-foreground mb-1.5 lg:mb-1">Original Media</h3>
                                        <div className="space-y-2 mt-2 lg:mt-1.5">
                                            {unifiedItem.originUrls.map((url, index) => (
                                                <div key={index} className="rounded-lg overflow-hidden bg-card border border-border flex items-center justify-center">
                                                    {url.match(/\.(mp4|webm|mov)$/i) ? (
                                                        <video
                                                            src={url}
                                                            controls
                                                            className="w-full max-h-40 lg:max-h-36 object-contain"
                                                            playsInline
                                                            controlsList="nodownload"
                                                            onContextMenu={(e) => e.preventDefault()}
                                                        >
                                                            Your browser does not support the video tag.
                                                        </video>
                                                    ) : url.match(/\.(mp3|wav|ogg|aac|m4a|flac)$/i) ? (
                                                        <div className="p-2 w-full flex items-center justify-center">
                                                            <audio
                                                                src={url}
                                                                controls
                                                                className="w-full"
                                                                controlsList="nodownload"
                                                            >
                                                                Your browser does not support the audio tag.
                                                            </audio>
                                                        </div>
                                                    ) : (
                                                        <Image
                                                            src={url}
                                                            alt={`Original media ${index + 1}`}
                                                            width={400}
                                                            height={300}
                                                            className="w-full max-h-40 lg:max-h-36 object-contain"
                                                            unoptimized
                                                        />
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Other Audio / Variations */}
                                {(() => {
                                    const variations =
                                        unifiedItem?.variantItems.filter(
                                            (variant) => variant.url !== mediaUrl
                                        ) || [];

                                    return variations.length > 0 && isAudio ? (
                                        <div className="bg-muted/50 rounded-lg p-3 lg:p-2.5">
                                            <h3 className="text-xs font-semibold text-muted-foreground mb-1.5 lg:mb-1">Variations / Other Audio</h3>
                                            <div className="space-y-2 mt-2 lg:mt-1.5">
                                                {variations.map((variant, index) => (
                                                    <div key={index} className="bg-card rounded-lg p-2.5 lg:p-2 border border-border">
                                                        <p className="text-xs text-muted-foreground mb-1.5 lg:mb-1">
                                                            {variant.title || `Variation ${index + 1}`}
                                                        </p>
                                                        <audio
                                                            src={variant.url}
                                                            controls
                                                            className="w-full rounded"
                                                            preload="metadata"
                                                        >
                                                            Your browser does not support the audio tag.
                                                        </audio>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ) : null;
                                })()}
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>

            {showDelete && (
                <DeleteConfirmDialog
                    open={isDeleteConfirmOpen}
                    onOpenChange={setIsDeleteConfirmOpen}
                    item={item}
                    onDeleteSuccess={() => {
                        setIsDeleteConfirmOpen(false);
                        onOpenChange(false);
                        if (onDeleteSuccess) {
                            onDeleteSuccess();
                        }
                    }}
                />
            )}
        </Dialog>
    );
}
