import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import { InputScreen } from "./InputScreen";
import type { PathwayStep } from "@/lib/pathway-data";

const mockUseIsAndroid = vi.fn(() => false);

vi.mock("@/hooks/useIsAndroid", () => ({
  useIsAndroid: () => mockUseIsAndroid(),
}));

const makeStep = (overrides: Partial<PathwayStep>): PathwayStep => ({
  stepIndex: 3,
  stageName: "Overlook",
  title: "Unpack Your Thoughts",
  subtitle: "Truths and Misperceptions",
  type: "input",
  prompt: "Prompt",
  icon: "Lightbulb",
  isInput: true,
  key: "thoughts",
  ...overrides,
});

afterEach(() => {
  mockUseIsAndroid.mockReset();
  mockUseIsAndroid.mockReturnValue(false);
});

describe("InputScreen vertical position (Steps 3-8)", () => {
  it("applies the mt-6 nudge on Android for a Steps 3-8 input step", () => {
    mockUseIsAndroid.mockReturnValue(true);

    const { container } = render(<InputScreen step={makeStep({})} />);

    expect(container.firstElementChild?.className).toContain("mt-6");
  });

  it("does not apply the nudge on iOS/web for a Steps 3-8 input step", () => {
    mockUseIsAndroid.mockReturnValue(false);

    const { container } = render(<InputScreen step={makeStep({})} />);

    expect(container.firstElementChild?.className).not.toContain("mt-6");
  });

  it("never applies the nudge to Step 9 (isSummary), even on Android", () => {
    mockUseIsAndroid.mockReturnValue(true);

    const step9 = makeStep({
      stepIndex: 8,
      title: "Commit in Prayer",
      subtitle: "Offer It All to Him",
      icon: "HandHeart",
      key: "prayer",
      isSummary: true,
    });

    const { container } = render(<InputScreen step={step9} />);

    expect(container.firstElementChild?.className).not.toContain("mt-6");
  });
});

describe("InputScreen prompt card sizing (Steps 3-9)", () => {
  it("applies the mobile min-height (reset on desktop) to the prompt card", () => {
    const { container } = render(<InputScreen step={makeStep({})} />);
    const card = container.firstElementChild?.firstElementChild;

    expect(card?.className).toContain("min-h-[390px]");
    expect(card?.className).toContain("md:min-h-0");
  });

  it("applies the same card min-height to Step 9 (isSummary) — no special-casing", () => {
    const step9 = makeStep({
      stepIndex: 8,
      title: "Commit in Prayer",
      subtitle: "Offer It All to Him",
      icon: "HandHeart",
      key: "prayer",
      isSummary: true,
    });

    const { container } = render(<InputScreen step={step9} />);
    const card = container.firstElementChild?.firstElementChild;

    expect(card?.className).toContain("min-h-[390px]");
    expect(card?.className).toContain("md:min-h-0");
  });

  it("keeps the card min-height and the Android mt-6 wrapper nudge independent of each other", () => {
    // Regression guard for commit 904d5dc: the min-height lives on the card
    // (first child), while the mt-6 nudge lives on the wrapper (the
    // rendered root) — confirm both classes coexist without interfering.
    mockUseIsAndroid.mockReturnValue(true);

    const { container } = render(<InputScreen step={makeStep({})} />);
    const wrapper = container.firstElementChild;
    const card = wrapper?.firstElementChild;

    expect(wrapper?.className).toContain("mt-6");
    expect(card?.className).toContain("min-h-[390px]");
  });
});
