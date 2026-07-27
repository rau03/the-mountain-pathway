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
