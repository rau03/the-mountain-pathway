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
import { Mountain, ArrowLeft, Loader2 } from "lucide-react";
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

  // Custom signup form state
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signupLoading, setSignupLoading] = useState(false);
  const [signupError, setSignupError] = useState<string | null>(null);
  const [signupSuccess, setSignupSuccess] = useState(false);

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      setView("choice");
      setFirstName("");
      setEmail("");
      setPassword("");
      setSignupError(null);
      setSignupSuccess(false);
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
    setSignupError(null);
    setSignupSuccess(false);
  };

  // Custom signup handler
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!supabase) {
      setSignupError("Authentication not configured");
      return;
    }

    if (!firstName.trim()) {
      setSignupError("Please enter your first name");
      return;
    }

    if (!email.trim()) {
      setSignupError("Please enter your email");
      return;
    }

    if (password.length < 6) {
      setSignupError("Password must be at least 6 characters");
      return;
    }

    setSignupLoading(true);
    setSignupError(null);

    try {
      const { error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            first_name: firstName.trim(),
            full_name: firstName.trim(),
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        setSignupError(error.message);
      } else {
        setSignupSuccess(true);
      }
    } catch (err) {
      setSignupError(err instanceof Error ? err.message : "Signup failed");
    } finally {
      setSignupLoading(false);
    }
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
            <div className="space-y-2">
              {/* Sign Up Option */}
              <Button
                onClick={() => setView("signup")}
                className="w-full h-auto py-3 px-4 bg-brand-gold hover:bg-brand-gold/90 text-slate-900 flex flex-col items-center justify-center gap-0.5"
              >
                <div className="font-semibold text-sm">
                  Yes, create my free account
                </div>
                <div className="text-xs opacity-80 font-normal">
                  Save and return to your journey anytime
                </div>
              </Button>

              {/* Guest Option */}
              <Button
                onClick={handleContinueAsGuest}
                variant="outline"
                className="w-full h-auto py-3 px-4 flex flex-col items-center justify-center gap-0.5 border-gray-300 dark:border-gray-600"
              >
                <div className="font-semibold text-sm text-gray-700 dark:text-gray-200">
                  No thanks, I&apos;ll explore first
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 font-normal">
                  Continue without saving
                </div>
              </Button>
            </div>

            {/* Login link */}
            <div className="text-center pt-2 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setView("login")}
                className="text-sm text-gray-900 dark:text-gray-100 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                I already have an account →
              </button>
            </div>
          </div>
        ) : view === "signup" ? (
          // Custom Signup Form
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
                Create Your Account
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Sign up to save your journey
              </p>
            </div>

            {signupSuccess ? (
              // Success message
              <div className="text-center space-y-4 py-4">
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <p className="text-sm text-green-700 dark:text-green-300 font-medium">
                    Check your email!
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                    We&apos;ve sent a confirmation link to {email}
                  </p>
                </div>
                <Button
                  onClick={() => {
                    setSignupSuccess(false);
                    setView("login");
                  }}
                  variant="outline"
                  className="w-full"
                >
                  Go to Login
                </Button>
              </div>
            ) : (
              // Signup form
              <form onSubmit={handleSignup} className="space-y-4">
                <div>
                  <label
                    htmlFor="signup-firstName"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    First Name
                  </label>
                  <input
                    id="signup-firstName"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Your first name"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold"
                    autoFocus
                    disabled={signupLoading}
                  />
                </div>

                <div>
                  <label
                    htmlFor="signup-email"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Email
                  </label>
                  <input
                    id="signup-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold"
                    disabled={signupLoading}
                  />
                </div>

                <div>
                  <label
                    htmlFor="signup-password"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Password
                  </label>
                  <input
                    id="signup-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold"
                    disabled={signupLoading}
                  />
                </div>

                {signupError && (
                  <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                    <p className="text-sm text-red-600 dark:text-red-400">
                      {signupError}
                    </p>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={signupLoading}
                  className="w-full bg-brand-gold hover:bg-brand-gold/90 text-slate-900"
                >
                  {signupLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Creating account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>
            )}

            {/* Toggle to login */}
            {!signupSuccess && (
              <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                Already have an account?{" "}
                <button
                  onClick={() => setView("login")}
                  className="text-brand-gold hover:text-brand-gold/80"
                >
                  Log in
                </button>
              </div>
            )}
          </div>
        ) : (
          // Login form (using Supabase Auth UI)
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
                Welcome Back
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Log in to continue your journey
              </p>
            </div>

            {/* Auth UI for Login */}
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
                        messageText: "#ef4444",
                        messageTextDanger: "#ef4444",
                        inputText: "#1f2937",
                        inputBackground: "#ffffff",
                        inputBorder: "#d1d5db",
                        inputBorderFocus: "#D4A574",
                        inputBorderHover: "#9ca3af",
                      },
                      borderWidths: {
                        inputBorderWidth: "1px",
                      },
                      radii: {
                        inputBorderRadius: "0.375rem",
                        buttonBorderRadius: "0.375rem",
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
                view="sign_in"
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

            {/* Toggle to signup */}
            <div className="text-center text-sm text-gray-500 dark:text-gray-400">
              Don&apos;t have an account?{" "}
              <button
                onClick={() => setView("signup")}
                className="text-brand-gold hover:text-brand-gold/80"
              >
                Sign up
              </button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
