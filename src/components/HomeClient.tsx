"use client";

import React, { useState, useEffect, useRef } from "react";
import { Session } from "@supabase/supabase-js";
import { useStore } from "@/lib/store/useStore";
import { LandingPage } from "@/components/LandingPage";
import { JourneyScreen } from "@/components/JourneyScreen";
import { SummaryScreen } from "@/components/SummaryScreen";
import { HeaderDesktop } from "@/components/HeaderDesktop";
import { DesktopSaveFooter } from "@/components/DesktopSaveFooter";
import { DesktopAuthSection } from "@/components/DesktopAuthSection";
import { MobileJourneyLayout } from "@/components/MobileJourneyLayout";
import { SimpleAudioPlayer } from "@/components/SimpleAudioPlayer";
import AuthModal from "@/components/AuthModal";
import SoftGateModal from "@/components/SoftGateModal";
import { Button } from "@/components/ui/button";
import { getBackgroundForStep } from "@/lib/pathway-data";
import supabase from "@/lib/supabaseClient";

export default function HomeClient({ session }: { session: Session | null }) {
  const { currentStep, setCurrentStep, setAnonymous, startJourney } =
    useStore();
  const [currentBackground, setCurrentBackground] = useState(
    "/homepage-background.v3.jpg"
  );
  const [isInitialized, setIsInitialized] = useState(false);
  const [liveSession, setLiveSession] = useState<Session | null>(session);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSoftGateModal, setShowSoftGateModal] = useState(false);
  const desktopScrollRef = useRef<HTMLDivElement>(null);

  // Update anonymous status when session changes
  useEffect(() => {
    setAnonymous(!liveSession);
  }, [liveSession, setAnonymous]);

  // Listen for real-time session changes
  useEffect(() => {
    if (!supabase) return;

    // Set initial session
    setLiveSession(session);

    // Subscribe to auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event: unknown, newSession: Session | null) => {
        setLiveSession(newSession);
      }
    );

    // Cleanup subscription on unmount
    return () => subscription.unsubscribe();
  }, [session]);

  // Update background when step changes
  useEffect(() => {
    const newBackground = getBackgroundForStep(currentStep);

    if (newBackground !== currentBackground) {
      // Preload the new image
      const img = new Image();
      img.onload = () => {
        setCurrentBackground(newBackground);
      };
      img.src = newBackground;
    }
  }, [currentStep, currentBackground]);

  // Initialize background on first load
  useEffect(() => {
    if (!currentBackground) {
      setCurrentBackground(getBackgroundForStep(currentStep));
    }
  }, [currentStep, currentBackground]);

  // Force homepage on first load to prevent jumping
  useEffect(() => {
    if (!isInitialized) {
      setCurrentStep(-1);
      setIsInitialized(true);
    }
  }, [isInitialized, setCurrentStep]);

  // Reset invalid step to landing page
  useEffect(() => {
    if (currentStep > 9) {
      console.log("Invalid step detected, resetting to landing page");
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

  // Reset desktop scroll position when step changes
  useEffect(() => {
    if (desktopScrollRef.current) {
      // Immediate reset
      desktopScrollRef.current.scrollTop = 0;

      // Additional reset after DOM update
      requestAnimationFrame(() => {
        if (desktopScrollRef.current) {
          desktopScrollRef.current.scrollTop = 0;
          desktopScrollRef.current.scrollTo({
            top: 0,
            left: 0,
            behavior: "instant" as ScrollBehavior,
          });
        }
      });

      // Final safety reset after render
      setTimeout(() => {
        if (desktopScrollRef.current) {
          desktopScrollRef.current.scrollTop = 0;
        }
      }, 50);
    }
  }, [currentStep]);

  // Handle "Begin your pathway" button click - opens soft gate modal
  const handleBeginClick = () => {
    // If user is already logged in, skip the soft gate and start journey
    if (liveSession) {
      startJourney();
    } else {
      // Show the soft gate modal for non-authenticated users
      setShowSoftGateModal(true);
    }
  };

  // Handle continuing as guest (from soft gate modal)
  const handleContinueAsGuest = () => {
    setAnonymous(true);
    startJourney();
  };

  // Handle successful authentication (from soft gate modal)
  const handleAuthComplete = () => {
    setAnonymous(false);
    startJourney();
  };

  const renderCurrentScreen = () => {
    if (currentStep === -1) {
      return <LandingPage onBeginClick={handleBeginClick} />;
    }

    if (currentStep === 9) {
      return <SummaryScreen session={liveSession} />;
    }

    return <JourneyScreen />;
  };

  // This is the stable, desktop-first layout
  const isJourneyScreen = currentStep > -1 && currentStep < 9;

  // Define background position explicitly for Tailwind purge-proof class names
  // Step 0 uses bg-bottom, all other steps use bg-center
  const backgroundPositionClass = currentStep === 0 ? "bg-bottom" : "bg-center";

  // Check if we're on mobile (for conditional rendering)
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640); // sm breakpoint
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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
          {/* Mobile Controls - Top Right */}
          {isMobile && (
            <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
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
            <LandingPage onBeginClick={handleBeginClick} />
          </div>
        </div>
      ) : (
        // Journey Screen - Clean Layout Swap
        <>
          {/* DESKTOP LAYOUT: Stable split-screen (visible ≥ 768px) */}
          <div className="hidden md:block">
            <main className="flex flex-row h-screen overflow-hidden">
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
                  className="flex-grow flex flex-col py-6 pr-2 overflow-y-auto scrollbar-thin"
                >
                  {renderCurrentScreen()}
                </div>

                {/* Footer */}
                {isJourneyScreen && (
                  <div className="flex-shrink-0 pt-6 pb-4">
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
    </div>
  );
}
