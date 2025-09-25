import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AppState, JournalEntry } from "../../types";

const createNewEntry = (): JournalEntry => ({
  id: Date.now().toString(),
  createdAt: new Date().toISOString(),
  responses: {},
  completed: false,
});

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      currentStep: -1, // Start at landing page
      currentEntry: createNewEntry(),
      entries: [],
      audioEnabled: false,
      currentAudioTrack: "music",
      silenceTimer: 3,
      isTimerActive: false,

      setCurrentStep: (step: number) => set({ currentStep: step }),

      updateResponse: (stepKey: string, value: string) =>
        set((state) => ({
          currentEntry: {
            ...state.currentEntry,
            responses: {
              ...state.currentEntry.responses,
              [stepKey]: value,
            },
          },
        })),

      createNewEntry: () =>
        set({
          currentEntry: createNewEntry(),
          currentStep: -1,
        }),

      completeEntry: () =>
        set((state) => {
          const completedEntry = {
            ...state.currentEntry,
            completed: true,
          };
          return {
            entries: [...state.entries, completedEntry],
            // Don't create new entry yet - keep the completed one for summary
            currentEntry: completedEntry,
            // currentStep stays at 9 for summary
          };
        }),

      toggleAudio: () =>
        set((state) => ({ audioEnabled: !state.audioEnabled })),

      setAudioTrack: (track: "music" | "nature") =>
        set({ currentAudioTrack: track }),

      setSilenceTimer: (minutes: number) => set({ silenceTimer: minutes }),

      startTimer: () => set({ isTimerActive: true }),

      stopTimer: () => set({ isTimerActive: false }),

      // Start the journey from landing page (move to first step)
      startJourney: () => set({ currentStep: 0 }),

      // Add a new function to start a fresh journey
      startNewJourney: () =>
        set({
          currentEntry: createNewEntry(),
          currentStep: -1,
        }),
    }),
    {
      name: "mountain-pathway-storage",
    }
  )
);
