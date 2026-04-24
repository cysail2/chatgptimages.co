import { API_CONFIG, getHeaders, handleApiError } from "./api-core";

export interface SyncUserPayload {
  uuid: string;
  email: string;
  token: string;
  nickname?: string;
  avatar?: string;
  from_login: string;
  ivcode?: string;
}

export const authApi = {
  syncUser: async (userData: SyncUserPayload) => {
    // Test Clerk keys route to the test login endpoint on the backend.
    const isTest = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.includes("test");
    const endpoint = isTest ? "loginAuthCyTest" : "loginAuth";

    const response = await fetch(`${API_CONFIG.API_BASE}/api/user/${endpoint}`, {
      method: "POST",
      headers: getHeaders(false),
      body: JSON.stringify(userData),
    });

    const result = await handleApiError(response);

    if (result.code === 200 && result.data && typeof window !== "undefined") {
      localStorage.setItem("access_token", result.data.access_token);
      localStorage.setItem("refresh_token", result.data.refresh_token);
      localStorage.setItem("token_expire_at", String(result.data.expire_at));
    }
    return result;
  },

  isTokenValid: (): boolean => {
    if (typeof window === "undefined") return false;
    const token = localStorage.getItem("access_token");
    const expireAt = localStorage.getItem("token_expire_at");
    if (!token || !expireAt) return false;
    return parseInt(expireAt) > Math.floor(Date.now() / 1000);
  },

  clearTokens: () => {
    if (typeof window === "undefined") return;
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("token_expire_at");
  },
};
