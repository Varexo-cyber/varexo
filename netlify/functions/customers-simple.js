// Ultra simple customers - return ALL non-deleted users
const { neon } = require('@netlify/neon');

exports.handler = async () => {
  const sql = neon();
  
  try {
    // Get all non-deleted, non-admin users
    const users = await sql`
      SELECT email, display_name, created_at, email_notifications
      FROM users 
      WHERE is_admin = FALSE AND deleted_at IS NULL
      ORDER BY created_at DESC
    `;
    
    // Format response
    const customers = users.map(u => ({
      email: u.email,
      displayName: u.display_name,
      phone: null,
      company: null,
      emailNotifications: u.email_notifications !== false,
      subscription: null,
      hasSocialMedia: false,
      createdAt: u.created_at,
      projectCount: 0,
      invoiceCount: 0
    }));
    
    return {
      statusCode: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(customers)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
