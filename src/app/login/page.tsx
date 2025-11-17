"use client";

import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import supabase from "../../lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useUser } from "@supabase/auth-helpers-react";
import { useEffect } from "react";

// Prevent static generation of this page
export const dynamic = "force-dynamic";

export default function LoginPage() {
  const router = useRouter();
  const user = useUser();

  // If a user is already logged in, redirect them to the home page.
  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  if (!supabase) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p>Configuration error: Supabase is not available</p>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
      }}
    >
      <div style={{ width: "100%", maxWidth: "420px" }}>
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          theme="dark"
          providers={["google"]}
          redirectTo={`${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`}
          onlyThirdPartyProviders={false}
        />
      </div>
    </div>
  );
}
