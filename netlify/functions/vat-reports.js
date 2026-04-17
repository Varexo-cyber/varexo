const { neon } = require('@netlify/neon');

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Content-Type': 'application/json'
};

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  const sql = neon();
  const path = event.path.replace('/.netlify/functions/vat-reports', '');
  const params = event.queryStringParameters || {};

  try {
    // Auto-migrate: Create vat_reports table
    await sql`
      CREATE TABLE IF NOT EXISTS vat_reports (
        id SERIAL PRIMARY KEY,
        quarter VARCHAR(2) NOT NULL CHECK (quarter IN ('Q1','Q2','Q3','Q4')),
        year INTEGER NOT NULL,
        total_income_excl_vat DECIMAL(10,2) DEFAULT 0,
        total_income_vat DECIMAL(10,2) DEFAULT 0,
        total_income_incl_vat DECIMAL(10,2) DEFAULT 0,
        total_expense_excl_vat DECIMAL(10,2) DEFAULT 0,
        total_expense_vat DECIMAL(10,2) DEFAULT 0,
        total_expense_incl_vat DECIMAL(10,2) DEFAULT 0,
        vat_to_pay_or_refund DECIMAL(10,2) DEFAULT 0,
        profit DECIMAL(10,2) DEFAULT 0,
        status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open','ready','submitted','closed')),
        deadline DATE,
        notes TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(quarter, year)
      )
    `;

    // GET /vat-reports - List all or filter by year
    if (event.httpMethod === 'GET') {
      // Special endpoint: /vat-reports/calculate?quarter=Q1&year=2026
      if (path.includes('/calculate')) {
        const quarter = params.quarter;
        const year = parseInt(params.year);
        
        if (!quarter || !year) {
          return { statusCode: 400, headers, body: JSON.stringify({ error: 'quarter and year required' }) };
        }

        // Determine date range for quarter
        const quarterMonths = {
          'Q1': { start: `${year}-01-01`, end: `${year}-03-31` },
          'Q2': { start: `${year}-04-01`, end: `${year}-06-30` },
          'Q3': { start: `${year}-07-01`, end: `${year}-09-30` },
          'Q4': { start: `${year}-10-01`, end: `${year}-12-31` }
        };

        const deadlines = {
          'Q1': `${year}-04-30`,
          'Q2': `${year}-07-31`,
          'Q3': `${year}-10-31`,
          'Q4': `${year + 1}-01-31`
        };

        const range = quarterMonths[quarter];
        if (!range) {
          return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid quarter' }) };
        }

        // Helper to convert DB dates to YYYY-MM-DD string
        const toDateStr = (val) => {
          if (!val) return null;
          if (val instanceof Date) return val.toISOString().substring(0, 10);
          if (typeof val === 'string') return val.substring(0, 10);
          return null;
        };
        const inRange = (val, start, end) => {
          const d = toDateStr(val);
          return d && d >= start && d <= end;
        };

        // Get active user emails (exclude deleted/test users only)
        const activeUsers = await sql`SELECT email FROM users WHERE deleted_at IS NULL`;
        const activeEmailSet = new Set(activeUsers.map(u => u.email?.toLowerCase()));

        // Fetch ALL invoices and filter in JS (more reliable than SQL ANY with neon)
        const allInvoices = await sql`SELECT * FROM invoices WHERE status != 'draft'`;
        const quarterInvoices = allInvoices.filter(i => {
          // Must be from active user
          if (!activeEmailSet.has(i.customer_email?.toLowerCase())) return false;
          // Must be in date range
          return inRange(i.invoice_date || i.created_at, range.start, range.end);
        });
        const invoiceTotal = quarterInvoices.reduce((sum, i) => sum + parseFloat(i.amount || 0), 0);
        console.log(`VAT calc ${quarter} ${year}: ${quarterInvoices.length} invoices, total: ${invoiceTotal}, range: ${range.start} - ${range.end}`);
        console.log('Invoice details:', quarterInvoices.map(i => ({ id: i.id, email: i.customer_email, amount: i.amount, date: toDateStr(i.invoice_date || i.created_at) })));

        // Business surcharges in range
        let surchargeIncome = 0;
        try {
          const allSurcharges = await sql`SELECT * FROM surcharges WHERE type = 'business'`;
          const qSurcharges = allSurcharges.filter(s => inRange(s.surcharge_date, range.start, range.end));
          surchargeIncome = qSurcharges.reduce((sum, s) => sum + parseFloat(s.amount || 0), 0);
        } catch (e) { /* surcharges table may not exist */ }

        // Business expenses in range
        let expenseTotal = 0;
        try {
          const allExpenses = await sql`SELECT * FROM expenses WHERE type = 'business'`;
          const qExpenses = allExpenses.filter(e => inRange(e.expense_date, range.start, range.end));
          expenseTotal = qExpenses.reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);
          console.log(`Expenses: ${qExpenses.length} in range, total: ${expenseTotal}`);
        } catch (e) { console.log('Expenses error:', e.message); }

        const totalIncomeInclVat = invoiceTotal + surchargeIncome;
        const totalIncomeExclVat = totalIncomeInclVat / 1.21;
        const totalIncomeVat = totalIncomeInclVat - totalIncomeExclVat;

        const totalExpenseExclVat = expenseTotal / 1.21;
        const totalExpenseVat = expenseTotal - totalExpenseExclVat;

        const vatToPayOrRefund = totalIncomeVat - totalExpenseVat;
        const profit = totalIncomeExclVat - totalExpenseExclVat;

        const calculation = {
          quarter,
          year,
          totalIncomeExclVat: Math.round(totalIncomeExclVat * 100) / 100,
          totalIncomeVat: Math.round(totalIncomeVat * 100) / 100,
          totalIncomeInclVat: Math.round(totalIncomeInclVat * 100) / 100,
          totalExpenseExclVat: Math.round(totalExpenseExclVat * 100) / 100,
          totalExpenseVat: Math.round(totalExpenseVat * 100) / 100,
          totalExpenseInclVat: Math.round(expenseTotal * 100) / 100,
          vatToPayOrRefund: Math.round(vatToPayOrRefund * 100) / 100,
          profit: Math.round(profit * 100) / 100,
          deadline: deadlines[quarter]
        };

        return { statusCode: 200, headers, body: JSON.stringify(calculation) };
      }

      // Regular GET: list all reports
      let reports;
      if (params.year) {
        reports = await sql`
          SELECT * FROM vat_reports 
          WHERE year = ${parseInt(params.year)}
          ORDER BY quarter ASC
        `;
      } else {
        reports = await sql`
          SELECT * FROM vat_reports 
          ORDER BY year DESC, quarter ASC
        `;
      }

      return { statusCode: 200, headers, body: JSON.stringify(reports) };
    }

    // POST /vat-reports - Create or update a VAT report (upsert)
    if (event.httpMethod === 'POST') {
      const body = JSON.parse(event.body || '{}');
      const { quarter, year, totalIncomeExclVat, totalIncomeVat, totalIncomeInclVat,
              totalExpenseExclVat, totalExpenseVat, totalExpenseInclVat,
              vatToPayOrRefund, profit, status, deadline, notes } = body;

      if (!quarter || !year) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'quarter and year required' }) };
      }

      // Upsert
      const result = await sql`
        INSERT INTO vat_reports (
          quarter, year, 
          total_income_excl_vat, total_income_vat, total_income_incl_vat,
          total_expense_excl_vat, total_expense_vat, total_expense_incl_vat,
          vat_to_pay_or_refund, profit, status, deadline, notes
        ) VALUES (
          ${quarter}, ${year},
          ${totalIncomeExclVat || 0}, ${totalIncomeVat || 0}, ${totalIncomeInclVat || 0},
          ${totalExpenseExclVat || 0}, ${totalExpenseVat || 0}, ${totalExpenseInclVat || 0},
          ${vatToPayOrRefund || 0}, ${profit || 0}, ${status || 'open'}, ${deadline || null}, ${notes || null}
        )
        ON CONFLICT (quarter, year) 
        DO UPDATE SET
          total_income_excl_vat = EXCLUDED.total_income_excl_vat,
          total_income_vat = EXCLUDED.total_income_vat,
          total_income_incl_vat = EXCLUDED.total_income_incl_vat,
          total_expense_excl_vat = EXCLUDED.total_expense_excl_vat,
          total_expense_vat = EXCLUDED.total_expense_vat,
          total_expense_incl_vat = EXCLUDED.total_expense_incl_vat,
          vat_to_pay_or_refund = EXCLUDED.vat_to_pay_or_refund,
          profit = EXCLUDED.profit,
          status = EXCLUDED.status,
          deadline = EXCLUDED.deadline,
          notes = COALESCE(EXCLUDED.notes, vat_reports.notes),
          updated_at = NOW()
        RETURNING *
      `;

      return { statusCode: 200, headers, body: JSON.stringify(result[0]) };
    }

    // PUT /vat-reports/:id - Update status/notes
    if (event.httpMethod === 'PUT') {
      const id = path.replace('/', '');
      const body = JSON.parse(event.body || '{}');
      const { status, notes } = body;

      const result = await sql`
        UPDATE vat_reports SET
          status = COALESCE(${status || null}, status),
          notes = COALESCE(${notes !== undefined ? notes : null}, notes),
          updated_at = NOW()
        WHERE id = ${parseInt(id)}
        RETURNING *
      `;

      if (result.length === 0) {
        return { statusCode: 404, headers, body: JSON.stringify({ error: 'Report not found' }) };
      }

      return { statusCode: 200, headers, body: JSON.stringify(result[0]) };
    }

    // DELETE /vat-reports/:id
    if (event.httpMethod === 'DELETE') {
      const id = path.replace('/', '');
      await sql`DELETE FROM vat_reports WHERE id = ${parseInt(id)}`;
      return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
    }

    return { statusCode: 404, headers, body: JSON.stringify({ error: 'Route not found' }) };

  } catch (error) {
    console.error('VAT Reports error:', error);
    return { statusCode: 500, headers, body: JSON.stringify({ error: error.message }) };
  }
};
