export type AuthRouteMode = 'sign-in' | 'sign-up';

const DEFAULT_REDIRECT_URL = '/';

export const normalizeRedirectUrl = (value?: string | null) => {
  if (!value) {
    return DEFAULT_REDIRECT_URL;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return DEFAULT_REDIRECT_URL;
  }

  try {
    const decoded = decodeURIComponent(trimmed);
    if (decoded.startsWith('//') || /^https?:\/\//i.test(decoded)) {
      return DEFAULT_REDIRECT_URL;
    }
    if (!decoded.startsWith('/')) {
      return DEFAULT_REDIRECT_URL;
    }
    return decoded;
  } catch {
    if (!trimmed.startsWith('/')) {
      return DEFAULT_REDIRECT_URL;
    }
    return trimmed;
  }
};

export const buildAuthRoute = ({
  mode = 'sign-in',
  redirectUrl,
  ivcode,
}: {
  mode?: AuthRouteMode;
  redirectUrl?: string | null;
  ivcode?: string | null;
}) => {
  const params = new URLSearchParams();
  const safeRedirectUrl = normalizeRedirectUrl(redirectUrl);

  if (safeRedirectUrl !== DEFAULT_REDIRECT_URL) {
    params.set('redirect_url', safeRedirectUrl);
  }

  if (ivcode) {
    params.set('ivcode', ivcode);
  }

  const path = mode === 'sign-up' ? '/sign-up' : '/sign-in';
  const query = params.toString();
  return query ? `${path}?${query}` : path;
};

export const buildAuthCompleteRoute = (redirectUrl?: string | null, ivcode?: string | null) =>
  buildQueryRoute('/auth/complete', redirectUrl, ivcode);

export const buildSignOutRoute = (redirectUrl?: string | null) =>
  buildQueryRoute('/sign-out', redirectUrl);

export const getCurrentReturnUrl = () => {
  if (typeof window === 'undefined') {
    return DEFAULT_REDIRECT_URL;
  }
  return normalizeRedirectUrl(
    `${window.location.pathname}${window.location.search}${window.location.hash}`
  );
};

export const getIvcodeFromCurrentLocation = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  const searchParams = new URLSearchParams(window.location.search);
  return searchParams.get('ivcode') || searchParams.get('i');
};

const buildQueryRoute = (
  path: string,
  redirectUrl?: string | null,
  ivcode?: string | null
) => {
  const params = new URLSearchParams();
  const safeRedirectUrl = normalizeRedirectUrl(redirectUrl);

  if (safeRedirectUrl !== DEFAULT_REDIRECT_URL) {
    params.set('redirect_url', safeRedirectUrl);
  }

  if (ivcode) {
    params.set('ivcode', ivcode);
  }

  const query = params.toString();
  return query ? `${path}?${query}` : path;
};
