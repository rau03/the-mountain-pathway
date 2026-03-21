import { useEffect, useState } from "react";
import { App as CapApp } from "@capacitor/app";
import type { PluginListenerHandle } from "@capacitor/core";
import { Session } from "@supabase/supabase-js";
import supabase from "@/lib/supabaseClient";
import { isNativeApp } from "@/lib/capacitorUtils";
import { parseSupabaseAuthRedirect } from "@/lib/deepLink";

export function useNativeAuthDeepLink(liveSession: Session | null) {
  const [showNativeResetPassword, setShowNativeResetPassword] = useState(false);

  useEffect(() => {
    if (!liveSession || !isNativeApp()) return;

    const pendingReset = localStorage.getItem("pendingPasswordReset");
    if (pendingReset) {
      localStorage.removeItem("pendingPasswordReset");
      const elapsed = Date.now() - parseInt(pendingReset, 10);
      if (elapsed < 30 * 60 * 1000) {
        setShowNativeResetPassword(true);
      }
    }
  }, [liveSession]);

  useEffect(() => {
    const sb = supabase;
    if (!sb) return;
    if (!isNativeApp()) return;

    const handleUrl = async (url: string) => {
      const parsed = parseSupabaseAuthRedirect(url);
      try {
        if (parsed.kind === "pkce") {
          await sb.auth.exchangeCodeForSession(parsed.code);
        } else if (parsed.kind === "hash") {
          await sb.auth.setSession({
            access_token: parsed.access_token,
            refresh_token: parsed.refresh_token || "",
          });
        } else {
          return;
        }

        const next = parsed.next;
        if (next === "/reset-password") {
          setShowNativeResetPassword(true);
          return;
        }

        const pendingReset = localStorage.getItem("pendingPasswordReset");
        if (pendingReset) {
          localStorage.removeItem("pendingPasswordReset");
          const elapsed = Date.now() - parseInt(pendingReset, 10);
          if (elapsed < 30 * 60 * 1000) {
            setShowNativeResetPassword(true);
            return;
          }
        }
      } catch (err) {
        console.error("Deep link auth handling failed:", err);
        return;
      }
    };

    let listener: PluginListenerHandle | null = null;

    (async () => {
      try {
        const res = await CapApp.getLaunchUrl();
        if (res?.url) await handleUrl(res.url);
      } catch {
        // ignore
      }

      try {
        listener = await CapApp.addListener("appUrlOpen", ({ url }) => {
          void handleUrl(url);
        });
      } catch (err) {
        console.error("Failed to attach appUrlOpen listener:", err);
      }
    })();

    return () => {
      listener?.remove();
    };
  }, []);

  return {
    showNativeResetPassword,
    setShowNativeResetPassword,
  };
}
