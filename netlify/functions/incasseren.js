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
    const body = JSON.parse(event.body);
    const customerEmail = body.customerEmail;
    const amount = parseFloat(body.amount);
    const description = body.description;
    const products = body.products;

    if (!customerEmail || !amount || isNaN(amount) || amount <= 0) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'customerEmail and valid amount required' }) };
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

    // Try to create Mollie Sales Invoice (klant krijgt email van Mollie)
    let mollieInvoiceId = null;
    try {
      const axios = require('axios');
      const invoiceLines = (products && products.length > 0) ? products.map(p => ({
        description: `${p.name} - Vrijgesteld van BTW i.v.m. KOR`,
        quantity: p.quantity || 1,
        vatRate: '0.00',
        unitPrice: { currency: 'EUR', value: parseFloat(p.unitPrice).toFixed(2) }
      })) : [{
        description: `${description || 'Varexo diensten'} - Vrijgesteld van BTW i.v.m. KOR`,
        quantity: 1,
        vatRate: '0.00',
        unitPrice: { currency: 'EUR', value: amount.toFixed(2) }
      }];

      const invoiceRes = await axios.post('https://api.mollie.com/v2/sales-invoices', {
        currency: 'EUR',
        status: 'issued',
        paymentTerm: 'days-14',
        recipientIdentifier: customer.mollie_customer_id,
        lines: invoiceLines
      }, {
        headers: { Authorization: `Bearer ${process.env.MOLLIE_API_KEY}`, 'Content-Type': 'application/json' }
      });
      mollieInvoiceId = invoiceRes.data?.id;
      console.log('Mollie sales invoice created:', mollieInvoiceId);
    } catch (invoiceErr) {
      console.log('Sales invoice creation failed (continuing with payment):', invoiceErr.response?.data || invoiceErr.message);
    }

    // Get default Mollie profile ID (needed for recurring payments)
    let profileId = process.env.MOLLIE_PROFILE_ID;
    if (!profileId) {
      try {
        const axios = require('axios');
        const profilesRes = await axios.get('https://api.mollie.com/v2/profiles', {
          headers: { Authorization: `Bearer ${process.env.MOLLIE_API_KEY}` }
        });
        const profiles = profilesRes.data?._embedded?.profiles || [];
        profileId = profiles[0]?.id;
        console.log('Using Mollie profile:', profileId);
      } catch (pErr) {
        console.log('Could not fetch profile:', pErr.message);
      }
    }

    // Create recurring payment (SEPA incasso)
    const paymentPayload = {
      amount: {
        currency: 'EUR',
        value: amount.toFixed(2)
      },
      description: description || `Varexo - ${customerEmail}`,
      webhookUrl: process.env.WEBHOOK_URL,
      customerId: customer.mollie_customer_id,
      sequenceType: 'recurring'
    };
    if (profileId) paymentPayload.profileId = profileId;

    const payment = await mollieClient.payments.create(paymentPayload);

    // Save payment
    await client.query(
      `INSERT INTO payments (customer_email, invoice_id, mollie_payment_id, amount, status, method)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [customerEmail, mollieInvoiceId || null, payment.id, amount, payment.status, 'directdebit']
    );

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        paymentId: payment.id,
        mollieInvoiceId,
        status: payment.status
      })
    };

  } catch (error) {
    console.error('Incasso error:', error);
    try {
      await client.query(
        'INSERT INTO incasso_logs (customer_email, amount, status, error_message) VALUES ($1, $2, $3, $4)',
        [error._customerEmail || 'unknown', error._amount || 0, 'error', error.message]
      );
    } catch (logErr) {
      console.error('Log error:', logErr.message);
    }
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  } finally {
    client.release();
  }
};
