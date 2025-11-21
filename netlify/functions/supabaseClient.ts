// Supabase client for Netlify Functions
import { createClient, SupabaseClient } from '@supabase/supabase-js';

let _supabase: SupabaseClient | null = null;

// Create Supabase client lazily at invocation time so env vars injected by Netlify are available.
export function getSupabase(): SupabaseClient {
	if (_supabase) return _supabase;

	const supabaseUrl = process.env.SUPABASE_URL;
	const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

	// Debug presence (do not log the actual keys)
	console.log('supabase: SUPABASE_URL present=', !!supabaseUrl);
	console.log('supabase: SUPABASE_SERVICE_ROLE_KEY present=', !!supabaseServiceKey);

	if (!supabaseUrl || !supabaseServiceKey) {
		throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set');
	}

	_supabase = createClient(supabaseUrl, supabaseServiceKey);
	return _supabase;
}
