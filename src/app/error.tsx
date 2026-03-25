"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, Mountain } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Route error boundary caught an error:", error);
  }, [error]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-brand-slate to-brand-stone">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(212,175,55,0.22),transparent_55%)]" />
      <div className="relative flex min-h-screen items-center justify-center p-6">
        <div className="w-full max-w-md rounded-2xl border border-brand-gold/30 bg-white/95 p-7 text-center shadow-xl">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand-gold/20">
            <Mountain className="h-7 w-7 text-brand-gold" />
          </div>
          <h1 className="text-2xl font-semibold text-brand-slate">
            Let&apos;s get you back on the pathway
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-brand-slate/80">
            Something unexpected happened, but your journey is still here. Try
            again or return home.
          </p>
          <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-xs text-amber-700">
            <AlertTriangle className="h-3.5 w-3.5" />
            Temporary app issue
          </div>
          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
            <Button
              onClick={reset}
              className="bg-brand-gold text-slate-900 hover:bg-brand-gold/90"
            >
              Retry
            </Button>
            <Button asChild variant="outline">
              <Link href="/">Go Home</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
