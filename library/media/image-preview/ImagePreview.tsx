"use client";

import React, {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";
import { Button } from "@/library/ui/button";
import { useToast } from "@/library/ui/toast-provider";
import {
    ChevronLeft,
    ChevronRight,
    Download,
    Loader2,
    User,
} from "lucide-react";
import { shareToSocial } from "@/library/lib/share/share-utils";

export type ImagePreviewSource = {
    url: string;
    source: "user" | "explore" | "demo";
    model?: string;
    prompt?: string;
    taskId?: string;
    pending?: boolean;
    statusMsg?: string;
};

export function ImagePreview({
    playlist,
    className,
    maxImages = 10,
    hidePrompt = false,
    hideToolbar = false,
    fitContainer = false,
    hideUserIndicator = false,
    showModelLabel = false,
}: {
    playlist: ImagePreviewSource[];
    className?: string;
    maxImages?: number;
    hidePrompt?: boolean;
    hideToolbar?: boolean;
    fitContainer?: boolean;
    hideUserIndicator?: boolean;
    showModelLabel?: boolean;
}) {
    const { success, error } = useToast();

    const limitedPlaylist = useMemo(() => {
        return playlist.slice(0, maxImages);
    }, [playlist, maxImages]);

    const [activeIndex, setActiveIndex] = useState(0);
    const [isDownloading, setIsDownloading] = useState(false);

    // Reset index when playlist changes significantly (e.g. cleared)
    useEffect(() => {
        if (activeIndex >= limitedPlaylist.length && limitedPlaylist.length > 0) {
            setActiveIndex(0);
        }
    }, [limitedPlaylist.length, activeIndex]);

    const activeItem = limitedPlaylist[activeIndex];
    const activeUrl = activeItem?.url;
    const isUserImage = activeItem?.source === "user";
    const isPending = !!activeItem?.pending;
    const activePrompt = activeItem?.prompt;
    const activeTaskId = activeItem?.taskId;

    const handleDownload = async () => {
        if (!activeUrl) return;
        setIsDownloading(true);
        try {
            const resp = await fetch(activeUrl);
            const blob = await resp.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `generated_image_${Date.now()}.png`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
            success("Image downloaded successfully!");
        } catch {
            error("Download failed. Please try again.");
        } finally {
            setIsDownloading(false);
        }
    };

    if (!activeItem && limitedPlaylist.length === 0) {
        return (
            <div className={`w-full ${className || ""} bg-card rounded-xl aspect-[4/3] flex items-center justify-center text-muted-foreground`}>
                No images to display
            </div>
        );
    }

    const PendingPlaceholder = ({ msg, prompt }: { msg?: string; prompt?: string }) => (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-card/90 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-3 px-6 text-center">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                <span className="text-sm font-medium text-foreground">{msg || "Generating..."}</span>
                {prompt && (
                    <span className="text-xs text-muted-foreground line-clamp-2 max-w-xs">{prompt}</span>
                )}
            </div>
        </div>
    );

    return (
        <div className={`w-full flex flex-col gap-4 ${fitContainer ? "flex-1 min-h-0" : ""} ${className || ""}`}>
            {/* Main Image Display */}
            <div className={`relative w-full bg-card ${fitContainer ? "flex-1 min-h-0" : "aspect-[4/3]"} rounded-xl overflow-hidden group`}>
                {showModelLabel && (
                    <div className="absolute top-3 left-3 z-20 text-white text-xs font-semibold tracking-wide bg-black/40 px-3 py-2 rounded-full backdrop-blur-sm uppercase">
                        {activeItem?.model || "Seedream"}
                    </div>
                )}

                {activeUrl && !isPending && (
                    <img
                        src={activeUrl}
                        alt={activePrompt || "Generated Image"}
                        className="absolute inset-0 w-full h-full object-contain"
                    />
                )}

                {isPending && (
                    <PendingPlaceholder msg={activeItem?.statusMsg} prompt={activePrompt} />
                )}

                {/* Navigation Overlays */}
                {limitedPlaylist.length > 1 && (
                    <>
                        <button
                            onClick={() => setActiveIndex(prev => (prev - 1 + limitedPlaylist.length) % limitedPlaylist.length)}
                            className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setActiveIndex(prev => (prev + 1) % limitedPlaylist.length)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </>
                )}
            </div>

            {/* Thumbnails / Indicators */}
            {limitedPlaylist.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2 px-1 snap-x scrollbar-hide max-w-full">
                    {limitedPlaylist.map((item, idx) => (
                        <button
                            key={item.pending ? `pending-${item.taskId}-${idx}` : idx}
                            onClick={() => setActiveIndex(idx)}
                            className={`relative w-16 h-12 flex-shrink-0 rounded-md overflow-hidden border-2 transition-all snap-start ${idx === activeIndex ? "border-primary ring-2 ring-primary/30" : "border-transparent opacity-70 hover:opacity-100"
                                }`}
                        >
                            {item.pending ? (
                                <div className="w-full h-full bg-card flex items-center justify-center">
                                    <Loader2 className="w-4 h-4 text-primary animate-spin" />
                                </div>
                            ) : (
                                <img
                                    src={item.url}
                                    className="w-full h-full object-cover"
                                    alt={item.prompt || `${item.model || "AI"} preview image ${idx + 1}`}
                                />
                            )}
                            {item.source === "user" && !item.pending && !hideUserIndicator && (
                                <div className="absolute top-0.5 right-0.5 bg-black/50 rounded-full p-0.5">
                                    <User className="w-2 h-2 text-white" />
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            )}

            {/* Actions & Prompt */}
            <div className="space-y-3">
                {activePrompt && !hidePrompt && (
                    <div className="bg-muted/50 p-3 rounded-xl border border-border">
                        <div className="text-xs text-muted-foreground mb-1">Prompt</div>
                        <div className="text-sm text-foreground leading-relaxed line-clamp-3">
                            {activePrompt}
                        </div>
                    </div>
                )}

                {isUserImage && activeUrl && !isPending && !hideToolbar && (
                    <div className="flex gap-2 justify-center items-center">
                        <Button
                            onClick={handleDownload}
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
                                {/* Share buttons similar to VideoPreview */}
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => shareToSocial("twitter", { taskId: activeTaskId, videoUrl: activeUrl })} // shareToSocial might expect videoUrl but we pass imageUrl
                                    title="Share to Twitter"
                                    className="hover:bg-[#1DA1F2] hover:text-white hover:border-[#1DA1F2]"
                                >
                                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                    </svg>
                                </Button>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => shareToSocial("facebook", { taskId: activeTaskId, videoUrl: activeUrl })}
                                    title="Share to Facebook"
                                    className="hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2]"
                                >
                                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                    </svg>
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
