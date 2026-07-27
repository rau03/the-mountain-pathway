import React from "react";

/**
 * Shared scroll shell for legal pages (Terms, Privacy, Data Deletion).
 *
 * These pages render inside the Capacitor WebView via in-app navigation
 * (see PR #34), so — like every other screen in the app — they need an
 * explicit scroll container instead of relying on native document/body
 * scroll, which is unreliable on Android WebView.
 *
 * Mirrors the exact two-level shell proven to scroll correctly on Android
 * in MobileJourneyLayout: a non-scrolling outer shell (`h-[100dvh]
 * overflow-hidden`) with a single inner flex child that actually owns the
 * scroll (`flex-grow min-h-0 overflow-y-auto overscroll-y-contain`). A
 * single div that is both height-constrained and the scroll owner has not
 * been field-validated on Android and did not resolve the scroll bug.
 */
export default function LegalPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative h-[100dvh] w-full min-w-full bg-brand-stone flex flex-col overflow-hidden overscroll-none">
      <div className="flex-grow min-h-0 overflow-y-auto overscroll-y-contain touch-pan-y">
        <div className="min-h-screen bg-brand-stone">
          <div className="max-w-3xl mx-auto px-6 py-12">{children}</div>
        </div>
      </div>
    </div>
  );
}
