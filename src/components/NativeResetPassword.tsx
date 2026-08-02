"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mountain, Loader2, CheckCircle } from "lucide-react";
import supabase from "@/lib/supabaseClient";
import PasswordInput from "@/components/PasswordInput";
import PasswordRequirements from "@/components/PasswordRequirements";
import {
  isPasswordValid,
  PASSWORD_POLICY_ERROR_MESSAGE,
} from "@/lib/passwordRequirements";

type Props = {
  onDone: () => void;
};

export default function NativeResetPassword({ onDone }: Props) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!supabase) {
      setError("Authentication not configured");
      return;
    }

    if (!isPasswordValid(password)) {
      setError(PASSWORD_POLICY_ERROR_MESSAGE);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password,
      });

      if (updateError) {
        setError(updateError.message);
      } else {
        setSuccess(true);
        setTimeout(onDone, 2500);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[100dvh] bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center p-4 pt-[calc(env(safe-area-inset-top,0px)+1rem)] pb-[calc(env(safe-area-inset-bottom,0px)+1rem)] overflow-y-auto">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 border border-brand-gold/20">
          <div className="text-center space-y-4">
            <div className="mx-auto w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              Password Updated!
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Your password has been successfully reset. Returning home...
            </p>
            <Loader2 className="w-5 h-5 animate-spin text-brand-gold mx-auto" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center p-4 pt-[calc(env(safe-area-inset-top,0px)+1rem)] pb-[calc(env(safe-area-inset-bottom,0px)+1rem)] overflow-y-auto">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 border border-brand-gold/20">
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="np-password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              New Password
            </label>
            <PasswordInput
              id="np-password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="at least 8 characters."
              autoFocus
              disabled={loading}
              autoComplete="new-password"
            />
            <PasswordRequirements password={password} />
          </div>

          <div>
            <label
              htmlFor="np-confirm"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Confirm Password
            </label>
            <PasswordInput
              id="np-confirm"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter your password"
              disabled={loading}
              autoComplete="new-password"
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
            className="w-full min-h-11 bg-brand-gold hover:bg-brand-gold/90 text-slate-900"
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

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={onDone}
            className="inline-flex min-h-11 items-center px-2 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            ← Back to home
          </button>
        </div>
      </div>
    </div>
  );
}
