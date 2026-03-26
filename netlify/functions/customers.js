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
      
      // Get ALL users, both active and deleted
      const allUsers = await sql`SELECT email, display_name, created_at, email_notifications, is_admin, deleted_at FROM users`;
      
      console.log('Total users in DB:', allUsers.length);
      
      // Filter and map - include deleted with marker
      const customers = allUsers
        .filter(u => u.is_admin === false) // Exclude admins only
        .map(u => ({
          email: u.email,
          displayName: u.deleted_at ? `${u.display_name} (NIET VERWIJDEREN ACCOUNT)` : u.display_name,
          phone: null,
          company: null,
          emailNotifications: u.email_notifications !== false,
          subscription: null,
          hasSocialMedia: false,
          createdAt: u.created_at,
          projectCount: 0,
          invoiceCount: 0,
          isDeleted: !!u.deleted_at // Flag for frontend
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
