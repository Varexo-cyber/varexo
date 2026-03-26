// Debug customers endpoint
const { neon } = require('@netlify/neon');

exports.handler = async () => {
  const sql = neon();
  
  try {
    // Step 1: Get all non-deleted users
    const result = await sql`
      SELECT 
        u.email,
        u.display_name,
        u.created_at,
        COALESCE(u.email_notifications, true) as email_notifications
      FROM users u
      WHERE u.is_admin = FALSE AND u.deleted_at IS NULL
      ORDER BY u.created_at DESC
    `;
    
    console.log('Step 1 - Users found:', result.length);
    console.log('Users:', result.map(u => u.email));
    
    // Step 2: Map with project/invoice counts
    const customers = await Promise.all(result.map(async (c) => {
      const projectResult = await sql`SELECT COUNT(*) as count FROM projects WHERE customer_email = ${c.email}`;
      const invoiceResult = await sql`SELECT COUNT(*) as count FROM invoices WHERE customer_email = ${c.email}`;
      
      return {
        email: c.email,
        displayName: c.display_name,
        phone: null,
        company: null,
        emailNotifications: c.email_notifications,
        subscription: null,
        hasSocialMedia: false,
        createdAt: c.created_at,
        projectCount: parseInt(projectResult[0].count),
        invoiceCount: parseInt(invoiceResult[0].count)
      };
    }));
    
    console.log('Step 2 - Final customers:', customers.length);
    
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        debug: {
          step1_usersFound: result.length,
          step1_userEmails: result.map(u => u.email),
          step2_customersCount: customers.length
        },
        customers: customers
      }, null, 2)
    };
  } catch (error) {
    console.error('Debug error:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: error.message, stack: error.stack })
    };
  }
};
