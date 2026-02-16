import { describe, expect, it, vi } from "vitest";

import { getPublicSiteUrl, getSupabaseAuthCallbackRedirectTo } from "./authRedirect";

describe("authRedirect", () => {
  it("uses NEXT_PUBLIC_SITE_URL when present (strips trailing slash)", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://example.com/");
    expect(getPublicSiteUrl()).toBe("https://example.com");
  });

  it("builds native callback redirect with native=1", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://themountainpathway.com");
    const url = getSupabaseAuthCallbackRedirectTo({ isNative: true });
    expect(url).toBe("https://themountainpathway.com/auth/callback?native=1");
  });

  it("builds web callback redirect using provided origin (strips trailing slash)", () => {
    const url = getSupabaseAuthCallbackRedirectTo({
      isNative: false,
      webOrigin: "https://www.themountainpathway.com/",
    });
    expect(url).toBe("https://www.themountainpathway.com/auth/callback");
  });
});

