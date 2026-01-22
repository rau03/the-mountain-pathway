"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Mountain, Loader2, CheckCircle, AlertCircle, Coffee } from "lucide-react";
import supabase from "@/lib/supabaseClient";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isValidSession, setIsValidSession] = useState<boolean | null>(null);
  const [isExchangingCode, setIsExchangingCode] = useState(false);

  // Handle code exchange and session check
  useEffect(() => {
    const handleAuth = async () => {
      // Add a timeout to prevent infinite loading
      const timeoutId = setTimeout(() => {
        console.error("Auth check timed out");
        setIsValidSession(false);
        setIsExchangingCode(false);
      }, 10000);

      try {
        if (!supabase) {
          console.error("Supabase client not available");
          clearTimeout(timeoutId);
          setIsValidSession(false);
          return;
        }

        // Check for hash fragment (older Supabase flow)
        // The hash might contain access_token and type=recovery
        if (typeof window !== "undefined" && window.location.hash) {
          const hashParams = new URLSearchParams(
            window.location.hash.substring(1)
          );
          const accessToken = hashParams.get("access_token");
          const refreshToken = hashParams.get("refresh_token");
          const type = hashParams.get("type");

          if (accessToken && type === "recovery") {
            setIsExchangingCode(true);
            try {
              // Set the session from the hash tokens
              const { error: sessionError } = await supabase.auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken || "",
              });

              if (sessionError) {
                console.error("Session error:", sessionError);
                clearTimeout(timeoutId);
                setIsValidSession(false);
                setIsExchangingCode(false);
                return;
              }

              clearTimeout(timeoutId);
              setIsValidSession(true);
              setIsExchangingCode(false);
              // Clean up URL
              window.history.replaceState({}, "", "/reset-password");
              return;
            } catch (err) {
              console.error("Hash token error:", err);
            }
          }
        }

        // Check if there's a code in the URL (PKCE flow)
        const code = searchParams.get("code");

        if (code) {
          setIsExchangingCode(true);
          try {
            // Exchange the code for a session
            const { error: exchangeError } =
              await supabase.auth.exchangeCodeForSession(code);

            if (exchangeError) {
              console.error("Code exchange error:", exchangeError);
              clearTimeout(timeoutId);
              setIsValidSession(false);
              setIsExchangingCode(false);
              return;
            }

            // Code exchanged successfully, now check session
            const {
              data: { session },
            } = await supabase.auth.getSession();
            clearTimeout(timeoutId);
            setIsValidSession(!!session);
            setIsExchangingCode(false);

            // Clean up URL by removing the code parameter
            window.history.replaceState({}, "", "/reset-password");
          } catch (err) {
            console.error("Error exchanging code:", err);
            clearTimeout(timeoutId);
            setIsValidSession(false);
            setIsExchangingCode(false);
          }
        } else {
          // No code in URL, just check if there's an existing session
          try {
            const {
              data: { session },
            } = await supabase.auth.getSession();
            clearTimeout(timeoutId);
            setIsValidSession(!!session);
          } catch (err) {
            console.error("Error getting session:", err);
            clearTimeout(timeoutId);
            setIsValidSession(false);
          }
        }
      } catch (err) {
        console.error("Auth handler error:", err);
        setIsValidSession(false);
        setIsExchangingCode(false);
      }
    };

    handleAuth();
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!supabase) {
      setError("Authentication not configured");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      });

      if (updateError) {
        setError(updateError.message);
      } else {
        setSuccess(true);
        // Clear any persisted journey state so user starts fresh
        if (typeof window !== "undefined") {
          localStorage.removeItem("mountain-pathway-storage");
        }
        // Redirect to home after 3 seconds
        setTimeout(() => {
          router.push("/");
        }, 3000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  // Loading state while checking session or exchanging code
  if (isValidSession === null || isExchangingCode) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center p-4">
        <div className="flex flex-col items-center">
          <Loader2 className="w-8 h-8 animate-spin text-brand-gold" />
          <p className="mt-4 text-gray-400">
            {isExchangingCode ? "Verifying your link..." : "Loading..."}
          </p>
        </div>
      </div>
    );
  }

  // Invalid or expired session
  if (!isValidSession) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 border border-brand-gold/20">
          <div className="text-center space-y-4">
            <div className="mx-auto w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              Link Expired
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              This password reset link has expired or is invalid. Please request
              a new one.
            </p>
            <Button
              onClick={() => router.push("/")}
              className="w-full bg-brand-gold hover:bg-brand-gold/90 text-slate-900"
            >
              Return Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Success state
  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 border border-brand-gold/20">
          <div className="text-center space-y-4">
            <div className="mx-auto w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              Password Updated!
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Your password has been successfully reset. Redirecting you home...
            </p>
            <div className="flex items-center justify-center">
              <Loader2 className="w-5 h-5 animate-spin text-brand-gold" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Password reset form
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 border border-brand-gold/20">
        {/* Header */}
        <div className="text-center space-y-3 mb-6">
          <div className="mx-auto w-12 h-12 bg-brand-gold/20 rounded-full flex items-center justify-center">
            <Mountain className="w-6 h-6 text-brand-gold" />
          </div>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            Set New Password
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Enter your new password below
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              New Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold"
              autoFocus
              disabled={loading}
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter your password"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold"
              disabled={loading}
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-gold hover:bg-brand-gold/90 text-slate-900"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Updating...
              </>
            ) : (
              "Update Password"
            )}
          </Button>
        </form>

        {/* Back link */}
        <div className="mt-6 text-center">
          <button
            onClick={() => router.push("/")}
            className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            ← Back to home
          </button>
        </div>

        {/* Buy Me a Coffee Link */}
        <div className="mt-6 text-center">
          <a
            href="https://buymeacoffee.com/themountainpathway"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-300 transition-colors"
          >
            <Coffee className="w-4 h-4" />
            <span>Buy me a Coffee</span>
          </a>
        </div>
      </div>
    </div>
  );
}

// Loading fallback for Suspense
function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div className="flex flex-col items-center">
        <Loader2 className="w-8 h-8 animate-spin text-brand-gold" />
        <p className="mt-4 text-gray-400">Loading...</p>
      </div>
    </div>
  );
}

// Wrapper component with Suspense for useSearchParams
export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ResetPasswordContent />
    </Suspense>
  );
}
