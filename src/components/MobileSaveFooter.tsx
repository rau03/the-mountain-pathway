"use client";

import { useState } from "react";
import { Session } from "@supabase/supabase-js";
import { ArrowLeft, ArrowRight, User, Save } from "lucide-react";
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
    savedJourneyTitle,
    isDirty,
    markSaved,
    nextStep,
    prevStep,
  } = useStore();

  const isAuthenticated = !!session;
  const isFirstStep = currentStep === 0;

  const handleFooterButtonClick = () => {
    if (isAuthenticated) {
      // Show save modal on journey screens
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

      // Update store with save status and title
      markSaved(savedJourney.id, title);

      console.log("Journey saved successfully!");
    } catch (error) {
      console.error("Error saving journey:", error);
      throw error; // Let SaveJourneyModal handle the error display
    } finally {
      setSaveLoading(false);
    }
  };

  // Quick save for existing journeys (uses existing title)
  const handleQuickSave = async () => {
    if (!session?.user || !savedJourneyTitle || !savedJourneyId) return;

    setSaveLoading(true);
    try {
      const journeyData = {
        title: savedJourneyTitle,
        currentEntry,
        currentStep,
        isCompleted: false,
      };

      await updateJourney(savedJourneyId, journeyData);
      markSaved(savedJourneyId, savedJourneyTitle);
      console.log("Journey updated successfully!");
    } catch (error) {
      console.error("Error updating journey:", error);
    } finally {
      setSaveLoading(false);
    }
  };

  // Check if this is an existing journey that can be quick-saved
  const canQuickSave =
    isSaved && savedJourneyId && savedJourneyTitle && isDirty;

  return (
    <>
      <footer className="w-full bg-brand-stone py-4 px-4 border-t border-brand-stone/20">
        <div className="flex flex-col gap-2">
          {/* Save Buttons - Centered */}
          <div className="flex justify-center gap-2">
            {/* Quick Save button for existing journeys with changes */}
            {isAuthenticated && canQuickSave && (
              <Button
                onClick={handleQuickSave}
                disabled={saveLoading}
                variant="ghost"
                size="lg"
                className="bg-green-600/80 backdrop-blur-sm text-white font-semibold px-3 py-3 rounded-md border border-green-500/30 hover:bg-green-600"
              >
                {saveLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Save className="w-4 h-4" />
                    Save Changes
                  </div>
                )}
              </Button>
            )}

            {/* Main Save/Login button */}
            <Button
              onClick={handleFooterButtonClick}
              disabled={saveLoading}
              variant="ghost"
              size="lg"
              className="bg-black/10 backdrop-blur-sm text-white font-semibold px-3 py-3 rounded-md border border-brand-slate/20 hover:bg-black/20"
            >
              {isAuthenticated
                ? isSaved
                  ? "Save As New"
                  : "Save Journey"
                : "Log in / Save Journey"}
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

            {/* Center: Step Counter + Account Button */}
            <div className="flex items-center gap-2">
              <p className="text-xs text-brand-slate/70 font-medium">
                Step {currentStep + 1} of {pathwayData.length}
              </p>

              {/* Account Button - Only show when authenticated */}
              {isAuthenticated && (
                <Button
                  onClick={() => setShowAuthModal(true)}
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  aria-label="Account"
                  title="Account settings"
                >
                  <User className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>

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
        initialTitle={isSaved ? "" : ""}
        isUpdate={false}
        isLoading={saveLoading}
      />
    </>
  );
};
