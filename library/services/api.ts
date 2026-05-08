import { API_CONFIG, getHeaders, handleApiError } from "@/library/services/api-core";

const AUTH_REQUEST_TIMEOUT_MS = 15000;
const USER_INFO_TIMEOUT_MS = 10000;

const createTimeoutSignal = (ms: number): AbortSignal | undefined => {
  if (typeof AbortSignal !== "undefined" && typeof AbortSignal.timeout === "function") {
    return AbortSignal.timeout(ms);
  }
  if (typeof AbortController !== "undefined") {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), ms);
    return controller.signal;
  }
  return undefined;
};

// 用户认证相关接口
export const authApi = {
  // 用户登录同步接口
  syncUser: async (userData: {
    uuid: string;
    email: string;
    token: string;
    nickname?: string;
    avatar?: string;
    from_login: string;
    ivcode?: string;
  }) => {
    const appEnv = process.env.APP_ENV;
    const isTestClerkKey = process.env.CLERK_SECRET_KEY?.includes("test");
    const isDevelopment =
      process.env.NODE_ENV === "development" ||
      appEnv === "test" ||
      isTestClerkKey;
    const endpoint = isDevelopment ? "loginAuthCyTest" : "loginAuth";

    const response = await fetch(
      `${API_CONFIG.API_BASE}/api/user/${endpoint}`,
      {
        method: "POST",
        headers: getHeaders(false), // 登录接口不需要Authorization
        body: JSON.stringify(userData),
        signal: createTimeoutSignal(AUTH_REQUEST_TIMEOUT_MS),
      }
    );

    const result = await handleApiError(response);

    // 保存token到localStorage
    if (result.code === 200 && result.data) {
      localStorage.setItem("access_token", result.data.access_token);
      localStorage.setItem("refresh_token", result.data.refresh_token);
      localStorage.setItem("token_expire_at", result.data.expire_at.toString());
    }

    return result;
  },

  // 检查token是否有效
  isTokenValid: (): boolean => {
    const token = localStorage.getItem("access_token");
    const expireAt = localStorage.getItem("token_expire_at");

    if (!token || !expireAt) return false;

    const currentTime = Math.floor(Date.now() / 1000);
    return parseInt(expireAt) > currentTime;
  },

  // 清除token
  clearTokens: () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("token_expire_at");
  },
};

// 用户信息相关接口
export const userApi = {
  // 获取用户信息
  getUserInfo: async () => {
    const response = await fetch(`${API_CONFIG.API_BASE}/api/user/info`, {
      headers: getHeaders(),
      signal: createTimeoutSignal(USER_INFO_TIMEOUT_MS),
    });

    return handleApiError(response);
  },

  // 获取用户作品列表
  getUserOpusList: async (page: number = 1, pageSize: number = 30) => {
    const response = await fetch(
      `${API_CONFIG.API_BASE}/api/user/opus_list?page=${page}&page_size=${pageSize}`,
      {
        method: "GET",
        headers: getHeaders(),
      }
    );

    return handleApiError(response);
  },

  // 获取用户积分记录
  getTimesLog: async (page: number = 1, pageSize: number = 10) => {
    const response = await fetch(
      `${API_CONFIG.API_BASE}/api/user/times_log?page=${page}&page_size=${pageSize}`,
      {
        method: "GET",
        headers: getHeaders(),
      }
    );

    return handleApiError(response);
  },
  getPayLog: async (page: number = 1, pageSize: number = 10) => {
    const response = await fetch(
      `${API_CONFIG.API_BASE}/api/user/pay_log?page=${page}&page_size=${pageSize}`,
      {
        method: "GET",
        headers: getHeaders(),
      }
    );

    return handleApiError(response);
  },
  // 获取推广链接
  getPromotionLink: async () => {
    const response = await fetch(
      `${API_CONFIG.API_BASE}/api/user/promotion_link`,
      {
        method: "GET",
        headers: getHeaders(),
      }
    );

    return handleApiError(response);
  },

  // 获取推广统计数据
  getPromotionStatistics: async () => {
    const response = await fetch(
      `${API_CONFIG.API_BASE}/api/user/promotion_statistics`,
      {
        method: "GET",
        headers: getHeaders(),
      }
    );

    return handleApiError(response);
  },

  // 获取推广收益明细
  getPromotionScoreLog: async (
    page: number = 1,
    pageSize: number = 10,
    status?: number
  ) => {
    let url = `${API_CONFIG.API_BASE}/api/user/promotion_score_log?page=${page}&page_size=${pageSize}`;
    if (status !== undefined) {
      url += `&status=${status}`;
    }

    const response = await fetch(url, {
      method: "GET",
      headers: getHeaders(),
    });

    return handleApiError(response);
  },

  // 获取推广用户列表
  getPromotionUsers: async (page: number = 1, pageSize: number = 10) => {
    const response = await fetch(
      `${API_CONFIG.API_BASE}/api/user/promotion_users?page=${page}&page_size=${pageSize}`,
      {
        method: "GET",
        headers: getHeaders(),
      }
    );

    return handleApiError(response);
  },
  // 删除用户作品
  deleteOpus: async (opusId: number) => {
    const response = await fetch(
      `${API_CONFIG.API_BASE}/api/opus/delete`,
      {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
          opus_id: opusId,
        }),
      }
    );

    return handleApiError(response);
  },

  // 关闭账户
  closeAccount: async () => {
    const response = await fetch(
      `${API_CONFIG.API_BASE}/api/user/close_account`,
      {
        method: "POST",
        headers: getHeaders(),
      }
    );

    return handleApiError(response);
  },
};


// CMS相关接口
export const cmsApi = {
  // 获取友情链接列表（客户端版本）
  getFriendLinkList: async () => {
    const response = await fetch(
      `${API_CONFIG.API_BASE}/api/cms/friendLinkList`,
      {
        method: "GET",
        headers: getHeaders(false), // 不需要认证
      }
    );

    return handleApiError(response);
  },

  // 博客点击统计
  trackBlogClick: async (url: string) => {
    const response = await fetch(
      `${API_CONFIG.API_BASE}/api/cms/statistics?url=${encodeURIComponent(
        url
      )}`,
      {
        method: "GET",
        headers: getHeaders(false), // 不需要认证
      }
    );

    return handleApiError(response);
  },
};

// 通用接口
export const commonApi = {
  // 人脸性别检测
  faceGenderDetection: async (image: File) => {
    const formData = new FormData();
    formData.append("image", image);

    const response = await fetch(
      "https://api.wan-ai.co/api/common/face_gender_detection",
      {
        method: "POST",
        body: formData,
        headers: {
          "x-appid": API_CONFIG.APP_ID,
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        // 不设置 Content-Type，让浏览器自动设置 multipart/form-data 和 boundary
      }
    );

    return handleApiError(response);
  },
};
// 站点配置相关接口
export const websiteApi = {
  // 获取站点配置
  getConfig: async () => {
    const response = await fetch(
      `${API_CONFIG.API_BASE}/api/website/config`,
      {
        method: "GET",
        headers: getHeaders(false), // 不需要认证
      }
    );

    return handleApiError(response);
  },

  // 获取公开作品列表
  getOpenOpusList: async (page: number = 1, pageSize: number = 10) => {
    const response = await fetch(
      `${API_CONFIG.API_BASE}/api/website/open/opus_list?page=${page}&page_size=${pageSize}`,
      {
        method: "GET",
        headers: getHeaders(false), // 不需要认证
      }
    );

    return handleApiError(response);
  },
};

// 重新导出FriendLink类型以保持兼容性
export type { FriendLink } from "./server-api";


// 导出所有API
export const api = {
  auth: authApi,
  user: userApi,
  website: websiteApi,
  cms: cmsApi,
  common: commonApi,
};
