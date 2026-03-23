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
    if (event.httpMethod === 'GET') {
      const customers = await sql`SELECT COUNT(*) as count FROM users WHERE is_admin = FALSE`;
      const projects = await sql`SELECT COUNT(*) as count FROM projects`;
      const activeProjects = await sql`SELECT COUNT(*) as count FROM projects WHERE status = 'active'`;
      
      // Debug: check all invoices and their statuses
      const allInvoices = await sql`SELECT id, amount, status FROM invoices`;
      console.log('All invoices:', allInvoices);
      
      const revenue = await sql`SELECT COALESCE(SUM(amount), 0) as total FROM invoices WHERE status != 'draft'`;
      const pendingInvoices = await sql`SELECT COUNT(*) as count FROM invoices WHERE status = 'sent'`;
      const overdueInvoices = await sql`SELECT COUNT(*) as count FROM invoices WHERE status = 'overdue'`;
      
      console.log('Revenue calculation:', revenue[0].total);

      return { statusCode: 200, headers, body: JSON.stringify({
        totalCustomers: parseInt(customers[0].count),
        totalProjects: parseInt(projects[0].count),
        activeProjects: parseInt(activeProjects[0].count),
        totalRevenue: parseFloat(revenue[0].total),
        pendingInvoices: parseInt(pendingInvoices[0].count),
        overdueInvoices: parseInt(overdueInvoices[0].count)
      })};
    }

    return { statusCode: 404, headers, body: JSON.stringify({ error: 'Route niet gevonden' }) };

  } catch (error) {
    console.error('Stats error:', error);
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Server error: ' + error.message }) };
  }
};
