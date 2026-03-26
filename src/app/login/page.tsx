"use client";

import { useState, type FormEvent } from "react";
import supabase from "../../lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useUser } from "@supabase/auth-helpers-react";
import { useEffect } from "react";
import { openExternalUrl } from "@/lib/capacitorUtils";
import { getEmailRedirectTo, getPublicSiteUrl } from "@/lib/authRedirect";

// Prevent static generation of this page
export const dynamic = "force-dynamic";

type LoginView = "login" | "signup" | "forgot";
const DUPLICATE_EMAIL_ERROR_MESSAGE =
  "This email address is already connected to an account. Please log in or choose Forgot password.";
type SignupErrorLike = {
  message?: string;
  code?: string;
};

export default function LoginPage() {
  const router = useRouter();
  const user = useUser();
  const [view, setView] = useState<LoginView>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // If a user is already logged in, redirect them to the home page.
  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  if (!supabase) {
    return (
      <div style={{ minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p>Configuration error: Supabase is not available</p>
      </div>
    );
  }
  const sb = supabase;

  const isDuplicateEmailError = (signupError: SignupErrorLike | null | undefined) => {
    if (!signupError) return false;
    const normalizedMessage = (signupError.message || "").toLowerCase();
    const normalizedCode = (signupError.code || "").toLowerCase();
    return (
      normalizedCode.includes("user_already_exists") ||
      normalizedCode.includes("email_exists") ||
      normalizedCode.includes("email_already_in_use") ||
      normalizedMessage.includes("email-already-in-use") ||
      normalizedMessage.includes("already registered") ||
      normalizedMessage.includes("already in use") ||
      normalizedMessage.includes("already been registered") ||
      normalizedMessage.includes("already associated") ||
      normalizedMessage.includes("already connected")
    );
  };

  const isExistingAccountSignupResponse = (
    candidateUser: { identities?: Array<{ id?: string }> | null } | null | undefined
  ) => {
    return Array.isArray(candidateUser?.identities) && candidateUser.identities.length === 0;
  };

  const routeToLoginWithMessage = (message: string, emailToPrefill: string) => {
    setView("login");
    setPassword("");
    setEmail(emailToPrefill.trim());
    setSuccess(null);
    setError(message);
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setError("Please enter your email");
      return;
    }

    if (!password) {
      setError("Please enter your password");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const { error: loginError } = await sb.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (loginError) {
        setError(loginError.message);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: FormEvent) => {
    e.preventDefault();
    if (!firstName.trim()) {
      setError("Please enter your first name");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const { data, error: signupError } = await sb.auth.signUp({
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

      if (signupError) {
        if (isDuplicateEmailError(signupError)) {
          routeToLoginWithMessage(DUPLICATE_EMAIL_ERROR_MESSAGE, email);
        } else {
          setError(signupError.message || "Signup failed");
        }
      } else if (isExistingAccountSignupResponse(data?.user)) {
        routeToLoginWithMessage(DUPLICATE_EMAIL_ERROR_MESSAGE, email);
      } else {
        setSuccess("Check your email for a confirmation link!");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Please enter your email");
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const redirectTo = `${getPublicSiteUrl()}/auth/callback/recovery`;
      const { error: resetError } = await sb.auth.resetPasswordForEmail(
        email.trim(),
        { redirectTo }
      );
      if (resetError) {
        setError(resetError.message);
      } else {
        localStorage.setItem("pendingPasswordReset", Date.now().toString());
        setSuccess("Check your email for a password reset link!");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        paddingTop: "calc(env(safe-area-inset-top, 0px) + 1rem)",
        paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 1rem)",
        paddingLeft: "1rem",
        paddingRight: "1rem",
        overflowY: "auto",
        WebkitOverflowScrolling: "touch",
      }}
    >
      <div style={{ width: "100%", maxWidth: "420px" }} className="space-y-4">
        <div className="text-center space-y-2">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            {view === "login" && "Welcome Back"}
            {view === "signup" && "Create Your Account"}
            {view === "forgot" && "Reset Password"}
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {view === "login" && "Log in to continue your journey"}
            {view === "signup" && "Sign up to save your journey"}
            {view === "forgot" && "Enter your email to receive a reset link"}
          </p>
        </div>

        {success && (
          <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <p className="text-sm text-green-700 dark:text-green-300 text-center">
              {success}
            </p>
          </div>
        )}
        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
            <p className="text-sm text-red-600 dark:text-red-400 text-center">{error}</p>
          </div>
        )}

        {view === "login" && !success && (
          <form onSubmit={handleLogin} className="space-y-3">
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              autoComplete="username"
              autoCapitalize="none"
              autoCorrect="off"
              disabled={loading}
            />
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              autoComplete="current-password"
              autoCapitalize="none"
              autoCorrect="off"
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => {
                setView("forgot");
                setError(null);
                setSuccess(null);
              }}
              className="inline-flex items-center min-h-11 px-2 text-sm text-brand-gold hover:text-brand-gold/80"
            >
              Forgot password?
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-full min-h-11 px-4 py-2 rounded-md bg-brand-gold text-slate-900 font-semibold hover:bg-brand-gold/90"
            >
              {loading ? "Logging in..." : "Log In"}
            </button>
            <p className="text-sm text-center text-gray-500 dark:text-gray-400">
              Don&apos;t have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  setView("signup");
                  setError(null);
                  setSuccess(null);
                }}
                className="inline-flex items-center min-h-11 px-2 text-brand-gold hover:text-brand-gold/80"
              >
                Sign up
              </button>
            </p>
          </form>
        )}

        {view === "signup" && !success && (
          <form onSubmit={handleSignup} className="space-y-3">
            <input
              type="text"
              name="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Your first name"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              autoComplete="given-name"
              disabled={loading}
            />
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              autoComplete="email"
              autoCapitalize="none"
              autoCorrect="off"
              disabled={loading}
            />
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="at least 8 characters."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              autoComplete="new-password"
              autoCapitalize="none"
              autoCorrect="off"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full min-h-11 px-4 py-2 rounded-md bg-brand-gold text-slate-900 font-semibold hover:bg-brand-gold/90"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
            <p className="text-sm text-center text-gray-500 dark:text-gray-400">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  setView("login");
                  setError(null);
                  setSuccess(null);
                }}
                className="inline-flex items-center min-h-11 px-2 text-brand-gold hover:text-brand-gold/80"
              >
                Log in
              </button>
            </p>
          </form>
        )}

        {view === "forgot" && !success && (
          <form onSubmit={handleForgotPassword} className="space-y-3">
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              autoComplete="email"
              autoCapitalize="none"
              autoCorrect="off"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full min-h-11 px-4 py-2 rounded-md bg-brand-gold text-slate-900 font-semibold hover:bg-brand-gold/90"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
            <p className="text-sm text-center text-gray-500 dark:text-gray-400">
              Back to{" "}
              <button
                type="button"
                onClick={() => {
                  setView("login");
                  setError(null);
                  setSuccess(null);
                }}
                className="inline-flex items-center min-h-11 px-2 text-brand-gold hover:text-brand-gold/80"
              >
                login
              </button>
            </p>
          </form>
        )}
      </div>

      {/* Buy Me a Coffee Link */}
      <a
        href="https://buymeacoffee.com/themountainpathway"
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => {
          e.preventDefault();
          void openExternalUrl("https://buymeacoffee.com/themountainpathway");
        }}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.5rem",
          marginTop: "2rem",
          fontSize: "0.875rem",
          color: "rgba(255, 255, 255, 0.5)",
          textDecoration: "none",
          transition: "color 0.2s",
        }}
        onMouseOver={(e) => (e.currentTarget.style.color = "rgba(255, 255, 255, 0.7)")}
        onMouseOut={(e) => (e.currentTarget.style.color = "rgba(255, 255, 255, 0.5)")}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M10 2v2" />
          <path d="M14 2v2" />
          <path d="M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1" />
          <path d="M6 2v2" />
        </svg>
        Buy me a Coffee
      </a>
    </div>
  );
}
