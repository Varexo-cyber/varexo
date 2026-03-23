const { neon } = require('@netlify/neon');

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Content-Type': 'application/json'
};

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  const sql = neon();

  try {
    // Auto-create table if not exists
    await sql`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id SERIAL PRIMARY KEY,
        naam VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        bericht TEXT NOT NULL,
        type VARCHAR(50) DEFAULT 'contact',
        status VARCHAR(50) DEFAULT 'new',
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;

    // GET - Admin reads all messages
    if (event.httpMethod === 'GET') {
      const result = await sql`SELECT * FROM contact_messages ORDER BY created_at DESC`;
      const messages = result.map(m => ({
        id: m.id.toString(),
        naam: m.naam,
        email: m.email,
        bericht: m.bericht,
        type: m.type,
        status: m.status,
        createdAt: m.created_at
      }));
      return { statusCode: 200, headers, body: JSON.stringify(messages) };
    }

    // POST - Submit new contact message
    if (event.httpMethod === 'POST') {
      const body = JSON.parse(event.body);
      const { naam, email, bericht, type } = body;

      const result = await sql`
        INSERT INTO contact_messages (naam, email, bericht, type)
        VALUES (${naam}, ${email}, ${bericht}, ${type || 'contact'})
        RETURNING *
      `;

      const m = result[0];
      return { statusCode: 200, headers, body: JSON.stringify({
        id: m.id.toString(),
        naam: m.naam,
        email: m.email,
        bericht: m.bericht,
        type: m.type,
        status: m.status,
        createdAt: m.created_at
      })};
    }

    return { statusCode: 404, headers, body: JSON.stringify({ error: 'Not found' }) };
  } catch (error) {
    console.error('Contact messages error:', error);
    return { statusCode: 500, headers, body: JSON.stringify({ error: error.message }) };
  }
};
