const { neon } = require('@netlify/neon');
const nodemailer = require('nodemailer');

// Netlify Scheduled Function - runs on 1st of every month at 7:00 AM UTC
// Also generates quarterly VAT reports and sends deadline email alerts
exports.handler = async (event) => {
  const sql = neon();

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  };

  try {
    const today = new Date();
    const currentMonth = today.getMonth() + 1; // 1-12
    const currentYear = today.getFullYear();

    // Determine current and previous quarter
    const currentQuarter = `Q${Math.ceil(currentMonth / 3)}`;
    const results = { generated: [], alerts: [] };

    // Quarter date ranges
    const quarterConfig = {
      'Q1': { months: [1,2,3], start: `${currentYear}-01-01`, end: `${currentYear}-03-31`, deadline: `${currentYear}-04-30` },
      'Q2': { months: [4,5,6], start: `${currentYear}-04-01`, end: `${currentYear}-06-30`, deadline: `${currentYear}-07-31` },
      'Q3': { months: [7,8,9], start: `${currentYear}-07-01`, end: `${currentYear}-09-30`, deadline: `${currentYear}-10-31` },
      'Q4': { months: [10,11,12], start: `${currentYear}-10-01`, end: `${currentYear}-12-31`, deadline: `${currentYear + 1}-01-31` }
    };

    // Auto-generate VAT report when a quarter ends (month 4, 7, 10, 1)
    const quarterEndMonths = { 4: 'Q1', 7: 'Q2', 10: 'Q3', 1: 'Q4' };
    const justEndedQuarter = quarterEndMonths[currentMonth];

    if (justEndedQuarter) {
      const qYear = currentMonth === 1 ? currentYear - 1 : currentYear;
      const config = {
        ...quarterConfig[justEndedQuarter],
        start: justEndedQuarter === 'Q4' && currentMonth === 1 ? `${qYear}-10-01` : quarterConfig[justEndedQuarter].start,
        end: justEndedQuarter === 'Q4' && currentMonth === 1 ? `${qYear}-12-31` : quarterConfig[justEndedQuarter].end,
        deadline: justEndedQuarter === 'Q4' && currentMonth === 1 ? `${qYear + 1}-01-31` : quarterConfig[justEndedQuarter].deadline
      };

      // Calculate income
      const incomeResult = await sql`
        SELECT COALESCE(SUM(amount), 0) as total_incl_vat
        FROM invoices 
        WHERE status != 'draft'
          AND (
            (invoice_date >= ${config.start} AND invoice_date <= ${config.end})
            OR (invoice_date IS NULL AND created_at >= ${config.start} AND created_at <= ${config.end}::timestamp + interval '1 day')
          )
      `;

      // Calculate expenses
      const expenseResult = await sql`
        SELECT COALESCE(SUM(amount), 0) as total_amount
        FROM expenses 
        WHERE type = 'business'
          AND expense_date >= ${config.start} 
          AND expense_date <= ${config.end}
      `;

      const totalIncomeInclVat = parseFloat(incomeResult[0]?.total_incl_vat || 0);
      const totalIncomeExclVat = totalIncomeInclVat / 1.21;
      const totalIncomeVat = totalIncomeInclVat - totalIncomeExclVat;
      const totalExpenseAmount = parseFloat(expenseResult[0]?.total_amount || 0);
      const totalExpenseExclVat = totalExpenseAmount / 1.21;
      const totalExpenseVat = totalExpenseAmount - totalExpenseExclVat;
      const vatToPayOrRefund = totalIncomeVat - totalExpenseVat;
      const profit = totalIncomeExclVat - totalExpenseExclVat;

      // Ensure table exists
      try {
        await sql`
          CREATE TABLE IF NOT EXISTS vat_reports (
            id SERIAL PRIMARY KEY,
            quarter VARCHAR(2) NOT NULL,
            year INTEGER NOT NULL,
            total_income_excl_vat DECIMAL(10,2) DEFAULT 0,
            total_income_vat DECIMAL(10,2) DEFAULT 0,
            total_income_incl_vat DECIMAL(10,2) DEFAULT 0,
            total_expense_excl_vat DECIMAL(10,2) DEFAULT 0,
            total_expense_vat DECIMAL(10,2) DEFAULT 0,
            total_expense_incl_vat DECIMAL(10,2) DEFAULT 0,
            vat_to_pay_or_refund DECIMAL(10,2) DEFAULT 0,
            profit DECIMAL(10,2) DEFAULT 0,
            status VARCHAR(20) DEFAULT 'open',
            deadline DATE,
            notes TEXT,
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW(),
            UNIQUE(quarter, year)
          )
        `;
      } catch (e) { /* table exists */ }

      // Upsert report
      await sql`
        INSERT INTO vat_reports (
          quarter, year, 
          total_income_excl_vat, total_income_vat, total_income_incl_vat,
          total_expense_excl_vat, total_expense_vat, total_expense_incl_vat,
          vat_to_pay_or_refund, profit, status, deadline
        ) VALUES (
          ${justEndedQuarter}, ${qYear},
          ${Math.round(totalIncomeExclVat * 100) / 100}, ${Math.round(totalIncomeVat * 100) / 100}, ${Math.round(totalIncomeInclVat * 100) / 100},
          ${Math.round(totalExpenseExclVat * 100) / 100}, ${Math.round(totalExpenseVat * 100) / 100}, ${Math.round(totalExpenseAmount * 100) / 100},
          ${Math.round(vatToPayOrRefund * 100) / 100}, ${Math.round(profit * 100) / 100}, 'ready', ${config.deadline}
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
          status = CASE WHEN vat_reports.status = 'submitted' THEN 'submitted' ELSE 'ready' END,
          updated_at = NOW()
      `;

      results.generated.push(`${justEndedQuarter} ${qYear}`);
      console.log(`Generated VAT report for ${justEndedQuarter} ${qYear}`);
    }

    // ===== EMAIL ALERTS =====
    const adminEmail = process.env.ADMIN_EMAIL || 'info@varexo.nl';

    // Check each quarter's deadline
    for (const [quarter, config] of Object.entries(quarterConfig)) {
      const deadline = new Date(config.deadline);
      const daysUntil = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

      // Check if report exists and is not submitted
      let reportStatus = 'none';
      try {
        const existing = await sql`
          SELECT status FROM vat_reports WHERE quarter = ${quarter} AND year = ${currentYear}
        `;
        if (existing.length > 0) reportStatus = existing[0].status;
      } catch (e) { /* table may not exist */ }

      // Skip if already submitted
      if (reportStatus === 'submitted' || reportStatus === 'closed') continue;

      let alertType = null;
      let subject = null;
      let message = null;

      // 14 days before deadline
      if (daysUntil === 14) {
        alertType = '14_days';
        subject = `⚠️ BTW aangifte ${quarter} ${currentYear} - nog 2 weken`;
        message = `Je moet binnen 2 weken BTW aangifte doen voor ${quarter} ${currentYear}.\nDeadline: ${deadline.toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })}\n\nGa naar je admin portaal om het rapport te bekijken en de gegevens te kopiëren naar de Belastingdienst.`;
      }

      // Day of deadline
      if (daysUntil === 0) {
        alertType = 'deadline_day';
        subject = `🔴 VANDAAG: Laatste dag BTW aangifte ${quarter} ${currentYear}`;
        message = `Vandaag is de LAATSTE DAG om je BTW aangifte te doen voor ${quarter} ${currentYear}!\n\nGa NU naar je admin portaal om het rapport te bekijken.`;
      }

      if (alertType && subject) {
        try {
          const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: process.env.SMTP_SECURE === 'true',
            auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
          });

          await transporter.sendMail({
            from: `"Varexo Admin" <${process.env.SMTP_USER || 'info@varexo.nl'}>`,
            to: adminEmail,
            subject,
            text: message,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background: linear-gradient(135deg, #1a3050, #2a5a8c); color: white; padding: 20px; border-radius: 8px 8px 0 0;">
                  <h2 style="margin: 0;">${subject}</h2>
                </div>
                <div style="background: #f8f9fa; padding: 20px; border-radius: 0 0 8px 8px; border: 1px solid #dee2e6;">
                  <p style="white-space: pre-line;">${message}</p>
                  <a href="https://varexo.nl/admin" style="display: inline-block; margin-top: 15px; padding: 10px 20px; background: #2a5a8c; color: white; text-decoration: none; border-radius: 5px;">Open Admin Portaal</a>
                </div>
              </div>
            `
          });

          results.alerts.push(`${alertType} for ${quarter}`);
          console.log(`Sent ${alertType} alert for ${quarter} ${currentYear}`);
        } catch (emailErr) {
          console.error(`Email alert failed for ${quarter}:`, emailErr.message);
        }
      }
    }

    // ===== MONTHLY SUMMARY (on 1st of each month) =====
    if (today.getDate() === 1) {
      try {
        // Get last month's data
        const lastMonth = currentMonth === 1 ? 12 : currentMonth - 1;
        const lastMonthYear = currentMonth === 1 ? currentYear - 1 : currentYear;
        const monthStart = `${lastMonthYear}-${String(lastMonth).padStart(2, '0')}-01`;
        const monthEnd = `${lastMonthYear}-${String(lastMonth).padStart(2, '0')}-${new Date(lastMonthYear, lastMonth, 0).getDate()}`;

        const monthIncome = await sql`
          SELECT COALESCE(SUM(amount), 0) as total FROM invoices 
          WHERE status != 'draft' AND (
            (invoice_date >= ${monthStart} AND invoice_date <= ${monthEnd})
            OR (invoice_date IS NULL AND created_at >= ${monthStart} AND created_at <= ${monthEnd}::timestamp + interval '1 day')
          )
        `;
        const monthExpense = await sql`
          SELECT COALESCE(SUM(amount), 0) as total FROM expenses 
          WHERE type = 'business' AND expense_date >= ${monthStart} AND expense_date <= ${monthEnd}
        `;

        const income = parseFloat(monthIncome[0]?.total || 0);
        const expense = parseFloat(monthExpense[0]?.total || 0);
        const profit = (income / 1.21) - (expense / 1.21);
        const vatBalance = (income - income / 1.21) - (expense - expense / 1.21);
        const monthNames = ['Januari','Februari','Maart','April','Mei','Juni','Juli','Augustus','September','Oktober','November','December'];

        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: parseInt(process.env.SMTP_PORT || '587'),
          secure: process.env.SMTP_SECURE === 'true',
          auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
        });

        await transporter.sendMail({
          from: `"Varexo Admin" <${process.env.SMTP_USER || 'info@varexo.nl'}>`,
          to: adminEmail,
          subject: `📊 Maandoverzicht ${monthNames[lastMonth - 1]} ${lastMonthYear}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: linear-gradient(135deg, #1a3050, #2a5a8c); color: white; padding: 20px; border-radius: 8px 8px 0 0;">
                <h2 style="margin: 0;">Maandoverzicht ${monthNames[lastMonth - 1]} ${lastMonthYear}</h2>
              </div>
              <div style="background: #f8f9fa; padding: 20px; border: 1px solid #dee2e6;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr><td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Omzet (incl. BTW)</strong></td><td style="text-align: right; padding: 10px; border-bottom: 1px solid #ddd; color: green;">€${income.toFixed(2)}</td></tr>
                  <tr><td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Kosten (incl. BTW)</strong></td><td style="text-align: right; padding: 10px; border-bottom: 1px solid #ddd; color: red;">€${expense.toFixed(2)}</td></tr>
                  <tr><td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Winst (excl. BTW)</strong></td><td style="text-align: right; padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">€${profit.toFixed(2)}</td></tr>
                  <tr><td style="padding: 10px;"><strong>BTW saldo</strong></td><td style="text-align: right; padding: 10px; color: ${vatBalance >= 0 ? 'orange' : 'blue'};">€${Math.abs(vatBalance).toFixed(2)} ${vatBalance >= 0 ? '(te betalen)' : '(terug te krijgen)'}</td></tr>
                </table>
              </div>
              <div style="background: #e8f4e8; padding: 15px; border-radius: 0 0 8px 8px; border: 1px solid #dee2e6; border-top: 0;">
                <a href="https://varexo.nl/admin" style="display: inline-block; padding: 10px 20px; background: #2a5a8c; color: white; text-decoration: none; border-radius: 5px;">Bekijk in Admin Portaal</a>
              </div>
            </div>
          `
        });

        results.alerts.push('monthly_summary');
        console.log('Sent monthly summary email');
      } catch (summaryErr) {
        console.error('Monthly summary email failed:', summaryErr.message);
      }
    }

    console.log('VAT report cron results:', results);
    return { statusCode: 200, headers, body: JSON.stringify(results) };

  } catch (error) {
    console.error('Generate VAT reports error:', error);
    return { statusCode: 500, headers, body: JSON.stringify({ error: error.message }) };
  }
};
