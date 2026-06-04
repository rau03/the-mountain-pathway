"use client";

import { useEffect, useRef, useState } from "react";
import { Wifi, WifiOff } from "lucide-react";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";

const BACK_ONLINE_DURATION_MS = 2000;

export function OfflineBanner() {
  const { isOnline } = useOnlineStatus();
  const [showBackOnline, setShowBackOnline] = useState(false);
  const wasOnlineRef = useRef(isOnline);

  useEffect(() => {
    // Only flash "Back online" on a genuine offline -> online transition.
    if (isOnline && !wasOnlineRef.current) {
      setShowBackOnline(true);
      const timeoutId = window.setTimeout(() => {
        setShowBackOnline(false);
      }, BACK_ONLINE_DURATION_MS);

      wasOnlineRef.current = isOnline;
      return () => window.clearTimeout(timeoutId);
    }

    wasOnlineRef.current = isOnline;
  }, [isOnline]);

  if (!isOnline) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="fixed top-0 left-0 right-0 z-[60] bg-brand-gold text-slate-900 py-2 px-4 flex items-center justify-center gap-2 text-sm font-medium shadow-md"
        style={{ paddingTop: "calc(env(safe-area-inset-top, 0px) + 0.5rem)" }}
      >
        <WifiOff className="w-4 h-4 flex-shrink-0" />
        <span>You&apos;re offline — changes may not be saved.</span>
      </div>
    );
  }

  if (showBackOnline) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="fixed top-0 left-0 right-0 z-[60] bg-emerald-500 text-white py-2 px-4 flex items-center justify-center gap-2 text-sm font-medium shadow-md"
        style={{ paddingTop: "calc(env(safe-area-inset-top, 0px) + 0.5rem)" }}
      >
        <Wifi className="w-4 h-4 flex-shrink-0" />
        <span>Back online.</span>
      </div>
    );
  }

  return null;
}
