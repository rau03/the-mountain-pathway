"use client";

import { useState } from "react";
import { Session } from "@supabase/supabase-js";
import { ArrowLeft, ArrowRight, Save } from "lucide-react";
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

  const canQuickSave =
    isSaved && savedJourneyId && savedJourneyTitle && isDirty;

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
        isCompleted: false,
      };

      const savedJourney = await saveJourney(journeyData);
      markSaved(savedJourney.id, title);
      console.log("Journey saved successfully!");
    } catch (error) {
      console.error("Error saving journey:", error);
      throw error;
    } finally {
      setSaveLoading(false);
    }
  };

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

  const handleFooterButtonClick = () => {
    if (isAuthenticated) {
      setShowSaveModal(true);
    } else {
      setShowAuthModal(true);
    }
  };

  return (
    <>
      <footer className="w-full flex items-center justify-between pt-6 gap-4">
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
          Step {currentStep + 1} of {pathwayData.length}
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
