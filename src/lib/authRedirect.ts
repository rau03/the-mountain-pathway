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
 * Always uses the public HTTPS site URL so that Supabase's redirect-URL
 * allowlist check passes reliably. In Capacitor, `window.location.origin`
 * is `capacitor://localhost` which Supabase rejects.
 *
 * The server-side callback route detects mobile via User-Agent and shows
 * the "Open the app" deep-link handoff page automatically.
 */
export function getEmailRedirectTo(): string {
  return `${getPublicSiteUrl()}/auth/callback`;
}

