import { Session } from "@supabase/supabase-js";
import HomeClient from "@/components/HomeClient";

/**
 * Server-side wrapper that renders the interactive journey UI
 * Authentication is now handled via the AuthButton modal in the top-right
 */
export default function PageWrapper({ session }: { session: Session | null }) {
  return <HomeClient session={session} />;
}
