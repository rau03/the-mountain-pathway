"use client";

import { useState } from "react";
import { Session } from "@supabase/supabase-js";
import { ArrowLeft, ArrowRight, Save, Coffee } from "lucide-react";
import { useStore } from "@/lib/store/useStore";
import { pathwayData } from "@/lib/pathway-data";
import { Button } from "./ui/button";
import AuthModal from "./AuthModal";
import SaveJourneyModal from "./SaveJourneyModal";
import { saveJourney, updateJourney } from "@/lib/journeyApi";

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
    isDirty,
    markSaved,
  } = useStore();
  const isFirstStep = currentStep === 0;
  const isAuthenticated = !!session;
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [quickSaveError, setQuickSaveError] = useState<string | null>(null);

  const canQuickSave =
    isSaved && savedJourneyId && savedJourneyTitle && isDirty;

  const handleSaveJourney = async (title: string) => {
    if (!session?.user) {
      throw new Error("You must be logged in to save a journey.");
    }

    if (!currentEntry) {
      throw new Error("No journey data to save.");
    }

    // Check if journey has any responses
    const hasResponses = Object.values(currentEntry.responses).some(
      (response) => response && response.trim()
    );
    if (!hasResponses) {
      throw new Error("Please add some content to your journey before saving.");
    }

    setSaveLoading(true);

    try {
      const journeyData = {
        title,
        currentEntry,
        currentStep,
        isCompleted: false,
      };

      const savedJourney = await saveJourney(journeyData);
      markSaved(savedJourney.id, title);
    } catch (error) {
      throw error;
    } finally {
      setSaveLoading(false);
    }
  };

  const handleQuickSave = async () => {
    if (!session?.user || !savedJourneyTitle || !savedJourneyId) return;

    setQuickSaveError(null);
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
    } catch (error) {
      setQuickSaveError(
        error instanceof Error
          ? error.message
          : "Failed to save changes. Please try again."
      );
      // Clear error after 5 seconds
      setTimeout(() => setQuickSaveError(null), 5000);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleFooterButtonClick = () => {
    if (isAuthenticated) {
      setShowSaveModal(true);
    } else {
      setShowAuthModal(true);
    }
  };

  return (
    <>
      {quickSaveError && (
        <div className="mb-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-2 rounded text-center">
          {quickSaveError}
        </div>
      )}
      <footer className="w-full flex items-center justify-between pt-1 gap-4">
        {/* Left Side: Back Button + Quick Save */}
        <div className="flex items-center gap-2">
          <Button
            onClick={prevStep}
            disabled={isFirstStep}
            variant="ghost"
            size="lg"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>

          {/* Quick Save button for existing journeys with changes */}
          {isAuthenticated && canQuickSave && (
            <Button
              onClick={handleQuickSave}
              disabled={saveLoading}
              variant="ghost"
              size="lg"
              className="bg-green-600/80 backdrop-blur-sm text-white hover:bg-green-600 px-4 py-2 rounded-md border border-green-500/30 font-medium"
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
        </div>

        {/* Center: Step Counter */}
        <p className="text-sm text-brand-slate/70 flex-shrink-0">
          {currentStep === 9 ? (
            "Complete"
          ) : (
            <>
              Step {currentStep + 1} of {pathwayData.length}
            </>
          )}
        </p>

        {/* Right Side: Save Journey Button + Next Button */}
        <div className="flex items-center gap-2">
          {/* Main Save/Login button */}
          {isAuthenticated && (
            <Button
              onClick={handleFooterButtonClick}
              disabled={saveLoading}
              variant="ghost"
              size="lg"
              className="bg-black/10 backdrop-blur-sm text-white hover:bg-black/20 px-4 py-2 rounded-md border border-brand-slate/20 font-medium"
            >
              {isSaved ? "Save As New" : "Save Journey"}
            </Button>
          )}

          {!isAuthenticated && (
            <Button
              onClick={handleFooterButtonClick}
              disabled={saveLoading}
              variant="ghost"
              size="lg"
              className="bg-black/10 backdrop-blur-sm text-white hover:bg-black/20 px-4 py-2 rounded-md border border-brand-slate/20 font-medium"
            >
              Save Journey
            </Button>
          )}

          <Button onClick={nextStep} size="lg">
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </footer>

      {/* Buy Me a Coffee Link */}
      <div className="text-center pt-3">
        <a
          href="https://buymeacoffee.com/themountainpathway"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-brand-slate/50 hover:text-brand-slate/70 transition-colors"
        >
          <Coffee className="w-4 h-4" />
          <span>Buy me a Coffee</span>
        </a>
      </div>

      <AuthModal
        open={showAuthModal}
        onOpenChange={setShowAuthModal}
        session={session}
      />

      <SaveJourneyModal
        open={showSaveModal}
        onOpenChange={setShowSaveModal}
        onSave={handleSaveJourney}
        initialTitle=""
        isUpdate={false}
        isLoading={saveLoading}
      />
    </>
  );
};
