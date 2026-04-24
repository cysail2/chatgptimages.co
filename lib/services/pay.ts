import { API_CONFIG, getHeaders, handleApiError } from "./api-core";

const createSession = async (provider: string, priceId: string) => {
  const response = await fetch(`${API_CONFIG.API_BASE}/api/pay/${provider}`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ price_id: priceId }),
  });
  return handleApiError(response);
};

export const payApi = {
  createStripeSession: (priceId: string) => createSession("stripe", priceId),
  createPaypalSession: (priceId: string) => createSession("paypal", priceId),
  createCreemSession: (priceId: string) => createSession("creem", priceId),
  createSquareSession: (priceId: string) => createSession("square", priceId),
};
