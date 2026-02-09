import React from "react";
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
        className="bg-black/10 backdrop-blur-sm border border-brand-slate/20 rounded-full w-10 h-10 flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity flex-shrink-0"
        aria-label="Return to home"
        data-testid="header-mountain-icon"
      >
        <span className="inline-flex w-6 h-6 overflow-hidden">
          <img
            src="/gold_lines_no%20background_mp.png"
            alt="Mountain Pathway Logo"
            width={32}
            height={32}
            className="w-6 h-6 object-contain scale-[1.75]"
            style={{ filter: "brightness(0.88) saturate(1.6) hue-rotate(-3deg) contrast(1.12)" }}
          />
        </span>
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
