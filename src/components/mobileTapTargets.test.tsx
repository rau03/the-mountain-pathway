import React from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { HeaderMobile } from "./HeaderMobile";
import { FooterMobile } from "./FooterMobile";

const storeState = {
  currentStep: 1,
  resetJourney: vi.fn(),
  nextStep: vi.fn(),
  prevStep: vi.fn(),
};

vi.mock("@/lib/store/useStore", () => ({
  useStore: () => storeState,
}));

vi.mock("./SimpleAudioPlayer", () => ({
  SimpleAudioPlayer: () => <div data-testid="simple-audio-player" />,
}));

vi.mock("@/lib/pathway-data", () => ({
  pathwayData: [{ stepIndex: 0 }, { stepIndex: 1 }, { stepIndex: 2 }],
}));

describe("mobile controls tap targets", () => {
  it("uses a 44px+ home icon target in HeaderMobile", () => {
    render(<HeaderMobile />);

    const homeButton = screen.getByTestId("header-mountain-icon");
    expect(homeButton.className).toContain("w-11");
    expect(homeButton.className).toContain("h-11");
  });

  it("keeps footer previous/next button sizing", () => {
    render(<FooterMobile />);

    const prevButton = screen.getByRole("button", { name: "Previous step" });
    const nextButton = screen.getByRole("button", { name: "Next step" });

    expect(prevButton.className).toContain("h-9");
    expect(prevButton.className).toContain("w-9");
    expect(nextButton.className).toContain("h-9");
    expect(nextButton.className).toContain("w-9");
  });
});
