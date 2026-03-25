const { neon } = require('@netlify/neon');

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  };

  try {
    const sql = neon();

    // Create expenses table
    await sql`
      CREATE TABLE IF NOT EXISTS expenses (
        id SERIAL PRIMARY KEY,
        description VARCHAR(255) NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        type VARCHAR(50) NOT NULL CHECK (type IN ('business', 'personal')),
        frequency VARCHAR(50) NOT NULL CHECK (frequency IN ('monthly', 'one-time', 'yearly')),
        category VARCHAR(100),
        expense_date DATE DEFAULT NOW(),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;

    // Verify table exists
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'expenses'
    `;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Expenses table created successfully!',
        tables: tables.map(t => t.table_name)
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: error.message
      })
    };
  }
};
