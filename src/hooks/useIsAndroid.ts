import { useEffect, useState } from "react";
import { getPlatform } from "@/lib/capacitorUtils";

/**
 * Detects whether the app is running on native Android (Capacitor).
 *
 * Defaults to false to avoid hydration mismatch on server render — the
 * platform can only be resolved client-side, so the check runs in an
 * effect and the value updates after mount (same pattern as
 * useOnlineStatus / useViewportFlags).
 */
export function useIsAndroid(): boolean {
  const [isAndroid, setIsAndroid] = useState(false);

  useEffect(() => {
    setIsAndroid(getPlatform() === "android");
  }, []);

  return isAndroid;
}
