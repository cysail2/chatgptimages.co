'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/library/ui/dialog";
import { Button } from "@/library/ui/button";
import Image from 'next/image';
import { CopyIcon, DownloadIcon, ReloadIcon, TrashIcon } from '@radix-ui/react-icons';
import { copyShareLink } from '@/library/lib/share/share-utils';
import { GenerationHistoryItem } from './types';
import { formatTimestamp, downloadMediaWithCors, parseAudioUrls } from './utils';
import { stripModelVersion } from '@/library/lib/aimodel/utils';
import { shareToSocial } from '@/library/lib/share/share-utils';
import { useToast } from '@/library/ui/toast-provider';
import { DeleteConfirmDialog } from './DeleteConfirmDialog';


interface VideoDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: GenerationHistoryItem | null;
  onDeleteSuccess?: () => void;
  showDelete?: boolean;
}

export function VideoDetailDialog({
  open,
  onOpenChange,
  item,
  onDeleteSuccess,
  showDelete = true,
}: VideoDetailDialogProps) {
  const [isDownloading, setIsDownloading] = useState<number | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const toast = useToast();

  if (!item) return null;

  const modelLabel = (() => {
    const m = (item.model || "").toLowerCase();
    if (!m) return null;
    const rawLabel = item.model;
    return stripModelVersion(rawLabel);
  })();
  const isReferenceModel = (item.model || "").toLowerCase().includes("reference");
  const otherUrls = parseAudioUrls(item.other_image);
  const referenceVideoUrls = otherUrls.filter((url) => /\.(mp4|webm|mov)(\?|#|$)/i.test(url));
  const audioUrls = otherUrls.filter((url) => /\.(mp3|wav|ogg|m4a|aac|flac)(\?|#|$)/i.test(url));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-[95vw] w-[95vw] lg:max-w-7xl max-h-[90vh] overflow-y-auto lg:overflow-hidden rounded-2xl border border-border shadow-2xl bg-card/95 backdrop-blur-xl lg:flex lg:flex-col lg:min-h-0 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-muted/50 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:bg-muted"
      >
        <DialogHeader className="pb-4 border-b border-border">
          <DialogTitle className="text-2xl font-semibold text-card-foreground">Video Details</DialogTitle>
        </DialogHeader>

        <div className="pt-3 lg:pt-2 lg:flex-1 lg:overflow-hidden min-h-0">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:h-full min-h-0">
            {/* 左侧：视频播放器 */}
            <div className="flex flex-col justify-start space-y-6 lg:col-span-7 xl:col-span-8 lg:h-full min-h-0">
              <div className="aspect-video min-h-[200px] bg-slate-900 rounded-lg overflow-hidden">
                <video
                  src={item.generate_image}
                  controls
                  className="w-full h-full object-contain"
                  playsInline
                  controlsList="nodownload"
                  onContextMenu={(e) => e.preventDefault()}
                >
                  Your browser does not support the video tag.
                </video>
              </div>

              {/* 下载、操作、分享按钮 */}
              <div className="flex flex-col sm:flex-row gap-2">
                {/* 下载按钮 */}
                <Button
                  onClick={() => downloadMediaWithCors(
                    item.generate_image,
                    `video-${item.id}.mp4`,
                    setIsDownloading,
                    item.id,
                    toast.showToast
                  )}
                  className="w-full sm:w-auto sm:flex-none sm:min-w-40 sm:max-w-56 flex items-center justify-center gap-2"
                  disabled={isDownloading === item.id}
                >
                  {isDownloading === item.id ? (
                    <>
                      <ReloadIcon className="h-4 w-4 animate-spin" />
                      Downloading...
                    </>
                  ) : (
                    <>
                      <DownloadIcon className="h-4 w-4" />
                      Download
                    </>
                  )}
                </Button>

                {/* 删除按钮 */}
                {showDelete && (
                  <Button
                    variant="destructive"
                    onClick={() => setIsDeleteConfirmOpen(true)}
                    className="flex items-center justify-center gap-2"
                  >
                    <TrashIcon className="h-4 w-4" />
                    Delete
                  </Button>
                )}

                {/* 复制网址按钮 */}
                <Button
                  variant="outline"
                  onClick={async () => {
                    const success = await copyShareLink({
                      taskId: item.task_id,
                      videoUrl: item.generate_image,
                      topicTag: item.topic_tag,
                    });
                    toast.showToast(
                      success ? "Copied share link" : "Copy failed, please try again"
                    );
                  }}
                  className="flex items-center justify-center gap-2"
                >
                  <CopyIcon className="h-4 w-4" />
                  Copy Link
                </Button>

                {/* 分享按钮组 */}
                {item.task_id && (
                  <div className="flex gap-2 justify-center sm:justify-start">
                    {/* Twitter */}
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        shareToSocial('twitter', {
                          taskId: item.task_id,
                          videoUrl: item.generate_image,
                          topicTag: item.topic_tag,
                        })
                      }
                      title="Share to Twitter"
                      className="hover:bg-[#1DA1F2] hover:text-white hover:border-[#1DA1F2]"
                    >
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    </Button>

                    {/* Facebook */}
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        shareToSocial('facebook', {
                          taskId: item.task_id,
                          videoUrl: item.generate_image,
                          topicTag: item.topic_tag,
                        })
                      }
                      title="Share to Facebook"
                      className="hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2]"
                    >
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                    </Button>

                    {/* WhatsApp */}
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        shareToSocial('whatsapp', {
                          taskId: item.task_id,
                          videoUrl: item.generate_image,
                          topicTag: item.topic_tag,
                        })
                      }
                      title="Share to WhatsApp"
                      className="hover:bg-[#25D366] hover:text-white hover:border-[#25D366]"
                    >
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                      </svg>
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* 右侧：详细信息 */}
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

                {isReferenceModel && referenceVideoUrls.length > 0 ? (
                  <div className="bg-muted/50 rounded-lg p-3 lg:p-2.5">
                    <h3 className="text-xs font-semibold text-muted-foreground mb-1.5 lg:mb-1">Reference Videos</h3>
                    <div className="space-y-2 mt-2 lg:mt-1.5">
                      {referenceVideoUrls.map((url, index) => (
                        <div key={`${url}-${index}`} className="rounded-lg overflow-hidden bg-slate-900">
                          <video
                            src={url}
                            controls
                            className="w-full max-h-40 lg:max-h-36 object-contain"
                            playsInline
                            controlsList="nodownload"
                            onContextMenu={(e) => e.preventDefault()}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ) : item.origin_image ? (
                  <div className="bg-muted/50 rounded-lg p-3 lg:p-2.5">
                    <h3 className="text-xs font-semibold text-muted-foreground mb-1.5 lg:mb-1">Original Media</h3>
                    <div className="mt-2 lg:mt-1.5 rounded-lg overflow-hidden bg-slate-900">
                      {item.origin_image.match(/\.(mp4|webm|mov)$/i) ? (
                        <video
                          src={item.origin_image}
                          controls
                          className="w-full max-h-40 lg:max-h-36 object-contain"
                          playsInline
                          controlsList="nodownload"
                          onContextMenu={(e) => e.preventDefault()}
                        >
                          Your browser does not support the video tag.
                        </video>
                      ) : (
                        <Image
                          src={item.origin_image}
                          alt="Original media"
                          width={400}
                          height={300}
                          className="w-full max-h-40 lg:max-h-36 object-contain"
                          unoptimized
                        />
                      )}
                    </div>
                  </div>
                ) : null}

                {/* Audio */}
                {audioUrls.length > 0 ? (
                  <div className="bg-muted/50 rounded-lg p-3 lg:p-2.5">
                    <h3 className="text-xs font-semibold text-muted-foreground mb-1.5 lg:mb-1">Audio</h3>
                    <div className="space-y-2 mt-2 lg:mt-1.5">
                      {audioUrls.map((audioUrl, index) => (
                        <div key={`${audioUrl}-${index}`} className="bg-slate-900 rounded-lg p-2.5 lg:p-2">
                          <p className="text-xs text-muted-foreground mb-1.5 lg:mb-1">Audio {index + 1}</p>
                          <audio
                            src={audioUrl}
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
                ) : null}
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
