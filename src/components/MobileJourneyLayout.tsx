import React, { useRef, useEffect } from "react";
import { Session } from "@supabase/supabase-js";
import { useStore } from "@/lib/store/useStore";
import { HeaderMobile } from "./HeaderMobile";
import { FooterMobile } from "./FooterMobile";
import { MobileSaveFooter } from "./MobileSaveFooter";
import { JourneyScreen } from "./JourneyScreen";
import { SummaryScreen } from "./SummaryScreen";
import { getBackgroundForStep, pathwayData } from "@/lib/pathway-data";

interface MobileJourneyLayoutProps {
  session: Session | null;
}

export const MobileJourneyLayout: React.FC<MobileJourneyLayoutProps> = ({
  session,
}) => {
  const { currentStep } = useStore();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Reset scroll position when step changes
  useEffect(() => {
    // Reset main window scroll
    window.scrollTo(0, 0);

    // Reset internal content scroll
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [currentStep]);

  const isJourneyScreen = currentStep > -1 && currentStep < 9;
  const isSummaryScreen = currentStep === 9;

  // Get the current background image
  const currentBackground = getBackgroundForStep(currentStep);

  // Get mobile alignment for current step (default to center 40%)
  const currentStepData =
    currentStep >= 0 && currentStep < pathwayData.length
      ? pathwayData[currentStep]
      : null;
  const mobileAlignment =
    currentStepData?.mobileAlignment || "[background-position:center_40%]";

  // Summary screen has its own rendering
  if (isSummaryScreen) {
    return (
      <div className="relative min-h-screen bg-brand-stone">
        {/* Dark gradient overlay at top for better logo contrast */}
        <div className="absolute inset-0 z-5 bg-gradient-to-b from-brand-slate/40 via-brand-slate/20 to-transparent h-32" />
        <div className="relative z-10 px-6 py-8">
          <SummaryScreen session={session} />
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-[100dvh] flex flex-col">
      {/* Full-Screen Background Image */}
      <div
        className={`absolute inset-0 bg-cover ${mobileAlignment} transition-all duration-1000`}
        style={{ backgroundImage: `url('${currentBackground}')` }}
      />

      {/* Top-Fade Vignette - Reveals more of background at top */}
      <div className="absolute inset-0 z-5 bg-gradient-to-t from-brand-stone/80 to-transparent" />

      {/* Mobile Content Layout - Full Height Flex Container */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Mobile Header at Top - with iOS safe area */}
        {isJourneyScreen && (
          <div className="flex-shrink-0 px-4 pt-4 pb-2 safe-area-top">
            <HeaderMobile />
          </div>
        )}

        {/* Spacer - Visual Area Above Content */}
        <div className="flex-shrink-0 min-h-[20dvh]" />

        {/* Bottom Sheet - Fixed Height Container with Gradient */}
        <div className="flex-grow flex flex-col bg-gradient-to-t from-brand-stone from-40% via-brand-stone/70 via-70% to-transparent pt-12">
          {/* Scrollable Content Area */}
          <div
            ref={scrollContainerRef}
            className="flex-grow overflow-y-auto px-6"
          >
            <JourneyScreen />
          </div>

          {/* Mobile Save Footer - Always Visible at Bottom */}
          {isJourneyScreen && <MobileSaveFooter session={session} />}

          {/* Legacy Footer Mobile - Hidden for now */}
          {isJourneyScreen && false && (
            <div className="flex-shrink-0 px-6 py-4 bg-brand-stone border-t border-brand-stone/20">
              <FooterMobile />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
