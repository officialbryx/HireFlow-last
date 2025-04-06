import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Add some debugging to verify variables are loading
// console.log("Supabase URL available:", !!supabaseUrl);
// console.log("Supabase Key available:", !!supabaseKey);

// Create a custom cookieStorage implementation that matches the expected interface
const cookieStorage = {
  getItem: (key) => {
    try {
      const matches = document.cookie.match(new RegExp(`(^| )${key}=([^;]+)`));
      return matches ? JSON.parse(decodeURIComponent(matches[2])) : null;
    } catch (error) {
      console.error('Cookie parsing error:', error);
      return null;
    }
  },
  setItem: (key, value) => {
    try {
      const stringValue = JSON.stringify(value);
      let cookieString = `${key}=${encodeURIComponent(stringValue)}; path=/`;
      
      // Enforce security flags
      cookieString += `; samesite=Strict`;
      cookieString += `; secure`; // Always require HTTPS
      cookieString += `; max-age=${60 * 60 * 8}`; // 8 hour expiry
      
      document.cookie = cookieString;
    } catch (error) {
      console.error('Cookie setting error:', error);
    }
  },
  removeItem: (key) => {
    document.cookie = `${key}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  }
};

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: cookieStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storageKey: 'sb-auth-token',
    flowType: 'pkce', // Use PKCE flow for added security
    debug: import.meta.env.VITE_MODE === 'development'
  }
});
