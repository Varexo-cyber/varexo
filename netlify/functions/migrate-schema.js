exports.handler = async (event) => {
  const { neon } = require('@netlify/neon');
  
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  };

  const results = [];

  try {
    const sql = neon();

    // 1. Add progress column to projects table
    try {
      await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS progress INTEGER DEFAULT 0`;
      results.push('projects.progress added');
    } catch (e) { results.push('projects.progress: ' + e.message); }

    // 2. Add features column to projects table
    try {
      await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS features JSONB DEFAULT '[]'`;
      results.push('projects.features added');
    } catch (e) { results.push('projects.features: ' + e.message); }

    // 3. Create project_logs table
    try {
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
      results.push('project_logs table created');
    } catch (e) { results.push('project_logs: ' + e.message); }

    // 4. Add invoice_date column to invoices
    try {
      await sql`ALTER TABLE invoices ADD COLUMN IF NOT EXISTS invoice_date DATE DEFAULT NOW()`;
      results.push('invoices.invoice_date added');
    } catch (e) { results.push('invoices.invoice_date: ' + e.message); }

    // 5. Add customer detail columns to invoices
    try {
      await sql`ALTER TABLE invoices ADD COLUMN IF NOT EXISTS customer_name VARCHAR(255)`;
      results.push('invoices.customer_name added');
    } catch (e) { results.push('invoices.customer_name: ' + e.message); }

    try {
      await sql`ALTER TABLE invoices ADD COLUMN IF NOT EXISTS customer_company VARCHAR(255)`;
      results.push('invoices.customer_company added');
    } catch (e) { results.push('invoices.customer_company: ' + e.message); }

    try {
      await sql`ALTER TABLE invoices ADD COLUMN IF NOT EXISTS customer_address TEXT`;
      results.push('invoices.customer_address added');
    } catch (e) { results.push('invoices.customer_address: ' + e.message); }

    try {
      await sql`ALTER TABLE invoices ADD COLUMN IF NOT EXISTS customer_postal VARCHAR(20)`;
      results.push('invoices.customer_postal added');
    } catch (e) { results.push('invoices.customer_postal: ' + e.message); }

    try {
      await sql`ALTER TABLE invoices ADD COLUMN IF NOT EXISTS customer_city VARCHAR(100)`;
      results.push('invoices.customer_city added');
    } catch (e) { results.push('invoices.customer_city: ' + e.message); }

    try {
      await sql`ALTER TABLE invoices ADD COLUMN IF NOT EXISTS customer_phone VARCHAR(50)`;
      results.push('invoices.customer_phone added');
    } catch (e) { results.push('invoices.customer_phone: ' + e.message); }

    // Verify
    const tables = await sql`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`;
    const projCols = await sql`SELECT column_name FROM information_schema.columns WHERE table_name = 'projects'`;
    const invCols = await sql`SELECT column_name FROM information_schema.columns WHERE table_name = 'invoices'`;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        status: 'SUCCESS',
        message: 'Migration complete!',
        migrationResults: results,
        tables: tables.map(t => t.table_name),
        projectColumns: projCols.map(c => c.column_name),
        invoiceColumns: invCols.map(c => c.column_name)
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        status: 'ERROR',
        message: error.message,
        migrationResults: results
      })
    };
  }
};
