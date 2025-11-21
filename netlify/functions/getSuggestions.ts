// Netlify Function: getSuggestions
import { Handler } from '@netlify/functions';
import { Client } from 'pg';

export const handler: Handler = async () => {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    return { statusCode: 500, body: JSON.stringify({ error: 'DATABASE_URL not configured' }) };
  }

  const client = new Client({ connectionString });
  await client.connect();
  try {
    const res = await client.query('SELECT * FROM suggestions ORDER BY timestamp DESC');
    return { statusCode: 200, body: JSON.stringify(res.rows) };
  } catch (err: any) {
    console.error('DB select error:', err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message || 'Query failed' }) };
  } finally {
    await client.end();
  }
};
