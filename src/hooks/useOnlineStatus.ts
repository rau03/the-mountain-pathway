import { useEffect, useState } from "react";
import { Capacitor } from "@capacitor/core";
import { Network } from "@capacitor/network";

/**
 * Tracks the device's online/offline status.
 *
 * On native (iOS + Android): uses @capacitor/network which fires
 * via ConnectivityManager callbacks — works reliably on Android WebView
 * where the browser online/offline DOM events are unreliable.
 *
 * On web: uses navigator.onLine + window online/offline events
 * (unchanged from previous implementation).
 *
 * Defaults to true to avoid hydration mismatch on server render.
 * Returns { isOnline: boolean } — same interface as before.
 */
export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      // Native path: use Capacitor Network plugin
      // Works reliably on both iOS and Android
      let listenerHandle: { remove: () => void } | undefined;

      Network.getStatus().then((status) => {
        setIsOnline(status.connected);
      });

      Network.addListener("networkStatusChange", (status) => {
        setIsOnline(status.connected);
      }).then((handle) => {
        listenerHandle = handle;
      });

      return () => {
        listenerHandle?.remove();
      };
    }

    // Web fallback — unchanged from original implementation
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
