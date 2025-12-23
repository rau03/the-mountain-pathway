// src/app/auth/callback/route.ts
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const type = requestUrl.searchParams.get("type");
  const next = requestUrl.searchParams.get("next");

  if (code) {
    const supabase = createRouteHandlerClient({ cookies });
    await supabase.auth.exchangeCodeForSession(code);
  }

  // Handle custom next parameter (e.g., from password reset)
  if (next) {
    return NextResponse.redirect(`${requestUrl.origin}${next}`);
  }

  // Handle password recovery - redirect to reset password page
  if (type === "recovery") {
    return NextResponse.redirect(`${requestUrl.origin}/reset-password`);
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(requestUrl.origin);
}
