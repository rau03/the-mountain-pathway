// src/app/auth/confirm/route.ts
// Handles password reset and email confirmation via token_hash
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function isSafeNextPath(next: string | null): next is string {
  return !!next && next.startsWith("/") && !next.startsWith("//");
}

function isMobileUserAgent(userAgent: string | null): boolean {
  if (!userAgent) return false;
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

function isAllowedRedirectTo(redirectTo: string, requestOrigin: string): boolean {
  // Allow same-origin absolute redirects
  if (redirectTo.startsWith(requestOrigin)) return true;

  // Allow known production origins (covers cases where requestOrigin is different)
  const allowedOrigins = [
    "https://themountainpathway.com",
    "https://www.themountainpathway.com",
  ];
  if (allowedOrigins.some((o) => redirectTo.startsWith(o))) return true;

  return false;
}

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const token_hash = requestUrl.searchParams.get("token_hash");
  const type = requestUrl.searchParams.get("type");
  const next = requestUrl.searchParams.get("next");
  const redirect_to =
    requestUrl.searchParams.get("redirect_to") ||
    requestUrl.searchParams.get("redirectTo") ||
    null;

  const isMobile = isMobileUserAgent(request.headers.get("user-agent"));

  // Determine where we should go after verification.
  // Prefer Supabase's `redirect_to` (if allowlisted), else safe `next`, else home.
  const redirectUrl =
    redirect_to && isAllowedRedirectTo(redirect_to, requestUrl.origin)
      ? redirect_to
      : isSafeNextPath(next)
        ? `${requestUrl.origin}${next}`
        : requestUrl.origin;

  if (token_hash && type) {
    // Create a Supabase client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Verify the OTP token - this returns session data
    const { data, error } = await supabase.auth.verifyOtp({
      token_hash,
      type: type as "recovery" | "email" | "signup" | "magiclink" | "invite",
    });

    if (error || !data.session) {
      console.error("Token verification error:", error);
      return NextResponse.redirect(
        `${requestUrl.origin}/?error=invalid_token`
      );
    }

    // Prefer passing a safe `next` to the app if present in redirectUrl.
    let nextForApp: string | undefined;
    try {
      const redirectAsUrl = new URL(redirectUrl);
      const nextFromRedirect = redirectAsUrl.searchParams.get("next");
      if (isSafeNextPath(nextFromRedirect)) nextForApp = nextFromRedirect;
    } catch {
      // ignore
    }

    // Mobile flow: many email clients open links inside an in-app webview that
    // blocks custom-scheme 302 redirects. Serve an HTML page with a user-tappable
    // "Open the app" button and a best-effort auto-open attempt.
    if (isMobile) {
      const deepLink = new URL("themountainpathway://auth/callback");
      const { access_token, refresh_token } = data.session;
      const hashParams = new URLSearchParams({
        access_token,
        refresh_token,
        type,
      });
      if (nextForApp) hashParams.set("next", nextForApp);

      const deepLinkString = `${deepLink.toString()}#${hashParams.toString()}`;
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
    <p style="margin: 0; color: #666; font-size: 13px;">
      If you’re viewing this inside an email app, try “Open in Safari”, then tap the button again.
    </p>
    <script>
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

    // If redirectUrl indicates native flow, deep-link into the app with tokens.
    // Supabase will often send users to /auth/confirm (this route) first, then
    // redirect_to our /auth/callback. For native we can skip the browser hop.
    let isNative = false;
    try {
      const redirectAsUrl = new URL(redirectUrl);
      isNative = redirectAsUrl.searchParams.get("native") === "1";
    } catch {
      // ignore
    }

    if (isNative) {
      const deepLink = new URL("themountainpathway://auth/callback");
      const { access_token, refresh_token } = data.session;
      const hashParams = new URLSearchParams({
        access_token,
        refresh_token,
        type,
      });
      if (nextForApp) hashParams.set("next", nextForApp);
      return NextResponse.redirect(`${deepLink.toString()}#${hashParams.toString()}`);
    }

    // Create response with redirect
    const response = NextResponse.redirect(redirectUrl);

    // Set the session tokens as cookies so the client can use them
    const { access_token, refresh_token } = data.session;

    // Set cookies that Supabase client-side will recognize
    response.cookies.set("sb-access-token", access_token, {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    response.cookies.set("sb-refresh-token", refresh_token, {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    // Also pass tokens in URL hash for client-side pickup
    const hashParams = new URLSearchParams({
      access_token,
      refresh_token,
      type,
    });

    return NextResponse.redirect(`${redirectUrl}#${hashParams.toString()}`);
  }

  // No token provided, redirect to home
  return NextResponse.redirect(requestUrl.origin);
}
