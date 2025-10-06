import React from "react";
import { Mountain } from "lucide-react";
import { ProgressPath } from "./ProgressPath";
import { useStore } from "@/lib/store/useStore";
import { pathwayContent, pathwayData } from "@/lib/pathway-data";
import { AudioToggle } from "@/components/AudioToggle";

export const Header: React.FC = () => {
  const { currentStep } = useStore();

  return (
    <header className="relative z-20">
      {/* Mobile: Minimalist header with icon, dots, and audio toggle */}
      <div className="flex md:hidden items-center justify-between px-4 py-2">
        {/* Left: Mountain Icon */}
        <div className="flex items-center">
          <Mountain className="w-7 h-7 text-amber-400" />
        </div>

        {/* Center: Dot-based progress indicator */}
        <div className="flex items-center gap-2">
          {pathwayData.map((step) => {
            const isActive = currentStep === step.stepIndex;
            const isPast = currentStep > step.stepIndex;
            const baseClasses =
              "w-2 h-2 rounded-full transition-colors duration-200";
            const stateClasses = isActive
              ? "bg-brand-gold"
              : isPast
              ? "bg-white/70"
              : "bg-white/30";
            return (
              <div
                key={step.stepIndex}
                className={`${baseClasses} ${stateClasses}`}
                aria-label={`Step ${step.stepIndex + 1}`}
              />
            );
          })}
        </div>

        {/* Right: Audio toggle */}
        <div className="flex items-center">
          <AudioToggle context="journey" />
        </div>
      </div>

      {/* Desktop: Existing text-based progress path and app title */}
      <div className="hidden md:flex flex-col px-6 py-4">
        <div className="max-w-4xl mx-auto w-full">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Mountain className="w-8 h-8 text-amber-400" />
              <div>
                <h1 className="text-2xl font-bold text-brand-slate">
                  {pathwayContent.appTitle}
                </h1>
                <p className="text-sm text-brand-slate/80">
                  {pathwayContent.appSubtitle}
                </p>
              </div>
            </div>
          </div>

          {currentStep >= 0 && currentStep < 9 && <ProgressPath />}
        </div>
      </div>
    </header>
  );
};
