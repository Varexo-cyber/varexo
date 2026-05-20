// Varexo Payments API - NeonSQL PostgreSQL version
// Backend endpoints voor Mollie integratie

const express = require('express');
const { Pool } = require('pg');
const { mollieService } = require('../services/mollieService');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();

// NeonSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Required for NeonSQL
  }
});

// JWT middleware
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Geen toegang' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token ongeldig' });
    req.user = user;
    next();
  });
};

// ============================================
// AUTH
// ============================================

router.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const result = await pool.query(
      'SELECT * FROM customers WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Ongeldige inloggegevens' });
    }

    const customer = result.rows[0];
    const validPassword = await bcrypt.compare(password, customer.password_hash);
    
    if (!validPassword) {
      return res.status(401).json({ error: 'Ongeldige inloggegevens' });
    }

    const token = jwt.sign(
      { 
        userId: customer.id, 
        email: customer.email,
        isAdmin: customer.email === 'admin@varexo.nl'
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: customer.id,
        email: customer.email,
        company: customer.company,
        firstName: customer.first_name,
        lastName: customer.last_name,
        sepaMandateStatus: customer.sepa_mandate_status
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ============================================
// KLANT - SEPA MANDAAT SETUP
// ============================================

router.post('/klant/setup-mandate', authenticateToken, async (req, res) => {
  const client = await pool.connect();
  try {
    const { redirectUrl } = req.body;
    const customerEmail = req.user.email;

    // Get customer
    const result = await client.query(
      'SELECT * FROM customers WHERE email = $1',
      [customerEmail]
    );
    const customer = result.rows[0];

    if (!customer) {
      return res.status(404).json({ error: 'Klant niet gevonden' });
    }

    // Create Mollie customer if not exists
    let mollieCustomerId = customer.mollie_customer_id;
    if (!mollieCustomerId) {
      const mollieCustomer = await mollieService.createCustomer(
        customer.display_name || customer.email,
        customer.email
      );
      mollieCustomerId = mollieCustomer.id;

      // Save to database
      await client.query(
        'UPDATE customers SET mollie_customer_id = $1 WHERE email = $2',
        [mollieCustomerId, customerEmail]
      );
    }

    // Create first payment (iDEAL) to setup mandate
    const payment = await mollieService.createFirstPayment(
      mollieCustomerId,
      0.01, // Symbolisch bedrag
      'SEPA mandaat setup - Varexo',
      redirectUrl,
      `${process.env.WEBHOOK_URL}/mollie`
    );

    res.json({
      paymentUrl: payment.checkoutUrl,
      paymentId: payment.id
    });
  } catch (error) {
    console.error('Setup mandate error:', error);
    res.status(500).json({ error: 'Fout bij mandaat setup' });
  } finally {
    client.release();
  }
});

// ============================================
// ADMIN - HANDMATIG INCASSEREN
// ============================================

const isAdmin = (req, res, next) => {
  if (req.user.email !== 'admin@varexo.nl') {
    return res.status(403).json({ error: 'Alleen voor admin' });
  }
  next();
};

router.post('/admin/incasseren', authenticateToken, isAdmin, async (req, res) => {
  const client = await pool.connect();
  try {
    const { customerEmail, amount, description, invoiceId } = req.body;

    // Get customer
    const result = await client.query(
      'SELECT * FROM customers WHERE email = $1',
      [customerEmail]
    );
    const customer = result.rows[0];

    if (!customer) {
      return res.status(404).json({ error: 'Klant niet gevonden' });
    }

    if (!customer.mollie_customer_id || customer.sepa_mandate_status !== 'valid') {
      return res.status(400).json({ error: 'Geen geldig SEPA mandaat' });
    }

    // Create recurring payment (SEPA incasso)
    const payment = await mollieService.createRecurringPayment(
      customer.mollie_customer_id,
      amount,
      description || `Varexo - ${customerEmail}`,
      `${process.env.WEBHOOK_URL}/mollie`
    );

    // Save payment to database
    await client.query(
      `INSERT INTO payments (customer_email, invoice_id, mollie_payment_id, amount, status, method)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [customerEmail, invoiceId || null, payment.id, amount, payment.status, 'directdebit']
    );

    res.json({
      success: true,
      paymentId: payment.id,
      status: payment.status
    });
  } catch (error) {
    console.error('Incasso error:', error);
    
    // Log error
    await client.query(
      'INSERT INTO incasso_logs (customer_email, amount, status, error_message) VALUES ($1, $2, $3, $4)',
      [req.body.customerEmail, req.body.amount, 'error', error.message]
    );
    
    res.status(500).json({ error: 'Incasso mislukt: ' + error.message });
  } finally {
    client.release();
  }
});

// ============================================
// WEBHOOK - Mollie callbacks
// ============================================

router.post('/webhooks/mollie', async (req, res) => {
  const client = await pool.connect();
  try {
    const paymentId = req.body.id;
    
    // Get payment from Mollie
    const payment = await mollieService.getPayment(paymentId);

    // Update payment in database
    await client.query(
      `UPDATE payments 
       SET status = $1, paid_at = $2, method = $3 
       WHERE mollie_payment_id = $4`,
      [payment.status, payment.paidAt, payment.method, paymentId]
    );

    // If paid, update invoice status OR create new invoice if none exists
    if (payment.status === 'paid') {
      // Check if payment has linked invoice
      const paymentResult = await client.query(
        'SELECT invoice_id FROM payments WHERE mollie_payment_id = $1',
        [paymentId]
      );
      
      if (paymentResult.rows.length > 0 && paymentResult.rows[0].invoice_id) {
        // Update existing invoice
        await client.query(
          `UPDATE invoices 
           SET status = 'paid', paid_at = NOW()
           WHERE id = $1`,
          [paymentResult.rows[0].invoice_id]
        );
      } else {
        // NO INVOICE EXISTS - Create automatic invoice from Mollie payment
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
            [invoiceResult.rows[0].id, paymentId]
          );
          
          console.log(`✅ Automatische factuur aangemaakt: ${invoiceNumber} voor ${customer.email}`);
        }
      }
    }

    // If this was first payment (mandate setup), update customer
    if (payment.sequenceType === 'first' && payment.status === 'paid') {
      const mandates = await mollieService.getMandates(payment.customerId);
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

        // Also save to mandates table
        await client.query(
          `INSERT INTO sepa_mandates (customer_email, mollie_mandate_id, status, signature_date)
           SELECT email, $1, $2, $3 FROM customers WHERE mollie_customer_id = $4
           ON CONFLICT (mollie_mandate_id) DO UPDATE SET status = $2`,
          [validMandate.id, 'valid', validMandate.signatureDate, payment.customerId]
        );
      }
    }

    res.status(200).send('OK');
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).send('Error');
  } finally {
    client.release();
  }
});

// ============================================
// ADMIN - Dashboard stats
// ============================================

router.get('/admin/dashboard', authenticateToken, isAdmin, async (req, res) => {
  const client = await pool.connect();
  try {
    // Total customers
    const customersResult = await client.query('SELECT COUNT(*) FROM customers WHERE email != $1', ['admin@varexo.nl']);
    
    // Customers with valid mandate
    const mandateResult = await client.query(
      "SELECT COUNT(*) FROM customers WHERE sepa_mandate_status = 'valid'"
    );
    
    // Open invoices total
    const invoicesResult = await client.query(
      "SELECT COALESCE(SUM(amount), 0) FROM invoices WHERE status IN ('draft', 'sent', 'pending')"
    );
    
    // Recent payments
    const paymentsResult = await client.query(
      `SELECT p.*, c.display_name, c.company 
       FROM payments p
       JOIN customers c ON p.customer_email = c.email
       ORDER BY p.created_at DESC
       LIMIT 10`
    );

    res.json({
      stats: {
        totalCustomers: parseInt(customersResult.rows[0].count),
        customersWithMandate: parseInt(mandateResult.rows[0].count),
        openInvoicesTotal: parseFloat(invoicesResult.rows[0].sum)
      },
      recentPayments: paymentsResult.rows
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
});

module.exports = router;
