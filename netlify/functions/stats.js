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
      
      // Get all expenses (ensure table exists first)
      let allExpenses = [];
      try { 
        await sql`CREATE TABLE IF NOT EXISTS expenses (
          id SERIAL PRIMARY KEY,
          description VARCHAR(255) NOT NULL,
          amount DECIMAL(10,2) NOT NULL,
          type VARCHAR(50) NOT NULL,
          frequency VARCHAR(50) DEFAULT 'one-time',
          category VARCHAR(100),
          expense_date DATE DEFAULT NOW(),
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        )`;
        const expResult = await sql`SELECT * FROM expenses`;
        allExpenses = Array.isArray(expResult) ? expResult : [];
        console.log('Expenses loaded:', allExpenses.length, 'items:', allExpenses.map(e => ({ type: e.type, freq: e.frequency, amount: e.amount })));
      } catch (e) { 
        console.error('Expenses error:', e.message);
      }
      
      // Get all surcharges
      let allSurcharges = [];
      try { 
        const surResult = await sql`SELECT * FROM surcharges`;
        allSurcharges = Array.isArray(surResult) ? surResult : [];
      } catch (e) { /* table may not exist */ }

      // Get payment tracking - only from active customers
      let allTracking = [];
      try { 
        const tracking = await sql`SELECT * FROM invoice_payment_tracking WHERE status = 'paid'`;
        const trackArr = Array.isArray(tracking) ? tracking : [];
        allTracking = trackArr.filter(t => activeEmails.has(t.customer_email?.toLowerCase()));
      } catch (e) { /* table may not exist */ }

      // Filter by period
      let filteredInvoices, filteredSurcharges, filteredTracking;
      const businessExpenses = allExpenses.filter(e => e.type === 'business');
      
      const periodRange = period === 'total' ? null : getDateRange(period);
      
      if (period === 'total') {
        filteredInvoices = realInvoices.filter(i => i.status !== 'draft');
        filteredSurcharges = allSurcharges.filter(s => s.type === 'business');
        filteredTracking = allTracking;
      } else {
        filteredInvoices = realInvoices.filter(i => {
          if (i.status === 'draft') return false;
          return isInRange(i.invoice_date || i.created_at, periodRange.start, periodRange.end);
        });
        filteredSurcharges = allSurcharges.filter(s => s.type === 'business' && isInRange(s.surcharge_date, periodRange.start, periodRange.end));
        filteredTracking = allTracking.filter(t => isInRange(t.paid_date || t.period_start_date, periodRange.start, periodRange.end));
      }

      const invoiceRevenue = filteredInvoices.reduce((sum, i) => sum + parseFloat(i.amount || 0), 0);
      const trackingRevenue = filteredTracking.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);
      const surchargeRevenue = filteredSurcharges.reduce((sum, s) => sum + parseFloat(s.amount || 0), 0);
      const totalRevenue = invoiceRevenue + trackingRevenue + surchargeRevenue;
      
      // Calculate expenses with recurring logic
      let totalExpenses = 0;
      businessExpenses.forEach(e => {
        const amount = parseFloat(e.amount || 0);
        const freq = e.frequency || 'one-time';
        const expDate = toDateStr(e.expense_date || e.created_at);
        
        if (freq === 'monthly' && periodRange) {
          // Count how many months in the range this expense applies to
          const startDate = new Date(periodRange.start);
          const endDate = new Date(periodRange.end);
          const expStart = expDate ? new Date(expDate) : null;
          let months = 0;
          let d = new Date(startDate);
          while (d <= endDate) {
            if (!expStart || d >= expStart) months++;
            d.setMonth(d.getMonth() + 1);
          }
          totalExpenses += amount * months;
        } else if (freq === 'monthly' && !periodRange) {
          // Total: count from expense start to now
          const expStart = expDate ? new Date(expDate) : new Date();
          const now = new Date();
          let months = (now.getFullYear() - expStart.getFullYear()) * 12 + (now.getMonth() - expStart.getMonth()) + 1;
          if (months < 1) months = 1;
          totalExpenses += amount * months;
        } else if (freq === 'yearly') {
          if (!periodRange) {
            // Total: count years from start to now
            const expStart = expDate ? new Date(expDate) : new Date();
            const years = new Date().getFullYear() - expStart.getFullYear() + 1;
            totalExpenses += amount * Math.max(1, years);
          } else if (periodRange && isInRange(e.expense_date || e.created_at, periodRange.start, periodRange.end)) {
            totalExpenses += amount;
          }
        } else {
          // One-time
          if (!periodRange || isInRange(e.expense_date || e.created_at, periodRange.start, periodRange.end)) {
            totalExpenses += amount;
          }
        }
      });
      console.log('Expenses calc:', { period, businessCount: businessExpenses.length, totalExpenses });
      const profit = (totalRevenue / 1.21) - (totalExpenses / 1.21);
      const vatBalance = (totalRevenue - totalRevenue / 1.21) - (totalExpenses - totalExpenses / 1.21);
      
      // Pending/overdue only from active customers
      const pendingCount = realInvoices.filter(i => i.status === 'sent').length;
      const overdueCount = realInvoices.filter(i => i.status === 'overdue').length;

      console.log('Stats result:', { period, invoiceRevenue, trackingRevenue, surchargeRevenue, totalRevenue, totalExpenses, businessExpCount: businessExpenses.length });

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
