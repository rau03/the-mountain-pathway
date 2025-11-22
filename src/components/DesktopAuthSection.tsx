"use client";

import { useState } from "react";
import { Session } from "@supabase/supabase-js";
import { useStore } from "@/lib/store/useStore";
import { Button } from "./ui/button";
import { SimpleAudioPlayer } from "./SimpleAudioPlayer";
import AuthModal from "./AuthModal";
import SaveJourneyModal from "./SaveJourneyModal";
import { saveJourney, updateJourney } from "@/lib/journeyApi";
import { Upload } from "lucide-react";

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

  const { currentEntry, isSaved, savedJourneyId, markSaved } = useStore();

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
        metadata: {
          stepsCompleted: currentStep + 1,
          completedAt: new Date().toISOString(),
        },
      };

      let savedJourney;
      if (isSaved && savedJourneyId) {
        savedJourney = await updateJourney(savedJourneyId, journeyData);
      } else {
        savedJourney = await saveJourney(journeyData);
      }

      markSaved(savedJourney.id);
      console.log("Journey saved successfully!");
    } catch (error) {
      console.error("Error saving journey:", error);
      throw error;
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <>
      <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
        {/* Save/Account Button */}
        {isAuthenticated ? (
          // Authenticated: Show "Account" text button
          <Button
            onClick={handleSaveClick}
            disabled={saveLoading}
            variant="ghost"
            size="lg"
            className="bg-black/10 backdrop-blur-sm text-white hover:bg-black/20 px-8 py-4 rounded-md border border-brand-slate/20 font-medium"
            aria-label="Account"
            title="Account settings"
          >
            Account
          </Button>
        ) : (
          // Not authenticated: Show icon button
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
        )}

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
        isLoading={saveLoading}
      />
    </>
  );
};
