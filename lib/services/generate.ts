import { API_CONFIG, getHeaders, handleApiError } from "./api-core";

const BASE = () => `${API_CONFIG.API_BASE}/api/task/wp/gpt-image-2`;

export interface TextToImageParams {
  prompt: string;
  aspect_ratio?: string;
  quality?: string;
  resolution?: string;
}

export interface EditImageParams {
  prompt: string;
  images: string[];
  aspect_ratio?: string;
  quality?: string;
  resolution?: string;
}

export interface TaskStatus {
  status: 0 | 1;
  image_url?: string;
  progress?: number;
}

export const generateApi = {
  textToImage: async (params: TextToImageParams) => {
    const res = await fetch(`${BASE()}/text-to-image`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(params),
    });
    return handleApiError(res);
  },

  editImage: async (params: EditImageParams) => {
    const res = await fetch(`${BASE()}/edit`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(params),
    });
    return handleApiError(res);
  },

  checkTask: async (taskId: string): Promise<{ data?: TaskStatus } & TaskStatus> => {
    const res = await fetch(`${BASE()}/check?task_id=${encodeURIComponent(taskId)}`, {
      headers: getHeaders(),
    });
    return handleApiError(res);
  },
};
