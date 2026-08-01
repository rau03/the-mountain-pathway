"use client";

import React from "react";
import { Session } from "@supabase/supabase-js";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useStore } from "@/lib/store/useStore";
import { pathwayData } from "@/lib/pathway-data";
import { Button } from "./ui/button";
import BuyMeCoffeeLink from "./BuyMeCoffeeLink";

interface DesktopSaveFooterProps {
  session: Session | null;
  /** Opens the sign-in/create-account modal from the Save button (signed out). */
  onSaveClick: () => void;
  autoSaveLoading: boolean;
  autoSaveError: string | null;
  onRetryAutoSave: () => void;
  /** Triggers an auto-save for the given target step (called after advancing). */
  onNextStepSave: (targetStep: number) => void;
}

export const DesktopSaveFooter = ({
  session,
  onSaveClick,
  autoSaveLoading,
  autoSaveError,
  onRetryAutoSave,
  onNextStepSave,
}: DesktopSaveFooterProps) => {
  const { currentStep, nextStep, prevStep } = useStore();
  const isFirstStep = currentStep === 0;
  const isAuthenticated = !!session;

  const handleNextStep = () => {
    if (currentStep >= 9) {
      nextStep();
      return;
    }

    const targetStep = currentStep + 1;
    nextStep();
    onNextStepSave(targetStep);
  };

  return (
    <>
      {autoSaveError && (
        <button
          type="button"
          onClick={onRetryAutoSave}
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
          <p className="text-sm text-white/80 [text-shadow:0_1px_6px_rgba(0,0,0,0.9)]">
            {currentStep === 9 ? (
              "Complete"
            ) : (
              <>
                Step {currentStep + 1} of {pathwayData.length}
              </>
            )}
          </p>
          <BuyMeCoffeeLink className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white/80 transition-colors [text-shadow:0_1px_6px_rgba(0,0,0,0.9)]" />
        </div>

        <div className="flex items-center justify-end gap-2">
          {!isAuthenticated && (
            <Button
              onClick={onSaveClick}
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
    </>
  );
};
