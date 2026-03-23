const { neon } = require('@netlify/neon');

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Content-Type': 'application/json'
};

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  const sql = neon();

  try {
    // GET /customers - Get all customers with project/invoice counts
    if (event.httpMethod === 'GET') {
      const result = await sql`
        SELECT 
          u.email,
          u.display_name,
          u.phone,
          u.company,
          u.created_at,
          COUNT(DISTINCT p.id) as project_count,
          COUNT(DISTINCT i.id) as invoice_count
        FROM users u
        LEFT JOIN projects p ON u.email = p.customer_email
        LEFT JOIN invoices i ON u.email = i.customer_email
        WHERE u.is_admin = FALSE
        GROUP BY u.email, u.display_name, u.phone, u.company, u.created_at
        ORDER BY u.created_at DESC
      `;

      const customers = result.map(c => ({
        email: c.email,
        displayName: c.display_name,
        phone: c.phone,
        company: c.company,
        createdAt: c.created_at,
        projectCount: parseInt(c.project_count),
        invoiceCount: parseInt(c.invoice_count)
      }));

      return { statusCode: 200, headers, body: JSON.stringify(customers) };
    }

    return { statusCode: 404, headers, body: JSON.stringify({ error: 'Route niet gevonden' }) };

  } catch (error) {
    console.error('Customers error:', error);
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Server error: ' + error.message }) };
  }
};
