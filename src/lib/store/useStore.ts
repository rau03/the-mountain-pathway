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
      // Tracking flags for Phase 3 persistence
      isAnonymous: true, // Default to anonymous until session is established
      isSaved: false,
      savedJourneyId: null,
      savedJourneyTitle: null,
      isDirty: false,

      setCurrentStep: (step: number) => set({ currentStep: step }),

      nextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),

      prevStep: () =>
        set((state) => ({ currentStep: Math.max(0, state.currentStep - 1) })),

      updateResponse: (stepKey: string, value: string) =>
        set((state) => ({
          currentEntry: {
            ...state.currentEntry,
            responses: {
              ...state.currentEntry.responses,
              [stepKey]: value,
            },
          },
          isDirty: true, // Mark as dirty when user adds/edits responses
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
      startJourney: () => set({ currentStep: 0, isDirty: true }),

      // Add a new function to start a fresh journey
      startNewJourney: () =>
        set({
          currentEntry: createNewEntry(),
          currentStep: -1,
          isDirty: true, // Mark as dirty when starting new journey
          isSaved: false, // Reset save status
          savedJourneyId: null, // Clear any previous journey ID
          savedJourneyTitle: null, // Clear any previous journey title
        }),

      // Force reset to homepage (for debugging)
      resetToHomepage: () => set({ currentStep: -1 }),

      // Reset journey - returns to landing page and clears current entry
      resetJourney: () =>
        set({
          currentEntry: createNewEntry(),
          currentStep: -1,
          isDirty: true, // Mark as dirty when resetting journey
          isSaved: false, // Reset save status
          savedJourneyId: null, // Clear any previous journey ID
          savedJourneyTitle: null, // Clear any previous journey title
        }),

      // New tracking actions for Phase 3
      markSaved: (id: string, title?: string) =>
        set((state) => ({
          isSaved: true,
          savedJourneyId: id,
          savedJourneyTitle: title ?? state.savedJourneyTitle,
          isDirty: false,
        })),

      markDirty: () => set({ isDirty: true }),

      setAnonymous: (flag: boolean) => set({ isAnonymous: flag }),

      clearLocalProgress: () =>
        set({
          currentStep: -1,
          currentEntry: createNewEntry(),
          entries: [],
          isSaved: false,
          savedJourneyId: null,
          savedJourneyTitle: null,
          isDirty: false,
          // Keep audio preferences
        }),

      // Restore a saved journey entry (for viewing/continuing saved journeys)
      restoreJourneyEntry: (entry, step, journeyId, title) =>
        set({
          currentEntry: entry,
          currentStep: step,
          isSaved: true,
          savedJourneyId: journeyId,
          savedJourneyTitle: title,
          isDirty: false,
        }),
    }),
    {
      name: "mountain-pathway-storage",
      version: 3,
      partialize: (state) => ({
        // Persist journey data and preferences
        currentStep: state.currentStep,
        currentEntry: state.currentEntry,
        entries: state.entries,
        audioEnabled: state.audioEnabled,
        currentAudioTrack: state.currentAudioTrack,
        silenceTimer: state.silenceTimer,
        // Persist tracking flags
        isAnonymous: state.isAnonymous,
        isSaved: state.isSaved,
        savedJourneyId: state.savedJourneyId,
        savedJourneyTitle: state.savedJourneyTitle,
        isDirty: state.isDirty,
        // Exclude: isTimerActive (session-specific)
      }),
      migrate: (persistedState: unknown, version: number) => {
        // Migrate from version 1 to version 2
        if (version < 2) {
          return {
            ...(persistedState as object),
            // Add new tracking flags with defaults
            isAnonymous: true,
            isSaved: false,
            savedJourneyId: null,
            savedJourneyTitle: null,
            isDirty: false,
          };
        }
        // Migrate from version 2 to version 3 - add savedJourneyTitle
        const state = persistedState as Record<string, unknown>;
        if (!("savedJourneyTitle" in state)) {
          return {
            ...state,
            savedJourneyTitle: null,
          };
        }
        return persistedState;
      },
    }
  )
);
