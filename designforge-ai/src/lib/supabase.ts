import { createBrowserClient } from "@supabase/ssr";

let supabaseUrl = "";
let supabaseAnonKey = "";

function init() {
  supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
}

export function createClient() {
  init();
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Supabase environment variables are not set. " +
      "Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
    );
  }
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
