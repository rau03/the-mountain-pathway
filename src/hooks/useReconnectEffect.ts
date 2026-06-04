import { useEffect, useRef } from "react";
import { useOnlineStatus } from "./useOnlineStatus";

/**
 * Fires onReconnect once on the offline→online transition.
 * Does not fire on initial mount.
 */
export function useReconnectEffect(onReconnect: () => void): void {
  const { isOnline } = useOnlineStatus();
  const wasOnlineRef = useRef(isOnline);

  useEffect(() => {
    if (isOnline && !wasOnlineRef.current) {
      onReconnect();
    }
    wasOnlineRef.current = isOnline;
  }, [isOnline, onReconnect]);
}
