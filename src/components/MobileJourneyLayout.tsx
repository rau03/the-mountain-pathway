import React, { useCallback, useRef, useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { useStore } from "@/lib/store/useStore";
import { HeaderMobile } from "./HeaderMobile";
import { FooterMobile } from "./FooterMobile";
import { MobileSaveFooter } from "./MobileSaveFooter";
import { JourneyScreen } from "./JourneyScreen";
import { SummaryScreen } from "./SummaryScreen";
import AuthModal from "./AuthModal";
import { getBackgroundForStep, pathwayData } from "@/lib/pathway-data";
import { useJourneyAutoSave } from "@/hooks/useJourneyAutoSave";

type AuthModalIntent = "save" | "account" | null;

interface MobileJourneyLayoutProps {
  session: Session | null;
}

export const MobileJourneyLayout: React.FC<MobileJourneyLayoutProps> = ({
  session,
}) => {
  const { currentStep } = useStore();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  // Auth modal state lives here (rather than inside MobileSaveFooter) so the
  // modal survives the footer being hidden while the on-screen keyboard is
  // open — previously the modal was mounted as a child of the footer, and
  // opening it (via the Save button) would auto-focus a text input, which
  // popped the keyboard, which unmounted the footer + modal together,
  // making the modal appear to flash and close immediately.
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalIntent, setAuthModalIntent] = useState<AuthModalIntent>(null);
  const { autoSaveLoading, autoSaveError, triggerAutoSave, handleRetryAutoSave } =
    useJourneyAutoSave(session);

  const handleAuthModalOpenChange = useCallback((next: boolean) => {
    setShowAuthModal(next);
    if (!next) {
      setAuthModalIntent(null);
    }
  }, []);

  const handleSaveClick = useCallback(() => {
    setAuthModalIntent("save");
    setShowAuthModal(true);
  }, []);

  const handleAccountClick = useCallback(() => {
    setAuthModalIntent("account");
    setShowAuthModal(true);
  }, []);

  // Only auto-save immediately after a successful sign in/sign up when the
  // modal was opened via the Save button specifically — not when opened via
  // the Account button (or any other entry point), which relies on the
  // existing step-to-step auto-save instead.
  const handleAuthSuccess = useCallback(
    (authedSession: Session) => {
      triggerAutoSave(currentStep, authedSession);
    },
    [triggerAutoSave, currentStep]
  );

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

  const scrollSheetClass = isSummaryScreen
    ? "flex-grow flex flex-col bg-gradient-to-t from-brand-stone from-50% via-brand-stone/80 via-75% to-transparent min-h-0 pt-[calc(env(safe-area-inset-top,0px)+1rem)]"
    : bottomSheetClass;

  const scrollPaddingBottom = isKeyboardOpen
    ? "pb-8"
    : isSummaryScreen
      ? "pb-[calc(env(safe-area-inset-bottom,0px)+1.5rem)]"
      : "pb-[calc(env(safe-area-inset-bottom,0px)+4rem)]";

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

      {isSummaryScreen && (
        <div className="absolute inset-x-0 top-0 z-5 bg-gradient-to-b from-brand-slate/40 via-brand-slate/20 to-transparent h-32" />
      )}

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
        {!isSummaryScreen && <div className="min-h-[5dvh] h-[4dvh]" />}

        {/* Bottom Sheet - Scrollable content region */}
        <div
          ref={scrollContainerRef}
          className={`${scrollSheetClass} overflow-y-auto overscroll-y-contain px-6 ${scrollPaddingBottom}`}
        >
          {isSummaryScreen ? (
            <SummaryScreen session={session} />
          ) : (
            <JourneyScreen />
          )}
        </div>

        {/* Mobile Save Footer - Fixed to device viewport bottom */}
        {isJourneyScreen && !isKeyboardOpen && (
          <div className="fixed inset-x-0 bottom-0 z-40">
            <MobileSaveFooter
              session={session}
              onSaveClick={handleSaveClick}
              onAccountClick={handleAccountClick}
              autoSaveLoading={autoSaveLoading}
              autoSaveError={autoSaveError}
              onRetryAutoSave={handleRetryAutoSave}
              onNextStepSave={triggerAutoSave}
            />
          </div>
        )}

        {/* Legacy Footer Mobile - Hidden for now */}
        {isJourneyScreen && false && (
          <div className="flex-shrink-0 px-6 py-4 bg-brand-stone border-t border-brand-stone/20">
            <FooterMobile />
          </div>
        )}
      </div>

      {/* Auth Modal - deliberately rendered here (outside the footer, and
          outside the `!isKeyboardOpen` block above) so it stays mounted and
          open regardless of keyboard visibility changes triggered by its own
          form inputs. */}
      <AuthModal
        open={showAuthModal}
        onOpenChange={handleAuthModalOpenChange}
        session={session}
        onAuthSuccess={authModalIntent === "save" ? handleAuthSuccess : undefined}
      />
    </div>
  );
};
