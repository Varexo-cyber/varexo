const { neon } = require('@netlify/neon');

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  };

  try {
    const sql = neon();

    // Create users table
    await sql`
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
      )
    `;

    // Create projects table
    await sql`
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        status VARCHAR(50) DEFAULT 'planning',
        customer_email VARCHAR(255) NOT NULL REFERENCES users(email) ON DELETE CASCADE,
        deadline DATE,
        budget DECIMAL(10,2),
        progress INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;

    // Migration: Add progress column if it doesn't exist yet
    await sql`
      DO $$ 
      BEGIN 
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='projects' AND column_name='progress') THEN
          ALTER TABLE projects ADD COLUMN progress INTEGER DEFAULT 0;
        END IF;
      END $$
    `;

    // Create project_logs table
    await sql`
      CREATE TABLE IF NOT EXISTS project_logs (
        id SERIAL PRIMARY KEY,
        project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        log_type VARCHAR(50) DEFAULT 'update',
        created_by VARCHAR(255),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;

    // Create invoices table
    await sql`
      CREATE TABLE IF NOT EXISTS invoices (
        id SERIAL PRIMARY KEY,
        invoice_number VARCHAR(50) UNIQUE NOT NULL,
        project_title VARCHAR(255) NOT NULL,
        customer_email VARCHAR(255) NOT NULL REFERENCES users(email) ON DELETE CASCADE,
        amount DECIMAL(10,2) NOT NULL,
        status VARCHAR(50) DEFAULT 'draft',
        due_date DATE NOT NULL,
        items JSONB DEFAULT '[]',
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;

    // Insert admin user
    await sql`
      INSERT INTO users (email, display_name, provider, is_admin)
      VALUES ('info@varexo.nl', 'Varexo Admin', 'email', TRUE)
      ON CONFLICT (email) DO NOTHING
    `;

    // Insert demo user
    await sql`
      INSERT INTO users (email, display_name, password_hash, provider)
      VALUES ('demo@varexo.nl', 'Demo Klant', 'demo123', 'email')
      ON CONFLICT (email) DO NOTHING
    `;

    // Verify
    const users = await sql`SELECT COUNT(*) as count FROM users`;
    const tables = await sql`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        status: 'SUCCESS',
        message: 'Database initialized!',
        tables: tables.map(t => t.table_name),
        userCount: users[0].count
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        status: 'ERROR',
        message: error.message
      })
    };
  }
};
