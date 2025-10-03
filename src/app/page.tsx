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

  return (
    <div className="relative min-h-screen">
      {/* The SINGLE, PERSISTENT AudioToggle */}
      <div className="absolute top-4 right-4 z-50">
        <AudioToggle context={currentStep === -1 ? "landing" : "journey"} />
      </div>

      {/* The Conditional Rendering Block */}
      {currentStep === -1 ? (
        // Landing Page - Full Screen Layout
        <div
          className={`min-h-screen grid place-items-center transition-all duration-1000 ${
            isTransitioning ? "opacity-60" : "opacity-100"
          }`}
        >
          {/* Layer 1: The Ghosted Background (Full Screen) */}
          <div className="absolute inset-0 w-full h-full">
            {/* Ghosted Background Layer - Blurred Image */}
            <div
              className="absolute inset-0 bg-cover bg-center blur-xl brightness-125"
              style={{
                backgroundImage: currentBackground
                  ? `url('${currentBackground}')`
                  : "none",
              }}
            />

            {/* Vellum Readability Layer - Brand Stone */}
            <div className="absolute inset-0 bg-brand-stone/80" />
          </div>

          {/* Layer 2: The Crisp Contained Image (Full Screen) */}
          <div
            className="absolute inset-0 w-full h-full bg-no-repeat bg-center"
            style={{
              backgroundImage: currentBackground
                ? `url('${currentBackground}')`
                : "none",
              backgroundSize: "50vw auto",
            }}
          />

          {/* Layer 3: The Edge Blend Vignette */}
          <div className="absolute inset-0 w-full h-full bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(231,229,228,0.4)_85%,#E7E5E4_100%)]" />

          {/* Layer 4: The Content (Centered by the Grid) */}
          <div className="relative z-10">
            <LandingPage />
          </div>
        </div>
      ) : (
        // Journey Mode - Split-Screen Layout
        <div className="min-h-screen overflow-hidden">
          {/* Split-Screen Layout */}
          <main className="flex flex-col md:flex-row h-screen">
            {/* Visual Pane - Left Side */}
            <div
              className={`w-full md:w-[45%] h-1/3 md:h-full bg-cover bg-center transition-all duration-1000 ${
                isTransitioning ? "opacity-60" : "opacity-100"
              }`}
              style={{
                backgroundImage: currentBackground
                  ? `url('${currentBackground}')`
                  : "none",
              }}
            />

            {/* Content Pane - Right Side */}
            <div className="w-full md:w-[55%] h-2/3 md:h-full text-slate-900 flex flex-col relative overflow-hidden">
              {/* Ghosted Image Layer (div #1) */}
              <div
                className="absolute inset-0 blur-2xl brightness-125"
                style={{
                  backgroundImage: currentBackground
                    ? `url('${currentBackground}')`
                    : "none",
                }}
              />

              {/* Vellum Readability Layer (div #2) */}
              <div className="absolute inset-0 bg-brand-stone/80" />

              {/* Content Layer (div #3) */}
              <div className="relative z-10 flex flex-col h-full">
                {/* Header */}
                <div className="flex-shrink-0 p-8 pb-4">
                  <Header />
                </div>

                {/* Main Content */}
                <div className="flex-grow flex items-start justify-center px-8 py-4 overflow-y-auto">
                  {renderCurrentScreen()}
                </div>

                {/* Footer */}
                <div className="flex-shrink-0 p-8 pt-4">
                  <Footer />
                </div>
              </div>
            </div>
          </main>
        </div>
      )}
    </div>
  );
}
