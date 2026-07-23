import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const UNAUTHORIZED_MESSAGE = "Unauthorized";

// Native Capacitor WebViews (capacitor://localhost on iOS, https://localhost
// on Android) post cross-origin to the production API, so every response
// must carry CORS headers. Authorization is required for the Bearer token.
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Authorization, Content-Type",
};

function getBearerToken(request: NextRequest): string | null {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;
  return authHeader.slice("Bearer ".length).trim() || null;
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function POST(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseAnonKey || !serviceRoleKey) {
    return NextResponse.json(
      { error: "Supabase environment is not configured" },
      { status: 500, headers: CORS_HEADERS }
    );
  }

  const accessToken = getBearerToken(request);
  if (!accessToken) {
    return NextResponse.json(
      { error: UNAUTHORIZED_MESSAGE },
      { status: 401, headers: CORS_HEADERS }
    );
  }

  const authClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  const {
    data: { user },
    error: userError,
  } = await authClient.auth.getUser(accessToken);

  if (userError || !user) {
    const supabaseMessage =
      userError?.message || "Supabase could not verify the provided token";

    console.error("[delete-account] getUser failed", {
      message: supabaseMessage,
      status: userError?.status ?? null,
      code: userError?.code ?? null,
      hasToken: Boolean(accessToken),
      hasUser: Boolean(user),
    });

    return NextResponse.json(
      { error: supabaseMessage },
      { status: 401, headers: CORS_HEADERS }
    );
  }

  const adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  const { error: deleteError } = await adminClient.auth.admin.deleteUser(user.id);

  if (deleteError) {
    return NextResponse.json(
      { error: deleteError.message || "Failed to delete account" },
      { status: 500, headers: CORS_HEADERS }
    );
  }

  return NextResponse.json({ success: true }, { headers: CORS_HEADERS });
}
