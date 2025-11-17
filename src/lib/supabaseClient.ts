// lib/supabaseClient.ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Ensure env vars exist, fallback to empty strings for build time
// The actual values will be available at runtime in production
const url = supabaseUrl || "";
const key = supabaseAnonKey || "";

// Create client - on build time with empty strings is ok, actual connection happens at runtime
const supabase = createClient(url, key);

export default supabase;
