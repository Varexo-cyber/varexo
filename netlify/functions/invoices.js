const { neon } = require('@netlify/neon');
const { sendNewInvoiceEmail, sendPaymentConfirmationEmail, sendOverdueReminderEmail } = require('./utils/send-email');

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
  const path = event.path.replace('/.netlify/functions/invoices', '').replace('/api/invoices', '');
  const body = event.body ? JSON.parse(event.body) : {};
  const params = event.queryStringParameters || {};

  try {
    // Auto-migrate: add new columns if missing
    try {
      await sql`ALTER TABLE invoices ADD COLUMN IF NOT EXISTS invoice_date DATE DEFAULT NOW()`;
      await sql`ALTER TABLE invoices ADD COLUMN IF NOT EXISTS customer_name VARCHAR(255)`;
      await sql`ALTER TABLE invoices ADD COLUMN IF NOT EXISTS customer_company VARCHAR(255)`;
      await sql`ALTER TABLE invoices ADD COLUMN IF NOT EXISTS customer_address TEXT`;
      await sql`ALTER TABLE invoices ADD COLUMN IF NOT EXISTS customer_postal VARCHAR(20)`;
      await sql`ALTER TABLE invoices ADD COLUMN IF NOT EXISTS customer_city VARCHAR(100)`;
      await sql`ALTER TABLE invoices ADD COLUMN IF NOT EXISTS customer_phone VARCHAR(50)`;
      await sql`ALTER TABLE invoices ALTER COLUMN status SET DEFAULT 'sent'`;
    } catch (e) { /* columns may already exist */ }

    // GET /invoices?nextNumber=true - Get next invoice number
    if (event.httpMethod === 'GET' && params.nextNumber === 'true') {
      const year = new Date().getFullYear().toString();
      const pattern = `${year}-%`;
      const lastInvoice = await sql`
        SELECT invoice_number FROM invoices 
        WHERE invoice_number LIKE ${pattern}
        ORDER BY invoice_number DESC LIMIT 1
      `;
      
      let nextNum = 1;
      if (lastInvoice.length > 0) {
        const lastNum = parseInt(lastInvoice[0].invoice_number.split('-')[1]) || 0;
        nextNum = lastNum + 1;
      }
      
      const nextNumber = `${year}-${String(nextNum).padStart(3, '0')}`;
      return { statusCode: 200, headers, body: JSON.stringify({ nextNumber }) };
    }

    // GET /invoices?email=... or ?all=true
    if (event.httpMethod === 'GET') {
      console.log('Fetching invoices...', params);
      
      // FIX: Get ALL invoices first to bypass caching
      const allInvoices = await sql`SELECT * FROM invoices ORDER BY created_at DESC`;
      console.log('Total invoices from DB:', allInvoices.length);
      
      let result;
      if (params.all === 'true') {
        result = allInvoices;
      } else if (params.email) {
        // Filter in JavaScript to bypass query caching
        result = allInvoices.filter(i => i.customer_email === params.email);
        console.log('Filtered for', params.email, ':', result.length);
      } else {
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'Email parameter vereist' }) };
      }

      const invoices = result.map(i => ({
        id: i.id.toString(),
        invoiceNumber: i.invoice_number,
        invoiceDate: i.invoice_date,
        projectTitle: i.project_title,
        customerEmail: i.customer_email,
        customerName: i.customer_name,
        customerCompany: i.customer_company,
        customerAddress: i.customer_address,
        customerPostal: i.customer_postal,
        customerCity: i.customer_city,
        customerPhone: i.customer_phone,
        amount: parseFloat(i.amount),
        status: i.status,
        dueDate: i.due_date,
        items: i.items || [],
        createdAt: i.created_at
      }));

      return { statusCode: 200, headers, body: JSON.stringify(invoices) };
    }

    // POST /invoices
    if (event.httpMethod === 'POST') {
      const { 
        invoiceNumber, invoiceDate, projectTitle, customerEmail, 
        customerName, customerCompany, customerAddress, customerPostal, customerCity, customerPhone,
        amount, status, dueDate, items 
      } = body;
      
      // Auto-generate invoice number in YYYY-NNN format if not provided
      let finalInvoiceNumber = invoiceNumber;
      if (!finalInvoiceNumber) {
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
        finalInvoiceNumber = `${year}-${String(nextNum).padStart(3, '0')}`;
      }

      let result;
      try {
        result = await sql`
          INSERT INTO invoices (
            invoice_number, invoice_date, project_title, customer_email,
            customer_name, customer_company, customer_address, customer_postal, customer_city, customer_phone,
            amount, status, due_date, items
          )
          VALUES (
            ${finalInvoiceNumber}, ${invoiceDate || null}, ${projectTitle}, ${customerEmail},
            ${customerName || null}, ${customerCompany || null}, ${customerAddress || null}, ${customerPostal || null}, ${customerCity || null}, ${customerPhone || null},
            ${amount}, ${status || 'sent'}, ${dueDate}, ${JSON.stringify(items || [])}
          )
          RETURNING *
        `;
      } catch (colErr) {
        // Fallback without new columns
        result = await sql`
          INSERT INTO invoices (invoice_number, project_title, customer_email, amount, status, due_date, items)
          VALUES (${finalInvoiceNumber}, ${projectTitle}, ${customerEmail}, ${amount}, ${status || 'sent'}, ${dueDate}, ${JSON.stringify(items || [])})
          RETURNING *
        `;
      }

      const i = result[0];

      // Send email notification with PDF attachment
      try {
        await sendNewInvoiceEmail(customerEmail, customerName || '', finalInvoiceNumber, amount, {
          invoiceDate: invoiceDate || new Date().toISOString(),
          dueDate: dueDate,
          customerName: customerName || '',
          customerCompany: customerCompany || '',
          customerAddress: customerAddress || '',
          customerPostal: customerPostal || '',
          customerCity: customerCity || '',
          customerPhone: customerPhone || '',
          items: items || [],
        });
      } catch (e) { console.log('Email skip:', e.message); }

      return { statusCode: 200, headers, body: JSON.stringify({
        id: i.id.toString(),
        invoiceNumber: i.invoice_number,
        invoiceDate: i.invoice_date || null,
        projectTitle: i.project_title,
        customerEmail: i.customer_email,
        customerName: i.customer_name || null,
        customerCompany: i.customer_company || null,
        customerAddress: i.customer_address || null,
        customerPostal: i.customer_postal || null,
        customerCity: i.customer_city || null,
        customerPhone: i.customer_phone || null,
        amount: parseFloat(i.amount),
        status: i.status,
        dueDate: i.due_date,
        items: i.items || [],
        createdAt: i.created_at
      })};
    }

    // PUT /invoices/:id
    if (event.httpMethod === 'PUT') {
      const id = path.replace('/', '');
      const { status, amount, dueDate, items } = body;

      // Get current invoice to check status change
      const currentInvoice = await sql`SELECT * FROM invoices WHERE id = ${parseInt(id)}`;
      if (currentInvoice.length === 0) {
        return { statusCode: 404, headers, body: JSON.stringify({ error: 'Factuur niet gevonden' }) };
      }
      const oldStatus = currentInvoice[0].status;
      const customerEmail = currentInvoice[0].customer_email;
      const customerName = currentInvoice[0].customer_name;
      const invoiceNumber = currentInvoice[0].invoice_number;
      const invoiceAmount = currentInvoice[0].amount;
      const invoiceDueDate = currentInvoice[0].due_date;

      const result = await sql`
        UPDATE invoices SET
          status = COALESCE(${status || null}, status),
          amount = COALESCE(${amount || null}, amount),
          due_date = COALESCE(${dueDate || null}, due_date),
          items = COALESCE(${items ? JSON.stringify(items) : null}, items)
        WHERE id = ${parseInt(id)}
        RETURNING *
      `;

      if (result.length === 0) {
        return { statusCode: 404, headers, body: JSON.stringify({ error: 'Factuur niet gevonden' }) };
      }

      // Send email notifications on status change
      if (status && status !== oldStatus) {
        try {
          if (status === 'paid') {
            await sendPaymentConfirmationEmail(customerEmail, customerName, invoiceNumber, invoiceAmount);
          } else if (status === 'overdue') {
            await sendOverdueReminderEmail(customerEmail, customerName, invoiceNumber, invoiceAmount, invoiceDueDate);
          }
        } catch (emailErr) {
          console.log('Status change email failed:', emailErr.message);
        }
      }

      const i = result[0];
      return { statusCode: 200, headers, body: JSON.stringify({
        id: i.id.toString(),
        invoiceNumber: i.invoice_number,
        projectTitle: i.project_title,
        customerEmail: i.customer_email,
        amount: parseFloat(i.amount),
        status: i.status,
        dueDate: i.due_date,
        items: i.items || [],
        createdAt: i.created_at
      })};
    }

    // DELETE /invoices/:id
    if (event.httpMethod === 'DELETE') {
      const id = path.replace('/', '');
      await sql`DELETE FROM invoices WHERE id = ${parseInt(id)}`;
      return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
    }

    return { statusCode: 404, headers, body: JSON.stringify({ error: 'Route niet gevonden' }) };

  } catch (error) {
    console.error('Invoices error:', error);
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Server error: ' + error.message }) };
  }
};
