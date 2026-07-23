import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const getUserMock = vi.fn();
const deleteUserMock = vi.fn();

vi.mock("@supabase/supabase-js", () => ({
  createClient: () => ({
    auth: {
      getUser: (...args: unknown[]) => getUserMock(...args),
      admin: {
        deleteUser: (...args: unknown[]) => deleteUserMock(...args),
      },
    },
  }),
}));

import { OPTIONS, POST } from "./route";

const CORS_HEADER_EXPECTATIONS = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "POST, OPTIONS",
  "access-control-allow-headers": "Authorization, Content-Type",
};

function expectCorsHeaders(response: Response) {
  for (const [header, value] of Object.entries(CORS_HEADER_EXPECTATIONS)) {
    expect(response.headers.get(header)).toBe(value);
  }
}

describe("/api/auth/delete-account", () => {
  beforeEach(() => {
    getUserMock.mockReset();
    deleteUserMock.mockReset();
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://example.supabase.co");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "anon-key");
    vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "service-role-key");
  });

  it("OPTIONS returns 204 with CORS headers including Authorization", async () => {
    const response = await OPTIONS();

    expect(response.status).toBe(204);
    expectCorsHeaders(response);
  });

  it("POST success returns CORS headers", async () => {
    getUserMock.mockResolvedValue({
      data: { user: { id: "user-123" } },
      error: null,
    });
    deleteUserMock.mockResolvedValue({ error: null });

    const request = new NextRequest(
      "https://www.themountainpathway.com/api/auth/delete-account",
      {
        method: "POST",
        headers: { Authorization: "Bearer valid-token" },
      }
    );

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({ success: true });
    expectCorsHeaders(response);
    expect(deleteUserMock).toHaveBeenCalledWith("user-123");
  });

  it("POST unauthorized returns CORS headers", async () => {
    const request = new NextRequest(
      "https://www.themountainpathway.com/api/auth/delete-account",
      { method: "POST" }
    );

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body).toEqual({ error: "Unauthorized" });
    expectCorsHeaders(response);
    expect(getUserMock).not.toHaveBeenCalled();
  });

  it("POST getUser failure returns CORS headers", async () => {
    getUserMock.mockResolvedValue({
      data: { user: null },
      error: { message: "Invalid JWT", status: 401, code: "bad_jwt" },
    });

    const request = new NextRequest(
      "https://www.themountainpathway.com/api/auth/delete-account",
      {
        method: "POST",
        headers: { Authorization: "Bearer bad-token" },
      }
    );

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body).toEqual({ error: "Invalid JWT" });
    expectCorsHeaders(response);
    expect(deleteUserMock).not.toHaveBeenCalled();
  });

  it("POST deleteUser failure returns CORS headers", async () => {
    getUserMock.mockResolvedValue({
      data: { user: { id: "user-123" } },
      error: null,
    });
    deleteUserMock.mockResolvedValue({
      error: { message: "Failed to delete account" },
    });

    const request = new NextRequest(
      "https://www.themountainpathway.com/api/auth/delete-account",
      {
        method: "POST",
        headers: { Authorization: "Bearer valid-token" },
      }
    );

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body).toEqual({ error: "Failed to delete account" });
    expectCorsHeaders(response);
  });
});
