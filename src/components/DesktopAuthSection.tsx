"use client";

import { useState } from "react";
import { Session } from "@supabase/supabase-js";
import { Button } from "./ui/button";
import { SimpleAudioPlayer } from "./SimpleAudioPlayer";
import AuthModal from "./AuthModal";
import { Upload } from "lucide-react";

interface DesktopAuthSectionProps {
  session: Session | null;
  currentStep: number;
}

export const DesktopAuthSection = ({
  session,
  currentStep,
}: DesktopAuthSectionProps) => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const isAuthenticated = !!session;

  const handleSaveClick = () => {
    setShowAuthModal(true);
  };

  // On landing page, hide login button for non-authenticated users (soft gate handles it)
  // During journey, show login button so users can save mid-journey
  const isLandingPage = currentStep === -1;
  const showAuthButton = isAuthenticated || !isLandingPage;

  return (
    <>
      <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
        {/* Account Button - Hidden on landing page for non-auth users */}
        {showAuthButton &&
          (isAuthenticated ? (
            // Authenticated: Show "Account" text button
            <Button
              onClick={handleSaveClick}
              variant="ghost"
              size="lg"
              className="bg-black/10 backdrop-blur-sm text-white hover:bg-black/20 px-4 py-4 rounded-md border border-brand-slate/20 font-medium"
              aria-label="Account"
              title="Account settings"
            >
              Account
            </Button>
          ) : (
            // Not authenticated (during journey): Show icon button
            <Button
              onClick={handleSaveClick}
              variant="ghost"
              size="lg"
              className="bg-black/10 backdrop-blur-sm text-white hover:bg-black/20 px-8 py-4 rounded-md border border-brand-slate/20"
              aria-label="Log in to save"
              title="Log in to save"
            >
              <Upload className="h-5 w-5" />
            </Button>
          ))}

        {/* Audio Controls */}
        <SimpleAudioPlayer
          context={currentStep === -1 ? "landing" : "journey"}
        />
      </div>

      <AuthModal
        open={showAuthModal}
        onOpenChange={setShowAuthModal}
        session={session}
      />
    </>
  );
};
