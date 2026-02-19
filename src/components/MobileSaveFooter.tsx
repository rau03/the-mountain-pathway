"use client";

import { useState } from "react";
import { Session } from "@supabase/supabase-js";
import { ArrowLeft, ArrowRight, User, Save, Coffee } from "lucide-react";
import { useStore } from "@/lib/store/useStore";
import { pathwayData } from "@/lib/pathway-data";
import AuthModal from "./AuthModal";
import SaveJourneyModal from "./SaveJourneyModal";
import { Button } from "./ui/button";
import { saveJourney, updateJourney } from "@/lib/journeyApi";
import { openExternalUrl } from "@/lib/capacitorUtils";

interface MobileSaveFooterProps {
  session: Session | null;
}

export const MobileSaveFooter = ({ session }: MobileSaveFooterProps) => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [quickSaveError, setQuickSaveError] = useState<string | null>(null);

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
        isCompleted: false, // Saving at any point, not necessarily complete
      };

      // Add timeout to prevent infinite loading
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(
            new Error(
              "Save operation timed out. Please check your connection and try again."
            )
          );
        }, 30000); // 30 second timeout
      });

      // Always save as NEW journey when clicking "Save Journey" or "Save As New"
      // The quick-save button handles updates to existing journeys
      const savedJourney = await Promise.race([
        saveJourney(journeyData),
        timeoutPromise,
      ]);

      // Update store with save status and title
      markSaved(savedJourney.id, title);
    } catch (error) {
      throw error; // Let SaveJourneyModal handle the error display
    } finally {
      setSaveLoading(false);
    }
  };

  // Quick save for existing journeys (uses existing title)
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

  // Check if this is an existing journey that can be quick-saved
  const canQuickSave =
    isSaved && savedJourneyId && savedJourneyTitle && isDirty;

  return (
    <>
      <footer className="flex-shrink-0 w-full bg-brand-stone pt-2 pb-2 px-5 border-t border-brand-stone/20">
        {/* Quick Save Error Message */}
        {quickSaveError && (
          <div className="mb-2 text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-2 rounded text-center">
            {quickSaveError}
          </div>
        )}

        {/* Navigation Controls - Grid Layout for True Centering */}
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
          {/* Left Side: Back Button + Quick Save (if applicable) */}
          <div className="flex items-center gap-2">
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

            {/* Quick Save button for existing journeys with changes */}
            {isAuthenticated && canQuickSave && (
              <Button
                onClick={handleQuickSave}
                disabled={saveLoading}
                variant="ghost"
                size="sm"
                className="bg-green-600/80 backdrop-blur-sm text-white font-medium px-2.5 py-1.5 rounded-md border border-green-500/30 hover:bg-green-600 text-xs"
              >
                {saveLoading ? (
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    <span className="hidden sm:inline">Saving...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <Save className="w-3 h-3" />
                    <span className="hidden sm:inline">Save</span>
                  </div>
                )}
              </Button>
            )}
          </div>

          {/* Center: Step Counter + Account Button + Coffee Link */}
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-2">
              <p className="text-xs text-brand-slate/70 font-medium whitespace-nowrap">
                {currentStep === 9 ? (
                  "Complete"
                ) : (
                  <>
                    Step {currentStep + 1} of {pathwayData.length}
                  </>
                )}
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
            <a
              href="https://buymeacoffee.com/themountainpathway"
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                e.preventDefault();
                void openExternalUrl(
                  "https://buymeacoffee.com/themountainpathway"
                );
              }}
              className="inline-flex items-center gap-1.5 text-xs text-brand-slate/50 hover:text-brand-slate/70 transition-colors"
            >
              <Coffee className="w-3.5 h-3.5" />
              <span>Buy me a Coffee</span>
            </a>
          </div>

          {/* Right Side: Save Journey Button + Next Button */}
          <div className="flex items-center gap-2 justify-end">
            {/* Main Save/Login button */}
            {isAuthenticated && (
              <Button
                onClick={handleFooterButtonClick}
                disabled={saveLoading}
                variant="ghost"
                size="sm"
                className="bg-black/10 backdrop-blur-sm text-white font-medium px-2 py-1 rounded-md border border-brand-slate/20 hover:bg-black/20 text-[10px]"
              >
                {isSaved ? "Save As New" : "Save"}
              </Button>
            )}

            {!isAuthenticated && (
              <Button
                onClick={handleFooterButtonClick}
                disabled={saveLoading}
                variant="ghost"
                size="sm"
                className="bg-black/10 backdrop-blur-sm text-white font-medium px-2 py-1 rounded-md border border-brand-slate/20 hover:bg-black/20 text-[10px]"
              >
                Save
              </Button>
            )}

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
