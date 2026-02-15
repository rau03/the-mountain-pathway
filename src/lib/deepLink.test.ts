import { describe, expect, it } from "vitest";
import { parseSupabaseAuthRedirect } from "./deepLink";

describe("parseSupabaseAuthRedirect", () => {
  it("parses PKCE code from query params", () => {
    const parsed = parseSupabaseAuthRedirect(
      "themountainpathway://auth/callback?code=abc123&next=%2F"
    );
    expect(parsed).toEqual({ kind: "pkce", code: "abc123", next: "/" });
  });

  it("parses access_token from hash fragment", () => {
    const parsed = parseSupabaseAuthRedirect(
      "themountainpathway://auth/callback#access_token=at&refresh_token=rt&type=recovery"
    );
    expect(parsed.kind).toBe("hash");
    if (parsed.kind !== "hash") throw new Error("expected hash");
    expect(parsed.access_token).toBe("at");
    expect(parsed.refresh_token).toBe("rt");
    expect(parsed.type).toBe("recovery");
  });

  it("returns none when no auth info exists", () => {
    const parsed = parseSupabaseAuthRedirect("themountainpathway://auth/callback");
    expect(parsed).toEqual({ kind: "none" });
  });
});

