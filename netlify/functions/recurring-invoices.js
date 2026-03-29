const { neon } = require('@netlify/neon');
const { sendRecurringInvoiceSetupEmail } = require('./utils/send-email');

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
  const path = event.path.replace('/.netlify/functions/recurring-invoices', '').replace('/api/recurring-invoices', '');
  const body = event.body ? JSON.parse(event.body) : {};
  const params = event.queryStringParameters || {};

  try {
    // Auto-create table
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

    // GET - all or per customer
    if (event.httpMethod === 'GET') {
      let result;
      if (params.all === 'true') {
        result = await sql`SELECT * FROM recurring_invoices ORDER BY created_at DESC`;
      } else if (params.email) {
        result = await sql`SELECT * FROM recurring_invoices WHERE customer_email = ${params.email} ORDER BY created_at DESC`;
      } else {
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'Parameter vereist' }) };
      }

      const items = result.map(r => ({
        id: r.id.toString(),
        customerEmail: r.customer_email,
        customerName: r.customer_name,
        customerCompany: r.customer_company,
        customerAddress: r.customer_address,
        customerPostal: r.customer_postal,
        customerCity: r.customer_city,
        description: r.description,
        amount: parseFloat(r.amount),
        intervalMonths: r.interval_months,
        startDate: r.start_date,
        nextInvoiceDate: r.next_invoice_date,
        active: r.active,
        items: r.items || [],
        createdAt: r.created_at
      }));

      return { statusCode: 200, headers, body: JSON.stringify(items) };
    }

    // POST - create new recurring invoice
    if (event.httpMethod === 'POST') {
      const {
        customerEmail, customerName, customerCompany,
        customerAddress, customerPostal, customerCity,
        description, amount, intervalMonths, startDate, items
      } = body;

      const result = await sql`
        INSERT INTO recurring_invoices (
          customer_email, customer_name, customer_company,
          customer_address, customer_postal, customer_city,
          description, amount, interval_months, start_date, next_invoice_date, items
        ) VALUES (
          ${customerEmail}, ${customerName || null}, ${customerCompany || null},
          ${customerAddress || null}, ${customerPostal || null}, ${customerCity || null},
          ${description}, ${amount}, ${intervalMonths || 1}, ${startDate}, ${startDate},
          ${JSON.stringify(items || [{ description: description, quantity: 1, price: parseFloat(amount), total: parseFloat(amount) }])}
        ) RETURNING *
      `;

      const r = result[0];
      
      // Send confirmation email to customer
      try {
        await sendRecurringInvoiceSetupEmail(
          r.customer_email,
          r.customer_name,
          r.description,
          parseFloat(r.amount),
          r.interval_months,
          r.next_invoice_date
        );
        console.log('Recurring invoice setup email sent to:', r.customer_email);
      } catch (emailError) {
        console.error('Failed to send recurring invoice setup email:', emailError);
        // Don't fail the request if email fails
      }
      
      return { statusCode: 200, headers, body: JSON.stringify({
        id: r.id.toString(),
        customerEmail: r.customer_email,
        customerName: r.customer_name,
        description: r.description,
        amount: parseFloat(r.amount),
        intervalMonths: r.interval_months,
        startDate: r.start_date,
        nextInvoiceDate: r.next_invoice_date,
        active: r.active,
        items: r.items || [],
        createdAt: r.created_at
      })};
    }

    // PUT - update (toggle active, update amount, etc.)
    if (event.httpMethod === 'PUT') {
      const id = path.replace('/', '');
      const { active, amount, description, intervalMonths } = body;

      const result = await sql`
        UPDATE recurring_invoices SET
          active = COALESCE(${typeof active === 'boolean' ? active : null}, active),
          amount = COALESCE(${amount || null}, amount),
          description = COALESCE(${description || null}, description),
          interval_months = COALESCE(${intervalMonths || null}, interval_months)
        WHERE id = ${parseInt(id)}
        RETURNING *
      `;

      if (result.length === 0) {
        return { statusCode: 404, headers, body: JSON.stringify({ error: 'Niet gevonden' }) };
      }

      const r = result[0];
      return { statusCode: 200, headers, body: JSON.stringify({
        id: r.id.toString(),
        customerEmail: r.customer_email,
        description: r.description,
        amount: parseFloat(r.amount),
        intervalMonths: r.interval_months,
        active: r.active,
        nextInvoiceDate: r.next_invoice_date
      })};
    }

    // DELETE
    if (event.httpMethod === 'DELETE') {
      const id = path.replace('/', '');
      await sql`DELETE FROM recurring_invoices WHERE id = ${parseInt(id)}`;
      return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
    }

    return { statusCode: 404, headers, body: JSON.stringify({ error: 'Route niet gevonden' }) };
  } catch (error) {
    console.error('Recurring invoices error:', error);
    return { statusCode: 500, headers, body: JSON.stringify({ error: error.message }) };
  }
};
