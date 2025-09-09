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
    if (currentStep > 8) {
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
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
      {/* Blurry Background Layer - Subtle and Soft */}
      <div
        className={`absolute inset-0 bg-cover bg-center bg-no-repeat blur-md transition-opacity duration-700 ease-in-out ${
          isTransitioning ? "opacity-10" : "opacity-20"
        }`}
        style={{
          backgroundImage: currentBackground
            ? `url('${currentBackground}')`
            : "none",
        }}
      />

      {/* Crisp Contained Image Layer - Shows Full Image */}
      <div
        className={`absolute inset-0 bg-contain bg-center bg-no-repeat transition-opacity duration-700 ease-in-out ${
          isTransitioning ? "opacity-60" : "opacity-90"
        }`}
        style={{
          backgroundImage: currentBackground
            ? `url('${currentBackground}')`
            : "none",
        }}
      />

      {/* Subtle overlay for seamless blending */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/30 via-transparent to-slate-900/30" />

      {/* Text readability overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/20 via-slate-800/10 to-slate-900/40" />

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center px-4 py-8">
          {renderCurrentScreen()}
        </main>
        <Footer />
      </div>

      <AudioToggle />
    </div>
  );
}
