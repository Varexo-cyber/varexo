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
  const path = event.path.replace('/.netlify/functions/payment-tracking', '').replace('/api/payment-tracking', '');
  const body = event.body ? JSON.parse(event.body) : {};
  const params = event.queryStringParameters || {};

  try {
    // Ensure table exists
    await sql`
      CREATE TABLE IF NOT EXISTS invoice_payment_tracking (
        id SERIAL PRIMARY KEY,
        invoice_id INTEGER NOT NULL,
        recurring_invoice_id INTEGER,
        period_number INTEGER NOT NULL,
        period_start_date DATE NOT NULL,
        period_end_date DATE NOT NULL,
        invoice_number VARCHAR(50),
        amount DECIMAL(10,2) NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        paid_date DATE,
        payment_method VARCHAR(50),
        payment_notes TEXT,
        reminder_count INTEGER DEFAULT 0,
        last_reminder_date DATE,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;

    // Migration: Add invoice_number column if it doesn't exist (for existing tables)
    try {
      await sql`ALTER TABLE invoice_payment_tracking ADD COLUMN IF NOT EXISTS invoice_number VARCHAR(50)`;
    } catch (migrateErr) {
      console.log('Migration note:', migrateErr.message);
    }

    // GET - payment tracking for invoice
    if (event.httpMethod === 'GET') {
      const invoiceId = params.invoiceId;
      if (!invoiceId) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invoice ID vereist' }) };
      }

      const tracking = await sql`
        SELECT * FROM invoice_payment_tracking 
        WHERE invoice_id = ${parseInt(invoiceId)}
        ORDER BY period_number ASC
      `;

      return { 
        statusCode: 200, 
        headers, 
        body: JSON.stringify(tracking.map(t => ({
          id: t.id.toString(),
          invoiceId: t.invoice_id.toString(),
          recurringInvoiceId: t.recurring_invoice_id?.toString(),
          periodNumber: t.period_number,
          periodStartDate: t.period_start_date,
          periodEndDate: t.period_end_date,
          invoiceNumber: t.invoice_number,
          amount: parseFloat(t.amount),
          status: t.status,
          paidDate: t.paid_date,
          paymentMethod: t.payment_method,
          paymentNotes: t.payment_notes,
          reminderCount: t.reminder_count,
          lastReminderDate: t.last_reminder_date,
          createdAt: t.created_at
        })))
      };
    }

    // POST - create payment tracking entry
    if (event.httpMethod === 'POST') {
      const { invoiceId, recurringInvoiceId, periodNumber, periodStartDate, periodEndDate, invoiceNumber, amount, status, paidDate, paymentMethod, paymentNotes } = body;

      const result = await sql`
        INSERT INTO invoice_payment_tracking (
          invoice_id, recurring_invoice_id, period_number, period_start_date, period_end_date,
          invoice_number, amount, status, paid_date, payment_method, payment_notes
        ) VALUES (
          ${invoiceId}, ${recurringInvoiceId || null}, ${periodNumber || 1}, ${periodStartDate}, ${periodEndDate},
          ${invoiceNumber || null}, ${amount}, ${status || 'pending'}, ${paidDate || null}, ${paymentMethod || null}, ${paymentNotes || null}
        )
        RETURNING *
      `;

      const t = result[0];
      return { statusCode: 200, headers, body: JSON.stringify({
        id: t.id.toString(),
        invoiceId: t.invoice_id.toString(),
        periodNumber: t.period_number,
        invoiceNumber: t.invoice_number,
        amount: parseFloat(t.amount),
        status: t.status,
        paidDate: t.paid_date
      })};
    }

    // PUT - update payment status
    if (event.httpMethod === 'PUT') {
      const id = path.replace('/', '');
      const { status, paidDate, paymentMethod, paymentNotes } = body;

      const result = await sql`
        UPDATE invoice_payment_tracking SET
          status = COALESCE(${status}, status),
          paid_date = COALESCE(${paidDate}, paid_date),
          payment_method = COALESCE(${paymentMethod}, payment_method),
          payment_notes = COALESCE(${paymentNotes}, payment_notes)
        WHERE id = ${parseInt(id)}
        RETURNING *
      `;

      if (result.length === 0) {
        return { statusCode: 404, headers, body: JSON.stringify({ error: 'Niet gevonden' }) };
      }

      const t = result[0];
      return { statusCode: 200, headers, body: JSON.stringify({
        id: t.id.toString(),
        status: t.status,
        paidDate: t.paid_date,
        paymentMethod: t.payment_method,
        paymentNotes: t.payment_notes
      })};
    }

    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method Not Allowed' }) };

  } catch (error) {
    console.error('Payment tracking error:', error);
    return { statusCode: 500, headers, body: JSON.stringify({ error: error.message }) };
  }
};
