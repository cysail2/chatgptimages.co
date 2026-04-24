import { API_CONFIG, getHeaders, handleApiError } from "@/library/services/api-core";
import type {
  GptImageApiResponse,
  GptImageCheckResponse,
  GptImageCreateTaskParams,
  GptImageTaskStatus,
} from "./api-types";

const buildAuthHeaders = () => getHeaders(true);

const CREATE_TEXT_PATH = "/api/task/wp/gpt-image-2/text-to-image";
const EDIT_PATH = "/api/task/wp/gpt-image-2/edit";
const CHECK_PATH = "/api/task/wp/gpt-image-2/check";

function normalizeImageUrls(
  value?: string[] | Record<string, string>,
): string[] {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter(Boolean);
  return Object.values(value).filter(Boolean);
}

export const gptImageApi = {
  createTask: async (
    params: GptImageCreateTaskParams,
  ): Promise<GptImageApiResponse> => {
    const url = `${API_CONFIG.API_BASE}${
      params.mode === "text" ? CREATE_TEXT_PATH : EDIT_PATH
    }`;
    const body =
      params.mode === "text"
        ? {
            prompt: params.params.prompt,
            aspect_ratio: params.params.aspect_ratio,
            quality: params.params.quality,
            resolution: params.params.resolution,
          }
        : {
            prompt: params.params.prompt,
            images: params.params.images,
            aspect_ratio: params.params.aspect_ratio,
            quality: params.params.quality,
            resolution: params.params.resolution,
          };

    const response = await fetch(url, {
      method: "POST",
      headers: buildAuthHeaders(),
      body: JSON.stringify(body),
    });

    return handleApiError(response);
  },

  checkTaskStatus: async (taskId: string): Promise<GptImageTaskStatus> => {
    const url = `${API_CONFIG.API_BASE}${CHECK_PATH}?task_id=${encodeURIComponent(
      taskId,
    )}`;
    const response = await fetch(url, {
      method: "GET",
      headers: buildAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to check task status: ${response.statusText}`);
    }

    const json: GptImageCheckResponse = await response.json();
    const imageUrls = normalizeImageUrls(json.data.image_urls);
    const imageUrl = json.data.image_url || imageUrls[0];

    return {
      taskId: json.data.task_id,
      status: json.data.status,
      statusMsg: json.data.status_msg,
      progress: json.data.progress,
      imageUrl,
      imageUrls: imageUrl ? Array.from(new Set([imageUrl, ...imageUrls])) : imageUrls,
    };
  },
};
