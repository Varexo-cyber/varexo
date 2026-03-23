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
  const path = event.path.replace('/.netlify/functions/invoices', '').replace('/api/invoices', '');
  const body = event.body ? JSON.parse(event.body) : {};
  const params = event.queryStringParameters || {};

  try {
    // GET /invoices?email=... or ?all=true
    if (event.httpMethod === 'GET') {
      let result;
      if (params.all === 'true') {
        result = await sql`SELECT * FROM invoices ORDER BY created_at DESC`;
      } else if (params.email) {
        result = await sql`SELECT * FROM invoices WHERE customer_email = ${params.email} ORDER BY created_at DESC`;
      } else {
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'Email parameter vereist' }) };
      }

      const invoices = result.map(i => ({
        id: i.id.toString(),
        invoiceNumber: i.invoice_number,
        projectTitle: i.project_title,
        customerEmail: i.customer_email,
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
      const { projectTitle, customerEmail, amount, status, dueDate, items } = body;
      const invoiceNumber = `INV-${Date.now()}`;

      const result = await sql`
        INSERT INTO invoices (invoice_number, project_title, customer_email, amount, status, due_date, items)
        VALUES (${invoiceNumber}, ${projectTitle}, ${customerEmail}, ${amount}, ${status || 'draft'}, ${dueDate}, ${JSON.stringify(items || [])})
        RETURNING *
      `;

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

    // PUT /invoices/:id
    if (event.httpMethod === 'PUT') {
      const id = path.replace('/', '');
      const { status, amount, dueDate, items } = body;

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
