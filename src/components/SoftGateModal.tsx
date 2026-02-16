"use client";

import { useState, useEffect } from "react";
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
import { isNativeApp } from "@/lib/capacitorUtils";
import {
  getPublicSiteUrl,
  getSupabaseAuthCallbackRedirectTo,
} from "@/lib/authRedirect";

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

  // Custom login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      setView("choice");
      setFirstName("");
      setEmail("");
      setPassword("");
      setSignupError(null);
      setSignupSuccess(false);
      setLoginEmail("");
      setLoginPassword("");
      setLoginError(null);
      setShowForgotPassword(false);
      setResetEmail("");
      setResetSuccess(false);
      setResetError(null);
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
    if (showForgotPassword) {
      setShowForgotPassword(false);
      setResetError(null);
      setResetSuccess(false);
    } else {
      setView("choice");
      setSignupError(null);
      setSignupSuccess(false);
      setLoginError(null);
    }
  };

  // Custom login handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!supabase) {
      setLoginError("Authentication not configured");
      return;
    }

    if (!loginEmail.trim()) {
      setLoginError("Please enter your email");
      return;
    }

    if (!loginPassword) {
      setLoginError("Please enter your password");
      return;
    }

    setLoginLoading(true);
    setLoginError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: loginEmail.trim(),
        password: loginPassword,
      });

      if (error) {
        setLoginError(error.message);
      }
      // Success is handled by the auth state change listener
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoginLoading(false);
    }
  };

  // Password reset handler
  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!supabase) {
      setResetError("Authentication not configured");
      return;
    }

    if (!resetEmail.trim()) {
      setResetError("Please enter your email");
      return;
    }

    setResetLoading(true);
    setResetError(null);

    try {
      const native = isNativeApp();
      const redirectTo = native
        ? `${getPublicSiteUrl()}/auth/callback?native=1&next=/reset-password`
        : `${window.location.origin}/reset-password`;

      const { error } = await supabase.auth.resetPasswordForEmail(
        resetEmail.trim(),
        {
          redirectTo,
        }
      );

      if (error) {
        setResetError(error.message);
      } else {
        setResetSuccess(true);
      }
    } catch (err) {
      setResetError(err instanceof Error ? err.message : "Reset failed");
    } finally {
      setResetLoading(false);
    }
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
          emailRedirectTo: getSupabaseAuthCallbackRedirectTo({
            isNative: isNativeApp(),
            webOrigin: typeof window !== "undefined" ? window.location.origin : undefined,
          }),
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
          // Custom Login Form
          <div className="p-6 space-y-4">
            {/* Back button */}
            <button
              onClick={handleBack}
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>

            {showForgotPassword ? (
              // Forgot Password Form
              <>
                {/* Header */}
                <div className="text-center space-y-2">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Reset Password
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Enter your email to receive a reset link
                  </p>
                </div>

                {resetSuccess ? (
                  <div className="text-center space-y-4 py-4">
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                      <p className="text-sm text-green-700 dark:text-green-300 font-medium">
                        Check your email!
                      </p>
                      <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                        We&apos;ve sent a password reset link to {resetEmail}
                      </p>
                    </div>
                    <Button
                      onClick={() => {
                        setShowForgotPassword(false);
                        setResetSuccess(false);
                      }}
                      variant="outline"
                      className="w-full border-gray-300 dark:border-gray-600"
                    >
                      Back to Login
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handlePasswordReset} className="space-y-4">
                    <div>
                      <label
                        htmlFor="reset-email"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Email
                      </label>
                      <input
                        id="reset-email"
                        type="email"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold"
                        autoFocus
                        disabled={resetLoading}
                      />
                    </div>

                    {resetError && (
                      <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                        <p className="text-sm text-red-600 dark:text-red-400">
                          {resetError}
                        </p>
                      </div>
                    )}

                    <Button
                      type="submit"
                      disabled={resetLoading}
                      className="w-full bg-brand-gold hover:bg-brand-gold/90 text-slate-900"
                    >
                      {resetLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          Sending...
                        </>
                      ) : (
                        "Send Reset Link"
                      )}
                    </Button>
                  </form>
                )}
              </>
            ) : (
              // Login Form
              <>
                {/* Header */}
                <div className="text-center space-y-2">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Welcome Back
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Log in to continue your journey
                  </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label
                      htmlFor="login-email"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Email
                    </label>
                    <input
                      id="login-email"
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold"
                      autoFocus
                      disabled={loginLoading}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="login-password"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Password
                    </label>
                    <input
                      id="login-password"
                      type="password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Your password"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold"
                      disabled={loginLoading}
                    />
                  </div>

                  {/* Forgot Password Link */}
                  <div className="text-right">
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(true)}
                      className="text-sm text-brand-gold hover:text-brand-gold/80"
                    >
                      Forgot password?
                    </button>
                  </div>

                  {loginError && (
                    <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                      <p className="text-sm text-red-600 dark:text-red-400">
                        {loginError}
                      </p>
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={loginLoading}
                    className="w-full bg-brand-gold hover:bg-brand-gold/90 text-slate-900"
                  >
                    {loginLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        Logging in...
                      </>
                    ) : (
                      "Log In"
                    )}
                  </Button>
                </form>

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
              </>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
