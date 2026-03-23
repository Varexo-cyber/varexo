exports.handler = async (event) => {
  const { neon } = require('@netlify/neon');
  
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  };

  try {
    const sql = neon();

    // Add progress column to projects table if not exists
    await sql`
      ALTER TABLE projects 
      ADD COLUMN IF NOT EXISTS progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100)
    `;

    // Add features column to projects table for detailed features list
    await sql`
      ALTER TABLE projects 
      ADD COLUMN IF NOT EXISTS features JSONB DEFAULT '[]'
    `;

    // Create project_logs table
    await sql`
      CREATE TABLE IF NOT EXISTS project_logs (
        id SERIAL PRIMARY KEY,
        project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        log_type VARCHAR(50) DEFAULT 'update' CHECK (log_type IN ('update', 'milestone', 'bugfix', 'feature', 'design', 'deployment')),
        created_by VARCHAR(255),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;

    // Verify
    const tables = await sql`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`;
    const columns = await sql`SELECT column_name FROM information_schema.columns WHERE table_name = 'projects'`;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        status: 'SUCCESS',
        message: 'Schema updated! Added progress, features, and project_logs table',
        tables: tables.map(t => t.table_name),
        projectColumns: columns.map(c => c.column_name)
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
