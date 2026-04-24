import type { GenerationTaskProvider } from "@/library/providers/TaskCenterProvider";

export type ImageGenMode = "text" | "image";

export type AspectRatio =
  | "1:1"
  | "2:3"
  | "3:2"
  | "3:4"
  | "4:3"
  | "4:5"
  | "5:4"
  | "9:16"
  | "16:9"
  | "21:9";

export type Resolution = "1k" | "2k" | "4k";

export type OutputFormat = "png" | "jpeg";

export interface UnifiedGenParams {
  mode: ImageGenMode;
  prompt: string;
  aspectRatio: AspectRatio;
  resolution: Resolution;
  outputFormat: OutputFormat;
  referenceImageUrls?: string[];
}

export interface UnifiedTaskStatus {
  taskId: string;
  status: number;
  statusMsg?: string;
  imageUrl?: string;
  imageUrls?: string[];
  progress?: string;
}

export interface ImageGenCapabilities {
  supportsImageToImage: boolean;
  supportedAspectRatios: AspectRatio[];
  supportedResolutions: Resolution[];
  supportedOutputFormats: OutputFormat[];
  maxReferenceImages: number;
}

export interface UploadedImage {
  url: string;
}

export interface ImageGenAdapter {
  modelId: string;
  modelLabel: string;
  description?: string;
  taskProvider: GenerationTaskProvider;
  capabilities: ImageGenCapabilities;
  estimateCreditCost(params: { isSignedIn: boolean }): number;
  createTask(
    params: UnifiedGenParams,
  ): Promise<{ taskId: string; immediateImageUrl?: string }>;
  checkTaskStatus(taskId: string): Promise<UnifiedTaskStatus>;
  uploadImage?(file: File): Promise<UploadedImage>;
}
