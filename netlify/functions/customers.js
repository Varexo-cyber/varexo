const { neon } = require('@netlify/neon');

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  try {
    // ALWAYS create fresh connection - no caching
    const dbUrl = process.env.DATABASE_URL || process.env.NETLIFY_DATABASE_URL;
    const sql = neon(dbUrl);

    if (event.httpMethod === 'GET') {
      console.log('Fetching ALL users from database...');
      
      // FIX: Get all users with all required fields
      const allUsers = await sql`SELECT email, display_name, created_at, email_notifications, is_admin, deleted_at FROM users`;
      
      console.log('Total users in DB:', allUsers.length);
      
      // FIX: Show only non-deleted non-admin users
      const customers = allUsers
        .filter(u => u.is_admin === false && u.deleted_at === null)
        .map(u => ({
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

      console.log('Returning customers:', customers.length);
      return { statusCode: 200, headers, body: JSON.stringify(customers) };
    }

    if (event.httpMethod === 'DELETE') {
      const path = event.path.replace('/.netlify/functions/customers', '').replace('/api/customers', '');
      const email = path.replace('/', '');
      await sql`UPDATE users SET deleted_at = NOW() WHERE email = ${email}`;
      return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
    }

    // PUT /admin-update - Admin update customer (subscription, company, etc.)
    if (event.httpMethod === 'PUT' && event.path.includes('admin-update')) {
      const body = JSON.parse(event.body || '{}');
      const { email, subscription, hasSocialMedia, socialMediaPackage, company } = body;
      
      if (!email) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'Email required' }) };
      }
      
      console.log('Admin updating customer:', email, { subscription, hasSocialMedia, company });
      
      try {
        // Build dynamic update query
        const updates = [];
        const values = [];
        let paramIndex = 1;
        
        if (subscription !== undefined) {
          updates.push(`subscription = $${paramIndex++}`);
          values.push(subscription);
        }
        if (hasSocialMedia !== undefined) {
          updates.push(`has_social_media = $${paramIndex++}`);
          values.push(hasSocialMedia);
        }
        if (socialMediaPackage !== undefined) {
          updates.push(`social_media_package = $${paramIndex++}`);
          values.push(socialMediaPackage);
        }
        if (company !== undefined) {
          updates.push(`company = $${paramIndex++}`);
          values.push(company);
        }
        
        if (updates.length === 0) {
          return { statusCode: 400, headers, body: JSON.stringify({ error: 'No fields to update' }) };
        }
        
        // Add email as last parameter
        values.push(email);
        
        const query = `UPDATE users SET ${updates.join(', ')}, updated_at = NOW() WHERE email = $${paramIndex} RETURNING *`;
        console.log('Update query:', query, values);
        
        const result = await sql.query(query, values);
        
        return { 
          statusCode: 200, 
          headers, 
          body: JSON.stringify({ 
            success: true, 
            customer: result[0] 
          }) 
        };
      } catch (error) {
        console.error('Error updating customer:', error);
        return { statusCode: 500, headers, body: JSON.stringify({ error: error.message }) };
      }
    }

    return { statusCode: 404, headers, body: JSON.stringify({ error: 'Not found' }) };

  } catch (error) {
    console.error('Error:', error);
    return { statusCode: 500, headers, body: JSON.stringify({ error: error.message }) };
  }
};
