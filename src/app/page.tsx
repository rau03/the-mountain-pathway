import { createClient } from "@supabase/supabase-js";
import PageWrapper from "@/components/PageWrapper";

/**
 * Home page - publicly accessible landing page with optional authentication
 * Users can view the landing page without logging in
 * Journey content requires authentication (handled in HomeClient)
 */
export default async function Home() {
  // Create a basic Supabase client with environment variables
  // This works better with Next.js 15's async cookies system
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
  );

  // Fetch the current session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Render the page with or without a session
  // Landing page is public; journey content will check for session
  return <PageWrapper session={session} />;
}
