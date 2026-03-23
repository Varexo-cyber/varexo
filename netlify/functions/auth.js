const { neon } = require('@netlify/neon');

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
  'Content-Type': 'application/json'
};

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  const sql = neon();
  const path = event.path.replace('/.netlify/functions/auth', '').replace('/api/auth', '');
  const body = event.body ? JSON.parse(event.body) : {};

  try {
    // POST /auth/signup
    if (event.httpMethod === 'POST' && path === '/signup') {
      const { email, password, displayName } = body;

      // Check if user exists
      const existing = await sql`SELECT email FROM users WHERE email = ${email}`;
      if (existing.length > 0) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'Email is al geregistreerd.' }) };
      }

      // Create user
      const result = await sql`
        INSERT INTO users (email, display_name, password_hash, provider)
        VALUES (${email}, ${displayName}, ${password}, 'email')
        RETURNING email, display_name, photo_url, provider
      `;

      const user = {
        email: result[0].email,
        displayName: result[0].display_name,
        photoURL: result[0].photo_url,
        provider: result[0].provider
      };

      return { statusCode: 200, headers, body: JSON.stringify(user) };
    }

    // POST /auth/login
    if (event.httpMethod === 'POST' && path === '/login') {
      const { email, password } = body;

      const result = await sql`
        SELECT email, display_name, photo_url, provider, is_admin
        FROM users WHERE email = ${email} AND password_hash = ${password}
      `;

      if (result.length === 0) {
        return { statusCode: 401, headers, body: JSON.stringify({ error: 'Onjuist e-mailadres of wachtwoord.' }) };
      }

      const user = {
        email: result[0].email,
        displayName: result[0].display_name,
        photoURL: result[0].photo_url,
        provider: result[0].provider,
        isAdmin: result[0].is_admin
      };

      return { statusCode: 200, headers, body: JSON.stringify(user) };
    }

    // POST /auth/google - Save/update Google user
    if (event.httpMethod === 'POST' && path === '/google') {
      const { email, displayName, photoURL } = body;

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
    }

    // PUT /auth/profile - Update profile
    if (event.httpMethod === 'PUT' && path === '/profile') {
      const { email, displayName, phone, company } = body;

      const result = await sql`
        UPDATE users SET
          display_name = COALESCE(${displayName || null}, display_name),
          phone = COALESCE(${phone || null}, phone),
          company = COALESCE(${company || null}, company),
          updated_at = NOW()
        WHERE email = ${email}
        RETURNING email, display_name, photo_url, provider, phone, company
      `;

      if (result.length === 0) {
        return { statusCode: 404, headers, body: JSON.stringify({ error: 'Gebruiker niet gevonden.' }) };
      }

      return { statusCode: 200, headers, body: JSON.stringify(result[0]) };
    }

    // PUT /auth/password - Change password
    if (event.httpMethod === 'PUT' && path === '/password') {
      const { email, currentPassword, newPassword } = body;

      const check = await sql`
        SELECT id FROM users WHERE email = ${email} AND password_hash = ${currentPassword}
      `;

      if (check.length === 0) {
        return { statusCode: 401, headers, body: JSON.stringify({ error: 'Huidig wachtwoord is onjuist.' }) };
      }

      await sql`UPDATE users SET password_hash = ${newPassword}, updated_at = NOW() WHERE email = ${email}`;

      return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
    }

    return { statusCode: 404, headers, body: JSON.stringify({ error: 'Route niet gevonden' }) };

  } catch (error) {
    console.error('Auth error:', error);
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Server error: ' + error.message }) };
  }
};
