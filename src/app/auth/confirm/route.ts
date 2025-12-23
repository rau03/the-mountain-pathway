// src/app/auth/confirm/route.ts
// Handles password reset and email confirmation via token_hash
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const token_hash = requestUrl.searchParams.get("token_hash");
  const type = requestUrl.searchParams.get("type");
  const next = requestUrl.searchParams.get("next") || "/";

  if (token_hash && type) {
    const supabase = createRouteHandlerClient({ cookies });

    // Verify the OTP token
    const { error } = await supabase.auth.verifyOtp({
      token_hash,
      type: type as "recovery" | "email" | "signup" | "magiclink" | "invite",
    });

    if (error) {
      console.error("Token verification error:", error);
      // Redirect to home with error
      return NextResponse.redirect(
        `${requestUrl.origin}${next}?error=invalid_token`
      );
    }

    // Successfully verified, redirect to the next page
    return NextResponse.redirect(`${requestUrl.origin}${next}`);
  }

  // No token provided, redirect to home
  return NextResponse.redirect(requestUrl.origin);
}
