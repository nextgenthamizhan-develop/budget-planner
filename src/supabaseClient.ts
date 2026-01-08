import { createClient, SupabaseClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

let _supabase: SupabaseClient | null = null;

if (url && anon) {
  _supabase = createClient(url, anon);
}

export const supabase = _supabase;
export const isSupabaseConfigured = Boolean(url && anon);
