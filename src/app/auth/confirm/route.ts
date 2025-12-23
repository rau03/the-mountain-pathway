// src/app/auth/confirm/route.ts
// Handles password reset and email confirmation via token_hash
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const token_hash = requestUrl.searchParams.get("token_hash");
  const type = requestUrl.searchParams.get("type");
  const next = requestUrl.searchParams.get("next") || "/";
  const redirectUrl = `${requestUrl.origin}${next}`;

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
        `${requestUrl.origin}${next}?error=invalid_token`
      );
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
      type: "recovery",
    });

    return NextResponse.redirect(`${redirectUrl}#${hashParams.toString()}`);
  }

  // No token provided, redirect to home
  return NextResponse.redirect(requestUrl.origin);
}
