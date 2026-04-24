import { API_CONFIG, handleApiError } from "@/library/services/api-core";

export type TaskStatusPayload = {
  video_url: string;
  status: number;
  status_msg: string;
};

export const buildAuthHeaders = () => {
  const token = localStorage.getItem("access_token");
  const headers: Record<string, string> = {
    "x-appid": API_CONFIG.APP_ID,
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

export const fetchTaskStatus = async (
  url: string,
  headers: Record<string, string>
): Promise<TaskStatusPayload> => {
  const response = await fetch(url, {
    method: "GET",
    headers,
  });

  const result = await handleApiError(response);
  if (result.code !== 200) {
    throw new Error(result.msg || "Task check failed");
  }
  return result.data;
};

export const pollTaskStatus = async (
  fetchStatus: () => Promise<TaskStatusPayload>,
  intervalMs: number = 2000
): Promise<TaskStatusPayload> => {
  return new Promise((resolve, reject) => {
    const poll = async () => {
      try {
        const { status, status_msg, video_url } = await fetchStatus();

        if (status === 1) {
          resolve({ video_url, status, status_msg });
        } else if (status === -1) {
          reject(new Error(status_msg || "Task failed"));
        } else {
          setTimeout(poll, intervalMs);
        }
      } catch (error) {
        reject(error);
      }
    };

    poll();
  });
};
