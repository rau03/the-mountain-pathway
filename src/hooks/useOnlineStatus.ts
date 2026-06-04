import { useEffect, useState } from "react";

/**
 * Tracks the browser's online/offline status.
 *
 * Defaults to `true` so the server-rendered and initial client render match
 * (deterministic — avoids a hydration mismatch). The real value is read from
 * `navigator.onLine` inside the effect, client-side only.
 *
 * Note: `navigator.onLine === true` only means a network interface is up, not
 * that the internet is actually reachable. That false-positive case is
 * acceptable for this feature's scope (offline banner).
 */
export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return { isOnline };
}
