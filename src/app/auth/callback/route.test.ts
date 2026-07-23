import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const exchangeCodeForSessionMock = vi.fn();

vi.mock("@supabase/auth-helpers-nextjs", () => ({
  createRouteHandlerClient: () => ({
    auth: {
      exchangeCodeForSession: (...args: unknown[]) =>
        exchangeCodeForSessionMock(...args),
    },
  }),
}));

vi.mock("next/headers", () => ({
  cookies: () => ({}),
}));

import { GET } from "./route";

const ANDROID_UA =
  "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Mobile Safari/537.36";
const IPHONE_UA =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";
const DESKTOP_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36";

describe("/auth/callback", () => {
  beforeEach(() => {
    exchangeCodeForSessionMock.mockReset();
    exchangeCodeForSessionMock.mockResolvedValue({ data: {}, error: null });
  });

  it("browser hit on Android with no native signal redirects straight to /reset-password", async () => {
    const request = new NextRequest(
      "https://www.themountainpathway.com/auth/callback?type=recovery&next=%2Freset-password",
      { headers: { "user-agent": ANDROID_UA } }
    );

    const response = await GET(request);

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(
      "https://www.themountainpathway.com/reset-password"
    );
  });

  it("browser hit on iPhone with a PKCE code exchanges the session and redirects to next (no app handoff)", async () => {
    const request = new NextRequest(
      "https://www.themountainpathway.com/auth/callback?code=abc123&next=%2Freset-password",
      { headers: { "user-agent": IPHONE_UA } }
    );

    const response = await GET(request);

    expect(exchangeCodeForSessionMock).toHaveBeenCalledWith("abc123");
    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(
      "https://www.themountainpathway.com/reset-password"
    );
  });

  it("desktop browser hit with no native signal still redirects normally (unchanged)", async () => {
    const request = new NextRequest(
      "https://www.themountainpathway.com/auth/callback?type=recovery&next=%2Freset-password",
      { headers: { "user-agent": DESKTOP_UA } }
    );

    const response = await GET(request);

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(
      "https://www.themountainpathway.com/reset-password"
    );
  });

  it("request with native=1 serves the app-handoff HTML instead of redirecting, even without a mobile UA", async () => {
    const request = new NextRequest(
      "https://www.themountainpathway.com/auth/callback?type=recovery&next=%2Freset-password&native=1",
      { headers: { "user-agent": DESKTOP_UA } }
    );

    const response = await GET(request);

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("text/html");
    const body = await response.text();
    expect(body).toContain("themountainpathway://auth/callback");
    expect(exchangeCodeForSessionMock).not.toHaveBeenCalled();
  });

  it("native=1 with a PKCE code builds a deep link carrying the code (no server-side exchange)", async () => {
    const request = new NextRequest(
      "https://www.themountainpathway.com/auth/callback?code=abc123&next=%2Freset-password&native=1",
      { headers: { "user-agent": ANDROID_UA } }
    );

    const response = await GET(request);

    expect(response.status).toBe(200);
    const body = await response.text();
    expect(body).toContain("themountainpathway://auth/callback?code=abc123");
    expect(exchangeCodeForSessionMock).not.toHaveBeenCalled();
  });
});
