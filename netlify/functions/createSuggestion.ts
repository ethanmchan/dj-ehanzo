// Netlify Function: createSuggestion
import { Handler } from '@netlify/functions';
import { getSupabase } from './supabaseClient';

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  const data = JSON.parse(event.body || '{}');

  // Validate required fields
  if (!data.song1 || !data.artist1 || !data.suggesterName) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing required fields' })
    };
  }

  // Insert into Supabase
  const supabase = getSupabase();
  const { data: inserted, error } = await supabase.from('suggestions').insert([
    {
      song1: data.song1,
      artist1: data.artist1,
      song2: data.song2 || null,
      artist2: data.artist2 || null,
      suggester_name: data.suggesterName,
      suggester_email: data.suggesterEmail || null,
      reason: data.reason || null,
      timestamp: new Date().toISOString(),
      likes: 0
    }
  ]).select();

  if (error) {
    console.error('Supabase insert error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ success: true, inserted: inserted })
  };
};
