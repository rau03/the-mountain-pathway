"use client";

import React, { useState, useEffect } from "react";
import { Loader2, Mountain } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { isNativeApp } from "@/lib/capacitorUtils";

type ContactFormModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const inputClasses =
  "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold";
const labelClasses =
  "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";

export default function ContactFormModal({
  open,
  onOpenChange,
}: ContactFormModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Reset all state whenever the modal closes
  useEffect(() => {
    if (!open) {
      setName("");
      setEmail("");
      setMessage("");
      setWebsite("");
      setLoading(false);
      setError(null);
      setSuccess(false);
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("Please enter your name");
      return;
    }

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !trimmedEmail.includes("@") || !trimmedEmail.includes(".")) {
      setError("Please enter a valid email address");
      return;
    }

    if (message.trim().length < 10) {
      setError("Message must be at least 10 characters");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const baseUrl = isNativeApp() ? process.env.NEXT_PUBLIC_SITE_URL : "";
      const response = await fetch(`${baseUrl}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: trimmedEmail,
          message: message.trim(),
          website,
        }),
      });

      const payload = (await response.json().catch(() => null)) as
        | { error?: string }
        | null;

      if (!response.ok) {
        throw new Error(payload?.error || "Failed to send message");
      }

      setName("");
      setEmail("");
      setMessage("");
      setSuccess(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to send message"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-md">
        <DialogHeader>
          <DialogTitle>Get in Touch</DialogTitle>
          {!success && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              We&apos;d love to hear from you.
            </p>
          )}
        </DialogHeader>

        {success ? (
          <div className="flex flex-col items-center text-center space-y-4 py-2">
            <div className="mx-auto w-12 h-12 bg-brand-gold/20 rounded-full flex items-center justify-center">
              <Mountain className="w-6 h-6 text-brand-gold" />
            </div>
            <p className="text-base text-gray-700 dark:text-gray-200">
              Your message has been sent. We&apos;ll be in touch soon.
            </p>
            <Button
              onClick={() => onOpenChange(false)}
              className="w-full min-h-11 bg-brand-gold hover:bg-brand-gold/90 text-slate-900 font-semibold"
            >
              Close
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="contact-name" className={labelClasses}>
                Name
              </label>
              <input
                id="contact-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className={inputClasses}
                disabled={loading}
                autoFocus
              />
            </div>

            <div>
              <label htmlFor="contact-email" className={labelClasses}>
                Email
              </label>
              <input
                id="contact-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className={inputClasses}
                disabled={loading}
                autoComplete="email"
                autoCapitalize="none"
                autoCorrect="off"
              />
            </div>

            <div>
              <label htmlFor="contact-message" className={labelClasses}>
                Message
              </label>
              <textarea
                id="contact-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="How can we help?"
                rows={4}
                className={`${inputClasses} resize-none`}
                disabled={loading}
              />
            </div>

            {/* Honeypot spam trap — hidden from real users */}
            <input
              type="text"
              name="website"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="hidden"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
            />

            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full min-h-11 bg-brand-gold hover:bg-brand-gold/90 text-slate-900 font-semibold"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Sending...
                </>
              ) : (
                "Send Message"
              )}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
