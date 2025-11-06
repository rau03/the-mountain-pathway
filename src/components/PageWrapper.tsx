import { Session } from "@supabase/supabase-js";
import Header from "@/components/Header";
import HomeClient from "@/components/HomeClient";

/**
 * Server-side wrapper that combines:
 * - Header (client component) for authentication state display
 * - HomeClient (client component) for interactive journey UI
 */
export default function PageWrapper({ session }: { session: Session | null }) {
  return (
    <>
      <Header session={session} />
      <HomeClient session={session} />
    </>
  );
}
