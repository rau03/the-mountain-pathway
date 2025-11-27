export interface JournalEntry {
  id: string;
  createdAt: string;
  responses: {
    reflect?: string;
    respond?: string;
    thoughts?: string;
    emotions?: string;
    desire?: string;
    pause?: string;
    choices?: string;
    prayer?: string;
  };
  completed: boolean;
}

export interface AppState {
  currentStep: number;
  currentEntry: JournalEntry;
  entries: JournalEntry[];
  audioEnabled: boolean;
  currentAudioTrack: "music" | "nature";
  silenceTimer: number;
  isTimerActive: boolean;
  // Tracking flags for Phase 3 persistence
  isAnonymous: boolean;
  isSaved: boolean;
  savedJourneyId: string | null;
  isDirty: boolean;
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateResponse: (step: string, value: string) => void;
  createNewEntry: () => void;
  completeEntry: () => void;
  startJourney: () => void;
  startNewJourney: () => void;
  resetToHomepage: () => void;
  resetJourney: () => void;
  toggleAudio: () => void;
  setAudioTrack: (track: "music" | "nature") => void;
  setSilenceTimer: (minutes: number) => void;
  startTimer: () => void;
  stopTimer: () => void;
  // New tracking actions
  markSaved: (id: string) => void;
  markDirty: () => void;
  setAnonymous: (flag: boolean) => void;
  clearLocalProgress: () => void;
  // Restore saved journey
  restoreJourneyEntry: (
    entry: JournalEntry,
    step: number,
    journeyId: string
  ) => void;
}

export interface Step {
  id: number;
  key: string;
  title: string;
  subtitle?: string;
  prompt: string;
  isInput: boolean;
  isTimer?: boolean;
  isSummary?: boolean;
}
