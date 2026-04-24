"use client";

import React, { useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUserInfo } from "@/library/providers";
import { Button } from "@/library/ui/button";
import { Progress } from "@/library/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/library/ui/dialog";
import { useTaskCenter, type GenerationTask } from "@/library/providers";
import { useAudioPlayer } from "@/library/media/audio-player/AudioPlayerProvider";
import { ExternalLink } from "lucide-react";

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

export function TaskCenterWidget() {
  const { isLoadingUserInfo, userInfo } = useUserInfo();
  const isLoaded = !isLoadingUserInfo;
  const userId = userInfo?.uuid;
  const pathname = usePathname();
  const { playTrack } = useAudioPlayer();
  const {
    tasks,
    setOpen,
    isProgressDialogOpen,
    progressDialogTaskId,
    closeProgressDialog,
  } = useTaskCenter();
  const previousTaskStateRef = useRef<Map<string, string>>(new Map());

  const isProfileRoute = /(^|\/)profile(\/|$)/.test(pathname);
  const isChristmasRoute = /(^|\/)christmas(\/|$)/.test(pathname);
  // Treat <= md breakpoint as "mobile" for visibility rules on /profile & /christmas.
  // Since we removed the mobile check logic here (it was for the floating button), we can simplify or just rely on CSS if needed.
  // But strictly speaking, if we just want to hide the widget on some pages, we can keep this check.
  // However, the widget now only shows the ProgressDialog which is global.
  // Maybe we should allow the ProgressDialog everywhere?
  // The original code hid it on profile/christmas mobile.
  // Let's keep it simple: Show ProgressDialog everywhere.

  const hideOnThisPage = false; // Simplified for now, or keep logic if necessary. 
  // Original logic:
  // const hideOnThisPage = isProfileRoute || (isChristmasRoute && isMobile === true);
  // But we don't have isMobile state anymore.

  const progressDialogTask = useMemo(() => {
    if (!progressDialogTaskId) return null;
    return tasks.find((t) => t.taskId === progressDialogTaskId) ?? null;
  }, [progressDialogTaskId, tasks]);

  useEffect(() => {
    const previousStates = previousTaskStateRef.current;

    for (const task of tasks) {
      const previousStatus = previousStates.get(task.taskId);
      const justCompleted =
        previousStatus === "pending" && task.status === "success" && !!task.audioUrl;

      if (justCompleted) {
        playTrack({
          id: `task-center-${task.taskId}`,
          title:
            task.prompt && task.prompt.length > 30
              ? `${task.prompt.slice(0, 30)}...`
              : task.prompt || "Generated Audio",
          artist: task.modelLabel || "AI Audio",
          src: task.audioUrl as string,
        });
      }

      previousStates.set(task.taskId, task.status);
    }

    const activeTaskIds = new Set(tasks.map((task) => task.taskId));
    for (const taskId of Array.from(previousStates.keys())) {
      if (!activeTaskIds.has(taskId)) {
        previousStates.delete(taskId);
      }
    }
  }, [playTrack, tasks]);

  if (!isLoaded) return null;
  if (!userId) return null;
  if (hideOnThisPage) return null;

  return (
    <>
      <Dialog
        open={isProgressDialogOpen}
        onOpenChange={(open) => {
          if (!open) closeProgressDialog();
        }}
      >
        <DialogContent className="w-[95vw] max-w-md sm:max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl p-6">
          <DialogHeader className="pr-6">
            <DialogTitle className="text-xl sm:text-2xl font-semibold">
              {progressDialogTask?.status === "failed"
                ? "Task Failed"
                : progressDialogTask?.status === "success"
                  ? "Completed"
                  : progressDialogTask?.provider === "seedream"
                    ? "Generating Image"
                    : "Generating Video"}
            </DialogTitle>
          </DialogHeader>

          {progressDialogTask ? (
            <div className="space-y-5">
              {progressDialogTask.prompt && (
                <div className="text-sm text-muted-foreground line-clamp-3">
                  {progressDialogTask.prompt}
                </div>
              )}

              {(progressDialogTask.imageUrl || progressDialogTask.videoUrl) && (
                <div className="rounded-lg overflow-hidden bg-muted/50 border flex items-center justify-center">
                  {progressDialogTask.imageUrl ? (
                    <img
                      src={progressDialogTask.imageUrl}
                      alt="Generated content"
                      className="max-w-full max-h-[300px] object-contain"
                    />
                  ) : (
                    <video
                      src={progressDialogTask.videoUrl}
                      controls
                      className="max-w-full max-h-[300px]"
                    />
                  )}
                </div>
              )}

              <div className="space-y-3">
                <div className="flex justify-between text-sm font-medium text-muted-foreground">
                  <span>Progress</span>
                  <span>
                    {Math.round(
                      progressDialogTask.status === "pending"
                        ? getEstimatedProgress(progressDialogTask)
                        : 100
                    )}
                    %
                  </span>
                </div>
                <Progress
                  value={
                    progressDialogTask.status === "pending"
                      ? getEstimatedProgress(progressDialogTask)
                      : 100
                  }
                  className="w-full h-3"
                />
                {progressDialogTask.status !== "failed" && (
                  <div className="text-xs text-muted-foreground leading-relaxed pt-2">
                    {progressDialogTask.provider === "seedream" ? (
                      <>
                        No need to wait here. Image generation usually takes about 30 seconds.
                      </>
                    ) : (
                      <>
                        No need to wait here. Video generation usually takes about 2 minutes.
                      </>
                    )}
                    Track progress in the{" "}
                    <button
                      type="button"
                      className="text-primary underline underline-offset-4"
                      onClick={() => {
                        closeProgressDialog();
                        setOpen(true);
                      }}
                    >
                      Task Center
                    </button>{" "}
                    (top right) or in{" "}
                    <Link
                      href="/library#generation-history-section"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline underline-offset-4 inline-flex items-center gap-1"
                      onClick={() => closeProgressDialog()}
                    >
                      Library <ExternalLink className="w-3 h-3" />
                    </Link>
                    .
                  </div>
                )}
                {progressDialogTask.statusMsg &&
                  !(
                    progressDialogTask.status === "pending" &&
                    /pending/i.test(progressDialogTask.statusMsg)
                  ) && (
                    <div
                      className={
                        progressDialogTask.status === "failed"
                          ? "text-sm text-red-600 leading-relaxed"
                          : "text-xs text-muted-foreground leading-relaxed"
                      }
                    >
                      {progressDialogTask.statusMsg}
                    </div>
                  )}
              </div>
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">Task not found.</div>
          )}

          <DialogFooter className="gap-2 sm:gap-2 sm:justify-center pt-4">
            {progressDialogTask?.status === "failed" ? (
              <Button
                type="button"
                variant="outline"
                className="w-full sm:w-auto"
                onClick={closeProgressDialog}
              >
                Close
              </Button>
            ) : (
              <Button
                type="button"
                className="w-full sm:w-auto"
                onClick={closeProgressDialog}
              >
                Run in Background
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
