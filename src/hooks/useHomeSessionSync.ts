import { useEffect, useRef, useState } from "react";
import { Session } from "@supabase/supabase-js";
import supabase from "@/lib/supabaseClient";

type SetAnonymous = (isAnonymous: boolean) => void;

export function useHomeSessionSync(
  initialSession: Session | null,
  setAnonymous: SetAnonymous
) {
  const [liveSession, setLiveSession] = useState<Session | null>(initialSession);
  const [showProfileSetupModal, setShowProfileSetupModal] = useState(false);
  const previousSessionRef = useRef<Session | null>(null);

  useEffect(() => {
    console.log("[useHomeSessionSync] setAnonymous from liveSession", {
      hasLiveSession: !!liveSession,
    });
    setAnonymous(!liveSession);
  }, [liveSession, setAnonymous]);

  useEffect(() => {
    if (!supabase) return;

    console.log("[useHomeSessionSync] initialize from initialSession", {
      hasInitialSession: !!initialSession,
    });
    setLiveSession(initialSession);
    previousSessionRef.current = initialSession;

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (event: string, newSession: Session | null) => {
        console.log("[useHomeSessionSync] onAuthStateChange", {
          event,
          hadPreviousSession: !!previousSessionRef.current,
          hasNewSession: !!newSession,
        });
        const isNewSignup =
          !previousSessionRef.current && newSession && event === "SIGNED_IN";

        console.log("[useHomeSessionSync] setLiveSession from auth event", {
          event,
          hasNewSession: !!newSession,
        });
        setLiveSession(newSession);
        previousSessionRef.current = newSession;

        if (isNewSignup && newSession?.user) {
          const userData = newSession.user.user_metadata;
          const hasName = userData?.first_name || userData?.full_name;
          if (!hasName) {
            setTimeout(() => {
              console.log("[useHomeSessionSync] opening profile setup modal");
              setShowProfileSetupModal(true);
            }, 500);
          }
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [initialSession]);

  return {
    liveSession,
    showProfileSetupModal,
    setShowProfileSetupModal,
  };
}
