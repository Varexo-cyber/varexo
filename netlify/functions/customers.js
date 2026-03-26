const { neon } = require('@netlify/neon');

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, DELETE, OPTIONS',
  'Content-Type': 'application/json'
};

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  const sql = neon();
  const path = event.path.replace('/.netlify/functions/customers', '').replace('/api/customers', '');

  try {
    // Ensure email_notifications and deleted_at columns exist
    try {
      await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS email_notifications BOOLEAN DEFAULT TRUE`;
      await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP`;
    } catch (e) {
      console.log('Column may already exist:', e.message);
    }

    // GET /customers - Get all non-deleted customers
    if (event.httpMethod === 'GET') {
      const result = await sql`
        SELECT 
          u.email,
          u.display_name,
          u.created_at,
          COALESCE(u.email_notifications, true) as email_notifications
        FROM users u
        WHERE u.is_admin = FALSE AND u.deleted_at IS NULL
        ORDER BY u.created_at DESC
      `;

      // Get project and invoice counts separately
      const customers = await Promise.all(result.map(async (c) => {
        const projectResult = await sql`SELECT COUNT(*) as count FROM projects WHERE customer_email = ${c.email}`;
        const invoiceResult = await sql`SELECT COUNT(*) as count FROM invoices WHERE customer_email = ${c.email}`;
        
        return {
          email: c.email,
          displayName: c.display_name,
          phone: null,
          company: null,
          emailNotifications: c.email_notifications,
          subscription: null,
          hasSocialMedia: false,
          createdAt: c.created_at,
          projectCount: parseInt(projectResult[0].count),
          invoiceCount: parseInt(invoiceResult[0].count)
        };
      }));

      return { statusCode: 200, headers, body: JSON.stringify(customers) };
    }

    // DELETE /customers/:email - Soft delete customer (mark as deleted)
    if (event.httpMethod === 'DELETE' && path) {
      const email = path.replace('/', '');
      
      // Soft delete - mark user as deleted instead of actually deleting
      await sql`UPDATE users SET deleted_at = NOW() WHERE email = ${email}`;
      
      return { statusCode: 200, headers, body: JSON.stringify({ success: true, message: 'Klant verwijderd' }) };
    }

    return { statusCode: 404, headers, body: JSON.stringify({ error: 'Route niet gevonden' }) };

  } catch (error) {
    console.error('Customers error:', error);
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Server error: ' + error.message }) };
  }
};
