const { neon } = require('@neondatabase/serverless');
const { sendOverdueReminderEmail, sendNewInvoiceEmail } = require('./utils/send-email');

// Netlify Scheduled Function - runs daily at 8:00 AM
exports.handler = async (event, context) => {
  const sql = neon(process.env.DATABASE_URL);

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  };

  try {
    console.log('=== Daily Invoice Check Started ===');
    
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    // Calculate date 2 days from now (for pre-due reminders on day 12)
    const twoDaysFromNow = new Date(today);
    twoDaysFromNow.setDate(today.getDate() + 2);
    const twoDaysFromNowStr = twoDaysFromNow.toISOString().split('T')[0];

    let remindersSent = 0;
    let invoicesCreated = 0;
    let markedOverdue = 0;

    // ============================================================================
    // 1. REMINDERS: Send reminder 2 days BEFORE due date (dag 12 ipv na 14)
    // ============================================================================
    
    console.log(`Checking for invoices due on ${twoDaysFromNowStr} (2 days from now)...`);
    
    // Find invoices due in 2 days with status 'sent'
    const invoicesDueSoon = await sql`
      SELECT * FROM invoices 
      WHERE status = 'sent'
      AND due_date = ${twoDaysFromNowStr}
    `;

    console.log(`Found ${invoicesDueSoon.length} invoices due in 2 days`);

    for (const invoice of invoicesDueSoon) {
      try {
        // Send reminder email (pre-due, not overdue)
        await sendOverdueReminderEmail(
          invoice.customer_email,
          invoice.customer_name || '',
          invoice.invoice_number,
          invoice.amount,
          invoice.due_date,
          'pre-due' // Indicates this is a reminder before due date
        );
        
        remindersSent++;
        console.log(`Sent reminder to ${invoice.customer_email} for ${invoice.invoice_number} (due in 2 days)`);
      } catch (err) {
        console.error(`Failed to send reminder for ${invoice.invoice_number}:`, err.message);
      }
    }

    // ============================================================================
    // 2. MONTHLY INVOICE CREATION: On 1st of each month
    // ============================================================================
    
    if (today.getDate() === 1) {
      console.log('=== Today is the 1st - Processing recurring invoices ===');
      
      // Ensure recurring_invoices table exists
      await sql`
        CREATE TABLE IF NOT EXISTS recurring_invoices (
          id SERIAL PRIMARY KEY,
          customer_email VARCHAR(255) NOT NULL,
          customer_name VARCHAR(255),
          customer_company VARCHAR(255),
          customer_address TEXT,
          customer_postal VARCHAR(20),
          customer_city VARCHAR(100),
          customer_phone VARCHAR(50),
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
      
      // Get active recurring invoices where next_invoice_date is today or earlier
      const recurringInvoices = await sql`
        SELECT * FROM recurring_invoices 
        WHERE active = true 
        AND next_invoice_date <= ${todayStr}
      `;

      console.log(`Found ${recurringInvoices.length} recurring invoices to process`);

      for (const recurring of recurringInvoices) {
        try {
          // Generate invoice number
          const year = today.getFullYear().toString();
          const lastInv = await sql`
            SELECT invoice_number FROM invoices 
            WHERE invoice_number LIKE ${year + '-%'}
            ORDER BY invoice_number DESC LIMIT 1
          `;
          let nextNum = 1;
          if (lastInv.length > 0) {
            const lastNum = parseInt(lastInv[0].invoice_number.split('-')[1]) || 0;
            nextNum = lastNum + 1;
          }
          const invoiceNumber = `${year}-${String(nextNum).padStart(3, '0')}`;

          // Calculate due date (14 days)
          const dueDate = new Date(today);
          dueDate.setDate(today.getDate() + 14);
          const dueDateStr = dueDate.toISOString().split('T')[0];

          // Create the invoice
          const result = await sql`
            INSERT INTO invoices (
              invoice_number, invoice_date, project_title, customer_email,
              customer_name, customer_company, customer_address, customer_postal, customer_city, customer_phone,
              amount, status, due_date, items
            ) VALUES (
              ${invoiceNumber}, ${todayStr}, ${recurring.description}, ${recurring.customer_email},
              ${recurring.customer_name || null}, ${recurring.customer_company || null}, 
              ${recurring.customer_address || null}, ${recurring.customer_postal || null}, 
              ${recurring.customer_city || null}, ${recurring.customer_phone || null},
              ${recurring.amount}, 'sent', ${dueDateStr}, ${recurring.items || '[]'}
            )
            RETURNING id
          `;

          const newInvoiceId = result[0].id;

          // Send invoice email with PDF
          await sendNewInvoiceEmail(
            recurring.customer_email,
            recurring.customer_name || '',
            invoiceNumber,
            recurring.amount,
            {
              invoiceDate: todayStr,
              dueDate: dueDateStr,
              customerName: recurring.customer_name || '',
              customerCompany: recurring.customer_company || '',
              customerAddress: recurring.customer_address || '',
              customerPostal: recurring.customer_postal || '',
              customerCity: recurring.customer_city || '',
              customerPhone: recurring.customer_phone || '',
              items: recurring.items || [{ description: recurring.description, quantity: 1, price: parseFloat(recurring.amount), total: parseFloat(recurring.amount) }]
            }
          );

          // Calculate next invoice date
          const nextDate = new Date(today);
          nextDate.setMonth(today.getMonth() + recurring.interval_months);
          
          // Update recurring invoice
          await sql`
            UPDATE recurring_invoices 
            SET next_invoice_date = ${nextDate.toISOString().split('T')[0]}
            WHERE id = ${recurring.id}
          `;

          invoicesCreated++;
          console.log(`Created invoice ${invoiceNumber} for ${recurring.customer_email}`);
        } catch (err) {
          console.error(`Failed to create invoice for recurring ${recurring.id}:`, err.message);
        }
      }
    }

    // ============================================================================
    // 3. Mark truly overdue invoices (past due date + grace period)
    // ============================================================================
    
    const overdueResult = await sql`
      UPDATE invoices 
      SET status = 'overdue'
      WHERE status = 'sent'
      AND due_date < ${todayStr}
      RETURNING id
    `;
    
    markedOverdue = overdueResult.length;
    if (markedOverdue > 0) {
      console.log(`Marked ${markedOverdue} invoices as overdue`);
    }

    const summary = { 
      date: todayStr,
      remindersSent,
      invoicesCreated,
      markedOverdue,
      isFirstOfMonth: today.getDate() === 1
    };
    
    console.log('=== Daily check summary:', summary);

    return { 
      statusCode: 200, 
      headers, 
      body: JSON.stringify(summary) 
    };
  } catch (error) {
    console.error('Daily invoice check error:', error);
    return { 
      statusCode: 500, 
      headers, 
      body: JSON.stringify({ error: error.message }) 
    };
  }
};
