"use client";

import React, { useState, useEffect, useRef } from "react";
import { Session } from "@supabase/supabase-js";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Loader2,
  AlertTriangle,
  Mountain,
  ArrowLeft,
} from "lucide-react";
import supabase from "@/lib/supabaseClient";
import SavedJourneysView from "@/components/SavedJourneysView";
import { useStore } from "@/lib/store/useStore";
import { getPublicSiteUrl, getEmailRedirectTo } from "@/lib/authRedirect";

type AuthModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  session?: Session | null;
};

type AuthView = "login" | "signup" | "forgot";
const DUPLICATE_EMAIL_ERROR_MESSAGE =
  "This email address is already connected to an account. Please log in or choose Forgot password.";
type SignupErrorLike = {
  message?: string;
  code?: string;
  status?: number;
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
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [showUnsavedWarning, setShowUnsavedWarning] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [accountError, setAccountError] = useState<string | null>(null);
  const [accountSuccess, setAccountSuccess] = useState<string | null>(null);
  const wasUnauthenticatedRef = useRef(!session);

  // Auth form state
  const [authView, setAuthView] = useState<AuthView>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState<string | null>(null);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendError, setResendError] = useState<string | null>(null);
  const [resendSuccess, setResendSuccess] = useState<string | null>(null);

  const isDuplicateEmailError = (error: SignupErrorLike | null | undefined) => {
    if (!error) return false;
    const normalizedMessage = (error.message || "").toLowerCase();
    const normalizedCode = (error.code || "").toLowerCase();

    if (
      normalizedCode.includes("user_already_exists") ||
      normalizedCode.includes("email_exists") ||
      normalizedCode.includes("email_already_in_use") ||
      normalizedMessage.includes("email-already-in-use") ||
      normalizedMessage.includes("already registered") ||
      normalizedMessage.includes("already in use") ||
      normalizedMessage.includes("already been registered") ||
      normalizedMessage.includes("already associated") ||
      normalizedMessage.includes("already connected")
    ) {
      return true;
    }

    return false;
  };

  const mapSignupErrorMessage = (error: SignupErrorLike) => {
    if (isDuplicateEmailError(error)) {
      return DUPLICATE_EMAIL_ERROR_MESSAGE;
    }
    return error.message || "Signup failed";
  };

  const isExistingAccountSignupResponse = (
    user: { identities?: Array<{ id?: string }> | null } | null | undefined
  ) => {
    // Supabase can return no error for existing confirmed users.
    // In that case identities is usually an empty array.
    return Array.isArray(user?.identities) && user.identities.length === 0;
  };

  const routeToLoginWithMessage = (message: string, emailToPrefill: string) => {
    setPassword("");
    setEmail(emailToPrefill.trim());
    setAuthSuccess(null);
    setAuthError(message);
    setAuthView("login");
  };

  // Get journey state to check for unsaved work
  const { isDirty, currentStep, isSaved, resetJourney, clearLocalProgress } =
    useStore();

  // Reset form when modal opens/closes
  useEffect(() => {
    if (open) {
      setAuthView("login");
      setEmail("");
      setPassword("");
      setFirstName("");
      setAuthError(null);
      setAuthSuccess(null);
      setResendLoading(false);
      setResendError(null);
      setResendSuccess(null);
      setShowDeleteConfirmation(false);
      setDeletingAccount(false);
      setAccountError(null);
      setAccountSuccess(null);
    }
  }, [open]);

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
    setAccountError(null);
    setAccountSuccess(null);

    try {
      await supabase.auth.signOut();
      setCurrentSession(null);
      resetJourney(); // Clear the journey data
      // Clear persisted data from localStorage to prevent sensitive data leakage
      if (typeof window !== "undefined") {
        localStorage.removeItem("mountain-pathway-storage");
      }
      onOpenChange(false);
      setSigningOut(false);
    } catch (error) {
      console.error("Error signing out:", error);
      setSigningOut(false);
    }
  };

  const handleDeleteAccountClick = () => {
    setAccountError(null);
    setAccountSuccess(null);
    setShowDeleteConfirmation(true);
  };

  const handleDeleteAccount = async () => {
    if (!supabase || !currentSession?.access_token) {
      setAccountError("Unable to verify your session. Please log in again.");
      return;
    }

    setDeletingAccount(true);
    setAccountError(null);
    setAccountSuccess(null);

    try {
      const response = await fetch("/api/auth/delete-account", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${currentSession.access_token}`,
        },
      });

      const payload = (await response.json().catch(() => null)) as
        | { error?: string }
        | null;

      if (!response.ok) {
        throw new Error(payload?.error || "Failed to delete account");
      }

      setShowDeleteConfirmation(false);
      setAuthView("login");
      setAuthError(null);
      setAuthSuccess("Your account has been permanently deleted.");
      setAccountSuccess(null);

      clearLocalProgress();
      if (typeof window !== "undefined") {
        localStorage.removeItem("mountain-pathway-storage");
      }

      await supabase.auth.signOut();
      setCurrentSession(null);

      window.setTimeout(() => {
        onOpenChange(false);
      }, 1300);
    } catch (error) {
      setAccountError(
        error instanceof Error ? error.message : "Failed to delete account"
      );
    } finally {
      setDeletingAccount(false);
    }
  };

  // Handle login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;

    if (!email.trim()) {
      setAuthError("Please enter your email");
      return;
    }

    if (!password) {
      setAuthError("Please enter your password");
      return;
    }

    setAuthLoading(true);
    setAuthError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setAuthError(error.message);
      }
      // Success handled by auth state listener
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setAuthLoading(false);
    }
  };

  // Handle signup
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;

    if (!firstName.trim()) {
      setAuthError("Please enter your first name");
      return;
    }

    if (password.length < 8) {
      setAuthError("Password must be at least 8 characters");
      return;
    }

    setAuthLoading(true);
    setAuthError(null);
    setResendError(null);
    setResendSuccess(null);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            first_name: firstName.trim(),
            full_name: firstName.trim(),
          },
          emailRedirectTo: getEmailRedirectTo(),
        },
      });

      if (error) {
        const mappedMessage = mapSignupErrorMessage(error);
        if (mappedMessage === DUPLICATE_EMAIL_ERROR_MESSAGE) {
          routeToLoginWithMessage(mappedMessage, email);
        } else {
          setAuthError(mappedMessage);
        }
      } else if (isExistingAccountSignupResponse(data?.user)) {
        routeToLoginWithMessage(DUPLICATE_EMAIL_ERROR_MESSAGE, email);
      } else {
        setAuthSuccess("Check your email for a confirmation link!");
      }
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : "Signup failed");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleResendConfirmation = async () => {
    if (!supabase) return;
    const trimmed = email.trim();
    if (!trimmed) {
      setResendError("Please enter your email first");
      return;
    }

    setResendLoading(true);
    setResendError(null);
    setResendSuccess(null);
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: trimmed,
      });
      if (error) {
        setResendError(error.message);
      } else {
        setResendSuccess("Confirmation email resent. Please check your inbox.");
      }
    } catch (err) {
      setResendError(
        err instanceof Error ? err.message : "Failed to resend confirmation email"
      );
    } finally {
      setResendLoading(false);
    }
  };

  // Handle forgot password
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;

    if (!email.trim()) {
      setAuthError("Please enter your email");
      return;
    }

    setAuthLoading(true);
    setAuthError(null);

    try {
      // Use /auth/callback/recovery which server-side redirects to
      // /auth/callback?next=/reset-password. This is the only reliable
      // way to carry the recovery signal — Supabase strips query params
      // from redirect_to but preserves the full path.
      const redirectTo = `${getPublicSiteUrl()}/auth/callback/recovery`;

      const { error } = await supabase.auth.resetPasswordForEmail(
        email.trim(),
        {
          redirectTo,
        }
      );

      if (error) {
        setAuthError(error.message);
      } else {
        localStorage.setItem("pendingPasswordReset", Date.now().toString());
        setAuthSuccess("Check your email for a password reset link!");
      }
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : "Reset failed");
    } finally {
      setAuthLoading(false);
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
                  {accountSuccess && (
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                      <p className="text-sm text-green-700 dark:text-green-300 text-center">
                        {accountSuccess}
                      </p>
                    </div>
                  )}
                  {accountError && (
                    <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                      <p className="text-sm text-red-600 dark:text-red-400 text-center">
                        {accountError}
                      </p>
                    </div>
                  )}
                  <Button
                    onClick={() => {
                      setShowSavedJourneys(true);
                      onOpenChange(false);
                    }}
                    className="w-full min-h-11 flex items-center justify-center gap-2 bg-brand-gold hover:bg-brand-gold/90 text-slate-900"
                  >
                    <BookOpen className="w-4 h-4" />
                    View Saved Journeys
                  </Button>

                  <Button
                    onClick={handleSignOutClick}
                    disabled={signingOut || deletingAccount}
                    variant="outline"
                    className="w-full min-h-11 border-gray-300 dark:border-gray-600"
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

                  <Button
                    onClick={handleDeleteAccountClick}
                    disabled={signingOut || deletingAccount}
                    variant="outline"
                    className="w-full min-h-11 text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-900/20"
                  >
                    Delete Account
                  </Button>
                </div>
              </div>
            ) : supabase ? (
              // Not authenticated - show custom auth forms
              <div className="p-6 space-y-4">
                {/* Back button for signup/forgot views */}
                {authView !== "login" && (
                  <button
                    type="button"
                    onClick={() => {
                      setAuthView("login");
                      setAuthError(null);
                      setAuthSuccess(null);
                    }}
                    className="inline-flex min-h-11 items-center gap-1 px-2 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </button>
                )}

                {/* Header */}
                <div className="text-center space-y-3">
                  <div className="mx-auto w-12 h-12 bg-brand-gold/20 rounded-full flex items-center justify-center">
                    <Mountain className="w-6 h-6 text-brand-gold" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {authView === "login" && "Welcome Back"}
                    {authView === "signup" && "Create Your Account"}
                    {authView === "forgot" && "Reset Password"}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {authView === "login" && "Log in to continue your journey"}
                    {authView === "signup" && "Sign up to save your journey"}
                    {authView === "forgot" &&
                      "Enter your email to receive a reset link"}
                  </p>
                </div>

                {/* Success message */}
                {authSuccess && (
                  <div className="space-y-3">
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                      <p className="text-sm text-green-700 dark:text-green-300 text-center">
                        {authSuccess}
                      </p>
                    </div>

                    {authView === "signup" && (
                      <div className="space-y-2">
                        {resendSuccess && (
                          <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                            <p className="text-sm text-green-700 dark:text-green-300 text-center">
                              {resendSuccess}
                            </p>
                          </div>
                        )}

                        {resendError && (
                          <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                            <p className="text-sm text-red-600 dark:text-red-400 text-center">
                              {resendError}
                            </p>
                          </div>
                        )}

                        <Button
                          type="button"
                          onClick={handleResendConfirmation}
                          disabled={resendLoading}
                          variant="outline"
                          className="w-full min-h-11 border-gray-300 dark:border-gray-600"
                        >
                          {resendLoading ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin mr-2" />
                              Resending...
                            </>
                          ) : (
                            "Resend confirmation email"
                          )}
                        </Button>

                        <Button
                          type="button"
                          onClick={() => {
                            setAuthView("login");
                            setAuthError(null);
                            setAuthSuccess(null);
                            setResendError(null);
                            setResendSuccess(null);
                          }}
                          className="w-full min-h-11 bg-brand-gold hover:bg-brand-gold/90 text-slate-900"
                        >
                          Back to login
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                {/* Login Form */}
                {authView === "login" && !authSuccess && (
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
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold"
                        autoFocus
                        disabled={authLoading}
                        autoComplete="username"
                        autoCapitalize="none"
                        autoCorrect="off"
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
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Your password"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold"
                        disabled={authLoading}
                        autoComplete="current-password"
                        autoCapitalize="none"
                        autoCorrect="off"
                      />
                    </div>

                    <div className="text-right">
                      <button
                        type="button"
                        onClick={() => {
                          setAuthView("forgot");
                          setAuthError(null);
                        }}
                        className="inline-flex min-h-11 items-center px-2 text-sm text-brand-gold hover:text-brand-gold/80"
                      >
                        Forgot password?
                      </button>
                    </div>

                    {authError && (
                      <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                        <p className="text-sm text-red-600 dark:text-red-400">
                          {authError}
                        </p>
                      </div>
                    )}

                    <Button
                      type="submit"
                      disabled={authLoading}
                      className="w-full min-h-11 bg-brand-gold hover:bg-brand-gold/90 text-slate-900"
                    >
                      {authLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          Logging in...
                        </>
                      ) : (
                        "Log In"
                      )}
                    </Button>

                    <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                      Don&apos;t have an account?{" "}
                      <button
                        type="button"
                        onClick={() => {
                          setAuthView("signup");
                          setAuthError(null);
                        }}
                        className="inline-flex min-h-11 items-center px-2 text-brand-gold hover:text-brand-gold/80"
                      >
                        Sign up
                      </button>
                    </div>
                  </form>
                )}

                {/* Signup Form */}
                {authView === "signup" && !authSuccess && (
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
                        name="firstName"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Your first name"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold"
                        autoFocus
                        disabled={authLoading}
                        autoComplete="given-name"
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
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold"
                        disabled={authLoading}
                        autoComplete="email"
                        autoCapitalize="none"
                        autoCorrect="off"
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
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="at least 8 characters."
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold"
                        disabled={authLoading}
                        autoComplete="new-password"
                        autoCapitalize="none"
                        autoCorrect="off"
                      />
                    </div>

                    {authError && (
                      <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                        <p className="text-sm text-red-600 dark:text-red-400">
                          {authError}
                        </p>
                      </div>
                    )}

                    <Button
                      type="submit"
                      disabled={authLoading}
                      className="w-full min-h-11 bg-brand-gold hover:bg-brand-gold/90 text-slate-900"
                    >
                      {authLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          Creating account...
                        </>
                      ) : (
                        "Create Account"
                      )}
                    </Button>

                    <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                      Already have an account?{" "}
                      <button
                        type="button"
                        onClick={() => {
                          setAuthView("login");
                          setAuthError(null);
                        }}
                        className="inline-flex min-h-11 items-center px-2 text-brand-gold hover:text-brand-gold/80"
                      >
                        Log in
                      </button>
                    </div>
                  </form>
                )}

                {/* Forgot Password Form */}
                {authView === "forgot" && !authSuccess && (
                  <form onSubmit={handleForgotPassword} className="space-y-4">
                    <div>
                      <label
                        htmlFor="forgot-email"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Email
                      </label>
                      <input
                        id="forgot-email"
                        type="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold"
                        autoFocus
                        disabled={authLoading}
                        autoComplete="email"
                        autoCapitalize="none"
                        autoCorrect="off"
                      />
                    </div>

                    {authError && (
                      <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                        <p className="text-sm text-red-600 dark:text-red-400">
                          {authError}
                        </p>
                      </div>
                    )}

                    <Button
                      type="submit"
                      disabled={authLoading}
                      className="w-full min-h-11 bg-brand-gold hover:bg-brand-gold/90 text-slate-900"
                    >
                      {authLoading ? (
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
                className="w-full min-h-11 bg-brand-gold hover:bg-brand-gold/90 text-slate-900"
              >
                Continue Journey
              </Button>
              <Button
                onClick={handleSignOut}
                variant="outline"
                className="w-full min-h-11 text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-900/20"
              >
                Leave Without Saving
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={showDeleteConfirmation}
        onOpenChange={(nextOpen) => {
          if (!deletingAccount) {
            setShowDeleteConfirmation(nextOpen);
          }
        }}
      >
        <DialogContent className="max-w-xs sm:max-w-sm p-6">
          <DialogHeader className="sr-only">
            <DialogTitle>Delete account confirmation</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
                <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Delete Account Permanently
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                This action cannot be undone. Your account and saved journey data
                will be permanently deleted.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <Button
                onClick={() => setShowDeleteConfirmation(false)}
                disabled={deletingAccount}
                className="w-full min-h-11 bg-brand-gold hover:bg-brand-gold/90 text-slate-900"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeleteAccount}
                disabled={deletingAccount}
                variant="outline"
                className="w-full min-h-11 text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-900/20"
              >
                {deletingAccount ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Deleting account...
                  </>
                ) : (
                  "Yes, Delete Account"
                )}
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
