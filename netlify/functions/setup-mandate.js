// Netlify Function: Setup SEPA Mandate
const { Pool } = require('pg');
const { createMollieClient } = require('@mollie/api-client');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const mollieClient = createMollieClient({ apiKey: process.env.MOLLIE_API_KEY });

exports.handler = async (event, context) => {
  // CORS headers
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

  // Check environment variables
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL missing');
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Database not configured' }) };
  }
  if (!process.env.MOLLIE_API_KEY) {
    console.error('❌ MOLLIE_API_KEY missing');
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Mollie not configured' }) };
  }

  let client;
  try {
    client = await pool.connect();
    console.log('✅ Database connected');
  } catch (dbError) {
    console.error('❌ Database connection failed:', dbError.message);
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Database connection failed' }) };
  }
  
  try {
    const { redirectUrl, email } = JSON.parse(event.body);
    
    if (!email) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Email required' }) };
    }

    const userEmail = email;
    console.log('Setup mandate for:', userEmail);

    // Get customer from database
    const result = await client.query(
      'SELECT * FROM customers WHERE email = $1',
      [userEmail]
    );
    
    const customer = result.rows[0];
    if (!customer) {
      return { statusCode: 404, headers, body: JSON.stringify({ error: 'Customer not found' }) };
    }

    // Create or get Mollie customer
    let mollieCustomerId = customer.mollie_customer_id;
    
    if (!mollieCustomerId) {
      const mollieCustomer = await mollieClient.customers.create({
        name: customer.display_name || customer.email,
        email: customer.email
      });
      mollieCustomerId = mollieCustomer.id;
      
      await client.query(
        'UPDATE customers SET mollie_customer_id = $1 WHERE email = $2',
        [mollieCustomerId, userEmail]
      );
    }

    // Create first payment (€0.01 via iDEAL)
    const payment = await mollieClient.payments.create({
      amount: {
        currency: 'EUR',
        value: '0.01'
      },
      description: 'SEPA mandaat setup - Varexo',
      redirectUrl: redirectUrl,
      webhookUrl: process.env.WEBHOOK_URL,
      method: 'ideal',
      customerId: mollieCustomerId,
      sequenceType: 'first'
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        paymentUrl: payment.getCheckoutUrl(),
        paymentId: payment.id
      })
    };

  } catch (error) {
    console.error('Setup mandate error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  } finally {
    client.release();
  }
};
