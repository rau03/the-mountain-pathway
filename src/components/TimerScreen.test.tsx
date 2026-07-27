import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { TimerScreen } from "./TimerScreen";
import { pathwayContent } from "@/lib/pathway-data";
import type { PathwayStep } from "@/lib/pathway-data";

const mockUseIsAndroid = vi.fn(() => false);

vi.mock("@/hooks/useIsAndroid", () => ({
  useIsAndroid: () => mockUseIsAndroid(),
}));

const trailheadStep: PathwayStep = {
  stepIndex: 0,
  stageName: "Trailhead",
  title: "Center Your Heart",
  subtitle: "A Moment of Stillness",
  type: "timer",
  prompt: "Prompt",
  icon: "Heart",
  isInput: false,
  isTimer: true,
  key: "begin",
};

afterEach(() => {
  mockUseIsAndroid.mockReset();
  mockUseIsAndroid.mockReturnValue(false);
});

describe("TimerScreen vertical position (Step 1)", () => {
  it("applies the mt-6 nudge on Android", () => {
    mockUseIsAndroid.mockReturnValue(true);

    const { container } = render(<TimerScreen step={trailheadStep} />);

    expect(container.firstElementChild?.className).toContain("mt-6");
  });

  it("does not apply the nudge on iOS/web", () => {
    mockUseIsAndroid.mockReturnValue(false);

    const { container } = render(<TimerScreen step={trailheadStep} />);

    expect(container.firstElementChild?.className).not.toContain("mt-6");
  });
});

describe("TimerScreen pre-start spacing (Step 1)", () => {
  it("widens the gap above the duration selector on Android (with a desktop-width fallback)", () => {
    mockUseIsAndroid.mockReturnValue(true);

    render(<TimerScreen step={trailheadStep} />);

    const label = screen.getByText(pathwayContent.timerScreen.durationLabel);
    // label -> label's own wrapper div -> preStartControlsClass div
    const preStartControls = label.parentElement?.parentElement;

    expect(preStartControls?.className).toBe("space-y-4 !mt-4 md:!mt-0");
  });

  it("keeps the original tight gap above the duration selector on iOS/web", () => {
    mockUseIsAndroid.mockReturnValue(false);

    render(<TimerScreen step={trailheadStep} />);

    const label = screen.getByText(pathwayContent.timerScreen.durationLabel);
    const preStartControls = label.parentElement?.parentElement;

    expect(preStartControls?.className).toBe("space-y-4 -mt-3");
  });

  it("trims the bottom clearance below Begin Silence on Android (with a desktop-width fallback)", () => {
    mockUseIsAndroid.mockReturnValue(true);

    render(<TimerScreen step={trailheadStep} />);

    const beginButton = screen.getByRole("button", {
      name: pathwayContent.timerScreen.beginButtonText,
    });

    expect(beginButton.parentElement?.className).toBe(
      "flex justify-center w-full mt-2 mb-28 md:mb-40"
    );
  });

  it("keeps the original bottom clearance below Begin Silence on iOS/web", () => {
    mockUseIsAndroid.mockReturnValue(false);

    render(<TimerScreen step={trailheadStep} />);

    const beginButton = screen.getByRole("button", {
      name: pathwayContent.timerScreen.beginButtonText,
    });

    expect(beginButton.parentElement?.className).toBe(
      "flex justify-center w-full mt-2 mb-40"
    );
  });
});
