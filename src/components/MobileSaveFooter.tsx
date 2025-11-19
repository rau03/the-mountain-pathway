"use client";

import { useState } from "react";
import { Session } from "@supabase/supabase-js";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useStore } from "@/lib/store/useStore";
import { pathwayData } from "@/lib/pathway-data";
import AuthModal from "./AuthModal";
import SaveJourneyModal from "./SaveJourneyModal";
import { Button } from "./ui/button";
import { saveJourney, updateJourney } from "@/lib/journeyApi";

interface MobileSaveFooterProps {
  session: Session | null;
}

export const MobileSaveFooter = ({ session }: MobileSaveFooterProps) => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  const {
    currentEntry,
    currentStep,
    isSaved,
    savedJourneyId,
    markSaved,
    nextStep,
    prevStep,
  } = useStore();

  const isAuthenticated = !!session;
  const isFirstStep = currentStep === 0;

  const handleFooterButtonClick = () => {
    if (isAuthenticated) {
      setShowSaveModal(true);
    } else {
      setShowAuthModal(true);
    }
  };

  const handleSaveJourney = async (title: string) => {
    if (!session?.user) {
      throw new Error("You must be logged in to save a journey.");
    }

    if (!currentEntry) {
      throw new Error("No journey data to save.");
    }

    setSaveLoading(true);

    try {
      const journeyData = {
        title,
        currentEntry,
        currentStep,
        isCompleted: false, // Saving at any point, not necessarily complete
        metadata: {
          stepsCompleted: currentStep + 1,
          completedAt: new Date().toISOString(),
        },
      };

      let savedJourney;
      if (isSaved && savedJourneyId) {
        // Update existing journey
        savedJourney = await updateJourney(savedJourneyId, journeyData);
      } else {
        // Save new journey
        savedJourney = await saveJourney(journeyData);
      }

      // Update store with save status
      markSaved(savedJourney.id);

      console.log("Journey saved successfully!");
    } catch (error) {
      console.error("Error saving journey:", error);
      throw error; // Let SaveJourneyModal handle the error display
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <>
      <footer className="w-full bg-brand-stone py-4 px-4 border-t border-brand-stone/20">
        <div className="flex flex-col gap-2">
          {/* Save Button - Centered */}
          <div className="flex justify-center">
            <Button
              onClick={handleFooterButtonClick}
              variant="ghost"
              className="bg-black/10 backdrop-blur-sm text-white font-medium px-6 py-2 rounded-md border border-brand-slate/20 hover:bg-black/20"
            >
              {isAuthenticated ? "Save Journey" : "Log in / Save Journey"}
            </Button>
          </div>

          {/* Navigation Controls - Bottom Row */}
          <div className="flex items-center justify-between">
            {/* Back Button */}
            <Button
              onClick={prevStep}
              disabled={isFirstStep}
              variant="ghost"
              size="sm"
              className="h-9 w-9 p-0 disabled:opacity-30"
              aria-label="Previous step"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>

            {/* Step Counter */}
            <p className="text-xs text-brand-slate/70 font-medium">
              Step {currentStep + 1} of {pathwayData.length}
            </p>

            {/* Next Button */}
            <Button
              onClick={nextStep}
              size="sm"
              className="h-9 w-9 p-0"
              aria-label="Next step"
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

      <SaveJourneyModal
        open={showSaveModal}
        onOpenChange={setShowSaveModal}
        onSave={handleSaveJourney}
        isLoading={saveLoading}
      />
    </>
  );
};
