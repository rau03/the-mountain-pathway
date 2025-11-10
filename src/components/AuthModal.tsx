"use client";

import { useState } from "react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { Session } from "@supabase/supabase-js";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";
import supabase from "@/lib/supabaseClient";
import SavedJourneysView from "@/components/SavedJourneysView";

type AuthModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  session?: Session | null; // Add session prop to show different content when authenticated
};

export default function AuthModal({
  open,
  onOpenChange,
  session,
}: AuthModalProps) {
  const [showSavedJourneys, setShowSavedJourneys] = useState(false);
  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          // Anchor near top-right on desktop, centered fallback on small screens
          className="top-4 right-4 left-auto translate-x-0 translate-y-0 w-full max-w-sm sm:top-4 sm:right-4 sm:left-auto"
        >
          <DialogHeader className="sr-only">
            <DialogTitle>{session ? "Account" : "Authenticate"}</DialogTitle>
          </DialogHeader>

          <div className="w-full">
            {session ? (
              // Authenticated user - show account options
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Signed in as
                  </p>
                  <p className="font-medium">{session.user?.email}</p>
                </div>

                <div className="space-y-2">
                  <Button
                    onClick={() => {
                      setShowSavedJourneys(true);
                      onOpenChange(false);
                    }}
                    variant="outline"
                    className="w-full flex items-center gap-2"
                  >
                    <BookOpen className="w-4 h-4" />
                    View Saved Journeys
                  </Button>

                  <Button
                    onClick={async () => {
                      await supabase.auth.signOut();
                      onOpenChange(false);
                    }}
                    variant="outline"
                    className="w-full"
                  >
                    Sign Out
                  </Button>
                </div>
              </div>
            ) : (
              // Not authenticated - show auth UI
              <Auth
                supabaseClient={supabase}
                appearance={{ theme: ThemeSupa }}
                theme="dark"
                providers={["google"]}
                redirectTo={`${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`}
                onlyThirdPartyProviders={false}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Saved Journeys Modal */}
      <SavedJourneysView
        open={showSavedJourneys}
        onOpenChange={setShowSavedJourneys}
      />
    </>
  );
}
