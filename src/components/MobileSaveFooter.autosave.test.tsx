import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MobileSaveFooter } from "./MobileSaveFooter";

const saveJourneyMock = vi.fn();
const updateJourneyMock = vi.fn();
const nextStepMock = vi.fn();
const prevStepMock = vi.fn();
const markSavedMock = vi.fn();

const storeState = {
  currentEntry: { responses: { respond: "Some text" } },
  currentStep: 2,
  isSaved: false,
  savedJourneyId: null as string | null,
  savedJourneyTitle: null as string | null,
  isDirty: true,
  markSaved: markSavedMock,
  nextStep: nextStepMock,
  prevStep: prevStepMock,
};

vi.mock("@/lib/store/useStore", () => ({
  useStore: () => storeState,
}));

vi.mock("@/lib/journeyApi", () => ({
  saveJourney: (...args: unknown[]) => saveJourneyMock(...args),
  updateJourney: (...args: unknown[]) => updateJourneyMock(...args),
}));

vi.mock("@/components/AuthModal", () => ({
  default: () => null,
}));

vi.mock("@/components/SaveJourneyModal", () => ({
  default: () => null,
}));

vi.mock("@/lib/capacitorUtils", () => ({
  openExternalUrl: vi.fn(),
}));

describe("MobileSaveFooter autosave on next step", () => {
  beforeEach(() => {
    saveJourneyMock.mockReset();
    updateJourneyMock.mockReset();
    nextStepMock.mockReset();
    prevStepMock.mockReset();
    markSavedMock.mockReset();

    storeState.currentStep = 2;
    storeState.isSaved = false;
    storeState.savedJourneyId = null;
    storeState.savedJourneyTitle = null;
  });

  it("creates once, then updates on next autosaves", async () => {
    const session = { user: { id: "u1" } } as never;
    saveJourneyMock.mockResolvedValue({ id: "journey-1" });
    updateJourneyMock.mockResolvedValue({ id: "journey-1" });

    const { rerender } = render(<MobileSaveFooter session={session} />);
    fireEvent.click(screen.getByLabelText("Next step"));

    await waitFor(() => {
      expect(nextStepMock).toHaveBeenCalledTimes(1);
      expect(saveJourneyMock).toHaveBeenCalledTimes(1);
      expect(markSavedMock).toHaveBeenCalledWith(
        "journey-1",
        expect.stringContaining("Journey")
      );
    });

    storeState.isSaved = true;
    storeState.savedJourneyId = "journey-1";
    storeState.savedJourneyTitle = "Journey 1";
    rerender(<MobileSaveFooter session={session} />);

    fireEvent.click(screen.getByLabelText("Next step"));

    await waitFor(() => {
      expect(updateJourneyMock).toHaveBeenCalledTimes(1);
      expect(nextStepMock).toHaveBeenCalledTimes(2);
    });
  });

  it("skips autosave silently for guests", async () => {
    render(<MobileSaveFooter session={null} />);
    fireEvent.click(screen.getByLabelText("Next step"));

    await waitFor(() => {
      expect(nextStepMock).toHaveBeenCalledTimes(1);
    });
    expect(saveJourneyMock).not.toHaveBeenCalled();
    expect(updateJourneyMock).not.toHaveBeenCalled();
  });
});
