"use client";

import Link from "next/link";
import { Session } from "@supabase/supabase-js";
import LogoutButton from "./LogoutButton";

export default function Header({ session }: { session: Session | null }) {
  return (
    <header>
      <nav
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          padding: "1rem",
          borderBottom: "1px solid #333",
          backgroundColor: "#1a1a1a",
          color: "white",
        }}
      >
        {session ? (
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <span>{session.user.email}</span>
            <LogoutButton />
          </div>
        ) : (
          <Link
            href="/login"
            style={{ color: "white", textDecoration: "none" }}
          >
            Login
          </Link>
        )}
      </nav>
    </header>
  );
}
