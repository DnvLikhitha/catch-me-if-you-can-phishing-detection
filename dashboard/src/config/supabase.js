import { createClient } from '@supabase/supabase-js';

// Supabase Configuration
const SUPABASE_URL = 'https://ngmsircoglpuafmsbfno.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5nbXNpcmNvZ2xwdWFmbXNiZm5vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk4MzY3NTgsImV4cCI6MjA4NTQxMjc1OH0.QedPuNP4_FRW_V_GYkYA8bUxacdsuuUWeyeTt_iMepQ';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// Helper function to get current user ID (anonymous or authenticated)
export const getUserId = () => {
  // For MVP, we'll use browser fingerprint as anonymous ID
  // In production, use Supabase Auth
  let userId = localStorage.getItem('phishguard_user_id');
  if (!userId) {
    userId = `anon_${crypto.randomUUID()}`;
    localStorage.setItem('phishguard_user_id', userId);
  }
  return userId;
};
