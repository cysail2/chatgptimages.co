"use client";

import React from "react";
import { Music, Pause, Play, Scissors, X } from "lucide-react";
import { cn } from "@/library/lib/utils";

type AudioUploadTheme = "light" | "dark";

export type AudioUploadProps = {
  audioPreviewUrl: string | null;
  audioFile: File | null;
  audioDuration?: number | null;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onUploadClick: () => void;
  onSelectAudio: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveAudio?: () => void;
  onTrimAudio?: () => void;
  isTemplateAudio?: boolean;
  showTrimButton?: boolean;
  accept?: string;
  maxSizeHint?: string;
  emptyStateLabel?: string;
  replaceStateLabel?: string;
  templatePreviewLabel?: string;
  templateBadgeLabel?: string;
  theme?: AudioUploadTheme;
  className?: string;
  uploadAreaClassName?: string;
  extraInfo?: React.ReactNode;
};

export function AudioUpload({
  audioPreviewUrl,
  audioFile,
  audioDuration = null,
  inputRef,
  onUploadClick,
  onSelectAudio,
  onRemoveAudio,
  onTrimAudio,
  isTemplateAudio = false,
  accept = "audio/*,audio/mpeg,audio/wav,audio/mp3",
  maxSizeHint = "MP3, WAV (max 20MB)",
  emptyStateLabel = "Click to upload audio",
  replaceStateLabel = "Click to replace the template audio",
  templatePreviewLabel = "Template audio",
  templateBadgeLabel = "Default",
  theme = "light",
  className,
  uploadAreaClassName,
  extraInfo,
}: AudioUploadProps) {
  const audioRef = React.useRef<HTMLAudioElement>(null);
  const [isAudioPlaying, setIsAudioPlaying] = React.useState(false);
  const [audioProgress, setAudioProgress] = React.useState(0);

  React.useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
    setIsAudioPlaying(false);
    setAudioProgress(0);
  }, [audioPreviewUrl]);

  React.useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const handleEnded = () => {
      setIsAudioPlaying(false);
      setAudioProgress(0);
    };
    const handlePause = () => setIsAudioPlaying(false);
    const handlePlay = () => setIsAudioPlaying(true);
    const handleTimeUpdate = () => {
      if (!audio.duration || Number.isNaN(audio.duration)) return;
      const progress = Math.min(1, audio.currentTime / audio.duration);
      setAudioProgress(progress);
    };
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    return () => {
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [audioPreviewUrl]);

  const toggleAudioPlayback = (e: React.MouseEvent) => {
    e.stopPropagation();
    const audio = audioRef.current;
    if (!audio) return;
    if (isAudioPlaying) {
      audio.pause();
      setIsAudioPlaying(false);
    } else {
      if (audio.ended) {
        audio.currentTime = 0;
      }
      audio
        .play()
        .then(() => setIsAudioPlaying(true))
        .catch(() => setIsAudioPlaying(false));
    }
  };

  const showFileDetails = Boolean(audioPreviewUrl);
  const showRemove = Boolean(onRemoveAudio) && !isTemplateAudio;
  const showTrim = Boolean(audioPreviewUrl);
  const durationText =
    audioDuration !== null && !Number.isNaN(audioDuration)
      ? `${audioDuration.toFixed(1)}s`
      : null;
  const fileTitle = isTemplateAudio
    ? templatePreviewLabel
    : audioFile?.name || "Audio file";
  const fileSizeText = audioFile
    ? `${(audioFile.size / 1024 / 1024).toFixed(2)} MB`
    : null;
  const metaText = [
    isTemplateAudio ? replaceStateLabel : fileSizeText,
    durationText,
  ]
    .filter(Boolean)
    .join(" • ");

  const styles =
    theme === "dark"
      ? {
          badge:
            "text-[10px] text-amber-200 bg-amber-500/10 border border-amber-500/30 rounded-full px-2 py-0.5",
          playButton:
            "w-8 h-8 flex items-center justify-center rounded-full bg-amber-500 text-white transition-colors relative hover:bg-amber-600",
          progressTrack: "text-amber-200/40",
          progress: "text-white",
          uploadArea:
            "border-2 border-dashed rounded-lg p-3 text-center cursor-pointer transition-all duration-200 min-h-[100px] flex items-center justify-center border-gray-600 hover:border-amber-500/50 bg-gray-800/30",
          uploadIcon: "text-gray-400",
          uploadText: "text-gray-400",
          uploadHint: "text-gray-500",
          fileName: "text-white",
          fileMeta: "text-gray-400",
          trimButton:
            "h-8 w-8 bg-amber-500 hover:bg-amber-600 text-white rounded-full transition-colors flex items-center justify-center",
          removeButton:
            "bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors",
          fileIcon: "text-amber-500",
        }
      : {
          badge:
            "text-[10px] text-primary bg-primary/10 border border-primary/20 rounded-full px-2 py-0.5",
          playButton:
            "w-8 h-8 flex items-center justify-center rounded-full bg-primary text-white transition-colors relative hover:bg-primary/90",
          progressTrack: "text-primary/30",
          progress: "text-white",
          uploadArea:
            "border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all duration-200 min-h-[100px] flex items-center justify-center border-gray-200 hover:border-primary/50 bg-gray-50",
          uploadIcon: "text-gray-400",
          uploadText: "text-gray-500",
          uploadHint: "text-gray-400",
          fileName: "text-gray-800",
          fileMeta: "text-gray-500",
          trimButton:
            "h-8 w-8 bg-primary hover:bg-primary/90 text-white rounded-full transition-colors flex items-center justify-center",
          removeButton:
            "bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors",
          fileIcon: "text-primary",
        };

  return (
    <div className={cn("space-y-2", className)}>
      <div
        className={cn(styles.uploadArea, uploadAreaClassName)}
        onClick={onUploadClick}
      >
        {showFileDetails ? (
          <div className="relative w-full flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <Music className={cn("w-6 h-6 flex-shrink-0", styles.fileIcon)} />
              <div className="flex-1 text-left min-w-0">
                <div className="flex items-center gap-2 min-w-0">
                  <span className={cn("text-xs font-medium truncate", styles.fileName)}>
                    {fileTitle}
                  </span>
                  {isTemplateAudio && (
                    <span className={styles.badge}>{templateBadgeLabel}</span>
                  )}
                </div>
                {metaText && (
                  <p className={cn("text-[10px]", styles.fileMeta)}>
                    {metaText}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {audioPreviewUrl && (
                <button
                  onClick={toggleAudioPlayback}
                  className={styles.playButton}
                  aria-label={
                    isAudioPlaying ? "Pause audio preview" : "Play audio preview"
                  }
                >
                  <svg
                    className="absolute inset-0 w-full h-full"
                    viewBox="0 0 36 36"
                    aria-hidden="true"
                  >
                    <circle
                      className={styles.progressTrack}
                      stroke="currentColor"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      fill="none"
                      cx="18"
                      cy="18"
                      r="16"
                    />
                    <circle
                      className={styles.progress}
                      stroke="currentColor"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      fill="none"
                      cx="18"
                      cy="18"
                      r="16"
                      strokeDasharray="100"
                      strokeDashoffset={
                        100 - Math.max(0, Math.min(1, audioProgress)) * 100
                      }
                      transform="rotate(-90 18 18)"
                    />
                  </svg>
                  {isAudioPlaying ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                </button>
              )}
              {showTrim && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onTrimAudio?.();
                  }}
                  className={styles.trimButton}
                  title="Trim audio"
                  aria-label="Trim audio"
                >
                  <Scissors className="h-4 w-4" />
                </button>
              )}
              {showRemove && (
                <button
                  className={styles.removeButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveAudio?.();
                  }}
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center pointer-events-none">
            <Music className={cn("w-6 h-6 mb-1", styles.uploadIcon)} />
            <p className={cn("text-xs", styles.uploadText)}>
              {isTemplateAudio ? replaceStateLabel : emptyStateLabel}
            </p>
            {maxSizeHint && (
              <p className={cn("mt-1 text-[10px]", styles.uploadHint)}>
                {maxSizeHint}
              </p>
            )}
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={onSelectAudio}
        />
      </div>
      {audioPreviewUrl && (
        <audio
          ref={audioRef}
          src={audioPreviewUrl || undefined}
          className="hidden"
        />
      )}
      {extraInfo ? <div className="mt-1.5">{extraInfo}</div> : null}
    </div>
  );
}
