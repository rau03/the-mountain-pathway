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
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  const currentBackground = getBackgroundForStep(currentStep);

  // Crossfade: ref tracks what's currently shown (avoids re-render that cancels timers)
  const shownBgRef = useRef(currentBackground);
  const [prevBackground, setPrevBackground] = useState<string | null>(null);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (currentBackground === shownBgRef.current) return;

    setPrevBackground(shownBgRef.current);
    shownBgRef.current = currentBackground;
    setFadeOut(false);

    const fadeTimer = setTimeout(() => setFadeOut(true), 50);
    const cleanupTimer = setTimeout(() => {
      setPrevBackground(null);
      setFadeOut(false);
    }, 850);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(cleanupTimer);
    };
  }, [currentBackground]);

  // Get mobile alignment for current step (default to center 50%)
  const currentStepData =
    currentStep >= 0 && currentStep < pathwayData.length
      ? pathwayData[currentStep]
      : null;
  const mobileAlignment =
    currentStepData?.mobileAlignment || "[background-position:center_50%]";

  // Reset scroll position when step changes
  useEffect(() => {
    // Reset main window scroll
    window.scrollTo(0, 0);

    // Reset internal content scroll
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [currentStep]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const viewport = window.visualViewport;
    if (!viewport) return;

    const handleViewportChange = () => {
      const keyboardHeight = window.innerHeight - viewport.height;
      setIsKeyboardOpen(keyboardHeight > 120);
    };

    handleViewportChange();
    viewport.addEventListener("resize", handleViewportChange);
    viewport.addEventListener("scroll", handleViewportChange);

    return () => {
      viewport.removeEventListener("resize", handleViewportChange);
      viewport.removeEventListener("scroll", handleViewportChange);
    };
  }, []);

  const isJourneyScreen = currentStep > -1 && currentStep < 9;
  const isSummaryScreen = currentStep === 9;
  const isTrailheadStep = currentStep === 0;
  const isScriptureStep = currentStep === 1;
  const isNameIssueStep = currentStep === 2;
  const isThoughtsStep = currentStep === 3;
  const isFeelingsStep = currentStep === 4;
  const isHopeStep = currentStep === 5;
  const isPauseStep = currentStep === 6;
  const isDiscernStep = currentStep === 7;
  const isPrayerStep = currentStep === 8;

  const screenOverlayClass =
    isTrailheadStep ||
    isScriptureStep ||
    isNameIssueStep ||
    isThoughtsStep ||
    isFeelingsStep ||
    isHopeStep ||
    isPauseStep ||
    isDiscernStep ||
    isPrayerStep
      ? "absolute inset-0 z-5 bg-transparent"
      : "absolute inset-0 z-5 bg-gradient-to-t from-brand-stone/40 to-transparent";

  const bottomSheetClass =
    isTrailheadStep ||
    isScriptureStep ||
    isNameIssueStep ||
    isThoughtsStep ||
    isFeelingsStep ||
    isHopeStep ||
    isPauseStep ||
    isDiscernStep ||
    isPrayerStep
    ? "flex-grow flex flex-col bg-transparent pt-8 min-h-0"
    : "flex-grow flex flex-col bg-gradient-to-t from-brand-stone from-50% via-brand-stone/80 via-75% to-transparent pt-8 min-h-0";

  // Summary screen has its own rendering
  if (isSummaryScreen) {
    return (
      <div className="relative min-h-screen w-full min-w-full bg-brand-stone">
        {/* Dark gradient overlay at top for better logo contrast */}
        <div className="absolute inset-0 z-5 bg-gradient-to-b from-brand-slate/40 via-brand-slate/20 to-transparent h-32" />
        <div className="relative z-10 px-6 pt-[calc(env(safe-area-inset-top,0px)+3.25rem)] pb-10">
          <SummaryScreen session={session} />
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-[100dvh] w-full min-w-full bg-brand-stone flex flex-col overflow-hidden overscroll-none">
      {/* Background Image Crossfade Container */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-brand-stone">
        {/* Current background (always visible underneath) */}
        <div
          className={`absolute inset-0 bg-cover ${mobileAlignment}`}
          style={{ backgroundImage: `url('${currentBackground}')` }}
        />
        {/* Previous background (fades out on top to reveal new image) */}
        {prevBackground && (
          <div
            className={`absolute inset-0 bg-cover ${mobileAlignment} transition-opacity duration-[800ms] ease-in-out ${
              fadeOut ? "opacity-0" : "opacity-100"
            }`}
            style={{ backgroundImage: `url('${prevBackground}')` }}
          />
        )}
      </div>

      {/* Screen overlay - Journey steps use clear image view */}
      <div className={screenOverlayClass} />

      {/* Mobile Content Layout - Full Height Flex Container */}
      <div className="relative z-10 h-full flex flex-col min-h-0">
        {/* Mobile Header at Top - with iOS safe area */}
        {isJourneyScreen && (
          <div
            className="flex-shrink-0 px-4 pb-2"
            style={{
              paddingTop:
                "max(calc(env(safe-area-inset-top, 0px) + 1rem), 3.25rem)",
            }}
          >
            <HeaderMobile />
          </div>
        )}

        {/* Spacer - Visual Area Above Content (shrinkable so footer stays visible) */}
        <div className="min-h-[5dvh] h-[15dvh]" />

        {/* Bottom Sheet - Scrollable content region */}
        <div
          ref={scrollContainerRef}
          className={`${bottomSheetClass} overflow-y-auto overscroll-y-contain px-6 ${
            isKeyboardOpen
              ? "pb-8"
              : "pb-[calc(env(safe-area-inset-bottom,0px)+8rem)]"
          }`}
        >
          <JourneyScreen />
        </div>

        {/* Mobile Save Footer - Fixed to device viewport bottom */}
        {isJourneyScreen && !isKeyboardOpen && (
          <div className="fixed inset-x-0 bottom-0 z-40 bg-brand-stone">
            <MobileSaveFooter session={session} />
          </div>
        )}

        {/* Legacy Footer Mobile - Hidden for now */}
        {isJourneyScreen && false && (
          <div className="flex-shrink-0 px-6 py-4 bg-brand-stone border-t border-brand-stone/20">
            <FooterMobile />
          </div>
        )}
      </div>
    </div>
  );
};
