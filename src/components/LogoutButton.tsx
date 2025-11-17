"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function LogoutButton() {
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [supabase, setSupabase] = useState<any>(null);

  // Lazy load supabase client
  useEffect(() => {
    let mounted = true;

    if (typeof window !== "undefined") {
      import("@/lib/supabaseClient").then((module) => {
        if (mounted) {
          setSupabase(module.default);
        }
      });
    }

    return () => {
      mounted = false;
    };
  }, []);

  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
      router.refresh();
    }
  };

  return (
    <button
      onClick={handleLogout}
      style={{
        background: "none",
        border: "1px solid white",
        color: "white",
        padding: "0.5rem 1rem",
        borderRadius: "5px",
        cursor: "pointer",
      }}
    >
      Logout
    </button>
  );
}
