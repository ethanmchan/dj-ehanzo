// Netlify Function: createSuggestion
import { Handler } from '@netlify/functions';
import { Client } from 'pg';

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

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    return { statusCode: 500, body: JSON.stringify({ error: 'DATABASE_URL not configured' }) };
  }

  const client = new Client({ connectionString });
  await client.connect();
  try {
    const insertQuery = `
      INSERT INTO suggestions (song1, artist1, song2, artist2, suggester_name, suggester_email, reason)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    const values = [
      data.song1,
      data.artist1,
      data.song2 || null,
      data.artist2 || null,
      data.suggesterName,
      data.suggesterEmail || null,
      data.reason || null
    ];

    const res = await client.query(insertQuery, values);
    return { statusCode: 200, body: JSON.stringify({ success: true, inserted: res.rows }) };
  } catch (err: any) {
    console.error('DB insert error:', err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message || 'Insert failed' }) };
  } finally {
    await client.end();
  }
};
