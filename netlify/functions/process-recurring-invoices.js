const { neon } = require('@netlify/neon');
const { sendNewInvoiceEmail } = require('./utils/send-email');

// Netlify Scheduled Function - runs daily at 8:00 AM
exports.handler = async (event) => {
  const sql = neon();

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  };

  // Also allow manual trigger via GET
  try {
    // Ensure table exists
    try {
      await sql`
        CREATE TABLE IF NOT EXISTS recurring_invoices (
          id SERIAL PRIMARY KEY,
          customer_email VARCHAR(255) NOT NULL,
          customer_name VARCHAR(255),
          customer_company VARCHAR(255),
          customer_address TEXT,
          customer_postal VARCHAR(20),
          customer_city VARCHAR(100),
          description VARCHAR(500) NOT NULL,
          amount DECIMAL(10,2) NOT NULL,
          interval_months INTEGER DEFAULT 1,
          start_date DATE NOT NULL,
          next_invoice_date DATE NOT NULL,
          active BOOLEAN DEFAULT true,
          items JSONB DEFAULT '[]',
          created_at TIMESTAMP DEFAULT NOW()
        )
      `;
    } catch (e) { /* table exists */ }

    // Find all recurring invoices that are due today or earlier
    const today = new Date().toISOString().split('T')[0];
    const dueInvoices = await sql`
      SELECT * FROM recurring_invoices 
      WHERE active = true AND next_invoice_date <= ${today}
    `;

    console.log(`Found ${dueInvoices.length} recurring invoices to process`);

    let processed = 0;
    let failed = 0;

    for (const ri of dueInvoices) {
      try {
        // Generate next invoice number (YYYY-NNN)
        const year = new Date().getFullYear().toString();
        const pattern = `${year}-%`;
        const lastInv = await sql`
          SELECT invoice_number FROM invoices 
          WHERE invoice_number LIKE ${pattern}
          ORDER BY invoice_number DESC LIMIT 1
        `;
        let nextNum = 1;
        if (lastInv.length > 0) {
          const lastNum = parseInt(lastInv[0].invoice_number.split('-')[1]) || 0;
          nextNum = lastNum + 1;
        }
        const invoiceNumber = `${year}-${String(nextNum).padStart(3, '0')}`;

        // Calculate due date (14 days from now)
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 14);
        const dueDateStr = dueDate.toISOString().split('T')[0];

        // Parse items
        const items = ri.items || [{ 
          description: ri.description, 
          quantity: 1, 
          price: parseFloat(ri.amount), 
          total: parseFloat(ri.amount) 
        }];

        // Create the invoice
        try {
          await sql`
            INSERT INTO invoices (
              invoice_number, invoice_date, project_title, customer_email,
              customer_name, customer_company, customer_address, customer_postal, customer_city,
              amount, status, due_date, items
            ) VALUES (
              ${invoiceNumber}, ${today}, ${ri.description}, ${ri.customer_email},
              ${ri.customer_name || null}, ${ri.customer_company || null}, 
              ${ri.customer_address || null}, ${ri.customer_postal || null}, ${ri.customer_city || null},
              ${ri.amount}, 'sent', ${dueDateStr}, ${JSON.stringify(items)}
            )
          `;
        } catch (colErr) {
          // Fallback without customer columns
          await sql`
            INSERT INTO invoices (invoice_number, project_title, customer_email, amount, status, due_date, items)
            VALUES (${invoiceNumber}, ${ri.description}, ${ri.customer_email}, ${ri.amount}, 'sent', ${dueDateStr}, ${JSON.stringify(items)})
          `;
        }

        // Send email with PDF
        try {
          await sendNewInvoiceEmail(ri.customer_email, ri.customer_name || '', invoiceNumber, ri.amount, {
            invoiceDate: today,
            dueDate: dueDateStr,
            customerName: ri.customer_name || '',
            customerCompany: ri.customer_company || '',
            customerAddress: ri.customer_address || '',
            customerPostal: ri.customer_postal || '',
            customerCity: ri.customer_city || '',
            items,
          });
        } catch (emailErr) {
          console.error(`Email failed for ${ri.customer_email}:`, emailErr.message);
        }

        // Update next_invoice_date
        const nextDate = new Date(ri.next_invoice_date);
        nextDate.setMonth(nextDate.getMonth() + (ri.interval_months || 1));
        const nextDateStr = nextDate.toISOString().split('T')[0];

        await sql`
          UPDATE recurring_invoices 
          SET next_invoice_date = ${nextDateStr}
          WHERE id = ${ri.id}
        `;

        processed++;
        console.log(`Processed recurring invoice #${ri.id} for ${ri.customer_email}: ${invoiceNumber}`);
      } catch (err) {
        failed++;
        console.error(`Failed to process recurring invoice #${ri.id}:`, err.message);
      }
    }

    const summary = { processed, failed, total: dueInvoices.length, date: today };
    console.log('Recurring invoices summary:', summary);

    return { statusCode: 200, headers, body: JSON.stringify(summary) };
  } catch (error) {
    console.error('Process recurring invoices error:', error);
    return { statusCode: 500, headers, body: JSON.stringify({ error: error.message }) };
  }
};
