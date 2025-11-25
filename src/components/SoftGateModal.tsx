"use client";

import { useState, useEffect } from "react";
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
import { Mountain, Sparkles, User, ArrowLeft } from "lucide-react";
import supabase from "@/lib/supabaseClient";

type SoftGateModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onContinueAsGuest: () => void;
  onAuthComplete: () => void;
};

type ModalView = "choice" | "signup" | "login";

export default function SoftGateModal({
  open,
  onOpenChange,
  onContinueAsGuest,
  onAuthComplete,
}: SoftGateModalProps) {
  const [view, setView] = useState<ModalView>("choice");
  const [currentSession, setCurrentSession] = useState<Session | null>(null);

  // Reset view when modal opens
  useEffect(() => {
    if (open) {
      setView("choice");
    }
  }, [open]);

  // Listen for auth state changes
  useEffect(() => {
    if (!supabase) return;

    // Check initial session state
    supabase.auth.getSession().then((result: unknown) => {
      const {
        data: { session },
      } = result as { data: { session: Session | null } };
      setCurrentSession(session);
    });

    // Subscribe to auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event: unknown, session: Session | null) => {
        // If user just authenticated (new session), trigger callback and close
        if (session && !currentSession && open) {
          setCurrentSession(session);
          onAuthComplete();
          onOpenChange(false);
        } else {
          setCurrentSession(session);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [open, onOpenChange, onAuthComplete, currentSession]);

  const handleContinueAsGuest = () => {
    onContinueAsGuest();
    onOpenChange(false);
  };

  const handleBack = () => {
    setView("choice");
  };

  // If user is already authenticated, just start the journey
  if (currentSession && open) {
    onAuthComplete();
    onOpenChange(false);
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm sm:max-w-md p-0 gap-0 overflow-hidden border-brand-gold/20">
        <DialogHeader className="sr-only">
          <DialogTitle>Before You Begin</DialogTitle>
        </DialogHeader>

        {view === "choice" ? (
          // Initial choice screen
          <div className="p-6 space-y-6">
            {/* Header */}
            <div className="text-center space-y-3">
              <div className="mx-auto w-12 h-12 bg-brand-gold/20 rounded-full flex items-center justify-center">
                <Mountain className="w-6 h-6 text-brand-gold" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                A Moment Before You Begin
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Your mountain pathway awaits. Would you like to save your
                reflections along the way?
              </p>
            </div>

            {/* Options */}
            <div className="space-y-3">
              {/* Sign Up Option */}
              <Button
                onClick={() => setView("signup")}
                className="w-full h-auto py-4 px-4 bg-brand-gold hover:bg-brand-gold/90 text-slate-900 flex items-start gap-3 justify-start"
              >
                <div className="flex-shrink-0 mt-0.5">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="font-semibold">
                    Yes, create my free account
                  </div>
                  <div className="text-xs opacity-80 font-normal">
                    Save and return to your journey anytime
                  </div>
                </div>
              </Button>

              {/* Guest Option */}
              <Button
                onClick={handleContinueAsGuest}
                variant="outline"
                className="w-full h-auto py-4 px-4 flex items-start gap-3 justify-start border-gray-300 dark:border-gray-600"
              >
                <div className="flex-shrink-0 mt-0.5">
                  <User className="w-5 h-5 text-gray-500" />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-gray-700 dark:text-gray-200">
                    No thanks, I&apos;ll explore first
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 font-normal">
                    Continue without saving
                  </div>
                </div>
              </Button>
            </div>

            {/* Login link */}
            <div className="text-center pt-2 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setView("login")}
                className="text-sm text-brand-gold hover:text-brand-gold/80 transition-colors"
              >
                I already have an account →
              </button>
            </div>
          </div>
        ) : (
          // Auth form (signup or login)
          <div className="p-6 space-y-4">
            {/* Back button */}
            <button
              onClick={handleBack}
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>

            {/* Header */}
            <div className="text-center space-y-2">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {view === "signup" ? "Create Your Account" : "Welcome Back"}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {view === "signup"
                  ? "Sign up to save your journey"
                  : "Log in to continue your journey"}
              </p>
            </div>

            {/* Auth UI */}
            {supabase ? (
              <Auth
                supabaseClient={supabase}
                appearance={{
                  theme: ThemeSupa,
                  variables: {
                    default: {
                      colors: {
                        brand: "#D4A574",
                        brandAccent: "#C49660",
                      },
                    },
                  },
                }}
                theme="dark"
                providers={[]}
                view={view === "signup" ? "sign_up" : "sign_in"}
                redirectTo={`${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`}
              />
            ) : (
              <div className="text-center space-y-3 py-4">
                <p className="text-sm text-red-500">
                  Authentication not configured
                </p>
                <p className="text-xs text-gray-500">
                  Please check environment variables
                </p>
              </div>
            )}

            {/* Toggle between signup/login */}
            <div className="text-center text-sm text-gray-500 dark:text-gray-400">
              {view === "signup" ? (
                <>
                  Already have an account?{" "}
                  <button
                    onClick={() => setView("login")}
                    className="text-brand-gold hover:text-brand-gold/80"
                  >
                    Log in
                  </button>
                </>
              ) : (
                <>
                  Don&apos;t have an account?{" "}
                  <button
                    onClick={() => setView("signup")}
                    className="text-brand-gold hover:text-brand-gold/80"
                  >
                    Sign up
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
