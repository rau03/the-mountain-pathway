"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import { Session } from "@supabase/supabase-js";
import { useStore } from "@/lib/store/useStore";
import { LandingPage } from "@/components/LandingPage";
import { HeaderDesktop } from "@/components/HeaderDesktop";
import { DesktopSaveFooter } from "@/components/DesktopSaveFooter";
import { SimpleAudioPlayer } from "@/components/SimpleAudioPlayer";
import { Button } from "@/components/ui/button";
import { useHomeSessionSync } from "@/hooks/useHomeSessionSync";
import { useNativeAuthDeepLink } from "@/hooks/useNativeAuthDeepLink";
import { useJourneyBackground } from "@/hooks/useJourneyBackground";
import { useViewportFlags } from "@/hooks/useViewportFlags";
import { useDesktopStepScrollReset } from "@/hooks/useDesktopStepScrollReset";
import { useUnsavedJourneyUnloadGuard } from "@/hooks/useUnsavedJourneyUnloadGuard";

const JourneyScreen = dynamic(
  () => import("@/components/JourneyScreen").then((mod) => mod.JourneyScreen)
);
const SummaryScreen = dynamic(
  () => import("@/components/SummaryScreen").then((mod) => mod.SummaryScreen)
);
const DesktopAuthSection = dynamic(
  () =>
    import("@/components/DesktopAuthSection").then(
      (mod) => mod.DesktopAuthSection
    )
);
const MobileJourneyLayout = dynamic(
  () =>
    import("@/components/MobileJourneyLayout").then(
      (mod) => mod.MobileJourneyLayout
    )
);
const AuthModal = dynamic(() => import("@/components/AuthModal"), {
  ssr: false,
});
const SoftGateModal = dynamic(() => import("@/components/SoftGateModal"), {
  ssr: false,
});
const WelcomeInfoModal = dynamic(() => import("@/components/WelcomeInfoModal"), {
  ssr: false,
});
const ProfileSetupModal = dynamic(
  () => import("@/components/ProfileSetupModal"),
  {
    ssr: false,
  }
);
const NativeResetPassword = dynamic(
  () => import("@/components/NativeResetPassword"),
  {
    ssr: false,
  }
);

export default function HomeClient({ session }: { session: Session | null }) {
  const { currentStep, setCurrentStep, setAnonymous, startJourney } =
    useStore();
  const { liveSession, showProfileSetupModal, setShowProfileSetupModal } =
    useHomeSessionSync(session, setAnonymous);
  const { showNativeResetPassword, setShowNativeResetPassword } =
    useNativeAuthDeepLink(liveSession);
  const { currentBackground, backgroundPositionClass } =
    useJourneyBackground(currentStep);
  const { isMobile } = useViewportFlags();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSoftGateModal, setShowSoftGateModal] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const desktopScrollRef = useRef<HTMLDivElement>(null);

  // Reset invalid step to landing page
  useEffect(() => {
    if (currentStep > 9) {
      setCurrentStep(-1);
    }
  }, [currentStep, setCurrentStep]);

  // Toggle body class based on current step
  useEffect(() => {
    if (currentStep === -1) {
      document.body.classList.remove("journey-mode");
    } else {
      document.body.classList.add("journey-mode");
    }
  }, [currentStep]);

  useDesktopStepScrollReset(currentStep, desktopScrollRef);

  // Handle "Begin your pathway" button click - opens soft gate modal
  const handleBeginClick = useCallback(() => {
    // If user is already logged in, skip the soft gate and start journey
    if (liveSession) {
      startJourney();
    } else {
      // Show the soft gate modal for non-authenticated users
      setShowSoftGateModal(true);
    }
  }, [liveSession, startJourney]);

  // Handle continuing as guest (from soft gate modal)
  const handleContinueAsGuest = useCallback(() => {
    setAnonymous(true);
    startJourney();
  }, [setAnonymous, startJourney]);

  // Handle successful authentication (from soft gate modal)
  const handleAuthComplete = useCallback(() => {
    setAnonymous(false);
    startJourney();
  }, [setAnonymous, startJourney]);

  const renderCurrentScreen = useCallback(() => {
    if (currentStep === -1) {
      return (
        <LandingPage
          onBeginClick={handleBeginClick}
          onLearnMoreClick={() => setShowWelcomeModal(true)}
        />
      );
    }

    if (currentStep === 9) {
      return <SummaryScreen session={liveSession} />;
    }

    return <JourneyScreen />;
  }, [currentStep, handleBeginClick, liveSession]);

  // This is the stable, desktop-first layout
  // Include summary page (step 9) so it gets the header and footer
  const isJourneyScreen = currentStep > -1 && currentStep <= 9;

  useUnsavedJourneyUnloadGuard();

  if (showNativeResetPassword) {
    return (
      <NativeResetPassword onDone={() => setShowNativeResetPassword(false)} />
    );
  }

  return (
    <div className="relative min-h-screen">
      {/* Desktop Auth Section - Save Button + Audio Controls - Top Right */}
      {!isMobile && (
        <DesktopAuthSection session={liveSession} currentStep={currentStep} />
      )}

      {currentStep === -1 ? (
        // Landing Page - Full screen image
        <div
          className="relative min-h-screen bg-cover"
          style={{
            backgroundImage: `url('/homepage-background.v3.jpg')`,
            backgroundPosition: "center 65%",
          }}
        >
          {/* Mobile Controls - Top Right with iOS safe area */}
          {isMobile && (
            <div
              className="absolute right-4 z-50 flex items-center gap-2"
              style={{
                top: "max(calc(env(safe-area-inset-top, 0px) + 1rem), 3.25rem)",
              }}
            >
              {/* Account Button - Only show for authenticated users on landing page */}
              {/* Non-authenticated users will use the soft gate modal */}
              {liveSession && (
                <Button
                  onClick={() => setShowAuthModal(true)}
                  variant="ghost"
                  size="sm"
                  className="bg-black/10 backdrop-blur-sm text-white hover:bg-black/20 px-3 py-2 rounded-full border border-brand-slate/20 text-sm font-medium"
                  aria-label="Account"
                  title="Account settings"
                >
                  Account
                </Button>
              )}

              {/* Audio Controls */}
              <SimpleAudioPlayer context="landing" />
            </div>
          )}

          {/* Content Layer */}
          <div className="relative z-10">
            <LandingPage
              onBeginClick={handleBeginClick}
              onLearnMoreClick={() => setShowWelcomeModal(true)}
            />
          </div>
        </div>
      ) : (
        // Journey Screen - Clean Layout Swap
        <>
          {/* DESKTOP LAYOUT: Stable split-screen (visible ≥ 768px) */}
          <div className="hidden md:block bg-brand-stone">
            <main className="flex flex-row h-screen overflow-hidden bg-brand-stone">
              {/* Visual Pane - Left side with background image */}
              <div
                className={`w-[45%] h-screen bg-cover ${backgroundPositionClass} transition-all duration-1000`}
                style={{ backgroundImage: `url('${currentBackground}')` }}
              />

              {/* Content Pane - Right side with content */}
              <div className="w-[55%] h-screen flex flex-col relative bg-brand-stone p-8 overflow-hidden">
                {/* Header */}
                {isJourneyScreen && (
                  <div className="flex-shrink-0">
                    <HeaderDesktop />
                  </div>
                )}

                {/* Main Content - Scrollable */}
                <div
                  ref={desktopScrollRef}
                  className="flex-grow flex flex-col py-6 pr-2 overflow-y-auto scrollbar-thin bg-brand-stone"
                >
                  {renderCurrentScreen()}
                </div>

                {/* Footer */}
                {isJourneyScreen && (
                  <div className="flex-shrink-0 pt-5 pb-1">
                    <DesktopSaveFooter session={liveSession} />
                  </div>
                )}
              </div>
            </main>
          </div>

          {/* MOBILE LAYOUT: Fading bottom sheet (visible < 768px) */}
          <div className="md:hidden">
            <MobileJourneyLayout session={liveSession} />
          </div>
        </>
      )}

      {/* Auth Modal for mobile homepage login (account access) */}
      <AuthModal
        open={showAuthModal}
        onOpenChange={setShowAuthModal}
        session={liveSession}
      />

      {/* Soft Gate Modal for journey start */}
      <SoftGateModal
        open={showSoftGateModal}
        onOpenChange={setShowSoftGateModal}
        onContinueAsGuest={handleContinueAsGuest}
        onAuthComplete={handleAuthComplete}
      />

      {/* Welcome Info Modal for "Who is this for?" */}
      <WelcomeInfoModal
        open={showWelcomeModal}
        onOpenChange={setShowWelcomeModal}
      />

      {/* Profile Setup Modal for new users */}
      <ProfileSetupModal
        open={showProfileSetupModal}
        onOpenChange={setShowProfileSetupModal}
        onComplete={() => {
          // Profile setup complete, user can continue
        }}
      />
    </div>
  );
}
