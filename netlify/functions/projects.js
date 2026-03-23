const { neon } = require('@netlify/neon');

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Content-Type': 'application/json'
};

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  const sql = neon();
  const path = event.path.replace('/.netlify/functions/projects', '').replace('/api/projects', '');
  const body = event.body ? JSON.parse(event.body) : {};
  const params = event.queryStringParameters || {};

  try {
    // GET /projects?email=... - Get projects for customer
    // GET /projects?all=true - Get all projects (admin)
    if (event.httpMethod === 'GET') {
      let result;
      if (params.all === 'true') {
        result = await sql`SELECT * FROM projects ORDER BY created_at DESC`;
      } else if (params.email) {
        result = await sql`SELECT * FROM projects WHERE customer_email = ${params.email} ORDER BY created_at DESC`;
      } else {
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'Email parameter vereist' }) };
      }

      const projects = result.map(p => ({
        id: p.id.toString(),
        title: p.title,
        description: p.description,
        status: p.status,
        customerEmail: p.customer_email,
        deadline: p.deadline,
        budget: p.budget ? parseFloat(p.budget) : undefined,
        progress: p.progress || 0,
        createdAt: p.created_at,
        updatedAt: p.updated_at
      }));

      return { statusCode: 200, headers, body: JSON.stringify(projects) };
    }

    // POST /projects - Create project
    if (event.httpMethod === 'POST') {
      const { title, description, status, customerEmail, deadline, budget } = body;

      let result;
      try {
        result = await sql`
          INSERT INTO projects (title, description, status, customer_email, deadline, budget, progress)
          VALUES (${title}, ${description || ''}, ${status || 'planning'}, ${customerEmail}, ${deadline || null}, ${budget || null}, ${body.progress || 0})
          RETURNING *
        `;
      } catch (colErr) {
        // Fallback without progress column
        result = await sql`
          INSERT INTO projects (title, description, status, customer_email, deadline, budget)
          VALUES (${title}, ${description || ''}, ${status || 'planning'}, ${customerEmail}, ${deadline || null}, ${budget || null})
          RETURNING *
        `;
      }

      const p = result[0];
      const project = {
        id: p.id.toString(),
        title: p.title,
        description: p.description,
        status: p.status,
        customerEmail: p.customer_email,
        deadline: p.deadline,
        budget: p.budget ? parseFloat(p.budget) : undefined,
        progress: p.progress || 0,
        createdAt: p.created_at,
        updatedAt: p.updated_at
      };

      return { statusCode: 200, headers, body: JSON.stringify(project) };
    }

    // PUT /projects/:id - Update project
    if (event.httpMethod === 'PUT') {
      const id = path.replace('/', '');
      const { title, description, status, deadline, budget, progress } = body;

      let result;
      try {
        result = await sql`
          UPDATE projects SET
            title = COALESCE(${title || null}, title),
            description = COALESCE(${description || null}, description),
            status = COALESCE(${status || null}, status),
            deadline = COALESCE(${deadline || null}, deadline),
            budget = COALESCE(${budget || null}, budget),
            progress = COALESCE(${typeof progress === 'number' ? progress : null}, progress, 0),
            updated_at = NOW()
          WHERE id = ${parseInt(id)}
          RETURNING *
        `;
      } catch (colErr) {
        result = await sql`
          UPDATE projects SET
            title = COALESCE(${title || null}, title),
            description = COALESCE(${description || null}, description),
            status = COALESCE(${status || null}, status),
            deadline = COALESCE(${deadline || null}, deadline),
            budget = COALESCE(${budget || null}, budget),
            updated_at = NOW()
          WHERE id = ${parseInt(id)}
          RETURNING *
        `;
      }

      if (result.length === 0) {
        return { statusCode: 404, headers, body: JSON.stringify({ error: 'Project niet gevonden' }) };
      }

      const p = result[0];
      return { statusCode: 200, headers, body: JSON.stringify({
        id: p.id.toString(),
        title: p.title,
        description: p.description,
        status: p.status,
        customerEmail: p.customer_email,
        deadline: p.deadline,
        budget: p.budget ? parseFloat(p.budget) : undefined,
        progress: p.progress || 0,
        createdAt: p.created_at,
        updatedAt: p.updated_at
      })};
    }

    // DELETE /projects/:id - Delete project
    if (event.httpMethod === 'DELETE') {
      const id = path.replace('/', '');
      await sql`DELETE FROM projects WHERE id = ${parseInt(id)}`;
      return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
    }

    return { statusCode: 404, headers, body: JSON.stringify({ error: 'Route niet gevonden' }) };

  } catch (error) {
    console.error('Projects error:', error);
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Server error: ' + error.message }) };
  }
};
