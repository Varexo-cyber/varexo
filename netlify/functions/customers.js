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
    // GET /customers - Get all customers with project/invoice counts
    if (event.httpMethod === 'GET') {
      const result = await sql`
        SELECT 
          u.email,
          u.display_name,
          u.phone,
          u.company,
          u.email_notifications,
          u.created_at,
          u.subscription,
          u.has_social_media,
          COUNT(DISTINCT p.id) as project_count,
          COUNT(DISTINCT i.id) as invoice_count
        FROM users u
        LEFT JOIN projects p ON u.email = p.customer_email
        LEFT JOIN invoices i ON u.email = i.customer_email
        WHERE u.is_admin = FALSE
        GROUP BY u.email, u.display_name, u.phone, u.company, u.email_notifications, u.created_at, u.subscription, u.has_social_media
        ORDER BY u.created_at DESC
      `;

      const customers = result.map(c => ({
        email: c.email,
        displayName: c.display_name,
        phone: c.phone,
        company: c.company,
        emailNotifications: c.email_notifications,
        subscription: c.subscription,
        hasSocialMedia: c.has_social_media,
        createdAt: c.created_at,
        projectCount: parseInt(c.project_count),
        invoiceCount: parseInt(c.invoice_count)
      }));

      return { statusCode: 200, headers, body: JSON.stringify(customers) };
    }

    // DELETE /customers/:email - Delete customer
    if (event.httpMethod === 'DELETE' && path) {
      const email = path.replace('/', '');
      
      // Delete customer's projects, invoices, and user record
      await sql`DELETE FROM project_logs WHERE project_id IN (SELECT id FROM projects WHERE customer_email = ${email})`;
      await sql`DELETE FROM projects WHERE customer_email = ${email}`;
      await sql`DELETE FROM invoices WHERE customer_email = ${email}`;
      await sql`DELETE FROM users WHERE email = ${email}`;
      
      return { statusCode: 200, headers, body: JSON.stringify({ success: true, message: 'Klant verwijderd' }) };
    }

    return { statusCode: 404, headers, body: JSON.stringify({ error: 'Route niet gevonden' }) };

  } catch (error) {
    console.error('Customers error:', error);
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Server error: ' + error.message }) };
  }
};
