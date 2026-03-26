// Ultra simple test - just count users
const { neon } = require('@netlify/neon');

exports.handler = async () => {
  const sql = neon();
  
  try {
    // Count ALL users
    const allUsers = await sql`SELECT COUNT(*) as count FROM users`;
    
    // Count non-admin users
    const nonAdminUsers = await sql`SELECT COUNT(*) as count FROM users WHERE is_admin = FALSE`;
    
    // Count non-deleted users  
    const nonDeletedUsers = await sql`SELECT COUNT(*) as count FROM users WHERE deleted_at IS NULL`;
    
    // Get actual users
    const actualUsers = await sql`SELECT email, is_admin, deleted_at FROM users`;
    
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        allUsers: allUsers[0].count,
        nonAdminUsers: nonAdminUsers[0].count,
        nonDeletedUsers: nonDeletedUsers[0].count,
        actualUsers: actualUsers
      }, null, 2)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
