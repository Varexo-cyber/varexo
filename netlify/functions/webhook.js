// Netlify Function: Mollie Webhook
const { Pool } = require('pg');
const { createMollieClient } = require('@mollie/api-client');
const { sendMandateConfirmationEmail } = require('./utils/send-email');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const mollieClient = createMollieClient({ apiKey: process.env.MOLLIE_API_KEY });

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: 'Method not allowed' };
  }

  const client = await pool.connect();
  
  try {
    const { id } = JSON.parse(event.body);
    
    // Get payment from Mollie
    const payment = await mollieClient.payments.get(id);

    // Update payment in database
    await client.query(
      `UPDATE payments 
       SET status = $1, paid_at = $2, method = $3 
       WHERE mollie_payment_id = $4`,
      [payment.status, payment.paidAt, payment.method, id]
    );

    // If paid, update invoice status OR create new invoice
    if (payment.status === 'paid') {
      // Check if payment has linked invoice
      const paymentResult = await client.query(
        'SELECT invoice_id FROM payments WHERE mollie_payment_id = $1',
        [id]
      );
      
      if (paymentResult.rows.length > 0 && paymentResult.rows[0].invoice_id) {
        // Update existing invoice
        await client.query(
          `UPDATE invoices SET status = 'paid', paid_at = NOW() WHERE id = $1`,
          [paymentResult.rows[0].invoice_id]
        );
      } else {
        // NO INVOICE EXISTS - Create automatic invoice
        const customerResult = await client.query(
          'SELECT id, email, company, display_name FROM customers WHERE mollie_customer_id = $1',
          [payment.customerId]
        );
        
        if (customerResult.rows.length > 0) {
          const customer = customerResult.rows[0];
          
          // Generate invoice number
          const date = new Date();
          const invoiceNumber = `F-${date.getFullYear()}${String(date.getMonth()+1).padStart(2,'0')}-${String(Math.floor(Math.random()*10000)).padStart(4,'0')}`;
          
          // Create invoice
          const invoiceResult = await client.query(
            `INSERT INTO invoices (customer_email, invoice_number, amount, status, description, created_at, paid_at)
             VALUES ($1, $2, $3, 'paid', $4, NOW(), NOW())
             RETURNING id`,
            [
              customer.email,
              invoiceNumber,
              payment.amount.value,
              payment.description || 'Betaling via Mollie'
            ]
          );
          
          // Link payment to new invoice
          await client.query(
            'UPDATE payments SET invoice_id = $1 WHERE mollie_payment_id = $2',
            [invoiceResult.rows[0].id, id]
          );
          
          console.log(`✅ Automatische factuur aangemaakt: ${invoiceNumber} voor ${customer.email}`);
        }
      }
    }

    // If this was first payment (mandate setup), update customer
    if (payment.sequenceType === 'first' && payment.status === 'paid') {
      const mandates = await mollieClient.customers.listMandates(payment.customerId);
      const validMandate = mandates.find(m => m.status === 'valid');

      if (validMandate) {
        await client.query(
          `UPDATE customers 
           SET sepa_mandate_id = $1, 
               sepa_mandate_status = 'valid',
               sepa_mandate_date = $2
           WHERE mollie_customer_id = $3`,
          [validMandate.id, validMandate.signatureDate, payment.customerId]
        );

        await client.query(
          `INSERT INTO sepa_mandates (customer_email, mollie_mandate_id, status, signature_date)
           SELECT email, $1, $2, $3 FROM customers WHERE mollie_customer_id = $4
           ON CONFLICT (mollie_mandate_id) DO UPDATE SET status = $2`,
          [validMandate.id, 'valid', validMandate.signatureDate, payment.customerId]
        );

        // Send confirmation email to customer
        const customerRes = await client.query(
          'SELECT email, display_name FROM customers WHERE mollie_customer_id = $1',
          [payment.customerId]
        );
        if (customerRes.rows.length > 0) {
          const { email, display_name } = customerRes.rows[0];
          await sendMandateConfirmationEmail(email, display_name, 'nl');
          console.log(`✅ Bevestigingsmail verstuurd naar ${email}`);
        }
      }
    }

    return {
      statusCode: 200,
      headers,
      body: 'OK'
    };

  } catch (error) {
    console.error('Webhook error:', error);
    return {
      statusCode: 200, // Always return 200 to Mollie
      headers,
      body: 'Error logged'
    };
  } finally {
    client.release();
  }
};
