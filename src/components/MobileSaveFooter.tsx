"use client";

import React, { useState } from "react";
import { Session } from "@supabase/supabase-js";
import { ArrowLeft, ArrowRight, User } from "lucide-react";
import { useStore } from "@/lib/store/useStore";
import { pathwayData } from "@/lib/pathway-data";
import AuthModal from "./AuthModal";
import { Button } from "./ui/button";
import { saveJourney, updateJourney } from "@/lib/journeyApi";
import BuyMeCoffeeLink from "./BuyMeCoffeeLink";

interface MobileSaveFooterProps {
  session: Session | null;
}

export const MobileSaveFooter = ({ session }: MobileSaveFooterProps) => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [autoSaveLoading, setAutoSaveLoading] = useState(false);
  const [autoSaveError, setAutoSaveError] = useState<string | null>(null);

  const {
    currentEntry,
    currentStep,
    isSaved,
    savedJourneyId,
    savedJourneyTitle,
    markSaved,
    nextStep,
    prevStep,
  } = useStore();

  const isAuthenticated = !!session;
  const isFirstStep = currentStep === 0;

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
      <footer className="flex-shrink-0 w-full bg-brand-stone pt-3 pb-[calc(env(safe-area-inset-bottom,0px)+0.75rem)] px-6 border-t border-brand-stone/20">
        {autoSaveError && (
          <button
            type="button"
            onClick={handleRetryAutoSave}
            className="mb-2 w-full text-xs text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-900/20 p-2 rounded text-center hover:underline"
          >
            {autoSaveLoading ? "Retrying save..." : autoSaveError}
          </button>
        )}

        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
          <div className="flex items-center gap-2">
            <Button
              onClick={prevStep}
              disabled={isFirstStep}
              variant="ghost"
              size="sm"
              className="h-9 w-9 p-0 disabled:opacity-30 touch-manipulation"
              aria-label="Previous step"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center justify-center gap-2 min-h-9">
            <p className="text-xs text-brand-slate/70 font-medium whitespace-nowrap">
              {currentStep === 9 ? (
                "Complete"
              ) : (
                <>
                  Step {currentStep + 1} of {pathwayData.length}
                </>
              )}
            </p>

            {isAuthenticated && (
              <Button
                onClick={() => setShowAuthModal(true)}
                variant="ghost"
                size="sm"
                className="h-9 w-9 p-0"
                aria-label="Account"
                title="Account settings"
              >
                <User className="h-4 w-4" />
              </Button>
            )}

            <BuyMeCoffeeLink
              className="hidden md:inline-flex items-center gap-1.5 text-xs text-brand-slate/50 hover:text-brand-slate/70 transition-colors"
              iconClassName="w-3.5 h-3.5"
            />
          </div>

          <div className="flex items-center gap-2 justify-end">
            {!isAuthenticated && (
              <Button
                onClick={() => setShowAuthModal(true)}
                variant="ghost"
                size="sm"
                className="bg-black/10 backdrop-blur-sm text-white font-medium px-1.5 py-0.5 rounded-md border border-brand-slate/20 hover:bg-black/20 text-[9px] min-h-8"
              >
                Save
              </Button>
            )}

            <Button
              onClick={handleNextStep}
              size="sm"
              className="h-9 w-9 p-0 touch-manipulation"
              aria-label="Next step"
              disabled={autoSaveLoading}
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
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
