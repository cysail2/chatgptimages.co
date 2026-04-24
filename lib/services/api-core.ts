export const API_CONFIG = {
  API_BASE: process.env.NEXT_PUBLIC_API_BASE || "",
  APP_ID: process.env.NEXT_PUBLIC_APP_ID || "chatgptimages",
};

export const getHeaders = (includeAuth = true): Record<string, string> => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "x-appid": API_CONFIG.APP_ID,
  };

  if (includeAuth && typeof window !== "undefined") {
    const token = localStorage.getItem("access_token");
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
};

export const handleApiError = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`HTTP Error ${response.status}: ${errorData || response.statusText}`);
  }
  const result = await response.json();
  if (result.code && result.code !== 200) {
    throw new Error(`API Business Error ${result.code}: ${result.message || result.msg || "Unknown error"}`);
  }
  return result;
};
