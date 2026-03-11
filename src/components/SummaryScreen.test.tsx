import React from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { SummaryScreen } from "./SummaryScreen";

vi.mock("@/components/SaveJourneyModal", () => ({
  default: () => null,
}));

vi.mock("@/components/AuthModal", () => ({
  default: () => null,
}));

vi.mock("@/lib/journeyApi", () => ({
  saveJourney: vi.fn(),
  updateJourney: vi.fn(),
}));

vi.mock("@/lib/capacitorUtils", () => ({
  openEmail: vi.fn(),
  openExternalUrl: vi.fn(),
}));

vi.mock("@/lib/store/useStore", () => ({
  useStore: () => ({
    currentEntry: {
      responses: { respond: "sample response", thoughts: "sample thoughts" },
    },
    startNewJourney: vi.fn(),
    currentStep: 9,
    isSaved: false,
    savedJourneyId: null,
    savedJourneyTitle: null,
    markSaved: vi.fn(),
  }),
}));

describe("SummaryScreen CTA hierarchy", () => {
  it("renders Save as primary, Start New Journey secondary, and Download/Copy tertiary", () => {
    render(<SummaryScreen session={null} />);

    const saveButton = screen.getByRole("button", { name: /save journey/i });
    const startNewButton = screen.getByRole("button", {
      name: /start new journey/i,
    });
    const downloadButton = screen.getByRole("button", { name: /download pdf/i });
    const copyButton = screen.getByRole("button", { name: /copy text/i });

    expect(saveButton.className).toContain("bg-brand-gold");
    expect(saveButton.className).toContain("font-bold");
    expect(startNewButton.className).toContain("font-medium");
    expect(downloadButton.className).toContain("text-sm");
    expect(copyButton.className).toContain("text-sm");

    expect(
      saveButton.compareDocumentPosition(startNewButton) &
        Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();
    expect(
      startNewButton.compareDocumentPosition(downloadButton) &
        Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();
    expect(
      downloadButton.compareDocumentPosition(copyButton) &
        Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();
  });
});
