import React from "react";
import { useStore } from "@/lib/store/useStore";
import { HeaderMobile } from "./HeaderMobile";
import { FooterMobile } from "./FooterMobile";
import { JourneyScreen } from "./JourneyScreen";
import { SummaryScreen } from "./SummaryScreen";
import { getBackgroundForStep } from "@/lib/pathway-data";

export const MobileJourneyLayout: React.FC = () => {
  const { currentStep } = useStore();
  const isJourneyScreen = currentStep > -1 && currentStep < 9;
  const isSummaryScreen = currentStep === 9;

  // Get the current background image
  const currentBackground = getBackgroundForStep(currentStep);

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
        className="absolute inset-0 bg-cover bg-bottom transition-all duration-1000"
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
        <div className="flex-shrink-0 bg-gradient-to-t from-brand-stone via-brand-stone to-transparent pt-16 pb-6">
          {/* All Content in Sheet - Scrollable */}
          <div className="px-6 pb-4 max-h-[65vh] overflow-y-auto">
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
