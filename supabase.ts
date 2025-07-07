import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://plwriyeggooghtamyjgx.supabase.co';

const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsd3JpeWVnZ29vZ2h0YW15amd4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1ODc3ODEsImV4cCI6MjA2NzE2Mzc4MX0.cB3KYw5y37ReDNKgckB6zhIGurl9vzVflaqvpvpXZjc";

if (!SUPABASE_ANON_KEY) {
  throw new Error('SUPABASE_ANON_KEY environment variable is not set');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);