exports.handler = async (event) => {
  const { neon } = require('@netlify/neon');
  
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  const sql = neon();
  const path = event.path.replace('/.netlify/functions/project-logs', '').replace('/api/project-logs', '');
  const body = event.body ? JSON.parse(event.body) : {};
  const params = event.queryStringParameters || {};

  try {
    // GET /project-logs?projectId=xxx - Get logs for a project
    if (event.httpMethod === 'GET' && params.projectId) {
      const result = await sql`
        SELECT * FROM project_logs 
        WHERE project_id = ${params.projectId}
        ORDER BY created_at DESC
      `;
      return { statusCode: 200, headers, body: JSON.stringify(result) };
    }

    // POST /project-logs - Add new log
    if (event.httpMethod === 'POST') {
      const { projectId, title, description, logType, createdBy } = body;
      
      const result = await sql`
        INSERT INTO project_logs (project_id, title, description, log_type, created_by)
        VALUES (${projectId}, ${title}, ${description}, ${logType || 'update'}, ${createdBy})
        RETURNING *
      `;
      
      return { statusCode: 200, headers, body: JSON.stringify(result[0]) };
    }

    // PUT /project-logs/:id - Update log
    if (event.httpMethod === 'PUT' && path) {
      const logId = path.replace('/', '');
      const { title, description, logType } = body;
      
      const result = await sql`
        UPDATE project_logs 
        SET title = ${title}, description = ${description}, log_type = ${logType}, updated_at = NOW()
        WHERE id = ${logId}
        RETURNING *
      `;
      
      if (result.length === 0) {
        return { statusCode: 404, headers, body: JSON.stringify({ error: 'Log not found' }) };
      }
      
      return { statusCode: 200, headers, body: JSON.stringify(result[0]) };
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
