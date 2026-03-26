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
      
      // Get ALL users, filter manually
      const allUsers = await sql`SELECT email, display_name, created_at, email_notifications, is_admin, deleted_at FROM users`;
      
      console.log('Total users in DB:', allUsers.length);
      console.log('All emails:', allUsers.map(u => ({ email: u.email, is_admin: u.is_admin, deleted: u.deleted_at })));
      
      // Filter manually
      const validUsers = allUsers.filter(u => u.is_admin === false && u.deleted_at === null);
      
      console.log('Valid customers:', validUsers.length);
      console.log('Valid emails:', validUsers.map(u => u.email));

      const customers = validUsers.map(u => ({
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
