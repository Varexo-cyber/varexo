// Debug - show what query is actually running
const { neon } = require('@netlify/neon');

exports.handler = async (event) => {
  const sql = neon();
  
  try {
    // Simple query without joins to check
    const simpleResult = await sql`
      SELECT email, display_name, is_admin, deleted_at, created_at 
      FROM users 
      WHERE is_admin = FALSE AND deleted_at IS NULL
      ORDER BY created_at DESC
    `;
    
    // Full query with joins
    const fullResult = await sql`
      SELECT 
        u.email,
        u.display_name,
        u.created_at,
        COALESCE(u.email_notifications, true) as email_notifications,
        COUNT(DISTINCT p.id) as project_count,
        COUNT(DISTINCT i.id) as invoice_count
      FROM users u
      LEFT JOIN projects p ON u.email = p.customer_email
      LEFT JOIN invoices i ON u.email = i.customer_email
      WHERE u.is_admin = FALSE AND u.deleted_at IS NULL
      GROUP BY u.email, u.display_name, u.created_at, u.email_notifications
      ORDER BY u.created_at DESC
    `;
    
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        simpleCount: simpleResult.length,
        simpleUsers: simpleResult.map(u => u.email),
        fullCount: fullResult.length,
        message: 'Compare these numbers!'
      }, null, 2)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
