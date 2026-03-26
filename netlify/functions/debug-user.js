// Debug endpoint to check user status
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
  const { email } = event.queryStringParameters || {};
  
  try {
    // Check specific user
    const user = await sql`
      SELECT email, display_name, is_admin, deleted_at, provider, created_at 
      FROM users 
      WHERE email = ${email || 'mohammed81310@gmail.com'}
    `;
    
    // Check all users
    const allUsers = await sql`
      SELECT email, is_admin, deleted_at 
      FROM users 
      ORDER BY created_at DESC
    `;
    
    return { 
      statusCode: 200, 
      headers, 
      body: JSON.stringify({ 
        searchedEmail: email,
        userFound: user.length > 0,
        userDetails: user[0] || null,
        allUsersCount: allUsers.length,
        allUsers: allUsers
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
