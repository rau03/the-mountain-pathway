export type ParsedAuthRedirect =
  | {
      kind: "pkce";
      code: string;
      next?: string;
    }
  | {
      kind: "hash";
      access_token: string;
      refresh_token?: string;
      type?: string;
      next?: string;
    }
  | {
      kind: "none";
    };

function safeParseUrl(urlString: string): URL | null {
  try {
    return new URL(urlString);
  } catch {
    return null;
  }
}

/**
 * Parse Supabase auth redirects from either:
 * - PKCE query param: ?code=...
 * - Legacy/hash tokens: #access_token=...&refresh_token=...&type=...
 *
 * Works for https URLs and custom-scheme deep links.
 */
export function parseSupabaseAuthRedirect(urlString: string): ParsedAuthRedirect {
  const url = safeParseUrl(urlString);
  if (!url) return { kind: "none" };

  const next = url.searchParams.get("next") || undefined;
  const code = url.searchParams.get("code");
  if (code) {
    return { kind: "pkce", code, next };
  }

  // Some providers put params in the hash fragment
  // Example: #access_token=...&refresh_token=...&type=recovery
  const hash = url.hash?.startsWith("#") ? url.hash.slice(1) : url.hash;
  if (hash) {
    const hashParams = new URLSearchParams(hash);
    const access_token = hashParams.get("access_token");
    const refresh_token = hashParams.get("refresh_token") || undefined;
    const type = hashParams.get("type") || undefined;
    const hashNext = hashParams.get("next") || undefined;
    if (access_token) {
      return {
        kind: "hash",
        access_token,
        refresh_token,
        type,
        next: next ?? hashNext,
      };
    }
  }

  return { kind: "none" };
}

