import { createClient } from '@supabase/supabase-js';

// Using credentials from user provided file
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://lgzhmnmvdmaucdrbsffk.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxnemhtbm12ZG1hdWNkcmJzZmZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyNzUxODAsImV4cCI6MjA4MDg1MTE4MH0.bR412a4WHmRLhLiv9LV-Pooj1Zsjn1CuiG9vvaG2Lk8';

// Check if credentials are present
export const isSupabaseConfigured = !!supabaseUrl && !!supabaseAnonKey;

if (!isSupabaseConfigured) {
    console.warn("Supabase credentials missing!");
}

export const supabase = createClient(
    supabaseUrl,
    supabaseAnonKey
);