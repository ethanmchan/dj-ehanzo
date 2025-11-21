// Netlify Function: getSuggestions
import { Handler } from '@netlify/functions';
import { getSupabase } from './supabaseClient';

export const handler: Handler = async () => {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('suggestions')
    .select('*')
    .order('timestamp', { ascending: false });

  if (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify(data)
  };
};
