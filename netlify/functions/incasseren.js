// Netlify Function: Admin Incasso
const { Pool } = require('pg');
const { createMollieClient } = require('@mollie/api-client');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const mollieClient = createMollieClient({ apiKey: process.env.MOLLIE_API_KEY });

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const client = await pool.connect();
  
  try {
    const { customerEmail, amount, description, invoiceId } = JSON.parse(event.body);

    // Check admin token
    const token = event.headers.authorization?.split(' ')[1];
    if (!token) {
      return { statusCode: 401, headers, body: JSON.stringify({ error: 'No token' }) };
    }

    // Get customer
    const result = await client.query(
      'SELECT * FROM customers WHERE email = $1',
      [customerEmail]
    );
    
    const customer = result.rows[0];
    if (!customer || !customer.mollie_customer_id || customer.sepa_mandate_status !== 'valid') {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'No valid SEPA mandate' }) };
    }

    // Create recurring payment (SEPA incasso)
    const payment = await mollieClient.payments.create({
      amount: {
        currency: 'EUR',
        value: amount.toFixed(2)
      },
      description: description || `Varexo - ${customerEmail}`,
      webhookUrl: process.env.WEBHOOK_URL,
      customerId: customer.mollie_customer_id,
      sequenceType: 'recurring'
    });

    // Save payment
    await client.query(
      `INSERT INTO payments (customer_email, invoice_id, mollie_payment_id, amount, status, method)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [customerEmail, invoiceId || null, payment.id, amount, payment.status, 'directdebit']
    );

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        paymentId: payment.id,
        status: payment.status
      })
    };

  } catch (error) {
    console.error('Incasso error:', error);
    await client.query(
      'INSERT INTO incasso_logs (customer_email, amount, status, error_message) VALUES ($1, $2, $3, $4)',
      [customerEmail, amount, 'error', error.message]
    );
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  } finally {
    client.release();
  }
};
