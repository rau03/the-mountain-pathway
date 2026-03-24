import { useEffect, useState } from "react";
import { App as CapApp } from "@capacitor/app";
import type { PluginListenerHandle } from "@capacitor/core";
import { Session } from "@supabase/supabase-js";
import supabase from "@/lib/supabaseClient";
import { isNativeApp } from "@/lib/capacitorUtils";
import { parseSupabaseAuthRedirect } from "@/lib/deepLink";

type RawResetIntent = {
  isResetIntent: boolean;
  tokenHash?: string;
};

function safeParseUrl(urlString: string): URL | null {
  try {
    return new URL(urlString);
  } catch {
    return null;
  }
}

export function detectRawResetIntent(urlString: string): RawResetIntent {
  const url = safeParseUrl(urlString);
  if (!url) return { isResetIntent: false };

  const pathname = url.pathname;
  const next = url.searchParams.get("next");
  const type = url.searchParams.get("type");
  const tokenHash = url.searchParams.get("token_hash") || undefined;

  const isRecoveryPath = pathname === "/auth/callback/recovery";
  const isConfirmRecoveryPath =
    pathname === "/auth/confirm" && (type === "recovery" || !!tokenHash);
  const hasResetNext = next === "/reset-password";

  return {
    isResetIntent: isRecoveryPath || isConfirmRecoveryPath || hasResetNext,
    tokenHash,
  };
}

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
      console.log("[useNativeAuthDeepLink] handleUrl start", { url });
      const parsed = parseSupabaseAuthRedirect(url);
      console.log("[useNativeAuthDeepLink] parseSupabaseAuthRedirect result", parsed);
      const rawResetIntent = detectRawResetIntent(url);
      console.log("[useNativeAuthDeepLink] detectRawResetIntent result", rawResetIntent);
      try {
        if (parsed.kind === "pkce") {
          console.log("[useNativeAuthDeepLink] branch=pkce exchangeCodeForSession");
          await sb.auth.exchangeCodeForSession(parsed.code);
        } else if (parsed.kind === "hash") {
          console.log("[useNativeAuthDeepLink] branch=hash setSession");
          await sb.auth.setSession({
            access_token: parsed.access_token,
            refresh_token: parsed.refresh_token || "",
          });
        } else {
          console.log("[useNativeAuthDeepLink] branch=none parsed kind");
          if (!rawResetIntent.isResetIntent) {
            console.log(
              "[useNativeAuthDeepLink] branch=none exiting (no reset intent)"
            );
            return;
          }

          if (rawResetIntent.tokenHash) {
            console.log(
              "[useNativeAuthDeepLink] branch=none verifyOtp with token_hash"
            );
            const { error } = await sb.auth.verifyOtp({
              token_hash: rawResetIntent.tokenHash,
              type: "recovery",
            });
            if (error) {
            console.log(
              "[useNativeAuthDeepLink] branch=none verifyOtp failed",
              error
            );
              console.error("Deep link recovery token verification failed:", error);
              return;
            }
          }

          console.log(
            "[useNativeAuthDeepLink] branch=none setShowNativeResetPassword(true)"
          );
          setShowNativeResetPassword(true);
          return;
        }

        const next = parsed.next;
        if (next === "/reset-password") {
          console.log(
            "[useNativeAuthDeepLink] branch=parsed setShowNativeResetPassword(true) via next"
          );
          setShowNativeResetPassword(true);
          return;
        }

        const pendingReset = localStorage.getItem("pendingPasswordReset");
        if (pendingReset) {
          console.log(
            "[useNativeAuthDeepLink] branch=parsed pendingPasswordReset found"
          );
          localStorage.removeItem("pendingPasswordReset");
          const elapsed = Date.now() - parseInt(pendingReset, 10);
          if (elapsed < 30 * 60 * 1000) {
            console.log(
              "[useNativeAuthDeepLink] branch=parsed setShowNativeResetPassword(true) via pending reset"
            );
            setShowNativeResetPassword(true);
            return;
          }
          console.log(
            "[useNativeAuthDeepLink] branch=parsed pending reset expired",
            { elapsed }
          );
        }
        console.log(
          "[useNativeAuthDeepLink] branch=parsed complete (no reset navigation)"
        );
      } catch (err) {
        console.error("Deep link auth handling failed:", err);
        return;
      }
    };

    let listener: PluginListenerHandle | null = null;

    (async () => {
      try {
        const res = await CapApp.getLaunchUrl();
        console.log("[useNativeAuthDeepLink] getLaunchUrl() result", res);
        if (res?.url) {
          console.log("[useNativeAuthDeepLink] cold start URL received", res.url);
          await handleUrl(res.url);
        } else {
          console.log("[useNativeAuthDeepLink] cold start URL missing");
        }
      } catch {
        // ignore
      }

      try {
        listener = await CapApp.addListener("appUrlOpen", ({ url }) => {
          console.log("[useNativeAuthDeepLink] appUrlOpen received", { url });
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
