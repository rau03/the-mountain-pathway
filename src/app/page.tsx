import { createClient } from "@supabase/supabase-js";
import PageWrapper from "@/components/PageWrapper";

/**
 * Home page - publicly accessible landing page with optional authentication
 * Users can view the landing page without logging in
 * Journey content requires authentication (handled in HomeClient)
 */

// Prevent static generation - this page needs runtime environment variables
export const dynamic = "force-dynamic";

export default async function Home() {
  // Create a basic Supabase client with environment variables
  // This works better with Next.js 15's async cookies system
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

  // If env vars are missing, render without session (for build time)
  if (!supabaseUrl || !supabaseAnonKey) {
    return <PageWrapper session={null} />;
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  // Fetch the current session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Render the page with or without a session
  // Landing page is public; journey content will check for session
  return <PageWrapper session={session} />;
}
