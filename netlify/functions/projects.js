const { neon } = require('@netlify/neon');
const { sendNewProjectEmail, sendProjectDeletedEmail, sendProgressUpdateEmail } = require('./utils/send-email');

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
    // Auto-migrate: add progress and website_url columns if missing
    try {
      await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS progress INTEGER DEFAULT 0`;
      await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS website_url TEXT`;
    } catch (e) { /* columns may already exist */ }

    // GET /projects?email=... - Get projects for customer
    // GET /projects?all=true - Get all projects (admin)
    if (event.httpMethod === 'GET') {
      console.log('Fetching projects...', params);
      
      // FIX: Get ALL projects first to bypass caching
      const allProjects = await sql`SELECT * FROM projects ORDER BY created_at DESC`;
      console.log('Total projects from DB:', allProjects.length);
      
      let result;
      if (params.all === 'true') {
        result = allProjects;
      } else if (params.email) {
        // Filter in JavaScript to bypass query caching
        result = allProjects.filter(p => p.customer_email === params.email);
        console.log('Filtered for', params.email, ':', result.length);
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
        websiteUrl: p.website_url,
        createdAt: p.created_at,
        updatedAt: p.updated_at
      }));

      return { statusCode: 200, headers, body: JSON.stringify(projects) };
    }

    // POST /projects - Create project
    if (event.httpMethod === 'POST') {
      const { title, description, status, customerEmail, deadline, budget, websiteUrl } = body;

      let result;
      try {
        result = await sql`
          INSERT INTO projects (title, description, status, customer_email, deadline, budget, progress, website_url)
          VALUES (${title}, ${description || ''}, ${status || 'planning'}, ${customerEmail}, ${deadline || null}, ${budget || null}, ${body.progress || 0}, ${websiteUrl || null})
          RETURNING *
        `;
      } catch (colErr) {
        // Fallback without new columns
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
        websiteUrl: p.website_url,
        createdAt: p.created_at,
        updatedAt: p.updated_at
      };

      // Send email notification
      try { await sendNewProjectEmail(customerEmail, '', title); } catch (e) { console.log('Email skip:', e.message); }

      return { statusCode: 200, headers, body: JSON.stringify(project) };
    }

    // PUT /projects/:id - Update project
    if (event.httpMethod === 'PUT') {
      const id = path.replace('/', '');
      const { title, description, status, deadline, budget, progress, websiteUrl } = body;

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
            website_url = COALESCE(${websiteUrl || null}, website_url),
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
        websiteUrl: p.website_url,
        createdAt: p.created_at,
        updatedAt: p.updated_at
      })};
    }

    // DELETE /projects/:id - Delete project
    if (event.httpMethod === 'DELETE') {
      const id = path.replace('/', '');
      // Get project info before deleting for email
      const projInfo = await sql`SELECT title, customer_email FROM projects WHERE id = ${parseInt(id)}`;
      await sql`DELETE FROM project_logs WHERE project_id = ${parseInt(id)}`;
      await sql`DELETE FROM projects WHERE id = ${parseInt(id)}`;
      // Send email notification
      if (projInfo.length > 0) {
        try { await sendProjectDeletedEmail(projInfo[0].customer_email, '', projInfo[0].title); } catch (e) { console.log('Email skip:', e.message); }
      }
      return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
    }

    return { statusCode: 404, headers, body: JSON.stringify({ error: 'Route niet gevonden' }) };

  } catch (error) {
    console.error('Projects error:', error);
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Server error: ' + error.message }) };
  }
};
