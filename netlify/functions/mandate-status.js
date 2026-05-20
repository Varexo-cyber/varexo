// Netlify Function: Check mandate status for a customer
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers };
  }

  const email = event.queryStringParameters?.email;
  if (!email) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Email required' }) };
  }

  let client;
  try {
    client = await pool.connect();
    const result = await client.query(
      'SELECT sepa_mandate_status FROM customers WHERE email = $1',
      [email]
    );

    const hasMandate = result.rows.length > 0 && result.rows[0].sepa_mandate_status === 'valid';

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ hasMandate })
    };
  } catch (error) {
    console.error('Mandate status error:', error);
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ hasMandate: false })
    };
  } finally {
    if (client) client.release();
  }
};
