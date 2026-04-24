import { API_CONFIG, getHeaders, handleApiError } from "./api-core";

// 支付相关接口
export const paymentApi = {
  // 创建PayPal支付会话
  createPaypalSession: async (priceId: string) => {
    const response = await fetch(`${API_CONFIG.API_BASE}/api/pay/paypal`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({
        price_id: priceId,
      }),
    });

    return handleApiError(response);
  },

  createCreemSession: async (priceId: string) => {
    const response = await fetch(`${API_CONFIG.API_BASE}/api/pay/creem`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({
        price_id: priceId,
      }),
    });

    return handleApiError(response);
  },
  createStripeSession: async (priceId: string) => {
    const response = await fetch(`${API_CONFIG.API_BASE}/api/pay/stripe`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({
        price_id: priceId,
      }),
    });

    return handleApiError(response);
  },

  createSquareSession: async (priceId: string) => {
    const response = await fetch(`${API_CONFIG.API_BASE}/api/pay/square`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({
        price_id: priceId,
      }),
    });

    return handleApiError(response);
  },

  // 获取订阅记录
  getSubscriptions: async () => {
    const response = await fetch(
      `${API_CONFIG.API_BASE}/api/pay/subscriptions`,
      {
        method: "GET",
        headers: getHeaders(),
      },
    );

    return handleApiError(response);
  },

  // 取消订阅
  cancelSubscription: async (id: number) => {
    const response = await fetch(
      `${API_CONFIG.API_BASE}/api/pay/subscription/cancel`,
      {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
          id: id,
        }),
      },
    );

    return handleApiError(response);
  },
};
