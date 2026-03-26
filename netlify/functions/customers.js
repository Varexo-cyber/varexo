const { neon } = require('@netlify/neon');

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, DELETE, OPTIONS',
  'Content-Type': 'application/json'
};

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Type': 'application/json'
  };

  const sql = neon();

  console.log('=== CUSTOMERS API ===');
  console.log('Method:', event.httpMethod);
  console.log('Path:', event.path);

  try {
    // GET /customers
    if (event.httpMethod === 'GET') {
      console.log('Fetching all non-deleted customers...');
      
      const users = await sql`
        SELECT email, display_name, created_at, email_notifications
        FROM users 
        WHERE is_admin = FALSE AND deleted_at IS NULL
        ORDER BY created_at DESC
      `;
      
      console.log('Users found in DB:', users.length);
      console.log('User emails:', users.map(u => u.email));

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

      console.log('Returning customers count:', customers.length);
      return { statusCode: 200, headers, body: JSON.stringify(customers) };
    }

    // DELETE /customers/:email
    if (event.httpMethod === 'DELETE') {
      const path = event.path.replace('/.netlify/functions/customers', '').replace('/api/customers', '');
      const email = path.replace('/', '');
      console.log('Soft deleting:', email);
      
      await sql`UPDATE users SET deleted_at = NOW() WHERE email = ${email}`;
      
      return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
    }

    return { statusCode: 404, headers, body: JSON.stringify({ error: 'Not found' }) };

  } catch (error) {
    console.error('ERROR:', error);
    return { statusCode: 500, headers, body: JSON.stringify({ error: error.message }) };
  }
};
