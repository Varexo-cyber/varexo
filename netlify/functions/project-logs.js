exports.handler = async (event) => {
  const { neon } = require('@netlify/neon');
  const { sendProjectUpdateEmail } = require('./utils/send-email');
  
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  // FIX: Force fresh connection every time
  const dbUrl = process.env.DATABASE_URL || process.env.NETLIFY_DATABASE_URL;
  const sql = neon(dbUrl);
  
  const path = event.path.replace('/.netlify/functions/project-logs', '').replace('/api/project-logs', '');
  const body = event.body ? JSON.parse(event.body) : {};
  const params = event.queryStringParameters || {};

  try {
    // Auto-create table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS project_logs (
        id SERIAL PRIMARY KEY,
        project_id INTEGER NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        log_type VARCHAR(50) DEFAULT 'update',
        created_by VARCHAR(255),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;

    const mapLog = (l) => ({
      id: l.id.toString(),
      projectId: l.project_id.toString(),
      title: l.title,
      description: l.description,
      logType: l.log_type || 'update',
      createdBy: l.created_by,
      createdAt: l.created_at,
      updatedAt: l.updated_at
    });

    // GET /project-logs?projectId=xxx - Get logs for a project
    if (event.httpMethod === 'GET' && params.projectId) {
      const result = await sql`
        SELECT * FROM project_logs 
        WHERE project_id = ${parseInt(params.projectId)}
        ORDER BY created_at DESC
      `;
      return { statusCode: 200, headers, body: JSON.stringify(result.map(mapLog)) };
    }

    // POST /project-logs - Add new log
    if (event.httpMethod === 'POST') {
      const { projectId, title, description, logType, createdBy } = body;
      
      const result = await sql`
        INSERT INTO project_logs (project_id, title, description, log_type, created_by)
        VALUES (${parseInt(projectId)}, ${title}, ${description}, ${logType || 'update'}, ${createdBy})
        RETURNING *
      `;

      // Send email notification to customer
      try {
        const projInfo = await sql`SELECT title, customer_email FROM projects WHERE id = ${parseInt(projectId)}`;
        if (projInfo.length > 0) {
          await sendProjectUpdateEmail(projInfo[0].customer_email, '', projInfo[0].title, title, description, logType || 'update');
        }
      } catch (e) { console.log('Email skip:', e.message); }
      
      return { statusCode: 200, headers, body: JSON.stringify(mapLog(result[0])) };
    }

    // PUT /project-logs/:id - Update log
    if (event.httpMethod === 'PUT' && path) {
      const logId = path.replace('/', '');
      const { title, description, logType } = body;
      
      const result = await sql`
        UPDATE project_logs 
        SET title = ${title}, description = ${description}, log_type = ${logType}, updated_at = NOW()
        WHERE id = ${parseInt(logId)}
        RETURNING *
      `;
      
      if (result.length === 0) {
        return { statusCode: 404, headers, body: JSON.stringify({ error: 'Log not found' }) };
      }
      
      return { statusCode: 200, headers, body: JSON.stringify(mapLog(result[0])) };
    }

    // DELETE /project-logs/:id - Delete log
    if (event.httpMethod === 'DELETE' && path) {
      const logId = path.replace('/', '');
      await sql`DELETE FROM project_logs WHERE id = ${logId}`;
      return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
    }

    return { statusCode: 404, headers, body: JSON.stringify({ error: 'Route not found' }) };
  } catch (error) {
    console.error('Project logs error:', error);
    return { statusCode: 500, headers, body: JSON.stringify({ error: error.message }) };
  }
};
