"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUserInfo } from "@/library/providers";
import { Button } from "@/library/ui/button";
import { Progress } from "@/library/ui/progress";
import { useTaskCenter, type GenerationTask } from "@/library/providers";
import { api } from "@/library/services/api";
import { useToast } from "@/library/ui/toast-provider";
import { WorkDetailDialog } from "@/library/components/profile";
import type { GenerationHistoryItem } from "@/library/components/profile/types";
import { stripModelVersion } from "@/library/lib/aimodel/utils";
import { TOPIC_TAGS } from "@/library/lib/share/topic-share-config";
import { useAudioPlayer } from "@/library/media/audio-player/AudioPlayerProvider";
import {
  ChevronDown,
  ChevronRight,
  Play,
} from "lucide-react";

const formatRelativeTime = (timestampMs: number) => {
  const diffMs = Date.now() - timestampMs;
  const diffSec = Math.max(0, Math.floor(diffMs / 1000));
  if (diffSec < 60) return `${diffSec}s`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h`;
  const date = new Date(timestampMs);
  const month = date.toLocaleString('en-US', { month: 'short' });
  const dd = date.getDate();
  return `${month} ${dd}`;
};

const formatFullTime = (timestampMs: number) => {
  const date = new Date(timestampMs);
  const time = date.toLocaleString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
  const dateStr = date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
  return `${time} · ${dateStr}`;
};

const getEstimatedProgress = (task: GenerationTask) => {
  if (task.status === "success") return 100;
  if (task.status === "failed") return 100;

  const elapsedSec = Math.max(0, (Date.now() - task.createdAt) / 1000);
  const tick = 1.5;
  const ticks = Math.floor(elapsedSec / tick);
  const ticksInFirst30 = Math.floor(30 / tick);
  const firstPhase = Math.min(ticks, ticksInFirst30) * 2;
  const secondPhase = Math.max(0, ticks - ticksInFirst30) * 1;
  return Math.min(95, firstPhase + secondPhase);
};

const getStatusPillClass = (task: GenerationTask) => {
  if (task.status === "success") return "bg-emerald-100 text-emerald-700 border-emerald-200";
  if (task.status === "failed") return "bg-red-100 text-red-700 border-red-200";
  return "bg-amber-100 text-amber-700 border-amber-200";
};

const getStatusLabel = (task: GenerationTask) => {
  if (task.status === "success") return "Completed";
  if (task.status === "failed") return "Failed";
  return "Generating";
};

export function TaskCenterDropdown() {
  const { isLoadingUserInfo, userInfo } = useUserInfo();
  const userId = userInfo?.uuid;
  const pathname = usePathname();
  const {
    tasks,
    isReady,
    removeTask,
    openProgressDialog,
    setOpen,
  } = useTaskCenter();
  const { playTrack } = useAudioPlayer();
  const toast = useToast();
  const [, forceTick] = useState(0);
  const [isCompletedCollapsed, setIsCompletedCollapsed] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [selectedDetailItem, setSelectedDetailItem] =
    useState<GenerationHistoryItem | null>(null);
  const [selectedDetailShowDelete, setSelectedDetailShowDelete] =
    useState(true);
  const [previewLoadingTaskId, setPreviewLoadingTaskId] = useState<
    string | null
  >(null);
  const [modelFilter, setModelFilter] = useState<string>("all");
  const [topicFilter, setTopicFilter] = useState<number | "all">("all");

  const isChristmasRoute = /(^|\/)christmas(\/|$)/.test(pathname);

  useEffect(() => {
    const hasPending = tasks.some((t) => t.status === "pending");
    if (!hasPending) return;
    const id = window.setInterval(() => {
      forceTick((x) => (x + 1) % 10_000);
    }, 1500);
    return () => window.clearInterval(id);
  }, [tasks]);

  const defaultModelFilter = useMemo(() => {
    if (/(^|\/)skyreels-v4(\/|$)/.test(pathname)) return "SkyReels V4";
    if (/(^|\/)skyreels-v3(\/|$)/.test(pathname)) return "SkyReels V3";
    if (/(^|\/)wan-2-7(\/|$)/.test(pathname)) return "Wan 2.7";
    if (/(^|\/)wan-2-6(\/|$)/.test(pathname)) return "Wan 2.6";
    if (/(^|\/)wan-2-5(\/|$)/.test(pathname)) return "Wan 2.5";
    return "all";
  }, [pathname]);

  useEffect(() => {
    if (isChristmasRoute) {
      setTopicFilter(TOPIC_TAGS.CHRISTMAS);
      return;
    }
    setModelFilter(defaultModelFilter);
  }, [defaultModelFilter, isChristmasRoute]);

  const modelOptions = useMemo(() => {
    const preferred = ["SkyReels V4", "SkyReels V3", "Wan 2.7", "Wan 2.6", "Wan 2.5"];
    const labels = Array.from(
      new Set(tasks.map((t) =>
        stripModelVersion(t.modelLabel)
      ).filter(Boolean))
    );
    labels.sort((a, b) => {
      const aIndex = preferred.indexOf(a);
      const bIndex = preferred.indexOf(b);
      if (aIndex !== -1 || bIndex !== -1) {
        return (aIndex === -1 ? preferred.length : aIndex) -
          (bIndex === -1 ? preferred.length : bIndex);
      }
      return a.localeCompare(b);
    });
    return labels;
  }, [tasks]);

  const topicOptions = useMemo(() => {
    const tagLabels = new Map<number, string>([
      [TOPIC_TAGS.CHRISTMAS, "Christmas"],
    ]);
    const tags = Array.from(
      new Set(
        tasks
          .map((t) => t.topicTag)
          .filter((v): v is number => typeof v === "number" && v !== 0)
      )
    );
    if (isChristmasRoute && !tags.includes(TOPIC_TAGS.CHRISTMAS)) {
      tags.push(TOPIC_TAGS.CHRISTMAS);
    }
    tags.sort((a, b) => a - b);
    return tags.map((tag) => ({
      tag,
      label: tagLabels.get(tag) ?? `Topic ${tag}`,
    }));
  }, [isChristmasRoute, tasks]);

  const filteredTasks = useMemo(() => {
    if (isChristmasRoute) {
      if (topicFilter === "all") return tasks;
      return tasks.filter((t) => t.topicTag === topicFilter);
    }
    if (modelFilter === "all") return tasks;
    return tasks.filter((t) =>
      stripModelVersion(t.modelLabel) === modelFilter
    );
  }, [isChristmasRoute, modelFilter, tasks, topicFilter]);

  const { inProgressTasks, completedTasks } = useMemo(() => {
    const inProgress = filteredTasks
      .filter((t) => t.status === "pending")
      .sort((a, b) => b.createdAt - a.createdAt);
    const completed = filteredTasks
      .filter((t) => t.status !== "pending")
      .sort((a, b) => b.createdAt - a.createdAt);
    return { inProgressTasks: inProgress, completedTasks: completed };
  }, [filteredTasks]);

  const buildFallbackDetailItem = (task: GenerationTask) => {
    const status = task.status === "success" ? 1 : task.status === "failed" ? -1 : 0;
    const primaryAudioUrl = task.audioUrl || task.audioUrls?.[0] || "";
    const otherAudioUrls = (task.audioUrls || []).filter(
      (url) => url && url !== primaryAudioUrl
    );
    // Map imageUrl(s) to generate_image if videoUrl is missing
    const mediaUrl =
      primaryAudioUrl ||
      task.videoUrl ||
      task.imageUrl ||
      (task as any).imageUrls?.[0] ||
      "";

    return {
      id: -1,
      user_id: 0,
      task_id: task.taskId,
      origin_image: "",
      size_image: "",
      other_image: otherAudioUrls.join("|"),
      generate_image: mediaUrl,
      quality_image: "",
      status,
      status_msg: task.statusMsg ?? "",
      generation_time: 0,
      prompt: task.prompt ?? "",
      created_at: Math.floor(task.createdAt / 1000),
      updated_at: Math.floor(task.updatedAt / 1000),
      deleted_at: 0,
    } satisfies GenerationHistoryItem;
  };

  const openTaskDetailDialog = async (task: GenerationTask) => {
    setPreviewLoadingTaskId(task.taskId);
    try {
      const result = await api.user.getUserOpusList(1, 30);
      const list = Array.isArray(result?.data?.list) ? result.data.list : [];
      const matched = list.find((item: any) => item?.task_id === task.taskId) as
        | GenerationHistoryItem
        | undefined;

      if (matched) {
        setSelectedDetailItem(matched);
        setSelectedDetailShowDelete(true);
      } else {
        setSelectedDetailItem(buildFallbackDetailItem(task));
        setSelectedDetailShowDelete(false);
      }
      setIsDetailDialogOpen(true);
    } catch (error) {
      console.error("Failed to load opus detail:", error);
      setSelectedDetailItem(buildFallbackDetailItem(task));
      setSelectedDetailShowDelete(false);
      setIsDetailDialogOpen(true);
      toast.error("Failed to load full details, showing preview only");
    } finally {
      setPreviewLoadingTaskId(null);
    }
  };

  const handleOpenPreview = async (task: GenerationTask) => {
    // 1. Handle Audio Tasks
    if (task.audioUrl || task.provider === "kie_music_v5" || task.modelLabel.toLowerCase().includes("qwen")) {
      const src = task.audioUrl || task.audioUrls?.[0];
      if (!src) {
        toast.error("Audio URL not found");
        return;
      }

      playTrack({
        id: `audio-${task.taskId}`,
        title: task.prompt && task.prompt.length > 30 ? `${task.prompt.slice(0, 30)}...` : (task.prompt || "Generated Audio"),
        artist: task.modelLabel || "AI Audio",
        src: src,

      });
      return;
    }

    // 2. Handle Video/Image Tasks
    await openTaskDetailDialog(task);
  };
  if (isLoadingUserInfo || !userId) return null;

  return (
    <div className="w-[85vw] max-w-[380px] h-[70vh] flex flex-col bg-background">
      <div className="flex-none p-4 pb-2 border-b">
        <div className="flex items-center justify-between pb-3">
          <Link
            href="/library"
            onClick={() => setOpen(false)}
            className="text-xs text-primary underline underline-offset-4 inline-flex items-center gap-1 cursor-pointer"
          >
            Open Library <ChevronRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {isChristmasRoute ? (
            <>
              <button
                type="button"
                className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-colors cursor-pointer ${topicFilter === "all"
                  ? "bg-primary text-white border-primary"
                  : "bg-background text-muted-foreground border-border hover:text-foreground"
                  }`}
                onClick={() => setTopicFilter("all")}
              >
                All
              </button>
              {topicOptions.map(({ tag, label }) => (
                <button
                  key={tag}
                  type="button"
                  className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-colors cursor-pointer ${topicFilter === tag
                    ? "bg-primary text-white border-primary"
                    : "bg-background text-muted-foreground border-border hover:text-foreground"
                    }`}
                  onClick={() => setTopicFilter(tag)}
                >
                  {label}
                </button>
              ))}
            </>
          ) : (
            <>
              <button
                type="button"
                className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-colors cursor-pointer ${modelFilter === "all"
                  ? "bg-primary text-white border-primary"
                  : "bg-background text-muted-foreground border-border hover:text-foreground"
                  }`}
                onClick={() => setModelFilter("all")}
              >
                All
              </button>
              {modelOptions.map((label) => (
                <button
                  key={label}
                  type="button"
                  className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-colors cursor-pointer ${modelFilter === label
                    ? "bg-primary text-white border-primary"
                    : "bg-background text-muted-foreground border-border hover:text-foreground"
                    }`}
                  onClick={() => setModelFilter(label)}
                >
                  {label}
                </button>
              ))}
            </>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        {filteredTasks.length === 0 && !isReady ? (
          <div className="text-sm text-muted-foreground py-10 px-4 text-center">
            Loading tasks...
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="text-sm text-muted-foreground py-10 px-4 text-center">
            {tasks.length === 0
              ? "No tasks yet."
              : isChristmasRoute
                ? "No tasks for this topic."
                : "No tasks for this model."}
          </div>
        ) : (
          <div className="space-y-4 pb-2">
            {inProgressTasks.length > 0 && (
              <div className="space-y-0 border-t border-border mt-2">
                <div className="text-[13px] font-bold text-foreground py-3 px-4 border-b border-border/50">
                  In Progress ({inProgressTasks.length})
                </div>
                {inProgressTasks.map((task) => {
                  const progress = getEstimatedProgress(task);
                  const elapsedMs = Date.now() - task.createdAt;
                  const showHint = elapsedMs >= 30_000;
                  return (
                    <div
                      key={task.taskId}
                      role="button"
                      tabIndex={0}
                      className="border-b border-border/50 p-4 bg-background cursor-pointer hover:bg-muted/30 transition-colors focus-visible:outline-none focus-visible:bg-muted/30"
                      onClick={() => openProgressDialog(task.taskId)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          openProgressDialog(task.taskId);
                        }
                      }}
                    >
                      <div className="flex gap-3">
                        <div className="shrink-0 mt-0.5">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                            {task.modelLabel.charAt(0).toUpperCase()}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                            <span className="font-bold text-foreground truncate">{task.modelLabel}</span>
                            <span className="shrink-0" title={formatFullTime(task.createdAt)}>· {formatRelativeTime(task.createdAt)}</span>
                          </div>
                          {task.prompt && (
                            <div className="text-[14px] text-foreground mt-0.5 line-clamp-3 leading-snug">
                              {task.prompt}
                            </div>
                          )}
                          <div className="mt-3 space-y-1.5">
                            <div className="flex justify-between items-center text-[12px] font-medium text-muted-foreground pr-1">
                              <span className="text-primary animate-pulse">Generating...</span>
                              <span>{Math.round(progress)}%</span>
                            </div>
                            <Progress value={progress} className="w-full h-1.5" />
                            {showHint && (
                              <div className="text-[12px] text-muted-foreground/80 leading-relaxed mt-1">
                                Generation usually takes about 2 mins.
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {completedTasks.length > 0 && (
              <div className="space-y-0 border-t border-border mt-4">
                <button
                  type="button"
                  className="w-full flex items-center justify-between text-[13px] font-bold text-foreground py-3 px-4 border-b border-border/50 cursor-pointer hover:bg-muted/30 transition-colors"
                  onClick={() => setIsCompletedCollapsed((v) => !v)}
                >
                  <span>Completed ({completedTasks.length})</span>
                  {isCompletedCollapsed ? (
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  )}
                </button>

                {!isCompletedCollapsed &&
                  completedTasks.map((task) => (
                    <div
                      key={task.taskId}
                      role="button"
                      tabIndex={0}
                      className={`border-b border-border/50 p-4 bg-background transition-colors focus-visible:outline-none focus-visible:bg-muted/30 ${task.status === "failed" ? "cursor-default" : "cursor-pointer hover:bg-muted/30"}`}
                      onClick={() => {
                        if (task.status !== "failed") {
                          openTaskDetailDialog(task);
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          if (task.status !== "failed") {
                            openTaskDetailDialog(task);
                          }
                        }
                      }}
                    >
                      <div className="flex gap-3">
                        <div className="shrink-0 mt-0.5">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                            {task.modelLabel.charAt(0).toUpperCase()}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                            <span className="font-bold text-foreground truncate">
                              {stripModelVersion(task.modelLabel)}
                            </span>
                            <span className="shrink-0" title={formatFullTime(task.createdAt)}>· {formatRelativeTime(task.createdAt)}</span>
                          </div>

                          {task.prompt && (
                            <div className="text-[14px] text-foreground mt-0.5 line-clamp-3 leading-snug">
                              {task.prompt}
                            </div>
                          )}

                          {task.status === "failed" && (
                            <div className="text-[12px] text-red-500 mt-1.5 bg-red-50/50 p-1.5 rounded truncate">
                              Failed: {task.statusMsg || "Unknown error"}
                            </div>
                          )}

                          {task.status === "success" && (task.videoUrl || task.audioUrl || task.imageUrl || (task as any).imageUrls?.length) && (
                            <div className="mt-2 flex items-center">
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-7 px-2.5 text-xs text-primary bg-primary/5 hover:bg-primary/15 -ml-1 rounded-full cursor-pointer transition-colors"
                                disabled={previewLoadingTaskId === task.taskId}
                                onClick={(e) => { e.stopPropagation(); handleOpenPreview(task); }}
                              >
                                {previewLoadingTaskId === task.taskId ? (
                                  <span className="animate-pulse">...</span>
                                ) : (
                                  <>
                                    <Play className="h-3 w-3 mr-1 fill-current" />
                                    {task.audioUrl ? "Play" : "View"}
                                  </>
                                )}
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}
      </div>

      <WorkDetailDialog
        open={isDetailDialogOpen}
        onOpenChange={setIsDetailDialogOpen}
        item={selectedDetailItem}
        showDelete={selectedDetailShowDelete}
        onDeleteSuccess={() => {
          if (selectedDetailItem?.task_id) {
            removeTask(selectedDetailItem.task_id);
          }
        }}
      />
    </div>
  );
}
