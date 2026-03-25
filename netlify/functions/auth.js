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

  let sql;
  try {
    // Try with simplified connection string
    const dbUrl = process.env.DATABASE_URL.replace('&channel_binding=require', '');
    sql = neon(dbUrl);
    console.log('Database connection established');
  } catch (error) {
    console.error('Database connection failed:', error);
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Database connection failed: ' + error.message }) };
  }
  const rawPath = event.path || '';
  const path = rawPath.replace('/.netlify/functions/auth', '').replace('/api/auth', '') || '/';
  const body = event.body ? JSON.parse(event.body) : {};

  console.log('=== AUTH REQUEST ===');
  console.log('Method:', event.httpMethod);
  console.log('Path:', rawPath);
  console.log('Clean Path:', path);
  console.log('Body:', body);
  console.log('==================');

  // Debug endpoint
  if (event.httpMethod === 'GET' && (path === '/debug' || path === '/debug/')) {
    try {
      const testResult = await sql`SELECT COUNT(*) as count FROM users`;
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          rawPath, 
          path, 
          method: event.httpMethod,
          databaseConnected: true,
          userCount: testResult[0].count
        })
      };
    } catch (dbError) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          rawPath, 
          path, 
          method: event.httpMethod,
          databaseConnected: false,
          error: dbError.message
        })
      };
    }
  }

  try {
    // POST /auth/signup
    if (event.httpMethod === 'POST' && path === '/signup') {
      const { email, password, displayName } = body;

      // Check if user exists
      const existing = await sql`SELECT email FROM users WHERE email = ${email}`;
      if (existing.length > 0) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'Email is al geregistreerd.' }) };
      }

      // Create user with email_notifications default TRUE
      const result = await sql`
        INSERT INTO users (email, display_name, password_hash, provider, email_notifications)
        VALUES (${email}, ${displayName}, ${password}, 'email', TRUE)
        RETURNING email, display_name, photo_url, provider, email_notifications
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

      // Get user by email (check both password_hash for manual users OR allow if no password set yet)
      const result = await sql`
        SELECT email, display_name, photo_url, provider, is_admin, password_hash
        FROM users WHERE email = ${email}
      `;

      if (result.length === 0) {
        return { statusCode: 401, headers, body: JSON.stringify({ error: 'Onjuist e-mailadres of wachtwoord.' }) };
      }

      const user = result[0];
      
      // Check if user has password set
      if (!user.password_hash) {
        return { 
          statusCode: 401, 
          headers, 
          body: JSON.stringify({ 
            error: 'Dit account heeft geen wachtwoord. Log in met Google of stel eerst een wachtwoord in via "Wachtwoord vergeten".' 
          }) 
        };
      }

      // Verify password
      if (user.password_hash !== password) {
        return { statusCode: 401, headers, body: JSON.stringify({ error: 'Onjuist e-mailadres of wachtwoord.' }) };
      }

      return { 
        statusCode: 200, 
        headers, 
        body: JSON.stringify({
          email: user.email,
          displayName: user.display_name,
          photoURL: user.photo_url,
          provider: user.provider,
          isAdmin: user.is_admin,
          emailNotifications: user.email_notifications
        }) 
      };
    }

    // POST /auth/google - Save/update Google user (MERGE with existing account if exists)
    if (event.httpMethod === 'POST' && path === '/google') {
      const { email, displayName, photoURL } = body;

      // Check if user exists with password (manual account)
      const existing = await sql`
        SELECT email, password_hash, provider FROM users WHERE email = ${email}
      `;

      let result;
      if (existing.length > 0 && existing[0].password_hash) {
        // User has manual account - MERGE: keep password, update photo and name
        result = await sql`
          UPDATE users SET
            display_name = ${displayName},
            photo_url = COALESCE(${photoURL || null}, users.photo_url),
            provider = 'both',
            updated_at = NOW()
          WHERE email = ${email}
          RETURNING email, display_name, photo_url, provider, is_admin
        `;
      } else {
        // New user or Google-only user
        result = await sql`
          INSERT INTO users (email, display_name, photo_url, provider)
          VALUES (${email}, ${displayName}, ${photoURL || null}, 'google')
          ON CONFLICT (email) DO UPDATE SET
            display_name = ${displayName},
            photo_url = COALESCE(${photoURL || null}, users.photo_url),
            updated_at = NOW()
          RETURNING email, display_name, photo_url, provider, is_admin
        `;
      }

      const user = {
        email: result[0].email,
        displayName: result[0].display_name,
        photoURL: result[0].photo_url,
        provider: result[0].provider,
        isAdmin: result[0].is_admin,
        emailNotifications: result[0].email_notifications
      };

      return { statusCode: 200, headers, body: JSON.stringify(user) };
    }

    // PUT /auth/profile - Update profile
    if (event.httpMethod === 'PUT' && path === '/profile') {
      try {
        const { email, displayName, phone, company, emailNotifications } = body;
        
        console.log('Profile update request:', { email, displayName, phone, company, emailNotifications });

        const result = await sql`
          UPDATE users SET
            display_name = COALESCE(${displayName || null}, display_name),
            phone = COALESCE(${phone || null}, phone),
            company = COALESCE(${company || null}, company),
            email_notifications = COALESCE(${emailNotifications !== undefined ? emailNotifications : null}, email_notifications),
            updated_at = NOW()
          WHERE email = ${email}
          RETURNING email, display_name, photo_url, provider, phone, company, email_notifications
        `;

        console.log('Profile update result:', result);

        if (result.length === 0) {
          return { statusCode: 404, headers, body: JSON.stringify({ error: 'Gebruiker niet gevonden.' }) };
        }

        return { statusCode: 200, headers, body: JSON.stringify(result[0]) };
      } catch (error) {
        console.error('Profile update error:', error);
        return { statusCode: 500, headers, body: JSON.stringify({ error: 'Profile update failed: ' + error.message }) };
      }
    }

    // PUT /auth/password - Change password (works for both manual and merged accounts)
    if (event.httpMethod === 'PUT' && path === '/password') {
      const { email, currentPassword, newPassword } = body;

      // Check user exists
      const user = await sql`
        SELECT id, password_hash, provider FROM users WHERE email = ${email}
      `;

      if (user.length === 0) {
        return { statusCode: 404, headers, body: JSON.stringify({ error: 'Gebruiker niet gevonden.' }) };
      }

      // If user has no password yet (Google-only), allow setting new password without current
      if (user[0].password_hash && user[0].password_hash !== currentPassword) {
        return { statusCode: 401, headers, body: JSON.stringify({ error: 'Huidig wachtwoord is onjuist.' }) };
      }

      await sql`
        UPDATE users 
        SET password_hash = ${newPassword}, 
            provider = COALESCE(NULLIF(provider, 'google'), 'both'),
            updated_at = NOW() 
        WHERE email = ${email}
      `;

      return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
    }

    return { statusCode: 404, headers, body: JSON.stringify({ error: 'Route niet gevonden' }) };

  } catch (error) {
    console.error('Auth error details:', {
      message: error.message,
      stack: error.stack,
      code: error.code,
      detail: error.detail,
      where: error.where,
      constraint: error.constraint
    });
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Server error: ' + error.message }) };
  }
};
