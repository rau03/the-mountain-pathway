"use client";

import React, { useState, useEffect } from "react";
import { useStore } from "@/lib/store/useStore";
import { LandingPage } from "@/components/LandingPage";
import { JourneyScreen } from "@/components/JourneyScreen";
import { SummaryScreen } from "@/components/SummaryScreen";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AudioToggle } from "@/components/AudioToggle";
import { getBackgroundForStep } from "@/lib/pathway-data";

export default function Home() {
  const { currentStep, setCurrentStep } = useStore();
  const [currentBackground, setCurrentBackground] = useState(
    "/homepage-background.v3.jpg"
  );
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Update background when step changes
  useEffect(() => {
    const newBackground = getBackgroundForStep(currentStep);

    if (newBackground !== currentBackground) {
      setIsTransitioning(true);

      // Preload the new image
      const img = new Image();
      img.onload = () => {
        setCurrentBackground(newBackground);
        setTimeout(() => {
          setIsTransitioning(false);
        }, 150); // Short delay to ensure smooth transition
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

  return (
    <div className="relative min-h-screen">
      {/* The single, persistent AudioToggle */}
      <div className="absolute top-4 right-4 z-50">
        <AudioToggle context={currentStep === -1 ? "landing" : "journey"} />
      </div>

      {currentStep === -1 ? (
        // --- START OF FINAL HOMEPAGE CODE ---
        <div className="relative min-h-screen bg-brand-stone">
          {/* The single, persistent AudioToggle */}
          <div className="absolute top-4 right-4 z-50">
            <AudioToggle context="landing" />
          </div>

          {/* The Crisp Contained Image & Content */}
          <div
            className="relative z-10 min-h-screen"
            style={{
              backgroundImage: `url('/homepage-background.v3.jpg')`,
              backgroundSize: "72vw auto",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
            }}
          >
            <LandingPage />
          </div>
        </div>
      ) : (
        // --- END OF FINAL HOMEPAGE CODE ---
        // --- END OF CORRECT HOMEPAGE CODE ---
        // --- END OF STABLE HOMEPAGE CODE ---
        // --- START OF STABLE SPLIT-SCREEN CODE ---
        <main className="flex flex-row h-screen">
          {/* Visual Pane */}
          <div
            className="w-[45%] h-full bg-cover bg-center transition-all duration-1000"
            style={{ backgroundImage: `url('${currentBackground}')` }}
          />

          {/* Content Pane */}
          <div className="w-[55%] h-full flex flex-col relative p-8 bg-brand-stone">
            {/* The Content Layer */}
            <div className="relative z-10 flex flex-col h-full">
              {isJourneyScreen && <Header />}
              <div className="flex-grow flex items-center justify-center">
                {renderCurrentScreen()}
              </div>
              {isJourneyScreen && <Footer />}
            </div>
          </div>
        </main>
        // --- END OF STABLE SPLIT-SCREEN CODE ---
      )}
    </div>
  );
}
