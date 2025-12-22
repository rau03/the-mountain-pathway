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
import { BookOpen, Loader2 } from "lucide-react";
import supabase from "@/lib/supabaseClient";
import SavedJourneysView from "@/components/SavedJourneysView";

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
  const wasUnauthenticatedRef = useRef(!session);

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

  const handleSignOut = async () => {
    if (!supabase) return;

    setSigningOut(true);
    try {
      await supabase.auth.signOut();
      setCurrentSession(null);
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
        <DialogContent className="max-w-xs sm:max-w-sm p-4 gap-3">
          <DialogHeader className="sr-only">
            <DialogTitle>
              {currentSession ? "Account" : "Authenticate"}
            </DialogTitle>
          </DialogHeader>

          <div className="w-full">
            {currentSession ? (
              // Authenticated user - show account options
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Signed in as
                  </p>
                  <p className="font-medium">
                    Hello,{" "}
                    {currentSession.user?.user_metadata?.first_name ||
                      currentSession.user?.email}
                  </p>
                </div>

                <div className="space-y-2">
                  <Button
                    onClick={() => {
                      setShowSavedJourneys(true);
                      onOpenChange(false);
                    }}
                    variant="outline"
                    className="w-full flex items-center gap-2"
                  >
                    <BookOpen className="w-4 h-4" />
                    View Saved Journeys
                  </Button>

                  <Button
                    onClick={handleSignOut}
                    disabled={signingOut}
                    variant="outline"
                    className="w-full"
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
            ) : (
              // Configuration error
              <div className="text-center space-y-3">
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

      {/* Saved Journeys Modal */}
      <SavedJourneysView
        open={showSavedJourneys}
        onOpenChange={setShowSavedJourneys}
      />
    </>
  );
}
