import { API_CONFIG, handleApiError } from "./api-core";

export const uploadApi = {
  upload: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const token = localStorage.getItem("access_token");
    const headers: Record<string, string> = {
      "x-appid": API_CONFIG.APP_ID,
    };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const response = await fetch(
      `${API_CONFIG.API_BASE}/api/common/upload`,
      {
        method: "POST",
        headers,
        body: formData,
      },
    );

    return handleApiError(response);
  },
};
