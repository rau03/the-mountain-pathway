const FALLBACK_SITE_URL = "https://themountainpathway.com";

function stripTrailingSlash(url: string): string {
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

/**
 * Returns the base site URL used for auth redirects.
 *
 * In Capacitor/native builds, `window.location.origin` is often `capacitor://localhost`
 * which is not allowlisted in Supabase Redirect URLs. Using a stable HTTPS site URL
 * keeps confirmation emails deliverable and allows the web callback route to deep-link
 * back into the app.
 */
export function getPublicSiteUrl(): string {
  return stripTrailingSlash(process.env.NEXT_PUBLIC_SITE_URL || FALLBACK_SITE_URL);
}

/**
 * Supabase signup/password-recovery redirect target.
 *
 * - Web: uses the current origin.
 * - Native: uses the public HTTPS site + `native=1` so the callback route can deep-link.
 */
export function getSupabaseAuthCallbackRedirectTo(params: {
  isNative: boolean;
  webOrigin?: string;
}): string {
  if (params.isNative) {
    return `${getPublicSiteUrl()}/auth/callback?native=1`;
  }

  if (!params.webOrigin) {
    throw new Error("webOrigin is required when isNative=false");
  }

  return `${stripTrailingSlash(params.webOrigin)}/auth/callback`;
}

