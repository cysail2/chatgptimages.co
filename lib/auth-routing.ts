export type AuthRouteMode = "sign-in" | "sign-up";

const DEFAULT_REDIRECT_URL = "/";

export const normalizeRedirectUrl = (value?: string | null) => {
  if (!value) return DEFAULT_REDIRECT_URL;
  const trimmed = value.trim();
  if (!trimmed) return DEFAULT_REDIRECT_URL;
  try {
    const decoded = decodeURIComponent(trimmed);
    if (decoded.startsWith("//") || /^https?:\/\//i.test(decoded)) return DEFAULT_REDIRECT_URL;
    if (!decoded.startsWith("/")) return DEFAULT_REDIRECT_URL;
    return decoded;
  } catch {
    if (!trimmed.startsWith("/")) return DEFAULT_REDIRECT_URL;
    return trimmed;
  }
};

export const buildAuthRoute = ({
  mode = "sign-in",
  redirectUrl,
}: {
  mode?: AuthRouteMode;
  redirectUrl?: string | null;
} = {}) => {
  const params = new URLSearchParams();
  const safe = normalizeRedirectUrl(redirectUrl);
  if (safe !== DEFAULT_REDIRECT_URL) params.set("redirect_url", safe);
  const path = mode === "sign-up" ? "/sign-up" : "/sign-in";
  const query = params.toString();
  return query ? `${path}?${query}` : path;
};

export const buildAuthCompleteRoute = (redirectUrl?: string | null) => {
  const params = new URLSearchParams();
  const safe = normalizeRedirectUrl(redirectUrl);
  if (safe !== DEFAULT_REDIRECT_URL) params.set("redirect_url", safe);
  const query = params.toString();
  return query ? `/auth/complete?${query}` : "/auth/complete";
};

export const getCurrentReturnUrl = () => {
  if (typeof window === "undefined") return DEFAULT_REDIRECT_URL;
  return normalizeRedirectUrl(`${window.location.pathname}${window.location.search}${window.location.hash}`);
};
