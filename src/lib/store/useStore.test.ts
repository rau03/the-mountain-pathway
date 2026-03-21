import { beforeEach, describe, expect, it } from "vitest";
import { useStore } from "./useStore";

const baseEntry = {
  id: "entry-1",
  createdAt: "2026-01-01T00:00:00.000Z",
  responses: {},
  completed: false,
};

const resetStoreState = () => {
  useStore.setState({
    currentStep: -1,
    currentEntry: { ...baseEntry, responses: {} },
    entries: [],
    audioEnabled: false,
    currentAudioTrack: "music",
    silenceTimer: 3,
    isTimerActive: false,
    isAnonymous: true,
    isSaved: false,
    savedJourneyId: null,
    savedJourneyTitle: null,
    isDirty: false,
  });
};

describe("useStore core journey transitions", () => {
  beforeEach(() => {
    localStorage.clear();
    resetStoreState();
  });

  it("starts journey at step 0 and marks state dirty", () => {
    useStore.getState().startJourney();

    const state = useStore.getState();
    expect(state.currentStep).toBe(0);
    expect(state.isDirty).toBe(true);
  });

  it("advances and completes entry while preserving summary state", () => {
    const store = useStore.getState();
    store.startJourney();
    store.nextStep();
    store.updateResponse("reflect", "God is guiding me");
    store.completeEntry();

    const state = useStore.getState();
    expect(state.currentStep).toBe(1);
    expect(state.currentEntry.completed).toBe(true);
    expect(state.entries).toHaveLength(1);
    expect(state.entries[0].responses.reflect).toBe("God is guiding me");
  });

  it("moves backward without going below step 0", () => {
    const store = useStore.getState();
    store.setCurrentStep(0);
    store.prevStep();

    expect(useStore.getState().currentStep).toBe(0);
  });

  it("updates response and marks journey dirty", () => {
    useStore.getState().updateResponse("respond", "I will trust and obey");

    const state = useStore.getState();
    expect(state.currentEntry.responses.respond).toBe("I will trust and obey");
    expect(state.isDirty).toBe(true);
  });

  it("resets journey to landing and clears save metadata", () => {
    useStore.setState({
      currentStep: 4,
      isSaved: true,
      savedJourneyId: "journey-1",
      savedJourneyTitle: "My Journey",
      isDirty: false,
      currentEntry: {
        ...baseEntry,
        responses: { reflect: "Old response" },
      },
    });

    useStore.getState().resetJourney();
    const state = useStore.getState();

    expect(state.currentStep).toBe(-1);
    expect(state.currentEntry.responses).toEqual({});
    expect(state.isSaved).toBe(false);
    expect(state.savedJourneyId).toBeNull();
    expect(state.savedJourneyTitle).toBeNull();
    expect(state.isDirty).toBe(true);
  });
});
