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
      // FIX: Get all users and count manually like customers.js
      const allUsers = await sql`SELECT is_admin, deleted_at FROM users`;
      const customerCount = allUsers.filter(u => u.is_admin === false && u.deleted_at === null).length;
      
      const projects = await sql`SELECT COUNT(*) as count FROM projects`;
      const activeProjects = await sql`SELECT COUNT(*) as count FROM projects WHERE status = 'active'`;
      
      const revenue = await sql`SELECT COALESCE(SUM(amount), 0) as total FROM invoices WHERE status != 'draft'`;
      const pendingInvoices = await sql`SELECT COUNT(*) as count FROM invoices WHERE status = 'sent'`;
      const overdueInvoices = await sql`SELECT COUNT(*) as count FROM invoices WHERE status = 'overdue'`;

      return { statusCode: 200, headers, body: JSON.stringify({
        totalCustomers: customerCount,
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
