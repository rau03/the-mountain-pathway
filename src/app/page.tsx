"use client";

import React, { useState, useEffect } from "react";
import { useStore } from "@/lib/store/useStore";
import { LandingPage } from "@/components/LandingPage";
import { JourneyScreen } from "@/components/JourneyScreen";
import { SummaryScreen } from "@/components/SummaryScreen";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SimpleAudioPlayer } from "@/components/SimpleAudioPlayer";
import { getBackgroundForStep } from "@/lib/pathway-data";

export default function Home() {
  const { currentStep, setCurrentStep } = useStore();
  const [currentBackground, setCurrentBackground] = useState(
    "/homepage-background.v3.jpg"
  );
  const [isInitialized, setIsInitialized] = useState(false);

  // Update background when step changes
  useEffect(() => {
    const newBackground = getBackgroundForStep(currentStep);

    if (newBackground !== currentBackground) {
      // Preload the new image
      const img = new Image();
      img.onload = () => {
        setCurrentBackground(newBackground);
      };
      img.src = newBackground;
    }
  }, [currentStep, currentBackground]);

  // Initialize background on first load
  useEffect(() => {
    if (!currentBackground) {
      setCurrentBackground(getBackgroundForStep(currentStep));
    }
  }, [currentStep, currentBackground]);

  // Force homepage on first load to prevent jumping
  useEffect(() => {
    if (!isInitialized) {
      setCurrentStep(-1);
      setIsInitialized(true);
    }
  }, [isInitialized, setCurrentStep]);

  // Reset invalid step to landing page
  useEffect(() => {
    if (currentStep > 9) {
      console.log("Invalid step detected, resetting to landing page");
      setCurrentStep(-1);
    }
  }, [currentStep, setCurrentStep]);

  // Toggle body class based on current step
  useEffect(() => {
    if (currentStep === -1) {
      document.body.classList.remove("journey-mode");
    } else {
      document.body.classList.add("journey-mode");
    }
  }, [currentStep]);

  const renderCurrentScreen = () => {
    if (currentStep === -1) {
      return <LandingPage />;
    }

    if (currentStep === 9) {
      return <SummaryScreen />;
    }

    return <JourneyScreen />;
  };

  // This is the stable, desktop-first layout
  const isJourneyScreen = currentStep > -1 && currentStep < 9;

  // Define background position explicitly for Tailwind purge-proof class names
  // Step 0 uses bg-bottom, all other steps use bg-center
  const backgroundPositionClass = currentStep === 0 ? "bg-bottom" : "bg-center";

  return (
    <div className="relative min-h-screen">
      {/* The single, persistent SimpleAudioPlayer */}
      <div className="absolute top-4 right-4 z-50">
        <SimpleAudioPlayer
          context={currentStep === -1 ? "landing" : "journey"}
        />
      </div>

      {currentStep === -1 ? (
        // Landing Page - Full screen image
        <div
          className="relative min-h-screen bg-cover"
          style={{
            backgroundImage: `url('/homepage-background.v3.jpg')`,
            backgroundPosition: "center 65%",
          }}
        >
          {/* Content Layer */}
          <div className="relative z-10">
            {/* The single, persistent SimpleAudioPlayer */}
            <div className="absolute top-4 right-4 z-50">
              <SimpleAudioPlayer context="landing" />
            </div>

            <LandingPage />
          </div>
        </div>
      ) : (
        // Journey Screen - Split-screen layout
        <main className="flex flex-row h-screen overflow-hidden">
          {/* Visual Pane - Left side with background image */}
          <div
            className={`w-[45%] h-screen bg-cover ${backgroundPositionClass} transition-all duration-1000`}
            style={{ backgroundImage: `url('${currentBackground}')` }}
          />

          {/* Content Pane - Right side with content */}
          <div className="w-[55%] h-screen flex flex-col relative bg-brand-stone p-8 overflow-hidden">
            {/* Header */}
            {isJourneyScreen && (
              <div className="flex-shrink-0">
                <Header />
              </div>
            )}

            {/* Main Content - Scrollable */}
            <div className="flex-grow flex flex-col py-6 pr-2 overflow-y-auto scrollbar-thin">
              {renderCurrentScreen()}
            </div>

            {/* Footer */}
            {isJourneyScreen && (
              <div className="flex-shrink-0 pt-6 pb-4">
                <Footer />
              </div>
            )}
          </div>
        </main>
      )}
    </div>
  );
}
