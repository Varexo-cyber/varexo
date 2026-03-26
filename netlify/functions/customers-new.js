// NEW customers API with fresh connection
const { neon } = require('@netlify/neon');

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  };

  // Create FRESH connection every time
  const sql = neon(process.env.DATABASE_URL);

  try {
    if (event.httpMethod === 'GET') {
      console.log('NEW API - Fetching fresh data...');
      
      const users = await sql`
        SELECT email, display_name, created_at, email_notifications
        FROM users 
        WHERE is_admin = FALSE AND deleted_at IS NULL
        ORDER BY created_at DESC
        LIMIT 100
      `;
      
      console.log('NEW API - Users found:', users.length);
      console.log('NEW API - Emails:', users.map(u => u.email));

      const customers = users.map(u => ({
        email: u.email,
        displayName: u.display_name,
        phone: null,
        company: null,
        emailNotifications: u.email_notifications !== false,
        subscription: null,
        hasSocialMedia: false,
        createdAt: u.created_at,
        projectCount: 0,
        invoiceCount: 0
      }));

      return { statusCode: 200, headers, body: JSON.stringify(customers) };
    }

    return { statusCode: 404, headers, body: JSON.stringify({ error: 'Not found' }) };

  } catch (error) {
    console.error('NEW API Error:', error);
    return { statusCode: 500, headers, body: JSON.stringify({ error: error.message }) };
  }
};
