"use client";

import { useState } from "react";
import { Session } from "@supabase/supabase-js";
import { useStore } from "@/lib/store/useStore";
import { Button } from "./ui/button";
import { SimpleAudioPlayer } from "./SimpleAudioPlayer";
import AuthModal from "./AuthModal";
import SaveJourneyModal from "./SaveJourneyModal";
import { saveJourney, updateJourney } from "@/lib/journeyApi";
import { Upload, Save } from "lucide-react";

interface DesktopAuthSectionProps {
  session: Session | null;
  currentStep: number;
}

export const DesktopAuthSection = ({
  session,
  currentStep,
}: DesktopAuthSectionProps) => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  const {
    currentEntry,
    isSaved,
    savedJourneyId,
    savedJourneyTitle,
    isDirty,
    markSaved,
  } = useStore();

  const isAuthenticated = !!session;

  const handleSaveClick = () => {
    if (isAuthenticated) {
      // When authenticated, show account options (allows logout)
      setShowAuthModal(true);
    } else {
      // When not authenticated, show login modal
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
        isCompleted: false,
      };

      // Always save as NEW journey when clicking "Save Journey" or "Save As New"
      // The quick-save button handles updates to existing journeys
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

  // On landing page, hide login button for non-authenticated users (soft gate handles it)
  // During journey, show login button so users can save mid-journey
  const isLandingPage = currentStep === -1;
  const showAuthButton = isAuthenticated || !isLandingPage;

  return (
    <>
      <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
        {/* Quick Save Button - for existing journeys with changes */}
        {isAuthenticated && canQuickSave && !isLandingPage && (
          <Button
            onClick={handleQuickSave}
            disabled={saveLoading}
            variant="ghost"
            size="lg"
            className="bg-green-600/80 backdrop-blur-sm text-white hover:bg-green-600 px-4 py-4 rounded-md border border-green-500/30 font-medium"
            aria-label="Save changes"
            title="Save changes to journey"
          >
            {saveLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Saving...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Save Changes
              </div>
            )}
          </Button>
        )}

        {/* Save As New Button - for authenticated users during journey */}
        {isAuthenticated && !isLandingPage && (
          <Button
            onClick={() => setShowSaveModal(true)}
            disabled={saveLoading}
            variant="ghost"
            size="lg"
            className="bg-black/10 backdrop-blur-sm text-white hover:bg-black/20 px-4 py-4 rounded-md border border-brand-slate/20 font-medium"
            aria-label="Save as new journey"
            title="Save as new journey"
          >
            {isSaved ? "Save As New" : "Save Journey"}
          </Button>
        )}

        {/* Account Button - Hidden on landing page for non-auth users */}
        {showAuthButton &&
          (isAuthenticated ? (
            // Authenticated: Show "Account" text button
            <Button
              onClick={handleSaveClick}
              disabled={saveLoading}
              variant="ghost"
              size="lg"
              className="bg-black/10 backdrop-blur-sm text-white hover:bg-black/20 px-4 py-4 rounded-md border border-brand-slate/20 font-medium"
              aria-label="Account"
              title="Account settings"
            >
              Account
            </Button>
          ) : (
            // Not authenticated (during journey): Show icon button
            <Button
              onClick={handleSaveClick}
              disabled={saveLoading}
              variant="ghost"
              size="lg"
              className="bg-black/10 backdrop-blur-sm text-white hover:bg-black/20 px-8 py-4 rounded-md border border-brand-slate/20"
              aria-label="Log in to save"
              title="Log in to save"
            >
              <Upload className="h-5 w-5" />
            </Button>
          ))}

        {/* Audio Controls */}
        <SimpleAudioPlayer
          context={currentStep === -1 ? "landing" : "journey"}
        />
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
