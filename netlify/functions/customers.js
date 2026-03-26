const { neon } = require('@netlify/neon');

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  try {
    // ALWAYS create fresh connection - no caching
    const dbUrl = process.env.DATABASE_URL || process.env.NETLIFY_DATABASE_URL;
    const sql = neon(dbUrl);

    if (event.httpMethod === 'GET') {
      console.log('Fetching ALL users from database...');
      
      // FIX: Count only non-deleted customers
      const allUsers = await sql`SELECT is_admin, deleted_at FROM users`;
      const customerCount = allUsers.filter(u => u.is_admin === false && u.deleted_at === null).length;
      
      console.log('Total users in DB:', allUsers.length);
      
      // FIX: Show only non-deleted non-admin users
      const customers = allUsers
        .filter(u => u.is_admin === false && u.deleted_at === null)
        .map(u => ({
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

      console.log('Returning customers:', customers.length);
      return { statusCode: 200, headers, body: JSON.stringify(customers) };
    }

    if (event.httpMethod === 'DELETE') {
      const path = event.path.replace('/.netlify/functions/customers', '').replace('/api/customers', '');
      const email = path.replace('/', '');
      await sql`UPDATE users SET deleted_at = NOW() WHERE email = ${email}`;
      return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
    }

    return { statusCode: 404, headers, body: JSON.stringify({ error: 'Not found' }) };

  } catch (error) {
    console.error('Error:', error);
    return { statusCode: 500, headers, body: JSON.stringify({ error: error.message }) };
  }
};
