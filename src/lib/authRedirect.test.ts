import { describe, expect, it, vi } from "vitest";

import { getPublicSiteUrl, getEmailRedirectTo } from "./authRedirect";

describe("authRedirect", () => {
  it("uses NEXT_PUBLIC_SITE_URL when present (strips trailing slash)", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://example.com/");
    expect(getPublicSiteUrl()).toBe("https://example.com");
  });

  it("always returns HTTPS public URL for email redirect", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://themountainpathway.com");
    expect(getEmailRedirectTo()).toBe(
      "https://themountainpathway.com/auth/callback"
    );
  });

  it("falls back to hardcoded site URL when env var is missing", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
    expect(getEmailRedirectTo()).toBe(
      "https://themountainpathway.com/auth/callback"
    );
  });
});
