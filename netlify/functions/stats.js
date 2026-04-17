const { neon } = require('@netlify/neon');

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Content-Type': 'application/json'
};

function getDateRange(period) {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0-indexed
  
  if (period === 'monthly') {
    const start = new Date(year, month, 1);
    const end = new Date(year, month + 1, 0); // last day of current month
    return { start: start.toISOString().split('T')[0], end: end.toISOString().split('T')[0] };
  }
  
  if (period === 'quarterly') {
    const qStart = Math.floor(month / 3) * 3; // 0, 3, 6, 9
    const start = new Date(year, qStart, 1);
    const end = new Date(year, qStart + 3, 0);
    return { start: start.toISOString().split('T')[0], end: end.toISOString().split('T')[0] };
  }
  
  // yearly (default)
  return { start: `${year}-01-01`, end: `${year}-12-31` };
}

function toDateStr(val) {
  if (!val) return null;
  if (val instanceof Date) return val.toISOString().substring(0, 10);
  if (typeof val === 'string') return val.substring(0, 10);
  return null;
}

function isInRange(val, start, end) {
  const d = toDateStr(val);
  if (!d) return false;
  return d >= start && d <= end;
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  const dbUrl = process.env.DATABASE_URL || process.env.NETLIFY_DATABASE_URL;
  const sql = neon(dbUrl);
  const params = event.queryStringParameters || {};
  const period = params.period || 'total'; // 'monthly', 'quarterly', 'yearly', 'total'

  try {
    if (event.httpMethod === 'GET') {
      const allUsers = await sql`SELECT email, display_name, created_at, email_notifications, is_admin, deleted_at FROM users`;
      const activeCustomers = allUsers.filter(u => u.is_admin === false && u.deleted_at === null);
      const customerCount = activeCustomers.length;
      // For revenue: include all non-deleted users (including admin) - only exclude deleted test accounts
      const activeEmails = new Set(allUsers.filter(u => u.deleted_at === null).map(u => u.email?.toLowerCase()));
      
      const allProjects = await sql`SELECT * FROM projects`;
      // Only count projects from active customers
      const activeProjects = allProjects.filter(p => activeEmails.has(p.customer_email?.toLowerCase()));
      const projectsCount = activeProjects.length;
      const activeProjectsCount = activeProjects.filter(p => p.status === 'active').length;
      
      // Only count invoices from active customers
      const allInvoices = await sql`SELECT * FROM invoices`;
      const realInvoices = allInvoices.filter(i => activeEmails.has(i.customer_email?.toLowerCase()));
      
      // Get all expenses
      let allExpenses = [];
      try { allExpenses = await sql`SELECT * FROM expenses`; } catch (e) { /* table may not exist */ }
      
      // Get all surcharges
      let allSurcharges = [];
      try { allSurcharges = await sql`SELECT * FROM surcharges`; } catch (e) { /* table may not exist */ }

      // Get payment tracking - only from active customers
      let allTracking = [];
      try { 
        const tracking = await sql`SELECT * FROM invoice_payment_tracking WHERE status = 'paid'`;
        allTracking = tracking.filter(t => activeEmails.has(t.customer_email?.toLowerCase()));
      } catch (e) { /* table may not exist */ }

      // Filter by period
      let filteredInvoices, filteredExpenses, filteredSurcharges, filteredTracking;
      
      if (period === 'total') {
        filteredInvoices = realInvoices.filter(i => i.status !== 'draft');
        filteredExpenses = allExpenses.filter(e => e.type === 'business');
        filteredSurcharges = allSurcharges.filter(s => s.type === 'business');
        filteredTracking = allTracking;
      } else {
        const range = getDateRange(period);
        filteredInvoices = realInvoices.filter(i => {
          if (i.status === 'draft') return false;
          return isInRange(i.invoice_date || i.created_at, range.start, range.end);
        });
        filteredExpenses = allExpenses.filter(e => e.type === 'business' && isInRange(e.expense_date, range.start, range.end));
        filteredSurcharges = allSurcharges.filter(s => s.type === 'business' && isInRange(s.surcharge_date, range.start, range.end));
        filteredTracking = allTracking.filter(t => isInRange(t.paid_date || t.period_start_date, range.start, range.end));
      }

      const invoiceRevenue = filteredInvoices.reduce((sum, i) => sum + parseFloat(i.amount || 0), 0);
      const trackingRevenue = filteredTracking.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);
      const surchargeRevenue = filteredSurcharges.reduce((sum, s) => sum + parseFloat(s.amount || 0), 0);
      const totalRevenue = invoiceRevenue + trackingRevenue + surchargeRevenue;
      
      const totalExpenses = filteredExpenses.reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);
      const profit = (totalRevenue / 1.21) - (totalExpenses / 1.21);
      const vatBalance = (totalRevenue - totalRevenue / 1.21) - (totalExpenses - totalExpenses / 1.21);
      
      // Pending/overdue only from active customers
      const pendingCount = realInvoices.filter(i => i.status === 'sent').length;
      const overdueCount = realInvoices.filter(i => i.status === 'overdue').length;

      return { statusCode: 200, headers, body: JSON.stringify({
        totalCustomers: customerCount,
        totalProjects: projectsCount,
        activeProjects: activeProjectsCount,
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        totalExpenses: Math.round(totalExpenses * 100) / 100,
        profit: Math.round(profit * 100) / 100,
        vatBalance: Math.round(vatBalance * 100) / 100,
        pendingInvoices: pendingCount,
        overdueInvoices: overdueCount,
        period: period
      })};
    }

    return { statusCode: 404, headers, body: JSON.stringify({ error: 'Route niet gevonden' }) };

  } catch (error) {
    console.error('Stats error:', error);
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Server error: ' + error.message }) };
  }
};
