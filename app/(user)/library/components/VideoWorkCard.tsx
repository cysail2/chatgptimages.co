'use client';

import { ReloadIcon, EyeOpenIcon } from '@radix-ui/react-icons';
import { GenerationHistoryItem } from '@/library/components/profile/types';
import { formatTimestamp } from '@/library/components/profile/utils';
import { stripModelVersion } from '@/library/lib/aimodel/utils';
import { isVideoUrl, getModelLabel } from './utils';


import { normalizeWorkItem } from '@/library/components/profile/normalization';

interface VideoWorkCardProps {
    item: GenerationHistoryItem;
    onOpenDetail: (item: GenerationHistoryItem) => void;
    showModelLabel: boolean;
}

export function VideoWorkCard({
    item,
    onOpenDetail,
    showModelLabel,
}: VideoWorkCardProps) {
    const unifiedItem = normalizeWorkItem(item);

    const handleClick = () => {
        onOpenDetail(item);
    };

    const handleButtonClick = (event: React.MouseEvent) => {
        event.stopPropagation();
        onOpenDetail(item);
    };

    if (!unifiedItem) return null;

    const { workType, mediaUrl, originUrls, status } = unifiedItem;
    const isImage = workType === 'image';

    return (
        <div
            className="bg-card rounded-xl overflow-hidden relative flex flex-col shadow-lg border border-border cursor-pointer hover:shadow-xl hover:border-primary/50 transition-all"
            style={{
                contentVisibility: 'auto',
                containIntrinsicSize: '320px 260px',
            }}
            onClick={handleClick}
        >
            {/* Status badges */}
            <div className="absolute top-2 left-2 z-10 flex items-center gap-2">
                {status === 0 && (
                    <span className="px-2 py-1 text-[11px] font-semibold rounded-full bg-amber-100 text-amber-700 border border-amber-200">
                        Generating
                    </span>
                )}
                {status === -1 && (
                    <span className="px-2 py-1 text-[11px] font-semibold rounded-full bg-red-100 text-red-700 border border-red-200">
                        Failed
                    </span>
                )}
                {showModelLabel && getModelLabel(item.model) && (
                    <span className="px-2 py-1 text-[11px] font-semibold rounded-full bg-muted text-muted-foreground border border-border">
                        {stripModelVersion(getModelLabel(item.model) || undefined)}
                    </span>
                )}
            </div>

            {/* View details button */}
            {status !== 0 && (
                <button
                    className="absolute top-2 right-2 z-10 bg-background/50 hover:bg-primary p-2 rounded-full text-foreground hover:text-primary-foreground transition-colors backdrop-blur-sm border border-border/50"
                    onClick={handleButtonClick}
                    title="View Details"
                >
                    <EyeOpenIcon className="h-4 w-4" />
                </button>
            )}

            {/* Media preview */}
            <div className="relative w-full aspect-video overflow-hidden bg-muted">
                {status === 0 ? (
                    originUrls.length > 0 ? (
                        <div className="w-full h-full relative">
                            {/* Check likely type of origin url or just use image as safe default? 
                                originUrls might be video too. */}
                            {/\.(mp4|webm|mov)$/i.test(originUrls[0]) ? (
                                <video
                                    src={originUrls[0]}
                                    muted
                                    loop
                                    preload="metadata"
                                    className="w-full h-full object-contain"
                                    playsInline
                                    disablePictureInPicture
                                >
                                    Your browser does not support the video tag.
                                </video>
                            ) : (
                                <img
                                    src={originUrls[0]}
                                    alt="Generating preview"
                                    className="w-full h-full object-contain bg-black/20"
                                />
                            )}
                            <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-2 text-white">
                                <ReloadIcon className="h-5 w-5 animate-spin" />
                                <span className="text-sm">Generating...</span>
                            </div>
                        </div>
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-muted text-muted-foreground">
                            <ReloadIcon className="h-5 w-5 animate-spin" />
                            <span className="text-sm">Generating...</span>
                        </div>
                    )
                ) : status === -1 || !mediaUrl ? (
                    <div className="w-full h-full flex items-center justify-center bg-muted text-red-500/80">
                        <span className="text-sm font-semibold">Generation failed</span>
                    </div>
                ) : item.deleted_at !== 0 ? (
                    <div className="w-full h-full flex justify-center items-center text-lg text-red-500 flex-col gap-1 pr-5 pl-5 box-border bg-black">
                        This content has been filtered.
                    </div>
                ) : isImage ? (
                    <img
                        src={mediaUrl}
                        alt="Generated content"
                        className="w-full h-full object-cover"
                        loading="lazy"
                    />
                ) : (
                    <video
                        src={mediaUrl}
                        muted
                        preload="metadata"
                        className="w-full h-full object-contain pointer-events-none"
                        playsInline
                        disablePictureInPicture
                    >
                        Your browser does not support the video tag.
                    </video>
                )}
            </div>

            {/* Timestamp footer */}
            <div className="px-3 py-1.5 text-xs text-muted-foreground bg-muted border-t border-border">
                {formatTimestamp(item.created_at)}
            </div>
        </div>
    );
}
