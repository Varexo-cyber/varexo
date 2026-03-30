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

  // FIX: Force fresh connection every time
  const dbUrl = process.env.DATABASE_URL || process.env.NETLIFY_DATABASE_URL;
  const sql = neon(dbUrl);

  try {
    if (event.httpMethod === 'GET') {
      // FIX: Get all users with all fields like customers.js
      const allUsers = await sql`SELECT email, display_name, created_at, email_notifications, is_admin, deleted_at FROM users`;
      const customerCount = allUsers.filter(u => u.is_admin === false && u.deleted_at === null).length;
      
      // FIX: Get ALL projects and filter in JS
      const allProjects = await sql`SELECT * FROM projects`;
      const projectsCount = allProjects.length;
      const activeProjectsCount = allProjects.filter(p => p.status === 'active').length;
      
      // FIX: Get ALL invoices and filter in JS  
      const allInvoices = await sql`SELECT * FROM invoices`;
      const invoiceRevenue = allInvoices
        .filter(i => i.status !== 'draft')
        .reduce((sum, i) => sum + parseFloat(i.amount || 0), 0);
      
      // Get paid payment tracking periods (for recurring invoices) - safely handle missing table
      let trackingRevenue = 0;
      try {
        const paidTrackingPeriods = await sql`SELECT * FROM invoice_payment_tracking WHERE status = 'paid'`;
        trackingRevenue = paidTrackingPeriods.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);
      } catch (trackingError) {
        console.log('Payment tracking table not found, using 0 for tracking revenue');
        trackingRevenue = 0;
      }
      
      // Total revenue = invoice revenue + paid tracking periods
      const revenue = invoiceRevenue + trackingRevenue;
      const pendingCount = allInvoices.filter(i => i.status === 'sent').length;
      const overdueCount = allInvoices.filter(i => i.status === 'overdue').length;

      return { statusCode: 200, headers, body: JSON.stringify({
        totalCustomers: customerCount,
        totalProjects: projectsCount,
        activeProjects: activeProjectsCount,
        totalRevenue: revenue,
        pendingInvoices: pendingCount,
        overdueInvoices: overdueCount
      })};
    }

    return { statusCode: 404, headers, body: JSON.stringify({ error: 'Route niet gevonden' }) };

  } catch (error) {
    console.error('Stats error:', error);
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Server error: ' + error.message }) };
  }
};
