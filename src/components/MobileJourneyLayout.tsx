import React, { useRef, useEffect, useState } from "react";
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
  
  // For smooth crossfade transitions
  const [displayedBackground, setDisplayedBackground] = useState(() => getBackgroundForStep(currentStep));
  const [previousBackground, setPreviousBackground] = useState<string | null>(null);
  const [fadeOut, setFadeOut] = useState(false);

  // Get the current background image
  const currentBackground = getBackgroundForStep(currentStep);

  // Get mobile alignment for current step (default to center 50%)
  const currentStepData =
    currentStep >= 0 && currentStep < pathwayData.length
      ? pathwayData[currentStep]
      : null;
  const mobileAlignment =
    currentStepData?.mobileAlignment || "[background-position:center_50%]";

  // Handle background crossfade when step changes
  useEffect(() => {
    if (currentBackground !== displayedBackground) {
      // Set up the previous background (starts visible)
      setPreviousBackground(displayedBackground);
      setDisplayedBackground(currentBackground);
      setFadeOut(false);
      
      // Trigger fade out after a tiny delay (allows element to mount at opacity-100)
      const fadeTimer = setTimeout(() => {
        setFadeOut(true);
      }, 50);
      
      // Clean up after animation completes
      const cleanupTimer = setTimeout(() => {
        setPreviousBackground(null);
        setFadeOut(false);
      }, 850); // 50ms delay + 800ms transition
      
      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(cleanupTimer);
      };
    }
  }, [currentBackground, displayedBackground]);

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

  // Summary screen has its own rendering
  if (isSummaryScreen) {
    return (
      <div className="relative min-h-screen w-full min-w-full bg-brand-stone">
        {/* Dark gradient overlay at top for better logo contrast */}
        <div className="absolute inset-0 z-5 bg-gradient-to-b from-brand-slate/40 via-brand-slate/20 to-transparent h-32" />
        <div className="relative z-10 px-6 py-8">
          <SummaryScreen session={session} />
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-[100svh] w-full min-w-full bg-brand-stone flex flex-col overflow-hidden">
      {/* Background Image Crossfade Container */}
      <div className="absolute inset-0 overflow-hidden bg-brand-stone">
        {/* Current background (always visible underneath) */}
        <div
          className={`absolute inset-0 bg-cover ${mobileAlignment}`}
          style={{ backgroundImage: `url('${displayedBackground}')` }}
        />
        
        {/* Previous background (fades out on top) */}
        {previousBackground && (
          <div
            className={`absolute inset-0 bg-cover ${mobileAlignment} transition-opacity duration-[800ms] ease-in-out ${
              fadeOut ? 'opacity-0' : 'opacity-100'
            }`}
            style={{ backgroundImage: `url('${previousBackground}')` }}
          />
        )}
      </div>

      {/* Top-Fade Vignette - Reveals more of background at top */}
      <div className="absolute inset-0 z-5 bg-gradient-to-t from-brand-stone/40 to-transparent" />

      {/* Mobile Content Layout - Full Height Flex Container */}
      <div className="relative z-10 h-full flex flex-col min-h-0">
        {/* Mobile Header at Top - with iOS safe area */}
        {isJourneyScreen && (
          <div className="flex-shrink-0 px-4 pt-4 pb-2 safe-area-top">
            <HeaderMobile />
          </div>
        )}

        {/* Spacer - Visual Area Above Content (shrinkable so footer stays visible) */}
        <div className="min-h-[5dvh] h-[15dvh]" />

        {/* Bottom Sheet - Fixed Height Container with Gradient */}
        <div className="flex-grow flex flex-col bg-gradient-to-t from-brand-stone from-50% via-brand-stone/80 via-75% to-transparent pt-8 pb-14 min-h-0">
          {/* Scrollable Content Area */}
          <div
            ref={scrollContainerRef}
            className="flex-grow overflow-y-auto px-6 min-h-0 pb-6"
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
