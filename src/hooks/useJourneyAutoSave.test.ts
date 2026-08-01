import { describe, expect, it, vi, beforeEach } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";
import { useJourneyAutoSave } from "./useJourneyAutoSave";

const saveJourneyMock = vi.fn();
const updateJourneyMock = vi.fn();
const markSavedMock = vi.fn();

const storeState = {
  currentEntry: { responses: { respond: "Some text" } },
  currentStep: 2,
  isSaved: false,
  savedJourneyId: null as string | null,
  savedJourneyTitle: null as string | null,
  markSaved: markSavedMock,
};

vi.mock("@/lib/store/useStore", () => ({
  useStore: () => storeState,
}));

vi.mock("@/lib/journeyApi", () => ({
  saveJourney: (...args: unknown[]) => saveJourneyMock(...args),
  updateJourney: (...args: unknown[]) => updateJourneyMock(...args),
}));

describe("useJourneyAutoSave", () => {
  beforeEach(() => {
    saveJourneyMock.mockReset();
    updateJourneyMock.mockReset();
    markSavedMock.mockReset();
    storeState.currentEntry = { responses: { respond: "Some text" } };
    storeState.currentStep = 2;
    storeState.isSaved = false;
    storeState.savedJourneyId = null;
    storeState.savedJourneyTitle = null;
  });

  it("creates a journey on first save, then updates it on subsequent saves", async () => {
    const session = { user: { id: "u1" } } as never;
    saveJourneyMock.mockResolvedValue({ id: "journey-1" });
    updateJourneyMock.mockResolvedValue({ id: "journey-1" });

    const { result, rerender } = renderHook(
      ({ session }) => useJourneyAutoSave(session),
      { initialProps: { session } }
    );

    act(() => {
      result.current.triggerAutoSave(3);
    });

    await waitFor(() => {
      expect(saveJourneyMock).toHaveBeenCalledTimes(1);
      expect(markSavedMock).toHaveBeenCalledWith(
        "journey-1",
        expect.stringContaining("Journey")
      );
    });

    storeState.isSaved = true;
    storeState.savedJourneyId = "journey-1";
    storeState.savedJourneyTitle = "Journey 1";
    rerender({ session });

    act(() => {
      result.current.triggerAutoSave(4);
    });

    await waitFor(() => {
      expect(updateJourneyMock).toHaveBeenCalledTimes(1);
      expect(updateJourneyMock).toHaveBeenCalledWith(
        "journey-1",
        expect.objectContaining({ currentStep: 4 })
      );
    });
    expect(saveJourneyMock).toHaveBeenCalledTimes(1);
  });

  it("does not call the API for guests (no session)", async () => {
    const { result } = renderHook(() => useJourneyAutoSave(null));

    act(() => {
      result.current.triggerAutoSave(3);
    });

    expect(saveJourneyMock).not.toHaveBeenCalled();
    expect(updateJourneyMock).not.toHaveBeenCalled();
    expect(result.current.autoSaveLoading).toBe(false);
  });

  it("sets an error message when the save fails", async () => {
    const session = { user: { id: "u1" } } as never;
    saveJourneyMock.mockRejectedValue(new Error("network down"));

    const { result } = renderHook(() => useJourneyAutoSave(session));

    act(() => {
      result.current.triggerAutoSave(3);
    });

    await waitFor(() => {
      expect(result.current.autoSaveError).toBe("Not saved - tap to retry");
    });
    expect(result.current.autoSaveLoading).toBe(false);
    expect(markSavedMock).not.toHaveBeenCalled();
  });

  it("handleRetryAutoSave retries at the current step", async () => {
    const session = { user: { id: "u1" } } as never;
    saveJourneyMock.mockResolvedValue({ id: "journey-1" });
    storeState.currentStep = 5;

    const { result } = renderHook(() => useJourneyAutoSave(session));

    act(() => {
      result.current.handleRetryAutoSave();
    });

    await waitFor(() => {
      expect(saveJourneyMock).toHaveBeenCalledWith(
        expect.objectContaining({ currentStep: 5 })
      );
    });
  });

  it("ignores a new trigger while a save is already in flight", async () => {
    const session = { user: { id: "u1" } } as never;
    let resolveSave: (value: { id: string }) => void = () => {};
    saveJourneyMock.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveSave = resolve;
        })
    );

    const { result } = renderHook(() => useJourneyAutoSave(session));

    act(() => {
      result.current.triggerAutoSave(3);
    });
    expect(result.current.autoSaveLoading).toBe(true);

    act(() => {
      result.current.triggerAutoSave(3);
    });

    expect(saveJourneyMock).toHaveBeenCalledTimes(1);

    await act(async () => {
      resolveSave({ id: "journey-1" });
      await Promise.resolve();
    });
  });
});
