"use client";

import { useState, useMemo } from "react";
import type { Session } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import AuthModal from "@/components/AuthModal";

type AuthButtonProps = {
  session: Session | null;
  context: "landing" | "journey" | "summary";
};

export default function AuthButton({ session, context }: AuthButtonProps) {
  const [open, setOpen] = useState(false);

  const label = useMemo(() => {
    // Phase 3 context-aware labeling:
    if (!session) {
      return "Log in to save"; // Encourages auth for persistence
    }

    // Authenticated user labels based on context
    switch (context) {
      case "landing":
        return "Account";
      case "journey":
        return "Save progress";
      case "summary":
        return "Save journey";
      default:
        return "Account";
    }
  }, [session, context]);

  // Match audio player styling based on context
  const buttonStyle =
    context === "landing"
      ? "bg-brand-gold text-brand-slate hover:bg-brand-gold/90 px-3 py-2 rounded-full"
      : "bg-black/10 backdrop-blur-sm px-3 py-2 rounded-full border border-brand-slate/20";

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className={buttonStyle}
        onClick={() => setOpen(true)}
        aria-label={label}
        data-context={context}
      >
        {label}
      </Button>
      <AuthModal open={open} onOpenChange={setOpen} session={session} />
    </>
  );
}
