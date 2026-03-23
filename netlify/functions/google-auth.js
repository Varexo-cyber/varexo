const { neon } = require('@netlify/neon');

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json'
};

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const sql = neon();
    const body = JSON.parse(event.body || '{}');
    const { email, displayName, photoURL } = body;

    if (!email || !displayName) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Email and displayName are required' })
      };
    }

    const result = await sql`
      INSERT INTO users (email, display_name, photo_url, provider)
      VALUES (${email}, ${displayName}, ${photoURL || null}, 'google')
      ON CONFLICT (email) DO UPDATE SET
        display_name = ${displayName},
        photo_url = COALESCE(${photoURL || null}, users.photo_url),
        updated_at = NOW()
      RETURNING email, display_name, photo_url, provider, is_admin
    `;

    const user = {
      email: result[0].email,
      displayName: result[0].display_name,
      photoURL: result[0].photo_url,
      provider: result[0].provider,
      isAdmin: result[0].is_admin
    };

    return { statusCode: 200, headers, body: JSON.stringify(user) };
  } catch (error) {
    console.error('Google auth error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Server error: ' + error.message })
    };
  }
};
