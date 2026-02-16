// src/app/auth/callback/route.ts
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function isSafeNextPath(next: string | null): next is string {
  return !!next && next.startsWith("/") && !next.startsWith("//");
}

function isMobileUserAgent(userAgent: string | null): boolean {
  if (!userAgent) return false;
  // iOS Safari / iOS in-app browsers often include iPhone/iPad; Android includes Android.
  return /iPhone|iPad|iPod|Android/i.test(userAgent);
}

function htmlEscape(s: string): string {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const type = requestUrl.searchParams.get("type");
  const next = requestUrl.searchParams.get("next");
  const native = requestUrl.searchParams.get("native") === "1";

  // Native app flow:
  // Supabase sends the user here (HTTPS allowlisted), then we immediately deep-link back
  // into the app *without* consuming the PKCE code on the server.
  if (code && (native || isMobileUserAgent(request.headers.get("user-agent")))) {
    const deepLink = new URL("themountainpathway://auth/callback");
    deepLink.searchParams.set("code", code);
    if (type) deepLink.searchParams.set("type", type);
    if (isSafeNextPath(next)) deepLink.searchParams.set("next", next);

    // Some iOS versions may block an immediate 302 redirect to a custom scheme.
    // Serve a minimal HTML page that attempts to open the app and provides a fallback link.
    const deepLinkString = deepLink.toString();
    const safeDeepLink = htmlEscape(deepLinkString);
    const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Open The Mountain Pathway</title>
  </head>
  <body style="font-family: -apple-system, system-ui, Segoe UI, Roboto, Helvetica, Arial, sans-serif; padding: 24px;">
    <h1 style="font-size: 18px; margin: 0 0 12px;">Opening the app…</h1>
    <p style="margin: 0 0 16px; color: #444;">If nothing happens, tap the button below.</p>
    <p style="margin: 0 0 16px;">
      <a href="${safeDeepLink}" style="display:inline-block;padding:12px 14px;border-radius:10px;background:#b8860b;color:#111;text-decoration:none;font-weight:600;">
        Open The Mountain Pathway
      </a>
    </p>
    <p style="margin: 0; color: #666; font-size: 13px;">You can close this tab after the app opens.</p>
    <script>
      // Try immediately, then again shortly after to handle browser timing.
      window.location.href = ${JSON.stringify(deepLinkString)};
      setTimeout(function () { window.location.href = ${JSON.stringify(
        deepLinkString
      )}; }, 350);
    </script>
  </body>
</html>`;

    return new NextResponse(html, {
      status: 200,
      headers: {
        "content-type": "text/html; charset=utf-8",
        "cache-control": "no-store",
      },
    });
  }

  if (code) {
    const supabase = createRouteHandlerClient({ cookies });
    await supabase.auth.exchangeCodeForSession(code);
  }

  // Handle custom next parameter (e.g., from password reset)
  // Validate to prevent open redirect attacks
  if (isSafeNextPath(next)) {
    return NextResponse.redirect(`${requestUrl.origin}${next}`);
  }

  // Handle password recovery - redirect to reset password page
  if (type === "recovery") {
    return NextResponse.redirect(`${requestUrl.origin}/reset-password`);
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(requestUrl.origin);
}
