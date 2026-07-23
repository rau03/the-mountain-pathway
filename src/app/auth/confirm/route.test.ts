import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const verifyOtpMock = vi.fn();

vi.mock("@supabase/supabase-js", () => ({
  createClient: () => ({
    auth: {
      verifyOtp: (...args: unknown[]) => verifyOtpMock(...args),
    },
  }),
}));

import { GET } from "./route";

const SESSION = {
  access_token: "access-token-value",
  refresh_token: "refresh-token-value",
};

const ANDROID_UA =
  "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Mobile Safari/537.36";
const DESKTOP_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36";

describe("/auth/confirm", () => {
  beforeEach(() => {
    verifyOtpMock.mockReset();
    verifyOtpMock.mockResolvedValue({
      data: { session: SESSION },
      error: null,
    });
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://example.supabase.co");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "anon-key");
  });

  it("browser hit on Android with no native signal redirects to next with session hash (no app handoff)", async () => {
    const request = new NextRequest(
      "https://www.themountainpathway.com/auth/confirm?token_hash=hash123&type=recovery&next=%2Freset-password",
      { headers: { "user-agent": ANDROID_UA } }
    );

    const response = await GET(request);

    expect(response.status).toBe(307);
    const location = response.headers.get("location") || "";
    expect(
      location.startsWith(
        "https://www.themountainpathway.com/reset-password"
      )
    ).toBe(true);
    expect(location).toContain("access_token=access-token-value");
  });

  it("desktop browser hit with no native signal still redirects normally (unchanged)", async () => {
    const request = new NextRequest(
      "https://www.themountainpathway.com/auth/confirm?token_hash=hash123&type=recovery&next=%2Freset-password",
      { headers: { "user-agent": DESKTOP_UA } }
    );

    const response = await GET(request);

    expect(response.status).toBe(307);
  });

  it("request with native=1 serves the app-handoff HTML instead of redirecting", async () => {
    const request = new NextRequest(
      "https://www.themountainpathway.com/auth/confirm?token_hash=hash123&type=recovery&next=%2Freset-password&native=1",
      { headers: { "user-agent": ANDROID_UA } }
    );

    const response = await GET(request);

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("text/html");
    const body = await response.text();
    expect(body).toContain("themountainpathway://auth/callback");
    expect(body).toContain("access_token=access-token-value");
  });

  it("invalid token still redirects to home with an error, regardless of native signal", async () => {
    verifyOtpMock.mockResolvedValue({
      data: { session: null },
      error: { message: "Token has expired" },
    });

    const request = new NextRequest(
      "https://www.themountainpathway.com/auth/confirm?token_hash=bad&type=recovery&next=%2Freset-password"
    );

    const response = await GET(request);

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(
      "https://www.themountainpathway.com/?error=invalid_token"
    );
  });
});
