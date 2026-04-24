"use client";

import "@/library/ai/gpt-image";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Image as ImageIcon,
  Info,
  Plus,
  Type,
  Upload,
  Zap,
} from "lucide-react";
import { cn } from "@/library/lib/utils";
import { useTaskCenter, useUserInfo } from "@/library/providers";
import { InsufficientCreditsModal } from "@/library/components/model-form";
import { Button } from "@/library/ui/button";
import { Textarea } from "@/library/ui/textarea";
import { Card, CardContent } from "@/library/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/library/ui/tabs";
import { Label } from "@/library/ui/label";
import { ImagePreview, type ImagePreviewSource } from "@/library/media/image-preview/ImagePreview";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/library/ui/tooltip";
import { ReferenceImageRow } from "./ReferenceImageRow";
import { useImageGeneration } from "./useImageGeneration";
import { listImageAdapters } from "./registry";
import type { OutputFormat } from "./types";
import aiImageExamples from "@/data/ai-image-examples.json";

type AiImageExampleRecord = {
  id: string;
  aiModel?: string;
  imageUrl: string;
  description?: string;
};

const imageExamples =
  ((aiImageExamples as { examples?: AiImageExampleRecord[] }).examples || []);

export function AiImageGenerator({
  defaultModel,
  hideModelSelector = false,
}: {
  defaultModel?: string;
  hideModelSelector?: boolean;
}) {
  const { isSignedIn, openSignIn } = useUserInfo();
  const { tasks, closeProgressDialog } = useTaskCenter();

  const models = useMemo(() => listImageAdapters(), []);
  const [selectedModel, setSelectedModel] = useState(
    defaultModel || models[0]?.modelId || "",
  );

  const hook = useImageGeneration(selectedModel);
  const adapter = hook.adapter;

  const demos = useMemo<ImagePreviewSource[]>(
    () =>
      imageExamples
        .filter((example) => example.aiModel === selectedModel)
        .map((example) => ({
          url: example.imageUrl,
          source: "demo",
          model: example.aiModel,
          prompt: example.description,
          taskId: example.id,
        })),
    [selectedModel],
  );

  const [userPlaylist, setUserPlaylist] = useState<ImagePreviewSource[]>([]);
  const addedUrlsRef = useRef<Set<string>>(new Set());
  const processedCompletedTaskIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!adapter) return;
    const relevantTasks = tasks.filter(
      (task) =>
        task.provider === adapter.taskProvider &&
        hook.computed.localTaskIdsRef.current.has(task.taskId),
    );

    const newItems: ImagePreviewSource[] = [];
    let hasNewImages = false;

    relevantTasks.forEach((task) => {
      const urls: string[] = (task as { imageUrls?: string[] }).imageUrls || [];
      if (task.imageUrl && !urls.includes(task.imageUrl)) {
        urls.push(task.imageUrl);
      }
      urls.forEach((url) => {
        if (url && !addedUrlsRef.current.has(url)) {
          addedUrlsRef.current.add(url);
          newItems.unshift({
            url,
            source: "user",
            model: adapter.modelId,
            prompt: task.prompt,
            taskId: task.taskId,
          });
          hasNewImages = true;
        }
      });
    });

    if (hasNewImages) {
      setUserPlaylist((prev) => [...newItems, ...prev]);
    }

    const completed = relevantTasks.filter(
      (task) =>
        task.status === "success" &&
        !processedCompletedTaskIdsRef.current.has(task.taskId),
    );
    if (completed.length > 0) {
      completed.forEach((task) =>
        processedCompletedTaskIdsRef.current.add(task.taskId),
      );
      closeProgressDialog();
    }
  }, [tasks, adapter, hook.computed.localTaskIdsRef, closeProgressDialog]);

  const pendingItems = useMemo<ImagePreviewSource[]>(() => {
    if (!adapter) return [];
    return tasks
      .filter(
        (task) =>
          task.provider === adapter.taskProvider &&
          hook.computed.localTaskIdsRef.current.has(task.taskId) &&
          task.status === "pending",
      )
      .map((task) => ({
        url: "",
        source: "user" as const,
        model: adapter.modelId,
        prompt: task.prompt,
        taskId: task.taskId,
        pending: true,
        statusMsg: task.statusMsg,
      }));
  }, [tasks, adapter, hook.computed.localTaskIdsRef]);

  const combinedPlaylist = useMemo(
    () => [...pendingItems, ...userPlaylist, ...demos],
    [pendingItems, userPlaylist, demos],
  );

  if (!adapter) {
    return null;
  }

  const caps = adapter.capabilities;
  const showImageMode = caps?.supportsImageToImage;
  const showAspectRatio = (caps?.supportedAspectRatios.length || 0) > 0;
  const showResolution = (caps?.supportedResolutions.length || 0) > 0;
  const showOutputFormat = (caps?.supportedOutputFormats.length || 0) > 1;
  const maxRefs = caps?.maxReferenceImages ?? 0;

  return (
    <TooltipProvider>
      <InsufficientCreditsModal
        open={hook.ui.showPricingModal}
        creditCost={hook.computed.creditCost}
        onClose={() => hook.ui.setShowPricingModal(false)}
        onUpgrade={() => {
          hook.ui.setShowPricingModal(false);
          document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" });
        }}
      />

      <section className="relative">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-start gap-6 lg:grid-cols-12 lg:px-6">
          <div className="lg:col-span-5">
            <Card className="border-border bg-card shadow-xl">
              <CardContent className="p-0">
                <Tabs
                  value={hook.state.mode}
                  onValueChange={(value) =>
                    hook.state.setMode(value as "text" | "image")
                  }
                  className="w-full"
                >
                  <div className="z-30 rounded-t-xl bg-card p-4 pb-0 sm:p-6 sm:pb-0">
                    <TabsList
                      className={cn(
                        "grid h-auto w-full rounded-2xl border border-white/8 bg-[#9b99b1]/18 p-1.5 text-[#b8b6cf] shadow-inner shadow-black/20 backdrop-blur-sm",
                        showImageMode ? "grid-cols-2" : "grid-cols-1",
                      )}
                    >
                      <TabsTrigger
                        value="text"
                        className="h-14 gap-2 rounded-xl text-base font-semibold text-[#c7c5da] data-[state=active]:bg-[#0a0a10] data-[state=active]:text-white data-[state=active]:shadow-[0_10px_30px_rgba(0,0,0,0.35)]"
                      >
                        <Type className="h-4 w-4" />
                        Text to Image
                      </TabsTrigger>
                      {showImageMode && (
                        <TabsTrigger
                          value="image"
                          className="h-14 gap-2 rounded-xl text-base font-semibold text-[#c7c5da] data-[state=active]:bg-[#0a0a10] data-[state=active]:text-white data-[state=active]:shadow-[0_10px_30px_rgba(0,0,0,0.35)]"
                        >
                          <ImageIcon className="h-4 w-4" />
                          Image Edit
                        </TabsTrigger>
                      )}
                    </TabsList>
                  </div>

                  <div className="space-y-6 p-4 sm:p-6">
                    {!hideModelSelector && models.length > 1 && (
                      <div className="space-y-2">
                        <Label>Model</Label>
                        <select
                          value={selectedModel}
                          onChange={(event) => setSelectedModel(event.target.value)}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        >
                          {models.map((model) => (
                            <option key={model.modelId} value={model.modelId}>
                              {model.modelLabel}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {hook.state.mode === "image" && showImageMode && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Label>Reference Images</Label>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-3.5 w-3.5 cursor-pointer text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent className="max-w-[280px]">
                              The images to use as reference. A maximum of {maxRefs} reference
                              images can be uploaded.
                            </TooltipContent>
                          </Tooltip>
                        </div>

                        <div className="space-y-3">
                          {hook.state.referenceImages.map((image, index) => (
                            <ReferenceImageRow
                              key={image.id}
                              item={image}
                              isFirst={index === 0}
                              onChange={(value: string, file?: File) =>
                                hook.uploads.updateReferenceImage(image.id, value, file)
                              }
                              onRemove={() => hook.uploads.removeReferenceImage(image.id)}
                            />
                          ))}
                        </div>

                        {hook.state.referenceImages.length < maxRefs && (
                          <Button
                            type="button"
                            onClick={hook.uploads.addReferenceImage}
                            variant="outline"
                            className="w-full border-dashed text-primary hover:bg-primary/5 hover:text-primary"
                          >
                            <Plus className="mr-2 h-4 w-4" />
                            Add Item
                          </Button>
                        )}
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label>Prompt</Label>
                      <Textarea
                        value={hook.state.prompt}
                        onChange={(event) => hook.state.setPrompt(event.target.value)}
                        placeholder={
                          hook.state.mode === "text"
                            ? "Describe the image you want to generate..."
                            : "Describe the edit you want to make..."
                        }
                        onClick={() => {
                          if (!isSignedIn) openSignIn();
                        }}
                        className="min-h-[100px] resize-none text-base"
                      />
                    </div>

                    {(showResolution || showAspectRatio) && (
                      <div className="space-y-4">
                        {showResolution && (
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Label>Size</Label>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Info className="h-3.5 w-3.5 cursor-pointer text-muted-foreground" />
                                </TooltipTrigger>
                                <TooltipContent className="max-w-[280px]">
                                  Adjust resolution and aspect ratio.
                                </TooltipContent>
                              </Tooltip>
                            </div>
                            <div className="mt-2 flex flex-wrap gap-2 text-sm">
                              {caps.supportedResolutions.map((res) => {
                                const isSelected = hook.state.resolution === res;
                                return (
                                  <button
                                    key={res}
                                    type="button"
                                    onClick={() => hook.state.setResolution(res)}
                                    className={cn(
                                      "w-16 rounded-md border px-4 py-2 text-center font-medium uppercase transition-all",
                                      isSelected
                                        ? "border-primary bg-primary text-primary-foreground shadow-sm"
                                        : "border-border bg-background text-foreground hover:bg-muted",
                                    )}
                                  >
                                    {res}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {showAspectRatio && (
                          <div className="flex flex-wrap gap-2 pt-2 text-sm">
                            {caps.supportedAspectRatios.map((ratio) => {
                              const isSelected = hook.state.aspectRatio === ratio;
                              return (
                                <button
                                  key={ratio}
                                  type="button"
                                  onClick={() => hook.state.setAspectRatio(ratio)}
                                  className={cn(
                                    "rounded-md border px-3 py-1.5 font-medium transition-all",
                                    isSelected
                                      ? "border-primary bg-primary/5 text-primary shadow-sm"
                                      : "border-border bg-background text-muted-foreground hover:bg-muted",
                                  )}
                                >
                                  <span className="flex items-center gap-1.5">
                                    <div
                                      className={cn(
                                        "rounded-[2px] border-[1.5px] border-current opacity-70",
                                        ratio === "1:1"
                                          ? "h-3 w-3"
                                          : parseInt(ratio.split(":")[0], 10) >
                                              parseInt(ratio.split(":")[1], 10)
                                            ? "h-2.5 w-3.5"
                                            : "h-3.5 w-2.5",
                                      )}
                                    />
                                    {ratio}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}

                    {showOutputFormat && (
                      <div className="space-y-2">
                        <Label>Output Format</Label>
                        <div className="flex flex-wrap gap-2 text-sm">
                          {caps.supportedOutputFormats.map((fmt: OutputFormat) => {
                            const isSelected = hook.state.outputFormat === fmt;
                            return (
                              <button
                                key={fmt}
                                type="button"
                                onClick={() => hook.state.setOutputFormat(fmt)}
                                className={cn(
                                  "rounded-md border px-4 py-2 font-medium uppercase transition-all",
                                  isSelected
                                    ? "border-primary bg-primary text-primary-foreground shadow-sm"
                                    : "border-border bg-background text-foreground hover:bg-muted",
                                )}
                              >
                                {fmt}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="bg-muted/20 p-4 sm:p-6">
                    <div className="mb-3 flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Estimated Cost</span>
                      <div className="flex items-center gap-1 font-medium">
                        <Zap className="h-3 w-3 text-primary" />
                        <span>{hook.computed.creditCost} Credits</span>
                      </div>
                    </div>
                    <Button
                      className="w-full py-6 text-base"
                      size="lg"
                      onClick={() => {
                        if (!isSignedIn) {
                          openSignIn();
                          return;
                        }
                        hook.handleGenerate();
                      }}
                      disabled={hook.ui.isSubmitCooldown || hook.ui.isPreparingRequest}
                    >
                      {hook.ui.isPreparingRequest ? (
                        <div className="flex items-center gap-2">
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
                          Processing...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Upload className="h-5 w-5" />
                          Generate Image
                        </div>
                      )}
                    </Button>
                  </div>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-7">
            <Card className="border border-border bg-card shadow-2xl">
              <CardContent className="flex flex-col p-[26px]">
                <div id="ai-image-preview" className="flex flex-col space-y-4">
                  <ImagePreview playlist={combinedPlaylist} />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </TooltipProvider>
  );
}
