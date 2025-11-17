"use client";

import { useRouter } from "next/navigation";
import supabase from "@/lib/supabaseClient";

export default function LogoutButton() {
  const router = useRouter();

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
