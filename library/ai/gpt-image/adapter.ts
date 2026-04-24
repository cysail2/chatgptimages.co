import { PricingCalculator } from "@/library/lib/aimodel/pricing";
import { registerImageAdapter } from "@/library/ai/image-generator/registry";
import type {
  AspectRatio,
  ImageGenAdapter,
  Resolution,
  UnifiedGenParams,
} from "@/library/ai/image-generator/types";
import { gptImageApi } from "./model/api";

const GPT_IMAGE_ASPECT_RATIOS: AspectRatio[] = [
  "1:1",
  "3:2",
  "2:3",
  "3:4",
  "4:3",
  "4:5",
  "5:4",
  "9:16",
  "16:9",
  "21:9",
];

const GPT_IMAGE_RESOLUTIONS: Resolution[] = ["1k", "2k"];

function buildAdapter(opts: {
  modelId: "gpt-image-2";
  modelLabel: string;
  description: string;
}): ImageGenAdapter {
  return {
    modelId: opts.modelId,
    modelLabel: opts.modelLabel,
    description: opts.description,
    taskProvider: "gpt_image",
    capabilities: {
      supportsImageToImage: true,
      supportedAspectRatios: GPT_IMAGE_ASPECT_RATIOS,
      supportedResolutions: GPT_IMAGE_RESOLUTIONS,
      supportedOutputFormats: ["jpeg"],
      maxReferenceImages: 10,
    },
    estimateCreditCost: ({ isSignedIn }) => {
      if (!isSignedIn) return 0;
      return PricingCalculator.getModelConfig(opts.modelId).cost || 6;
    },
    createTask: async (params: UnifiedGenParams) => {
      if (params.mode === "text") {
        const response = await gptImageApi.createTask({
          mode: "text",
          version: opts.modelId,
          params: {
            prompt: params.prompt,
            aspect_ratio: params.aspectRatio,
            quality: "medium",
            resolution: params.resolution === "4k" ? "2k" : params.resolution,
          },
        });
        return { taskId: response.data.task_id };
      }

      const response = await gptImageApi.createTask({
        mode: "image",
        version: opts.modelId,
        params: {
          prompt: params.prompt,
          images: params.referenceImageUrls || [],
          aspect_ratio: params.aspectRatio,
          quality: "medium",
          resolution: params.resolution === "4k" ? "2k" : params.resolution,
        },
      });
      return { taskId: response.data.task_id };
    },
    checkTaskStatus: async (taskId: string) => {
      const result = await gptImageApi.checkTaskStatus(taskId);
      return {
        taskId: result.taskId,
        status: result.status,
        statusMsg: result.statusMsg,
        imageUrl: result.imageUrl,
        imageUrls: result.imageUrls,
        progress: result.progress,
      };
    },
  };
}

export const gptImage2Adapter: ImageGenAdapter = buildAdapter({
  modelId: "gpt-image-2",
  modelLabel: "GPT Image 2.0",
  description: "Text-to-image and image edit generation for GPT Image 2.0",
});

registerImageAdapter(gptImage2Adapter);
