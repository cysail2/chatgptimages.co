// API 基础配置（用环境变量预填，避免 setApiConfig 异步加载前的竞态）
export const API_CONFIG = {
  API_BASE: process.env.NEXT_PUBLIC_API_BASE || "",
  APP_ID: process.env.NEXT_PUBLIC_APP_ID || "",
};

type ApiConfigOverrides = {
  apiBase?: string;
  appId?: string;
};

export const setApiConfig = (overrides: ApiConfigOverrides | null) => {
  if (!overrides) return;
  if (overrides.apiBase?.trim()) {
    API_CONFIG.API_BASE = overrides.apiBase.trim();
  }
  if (overrides.appId?.trim()) {
    API_CONFIG.APP_ID = overrides.appId.trim();
  }
};

// 通用请求头
export const getHeaders = (includeAuth = true) => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "x-appid": API_CONFIG.APP_ID,
  };

  if (includeAuth) {
    const token = localStorage.getItem("access_token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  return headers;
};

// 通用错误处理
export const handleApiError = async (response: Response) => {
  // 首先检查 HTTP 状态码
  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(
      `HTTP Error ${response.status}: ${errorData || response.statusText}`
    );
  }

  // 解析 JSON 响应
  const result = await response.json();

  // 检查业务错误码
  if (result.code && result.code !== 200) {
    throw new Error(
      `API Business Error ${result.code}: ${result.message || result.msg || "Unknown error"
      }`
    );
  }

  return result;
};

const reportCzPostFailure = (payload: {
  url: string;
  reason: string;
  status?: number;
}) => {
  try {
    if (typeof window === "undefined") return;
    const czc = (window as any)?._czc;
    if (!czc || typeof czc.push !== "function") return;

    const label = `${payload.url} | ${payload.reason}${payload.status ? ` | status=${payload.status}` : ""
      }`;
    czc.push(["_trackEvent", "接口异常", "POST请求失败", label, "1", ""]);
    console.log("POST request failed:", {
      url: payload.url,
      reason: payload.reason,
      status: payload.status,
    });
  } catch {
    // ignore
  }
};

const getPostRequestErrorMessage = (err: unknown) => {
  const message = String((err as any)?.message || err);
  const name = String((err as any)?.name || "");
  const isTimeout =
    name === "AbortError" || message.toLowerCase().includes("timeout");
  if (isTimeout) {
    return "Request timed out. Please try again later.";
  }
  return "Network error. Please check your connection and try again.";
};

const parseHttpStatusFromError = (err: unknown) => {
  const message = String((err as any)?.message || err);
  const match = message.match(/HTTP Error\s+(\d+)/i);
  return match ? Number(match[1]) : undefined;
};

const isNetworkError = (err: unknown) => {
  const name = String((err as any)?.name || "");
  const message = String((err as any)?.message || err).toLowerCase();
  return name === "TypeError" || message.includes("failed to fetch");
};


export const postForm = async (
  url: string,
  headers: Record<string, string>,
  body: FormData
) => {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers,
      body,
    });
    return await handleApiError(response);
  } catch (err) {
    reportCzPostFailure({
      url,
      reason: String((err as any)?.message || err).slice(0, 180),
      status: parseHttpStatusFromError(err),
    });
    if (isNetworkError(err)) {
      throw new Error(getPostRequestErrorMessage(err), { cause: err });
    }
    throw err;
  }
};
