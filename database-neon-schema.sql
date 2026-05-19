-- ============================================
-- VAREXO KLANTPORTAAL - NEONSQL SCHEMA
-- PostgreSQL compatible
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- KLANTEN (uitbreiding bestaande tabel)
-- ============================================
-- Als je al een customers tabel hebt, voeg deze columns toe:
ALTER TABLE customers 
ADD COLUMN IF NOT EXISTS mollie_customer_id VARCHAR(100),
ADD COLUMN IF NOT EXISTS sepa_mandate_id VARCHAR(100),
ADD COLUMN IF NOT EXISTS sepa_mandate_status VARCHAR(50) DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS sepa_mandate_date TIMESTAMP,
ADD COLUMN IF NOT EXISTS kvk_number VARCHAR(20),
ADD COLUMN IF NOT EXISTS vat_number VARCHAR(20),
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS postal_code VARCHAR(20),
ADD COLUMN IF NOT EXISTS city VARCHAR(100);

-- ============================================
-- BETALINGEN TABEL (nieuw)
-- ============================================
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_email VARCHAR(255) NOT NULL REFERENCES customers(email),
    invoice_id UUID REFERENCES invoices(id),
    mollie_payment_id VARCHAR(100) UNIQUE NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'EUR',
    status VARCHAR(50) DEFAULT 'pending',
    method VARCHAR(50),
    paid_at TIMESTAMP,
    webhook_data JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- SEPA MANDATEN TABEL (voor tracking)
-- ============================================
CREATE TABLE IF NOT EXISTS sepa_mandates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_email VARCHAR(255) NOT NULL REFERENCES customers(email),
    mollie_mandate_id VARCHAR(100) UNIQUE NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    method VARCHAR(50) DEFAULT 'directdebit',
    signature_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- INCASSO LOG (voor debugging)
-- ============================================
CREATE TABLE IF NOT EXISTS incasso_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_email VARCHAR(255),
    invoice_id UUID,
    amount DECIMAL(10,2),
    status VARCHAR(50),
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes voor snelheid
CREATE INDEX IF NOT EXISTS idx_payments_customer ON payments(customer_email);
CREATE INDEX IF NOT EXISTS idx_payments_mollie ON payments(mollie_payment_id);
CREATE INDEX IF NOT EXISTS idx_mandates_customer ON sepa_mandates(customer_email);
CREATE INDEX IF NOT EXISTS idx_mandates_status ON sepa_mandates(status);

-- ============================================
-- VIEW: Klanten met mandaten status
-- ============================================
CREATE OR REPLACE VIEW customer_mandate_status AS
SELECT 
    c.email,
    c.company,
    c.display_name,
    c.mollie_customer_id,
    c.sepa_mandate_status,
    c.sepa_mandate_date,
    CASE 
        WHEN c.sepa_mandate_status = 'valid' THEN 'Ja'
        ELSE 'Nee'
    END as has_valid_mandate
FROM customers c;

-- ============================================
-- VIEW: Openstaande facturen met klant info
-- ============================================
CREATE OR REPLACE VIEW open_invoices AS
SELECT 
    i.id,
    i.invoice_number,
    i.amount,
    i.status,
    i.customer_email,
    c.display_name,
    c.company,
    c.sepa_mandate_status,
    i.created_at,
    i.due_date
FROM invoices i
JOIN customers c ON i.customer_email = c.email
WHERE i.status IN ('draft', 'sent', 'pending')
ORDER BY i.created_at DESC;
