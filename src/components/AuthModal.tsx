"use client";

import { useState, useEffect, useRef } from "react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { Session } from "@supabase/supabase-js";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BookOpen, Loader2, AlertTriangle, Mountain } from "lucide-react";
import supabase from "@/lib/supabaseClient";
import SavedJourneysView from "@/components/SavedJourneysView";
import { useStore } from "@/lib/store/useStore";

type AuthModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  session?: Session | null;
};

export default function AuthModal({
  open,
  onOpenChange,
  session,
}: AuthModalProps) {
  const [showSavedJourneys, setShowSavedJourneys] = useState(false);
  const [currentSession, setCurrentSession] = useState<Session | null>(
    session || null
  );
  const [signingOut, setSigningOut] = useState(false);
  const [showUnsavedWarning, setShowUnsavedWarning] = useState(false);
  const wasUnauthenticatedRef = useRef(!session);

  // Get journey state to check for unsaved work
  const { isDirty, currentStep, isSaved, resetJourney } = useStore();

  // Check if user has unsaved work
  const hasUnsavedWork =
    isDirty && !isSaved && currentStep > -1 && currentStep < 9;

  // Sync with prop changes
  useEffect(() => {
    setCurrentSession(session || null);
  }, [session]);

  // Listen for real-time session changes
  useEffect(() => {
    if (!supabase) return;

    // Check initial session state
    supabase.auth.getSession().then((result: unknown) => {
      const {
        data: { session: fetchedSession },
      } = result as { data: { session: Session | null } };
      setCurrentSession(fetchedSession);
      wasUnauthenticatedRef.current = !fetchedSession;
    });

    // Subscribe to auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event: unknown, newSession: Session | null) => {
        setCurrentSession(newSession);
        // Close modal only when user successfully authenticates (new session after being unauthenticated)
        if (newSession && wasUnauthenticatedRef.current && open) {
          onOpenChange(false);
        }
        wasUnauthenticatedRef.current = !newSession;
      }
    );

    // Cleanup subscription on unmount
    return () => subscription.unsubscribe();
  }, [open, onOpenChange]);

  // Handle sign out button click - check for unsaved work first
  const handleSignOutClick = () => {
    if (hasUnsavedWork) {
      setShowUnsavedWarning(true);
    } else {
      handleSignOut();
    }
  };

  // Actually perform the sign out
  const handleSignOut = async () => {
    if (!supabase) return;

    setSigningOut(true);
    setShowUnsavedWarning(false);

    try {
      await supabase.auth.signOut();
      setCurrentSession(null);
      resetJourney(); // Clear the journey data
      onOpenChange(false);
      setSigningOut(false);
    } catch (error) {
      console.error("Error signing out:", error);
      setSigningOut(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-sm sm:max-w-md p-0 gap-0 overflow-hidden border-brand-gold/20">
          <DialogHeader className="sr-only">
            <DialogTitle>
              {currentSession ? "Account" : "Authenticate"}
            </DialogTitle>
          </DialogHeader>

          <div className="w-full">
            {currentSession ? (
              // Authenticated user - show account options
              <div className="p-6 space-y-6">
                {/* Header */}
                <div className="text-center space-y-3">
                  <div className="mx-auto w-12 h-12 bg-brand-gold/20 rounded-full flex items-center justify-center">
                    <Mountain className="w-6 h-6 text-brand-gold" />
                  </div>
                  <div>
                    <p className="text-xl font-semibold text-gray-900 dark:text-white">
                      Hello,{" "}
                      {currentSession.user?.user_metadata?.first_name ||
                        currentSession.user?.email?.split("@")[0]}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {currentSession.user?.email}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-2">
                  <Button
                    onClick={() => {
                      setShowSavedJourneys(true);
                      onOpenChange(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 bg-brand-gold hover:bg-brand-gold/90 text-slate-900"
                  >
                    <BookOpen className="w-4 h-4" />
                    View Saved Journeys
                  </Button>

                  <Button
                    onClick={handleSignOutClick}
                    disabled={signingOut}
                    variant="outline"
                    className="w-full border-gray-300 dark:border-gray-600"
                  >
                    {signingOut ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        Signing out...
                      </>
                    ) : (
                      "Sign Out"
                    )}
                  </Button>
                </div>
              </div>
            ) : supabase ? (
              // Not authenticated - show auth UI
              <div className="p-6">
                <Auth
                  supabaseClient={supabase}
                  appearance={{
                    theme: ThemeSupa,
                    variables: {
                      default: {
                        colors: {
                          brand: "#D4A574",
                          brandAccent: "#C49660",
                          messageText: "#ef4444",
                          messageTextDanger: "#ef4444",
                          inputText: "#1f2937",
                          inputBackground: "#ffffff",
                          inputBorder: "#d1d5db",
                          inputBorderFocus: "#D4A574",
                          inputBorderHover: "#9ca3af",
                        },
                      },
                      dark: {
                        colors: {
                          brand: "#D4A574",
                          brandAccent: "#C49660",
                          messageText: "#f87171",
                          messageTextDanger: "#f87171",
                          inputText: "#f9fafb",
                          inputBackground: "#374151",
                          inputBorder: "#4b5563",
                          inputBorderFocus: "#D4A574",
                          inputBorderHover: "#6b7280",
                        },
                      },
                    },
                    style: {
                      message: {
                        color: "#ef4444",
                        fontWeight: "500",
                        padding: "8px 12px",
                        borderRadius: "6px",
                        backgroundColor: "rgba(239, 68, 68, 0.1)",
                        border: "1px solid rgba(239, 68, 68, 0.3)",
                      },
                    },
                  }}
                  theme="dark"
                  providers={[]}
                  redirectTo={`${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`}
                />
              </div>
            ) : (
              // Configuration error
              <div className="p-6 text-center space-y-3">
                <p className="text-sm text-red-500">
                  Authentication not configured
                </p>
                <p className="text-xs text-gray-500">
                  Please check environment variables
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Unsaved Work Warning Dialog */}
      <Dialog open={showUnsavedWarning} onOpenChange={setShowUnsavedWarning}>
        <DialogContent className="max-w-xs sm:max-w-sm p-6">
          <DialogHeader className="sr-only">
            <DialogTitle>Unsaved Work Warning</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-full">
                <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Unsaved Journey
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Your journey is not saved and will be lost. Are you sure you
                want to sign out?
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <Button
                onClick={() => setShowUnsavedWarning(false)}
                className="w-full bg-brand-gold hover:bg-brand-gold/90 text-slate-900"
              >
                Continue Journey
              </Button>
              <Button
                onClick={handleSignOut}
                variant="outline"
                className="w-full text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-900/20"
              >
                Leave Without Saving
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Saved Journeys Modal */}
      <SavedJourneysView
        open={showSavedJourneys}
        onOpenChange={setShowSavedJourneys}
      />
    </>
  );
}
