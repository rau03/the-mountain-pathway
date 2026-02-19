// Password-recovery redirect: forwards to /auth/callback with next=/reset-password.
// Supabase strips query params from redirect_to, so using a dedicated path
// is the only reliable way to carry the recovery signal through the redirect chain.
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const callbackUrl = new URL("/auth/callback", url.origin);

  url.searchParams.forEach((value, key) => {
    callbackUrl.searchParams.set(key, value);
  });

  callbackUrl.searchParams.set("next", "/reset-password");

  return NextResponse.redirect(callbackUrl.toString());
}
