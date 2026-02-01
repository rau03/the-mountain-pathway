import React from "react";
import Image from "next/image";
import { SimpleAudioPlayer } from "./SimpleAudioPlayer";
import { useStore } from "@/lib/store/useStore";
import { pathwayData } from "@/lib/pathway-data";

export const HeaderMobile: React.FC = () => {
  const { currentStep, resetJourney } = useStore();

  return (
    <header className="flex items-center justify-between gap-3">
      {/* Mobile Logo - Icon Only, Clickable to return home */}
      <button
        onClick={resetJourney}
        className="bg-transparent border-none p-0 cursor-pointer hover:opacity-80 transition-opacity flex-shrink-0"
        aria-label="Return to home"
      >
        <Image
          src="/mountain-icon.svg"
          alt="Mountain Pathway Logo"
          width={24}
          height={24}
          className="w-6 h-6"
          style={{
            filter:
              "brightness(0) saturate(100%) invert(75%) sepia(95%) saturate(1352%) hue-rotate(1deg) brightness(102%) contrast(101%)",
          }}
        />
      </button>

      {/* Mobile Progress: Simple Dots */}
      <div className="flex items-center gap-1.5 flex-grow justify-center">
        {pathwayData.map((step) => {
          const isActive = currentStep === step.stepIndex;
          const isCompleted = currentStep > step.stepIndex;

          return (
            <div
              key={step.stepIndex}
              className={`h-2 rounded-full transition-all duration-300 shadow-sm shadow-black/40 ${
                isActive
                  ? "w-6 bg-brand-gold"
                  : isCompleted
                  ? "w-2 bg-brand-gold/90"
                  : "w-2 bg-white/60"
              }`}
            />
          );
        })}
      </div>

      {/* Mobile Audio Controls */}
      <div className="flex-shrink-0">
        <SimpleAudioPlayer context="journey" />
      </div>
    </header>
  );
};
