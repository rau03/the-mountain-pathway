import React, { useRef, useEffect } from "react";
import { useStore } from "@/lib/store/useStore";
import { HeaderMobile } from "./HeaderMobile";
import { FooterMobile } from "./FooterMobile";
import { JourneyScreen } from "./JourneyScreen";
import { SummaryScreen } from "./SummaryScreen";
import { getBackgroundForStep, pathwayData } from "@/lib/pathway-data";

export const MobileJourneyLayout: React.FC = () => {
  const { currentStep } = useStore();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Reset scroll position when step changes
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [currentStep]);

  const isJourneyScreen = currentStep > -1 && currentStep < 9;
  const isSummaryScreen = currentStep === 9;

  // Get the current background image
  const currentBackground = getBackgroundForStep(currentStep);

  // Get mobile alignment for current step (default to bg-bottom)
  const currentStepData =
    currentStep >= 0 && currentStep < pathwayData.length
      ? pathwayData[currentStep]
      : null;
  const mobileAlignment = currentStepData?.mobileAlignment || "bg-bottom";

  // Summary screen has its own rendering
  if (isSummaryScreen) {
    return (
      <div className="relative min-h-screen bg-brand-stone">
        <div className="relative z-10 px-6 py-8">
          <SummaryScreen />
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      {/* Full-Screen Background Image */}
      <div
        className={`absolute inset-0 bg-cover ${mobileAlignment} transition-all duration-1000`}
        style={{ backgroundImage: `url('${currentBackground}')` }}
      />

      {/* Mobile Content Layout */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Mobile Header at Top */}
        {isJourneyScreen && (
          <div className="flex-shrink-0 px-4 pt-4 pb-2">
            <HeaderMobile />
          </div>
        )}

        {/* Spacer - Pushes sheet to bottom */}
        <div className="flex-grow" />

        {/* Fading Bottom Sheet */}
        <div className="flex-shrink-0 bg-gradient-to-t from-brand-stone from-50% to-brand-stone/80 pt-12 pb-6">
          {/* All Content in Sheet - Scrollable */}
          <div
            ref={scrollContainerRef}
            className="px-6 pb-4 max-h-[70dvh] overflow-y-auto"
          >
            <JourneyScreen />
          </div>

          {/* Mobile Footer at Bottom of Sheet */}
          {isJourneyScreen && (
            <div className="px-6 pt-4">
              <FooterMobile />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
