import React from "react";
import { Mountain } from "lucide-react";
import { SimpleAudioPlayer } from "./SimpleAudioPlayer";
import { useStore } from "@/lib/store/useStore";
import { pathwayData } from "@/lib/pathway-data";

export const HeaderMobile: React.FC = () => {
  const { currentStep } = useStore();

  return (
    <header className="flex items-center justify-between gap-3">
      {/* Mobile Logo - Icon Only */}
      <Mountain className="w-6 h-6 text-brand-gold flex-shrink-0" />

      {/* Mobile Progress: Simple Dots */}
      <div className="flex items-center gap-1.5 flex-grow justify-center">
        {pathwayData.map((step) => {
          const isActive = currentStep === step.stepIndex;
          const isCompleted = currentStep > step.stepIndex;

          return (
            <div
              key={step.stepIndex}
              className={`h-2 rounded-full transition-all duration-300 ${
                isActive
                  ? "w-6 bg-brand-gold"
                  : isCompleted
                  ? "w-2 bg-brand-gold/70"
                  : "w-2 bg-white/30"
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
