import { createClient } from '@supabase/supabase-js';

const getSupabase = () => {
    // 1. Try environment variables (Vercel/Local dev)
    const envUrl = import.meta.env.VITE_SUPABASE_URL;
    const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (envUrl && envKey && !envUrl.includes('your-project')) {
        return createClient(envUrl, envKey);
    }

    // 2. Try localStorage (UI-based configuration)
    try {
        const saved = localStorage.getItem('jobTracker_supabaseConfig');
        if (saved) {
            const { url, anonKey } = JSON.parse(saved);
            if (url && anonKey) {
                return createClient(url, anonKey);
            }
        }
    } catch (e) {
        console.error('Failed to parse Supabase config from localStorage:', e);
    }

    return null;
};

export const supabase = getSupabase();
