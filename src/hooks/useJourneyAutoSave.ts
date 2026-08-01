import { useCallback, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { useStore } from "@/lib/store/useStore";
import { saveJourney, updateJourney } from "@/lib/journeyApi";

/**
 * Shared auto-save logic for the journey Save footers (mobile + desktop).
 *
 * Centralizes the "create once, then update" save flow plus loading/error
 * state so it isn't duplicated between MobileSaveFooter and
 * DesktopSaveFooter, and so it can also be triggered from a layout-level
 * parent (e.g. immediately after a Save-button-triggered sign in/sign up).
 */
export function useJourneyAutoSave(session: Session | null) {
  const {
    currentEntry,
    currentStep,
    isSaved,
    savedJourneyId,
    savedJourneyTitle,
    markSaved,
  } = useStore();

  const [autoSaveLoading, setAutoSaveLoading] = useState(false);
  const [autoSaveError, setAutoSaveError] = useState<string | null>(null);

  const runAutoSave = useCallback(
    async (targetStep: number) => {
      const fallbackTitle = `Journey ${new Date().toLocaleDateString("en-US")}`;
      const title = savedJourneyTitle || fallbackTitle;
      const journeyData = {
        title,
        currentEntry,
        currentStep: targetStep,
        isCompleted: targetStep >= 9,
      };

      if (isSaved && savedJourneyId) {
        await updateJourney(savedJourneyId, journeyData);
        return { id: savedJourneyId, title };
      }

      const savedJourney = await saveJourney(journeyData);
      return { id: savedJourney.id, title };
    },
    [currentEntry, isSaved, savedJourneyId, savedJourneyTitle]
  );

  const triggerAutoSave = useCallback(
    // `sessionOverride` lets a caller supply a session directly (e.g. the
    // session an auth-success event just handed us) instead of relying on
    // this hook's own `session` argument, which may not have been updated
    // yet if it comes from a separate `onAuthStateChange` subscriber whose
    // callback hasn't run yet — subscriber ordering isn't guaranteed.
    (targetStep: number, sessionOverride?: Session | null) => {
      const activeSession = sessionOverride ?? session;
      if (!activeSession?.user || autoSaveLoading) return;

      setAutoSaveLoading(true);
      setAutoSaveError(null);

      void runAutoSave(targetStep)
        .then(({ id, title }) => {
          markSaved(id, title);
        })
        .catch(() => {
          setAutoSaveError("Not saved - tap to retry");
        })
        .finally(() => {
          setAutoSaveLoading(false);
        });
    },
    [session, autoSaveLoading, runAutoSave, markSaved]
  );

  const handleRetryAutoSave = useCallback(() => {
    triggerAutoSave(currentStep);
  }, [triggerAutoSave, currentStep]);

  return { autoSaveLoading, autoSaveError, triggerAutoSave, handleRetryAutoSave };
}
