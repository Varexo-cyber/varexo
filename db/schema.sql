-- Varexo Database Schema for Neon PostgreSQL

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  display_name VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255),
  photo_url TEXT,
  provider VARCHAR(50) DEFAULT 'email',
  phone VARCHAR(50),
  company VARCHAR(255),
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'planning' CHECK (status IN ('planning', 'active', 'completed', 'paused')),
  customer_email VARCHAR(255) NOT NULL REFERENCES users(email) ON DELETE CASCADE,
  deadline DATE,
  budget DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Invoices table
CREATE TABLE IF NOT EXISTS invoices (
  id SERIAL PRIMARY KEY,
  invoice_number VARCHAR(50) UNIQUE NOT NULL,
  project_title VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL REFERENCES users(email) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid', 'overdue')),
  due_date DATE NOT NULL,
  items JSONB DEFAULT '[]',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Insert admin user
INSERT INTO users (email, display_name, provider, is_admin) 
VALUES ('info@varexo.nl', 'Varexo Admin', 'email', TRUE)
ON CONFLICT (email) DO NOTHING;

-- Insert demo user
INSERT INTO users (email, display_name, password_hash, provider) 
VALUES ('demo@varexo.nl', 'Demo Klant', 'demo123', 'email')
ON CONFLICT (email) DO NOTHING;
