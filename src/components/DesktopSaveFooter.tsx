"use client";

import { useState } from "react";
import { Session } from "@supabase/supabase-js";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useStore } from "@/lib/store/useStore";
import { pathwayData } from "@/lib/pathway-data";
import { Button } from "./ui/button";
import AuthModal from "./AuthModal";
import { saveJourney, updateJourney } from "@/lib/journeyApi";
import BuyMeCoffeeLink from "./BuyMeCoffeeLink";

interface DesktopSaveFooterProps {
  session: Session | null;
}

export const DesktopSaveFooter = ({ session }: DesktopSaveFooterProps) => {
  const {
    currentStep,
    nextStep,
    prevStep,
    currentEntry,
    isSaved,
    savedJourneyId,
    savedJourneyTitle,
    markSaved,
  } = useStore();
  const isFirstStep = currentStep === 0;
  const isAuthenticated = !!session;
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [autoSaveLoading, setAutoSaveLoading] = useState(false);
  const [autoSaveError, setAutoSaveError] = useState<string | null>(null);

  const runAutoSave = async (targetStep: number) => {
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
  };

  const handleRetryAutoSave = () => {
    if (!session?.user || autoSaveLoading) return;

    setAutoSaveLoading(true);
    setAutoSaveError(null);

    void runAutoSave(currentStep)
      .then(({ id, title }) => {
        markSaved(id, title);
      })
      .catch(() => {
        setAutoSaveError("Not saved - tap to retry");
      })
      .finally(() => {
        setAutoSaveLoading(false);
      });
  };

  const handleNextStep = () => {
    if (currentStep >= 9) {
      nextStep();
      return;
    }

    const targetStep = currentStep + 1;
    nextStep();

    if (!session?.user || autoSaveLoading) {
      return;
    }

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
  };

  return (
    <>
      {autoSaveError && (
        <button
          type="button"
          onClick={handleRetryAutoSave}
          className="mb-2 w-full text-sm text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-900/20 p-2 rounded text-center hover:underline"
        >
          {autoSaveLoading ? "Retrying save..." : autoSaveError}
        </button>
      )}
      <footer className="w-full grid grid-cols-[1fr_auto_1fr] items-center pt-1 gap-4">
        <div className="flex items-center gap-2">
          <Button
            onClick={prevStep}
            disabled={isFirstStep}
            variant="ghost"
            size="lg"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex flex-col items-center gap-2">
          <p className="text-sm text-brand-slate/70">
            {currentStep === 9 ? (
              "Complete"
            ) : (
              <>
                Step {currentStep + 1} of {pathwayData.length}
              </>
            )}
          </p>
          <BuyMeCoffeeLink className="inline-flex items-center gap-2 text-sm text-brand-slate/50 hover:text-brand-slate/70 transition-colors" />
        </div>

        <div className="flex items-center justify-end gap-2">
          {!isAuthenticated && (
            <Button
              onClick={() => setShowAuthModal(true)}
              variant="ghost"
              size="sm"
              className="bg-black/10 backdrop-blur-sm text-white hover:bg-black/20 px-3 py-1.5 rounded-md border border-brand-slate/20 font-medium text-sm"
            >
              Save
            </Button>
          )}

          <Button onClick={handleNextStep} size="lg" disabled={autoSaveLoading}>
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </footer>

      <AuthModal
        open={showAuthModal}
        onOpenChange={setShowAuthModal}
        session={session}
      />
    </>
  );
};
