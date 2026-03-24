const { neon } = require('@netlify/neon');

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
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
        telefoon VARCHAR(50),
        bedrijf VARCHAR(255),
        project_type VARCHAR(100),
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;

    // Add columns if they don't exist (for existing tables)
    try {
      await sql`ALTER TABLE contact_messages ADD COLUMN IF NOT EXISTS telefoon VARCHAR(50)`;
      await sql`ALTER TABLE contact_messages ADD COLUMN IF NOT EXISTS bedrijf VARCHAR(255)`;
      await sql`ALTER TABLE contact_messages ADD COLUMN IF NOT EXISTS project_type VARCHAR(100)`;
    } catch (e) { /* columns may already exist */ }

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
        telefoon: m.telefoon || '',
        bedrijf: m.bedrijf || '',
        projectType: m.project_type || '',
        createdAt: m.created_at
      }));
      return { statusCode: 200, headers, body: JSON.stringify(messages) };
    }

    // POST - Submit new contact message
    if (event.httpMethod === 'POST') {
      const body = JSON.parse(event.body);
      const { naam, email, bericht, type, telefoon, bedrijf, projectType } = body;

      const result = await sql`
        INSERT INTO contact_messages (naam, email, bericht, type, telefoon, bedrijf, project_type)
        VALUES (${naam}, ${email}, ${bericht}, ${type || 'contact'}, ${telefoon || null}, ${bedrijf || null}, ${projectType || null})
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
        telefoon: m.telefoon || '',
        bedrijf: m.bedrijf || '',
        projectType: m.project_type || '',
        createdAt: m.created_at
      })};
    }

    // DELETE - Remove a message
    if (event.httpMethod === 'DELETE') {
      const id = event.path.split('/').pop();
      if (!id) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'Message ID required' }) };
      }

      const result = await sql`DELETE FROM contact_messages WHERE id = ${id}`;
      if (result.rowCount === 0) {
        return { statusCode: 404, headers, body: JSON.stringify({ error: 'Message not found' }) };
      }

      return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
    }

    return { statusCode: 404, headers, body: JSON.stringify({ error: 'Not found' }) };
  } catch (error) {
    console.error('Contact messages error:', error);
    return { statusCode: 500, headers, body: JSON.stringify({ error: error.message }) };
  }
};
