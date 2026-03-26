// Test function to debug customers not appearing in admin
const { neon } = require('@netlify/neon');

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json'
};

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  const sql = neon();
  
  try {
    // Simple query to get ALL users (no joins)
    const allUsers = await sql`
      SELECT email, display_name, is_admin, deleted_at, provider, created_at 
      FROM users 
      ORDER BY created_at DESC
    `;
    
    // Check specific user
    const testUser = await sql`
      SELECT * FROM users WHERE email = 'mohammed81310@gmail.com'
    `;
    
    return { 
      statusCode: 200, 
      headers, 
      body: JSON.stringify({ 
        totalUsers: allUsers.length,
        allUsers: allUsers,
        testUser: testUser
      }, null, 2) 
    };

  } catch (error) {
    return { 
      statusCode: 500, 
      headers, 
      body: JSON.stringify({ error: error.message }) 
    };
  }
};
