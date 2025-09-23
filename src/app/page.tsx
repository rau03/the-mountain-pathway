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
  const [currentBackground, setCurrentBackground] = useState("");
  const [isTransitioning, setIsTransitioning] = useState(false);

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

  // Reset invalid step to landing page
  useEffect(() => {
    if (currentStep > 9) {
      console.log("Invalid step detected, resetting to landing page");
      setCurrentStep(-1);
    }
  }, [currentStep, setCurrentStep]);

  const renderCurrentScreen = () => {
    if (currentStep === -1) {
      return <LandingPage />;
    }

    if (currentStep === 9) {
      return <SummaryScreen />;
    }

    return <JourneyScreen />;
  };

  // Landing Page - Full Screen Layout
  if (currentStep === -1) {
    return (
      <div className="min-h-screen overflow-hidden">
        {/* Full Background for Landing Page */}
        <div
          className={`absolute inset-0 bg-cover bg-center transition-all duration-1000 ${
            isTransitioning ? "opacity-60" : "opacity-100"
          }`}
          style={{
            backgroundImage: currentBackground
              ? `url('${currentBackground}')`
              : "none",
          }}
        />

        {/* Landing Page Content - Centered */}
        <div className="relative z-10 min-h-screen flex items-center justify-center p-8">
          <div className="w-full max-w-2xl mx-auto bg-slate-50/95 backdrop-blur-sm rounded-3xl p-12 text-slate-900">
            <LandingPage />
          </div>
        </div>

        {/* AudioToggle for Landing Page */}
        <div className="absolute top-4 right-4 z-20">
          <AudioToggle />
        </div>
      </div>
    );
  }

  // Journey Mode - Split-Screen Layout
  return (
    <div className="min-h-screen overflow-hidden">
      {/* Split-Screen Layout */}
      <main className="flex flex-col md:flex-row h-screen">
        {/* Visual Pane - Left Side */}
        <div
          className={`w-full md:w-2/5 h-1/3 md:h-full bg-cover bg-center transition-all duration-1000 ${
            isTransitioning ? "opacity-60" : "opacity-100"
          }`}
          style={{
            backgroundImage: currentBackground
              ? `url('${currentBackground}')`
              : "none",
          }}
        />

        {/* Content Pane - Right Side */}
        <div className="w-full md:w-3/5 h-2/3 md:h-full bg-slate-50 text-slate-900 flex flex-col relative">
          {/* AudioToggle positioned in top-right of Content Pane */}
          <div className="absolute top-4 right-4 z-10">
            <AudioToggle />
          </div>

          {/* Header with Progress Path */}
          <div className="flex-shrink-0 p-8 pb-4">
            <Header />
          </div>

          {/* Main Content Area - Takes available space */}
          <div className="flex-grow flex items-center justify-center px-8 py-4 overflow-y-auto">
            {renderCurrentScreen()}
          </div>

          {/* Footer with Back/Next buttons - Always visible */}
          <div className="flex-shrink-0 p-8 pt-4">
            <Footer />
          </div>
        </div>
      </main>
    </div>
  );
}
