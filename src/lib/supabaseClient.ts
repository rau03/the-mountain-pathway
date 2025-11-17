// lib/supabaseClient.ts
import { createClient } from "@supabase/supabase-js";

// Get environment variables, with fallbacks for build time
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
