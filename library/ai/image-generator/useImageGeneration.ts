"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { useToast } from "@/library/ui/toast-provider";
import { useTaskCenter, useUserInfo } from "@/library/providers";
import { api } from "@/library/services/api";
import { uploadApi } from "@/library/services/upload";
import { trackCnzzEvent } from "@/library/lib/analytics/cnzz";
import { getImageAdapter } from "./registry";
import type {
  AspectRatio,
  ImageGenMode,
  OutputFormat,
  Resolution,
  UnifiedGenParams,
} from "./types";

type ReferenceImage = {
  id: string;
  value: string;
  file?: File;
  isLoading?: boolean;
};

function pickDefault<T>(supported: T[], preferred: T, fallback: T): T {
  if (supported.includes(preferred)) return preferred;
  return supported[0] ?? fallback;
}

export function useImageGeneration(modelId: string) {
  const adapter = getImageAdapter(modelId);
  const { userInfo, openSignIn } = useUserInfo();
  const isSignedIn = !!userInfo?.uuid;
  const { success, error } = useToast();
  const {
    addTask,
    updateTask,
    replaceTaskId,
    removeTask,
    closeProgressDialog,
    setOpen,
  } = useTaskCenter();

  const caps = adapter?.capabilities;

  const [mode, setMode] = useState<ImageGenMode>("text");
  const [prompt, setPrompt] = useState("");
  const [outputFormat, setOutputFormat] = useState<OutputFormat>(
    pickDefault(caps?.supportedOutputFormats || ["png"], "png", "png"),
  );
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(
    pickDefault(caps?.supportedAspectRatios || ["1:1"], "1:1", "1:1"),
  );
  const [resolution, setResolution] = useState<Resolution>(
    pickDefault(caps?.supportedResolutions || ["1k"], "2k", "1k"),
  );
  const [referenceImages, setReferenceImages] = useState<ReferenceImage[]>([
    { id: Date.now().toString(), value: "" },
  ]);

  const submitLockRef = useRef(false);
  const [isSubmitCooldown, setIsSubmitCooldown] = useState(false);
  const [isPreparingRequest, setIsPreparingRequest] = useState(false);
  const localTaskIdsRef = useRef<Set<string>>(new Set());
  const [showPricingModal, setShowPricingModal] = useState(false);

  const creditCost = useMemo(() => {
    if (!adapter) return 0;
    return adapter.estimateCreditCost({ isSignedIn });
  }, [adapter, isSignedIn]);

  const uploadFile = useCallback(
    async (file: File): Promise<string> => {
      if (adapter?.uploadImage) {
        const result = await adapter.uploadImage(file);
        return result.url;
      }
      const response = await uploadApi.upload(file);
      const url =
        typeof response.data === "string" ? response.data : response.data?.url;
      if (response.code !== 200 || !url) {
        throw new Error(response.msg || "Image upload failed");
      }
      return url;
    },
    [adapter],
  );

  const addReferenceImage = useCallback(() => {
    const max = caps?.maxReferenceImages ?? 0;
    setReferenceImages((prev) => {
      if (prev.length >= max) return prev;
      return [...prev, { id: `${Date.now()}-${Math.random()}`, value: "" }];
    });
  }, [caps?.maxReferenceImages]);

  const updateReferenceImage = useCallback(
    async (id: string, value: string, file?: File) => {
      setReferenceImages((prev) =>
        prev.map((img) =>
          img.id === id ? { ...img, value, file, isLoading: !!file } : img,
        ),
      );
      if (!file) return;
      try {
        const url = await uploadFile(file);
        setReferenceImages((prev) =>
          prev.map((img) =>
            img.id === id ? { ...img, value: url, isLoading: false } : img,
          ),
        );
      } catch (err) {
        error(`Image upload failed: ${(err as Error).message}`);
        setReferenceImages((prev) =>
          prev.map((img) =>
            img.id === id ? { ...img, isLoading: false } : img,
          ),
        );
      }
    },
    [error, uploadFile],
  );

  const removeReferenceImage = useCallback((id: string) => {
    setReferenceImages((prev) => prev.filter((img) => img.id !== id));
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!adapter) {
      error(`Unknown image model: ${modelId}`);
      return;
    }
    if (submitLockRef.current) return;

    trackCnzzEvent({
      category: "User Action",
      action: "Click Generate Button",
      label: `/${modelId}`,
    });

    if (!isSignedIn) {
      error("Please sign in to generate images");
      return;
    }
    if (!prompt.trim()) {
      error("Please enter a prompt");
      return;
    }

    const validImages = referenceImages.filter(
      (img) => img.value.trim() !== "" || img.file,
    );
    if (mode === "image") {
      if (!adapter.capabilities.supportsImageToImage) {
        error("This model does not support image-to-image");
        return;
      }
      if (validImages.length === 0) {
        error("Please provide at least one reference image URL or file");
        return;
      }
    }

    submitLockRef.current = true;
    setIsSubmitCooldown(true);
    setIsPreparingRequest(true);
    const startedAt = Date.now();

    const tempTaskId = `pending-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}`;
    localTaskIdsRef.current.add(tempTaskId);

    addTask(
      {
        taskId: tempTaskId,
        provider: adapter.taskProvider,
        modelLabel: adapter.modelLabel,
        prompt: prompt.trim(),
        createdAt: Date.now(),
        isLocalPending: true,
      },
      { open: true },
    );
    updateTask(tempTaskId, { statusMsg: "Submitting request..." });
    setOpen(true);

    try {
      const userInfoData = await api.user.getUserInfo();
      const totalCredits =
        userInfoData.data.free_limit + userInfoData.data.remaining_limit;

      if (totalCredits < creditCost) {
        setShowPricingModal(true);
        setIsPreparingRequest(false);
        removeTask(tempTaskId);
        closeProgressDialog();
        return;
      }

      let referenceUrls: string[] = [];
      if (mode === "image") {
        updateTask(tempTaskId, { statusMsg: "Processing images..." });
        referenceUrls = await Promise.all(
          validImages.map(async (img) => {
            if (img.file) {
              return uploadFile(img.file);
            }
            if (!img.value.startsWith("http")) {
              throw new Error(`Invalid URL: ${img.value}`);
            }
            return img.value;
          }),
        );
        updateTask(tempTaskId, { statusMsg: "Generating..." });
      }

      const params: UnifiedGenParams = {
        mode,
        prompt: prompt.trim(),
        aspectRatio,
        resolution,
        outputFormat,
        referenceImageUrls: mode === "image" ? referenceUrls : undefined,
      };

      const { taskId, immediateImageUrl } = await adapter.createTask(params);

      localTaskIdsRef.current.add(taskId);
      localTaskIdsRef.current.delete(tempTaskId);
      replaceTaskId(tempTaskId, {
        taskId,
        provider: adapter.taskProvider,
        modelLabel: adapter.modelLabel,
        prompt: prompt.trim(),
      });

      if (immediateImageUrl) {
        updateTask(taskId, {
          status: "success",
          statusMsg: "Completed",
          imageUrl: immediateImageUrl,
          imageUrls: [immediateImageUrl],
        });
      }

      setIsPreparingRequest(false);
      success("Task submitted. Track progress in Task Center.");
    } catch (err) {
      setIsPreparingRequest(false);
      const message =
        err instanceof Error ? err.message : "Network error or server issue.";
      updateTask(tempTaskId, { status: "failed", statusMsg: message });
      setOpen(true);
      error(message);
    } finally {
      setIsPreparingRequest(false);
      const elapsed = Date.now() - startedAt;
      const remain = Math.max(0, 2000 - elapsed);
      window.setTimeout(() => {
        submitLockRef.current = false;
        setIsSubmitCooldown(false);
      }, remain);
    }
  }, [
    adapter,
    modelId,
    isSignedIn,
    prompt,
    referenceImages,
    mode,
    aspectRatio,
    resolution,
    outputFormat,
    addTask,
    updateTask,
    replaceTaskId,
    removeTask,
    closeProgressDialog,
    setOpen,
    creditCost,
    uploadFile,
    success,
    error,
  ]);

  return {
    adapter,
    state: {
      mode,
      setMode,
      prompt,
      setPrompt,
      outputFormat,
      setOutputFormat,
      aspectRatio,
      setAspectRatio,
      resolution,
      setResolution,
      referenceImages,
    },
    uploads: {
      addReferenceImage,
      updateReferenceImage,
      removeReferenceImage,
    },
    computed: {
      creditCost,
      localTaskIdsRef,
    },
    ui: {
      showPricingModal,
      setShowPricingModal,
      isSubmitCooldown,
      isPreparingRequest,
    },
    handleGenerate,
    openSignIn,
  };
}
