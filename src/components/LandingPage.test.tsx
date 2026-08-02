import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import { LandingPage } from "./LandingPage";

const mockUseIsAndroid = vi.fn(() => false);

vi.mock("@/hooks/useIsAndroid", () => ({
  useIsAndroid: () => mockUseIsAndroid(),
}));

// LandingPage hides the native splash screen on mount when running inside
// Capacitor; mock it out so these DOM-only tests don't touch native APIs.
vi.mock("@capacitor/core", () => ({
  Capacitor: { isNativePlatform: () => false },
}));
vi.mock("@capacitor/splash-screen", () => ({
  SplashScreen: { hide: vi.fn() },
}));

afterEach(() => {
  mockUseIsAndroid.mockReset();
  mockUseIsAndroid.mockReturnValue(false);
});

describe("LandingPage bottom section vertical position", () => {
  it("applies the pt-4 nudge above the Begin Your Pathway button on Android", () => {
    mockUseIsAndroid.mockReturnValue(true);

    const { container } = render(<LandingPage onBeginClick={() => {}} />);
    const bottomSection = container.querySelector(
      "button"
    )?.parentElement;

    expect(bottomSection?.className).toContain("pt-4");
  });

  it("does not apply the nudge on iOS/web — spacing stays at the existing value", () => {
    mockUseIsAndroid.mockReturnValue(false);

    const { container } = render(<LandingPage onBeginClick={() => {}} />);
    const bottomSection = container.querySelector(
      "button"
    )?.parentElement;

    expect(bottomSection?.className).not.toContain("pt-4");
  });

  it("keeps the md:pt-8 desktop reset in place regardless of platform", () => {
    mockUseIsAndroid.mockReturnValue(true);

    const { container } = render(<LandingPage onBeginClick={() => {}} />);
    const bottomSection = container.querySelector(
      "button"
    )?.parentElement;

    expect(bottomSection?.className).toContain("md:pt-8");
  });
});
