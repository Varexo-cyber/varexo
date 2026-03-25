const { neon } = require('@netlify/neon');

exports.handler = async (event, context) => {
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

  try {
    // Auto-migrate: Create surcharges table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS surcharges (
        id SERIAL PRIMARY KEY,
        description VARCHAR(255) NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        type VARCHAR(50) NOT NULL CHECK (type IN ('business', 'personal')),
        frequency VARCHAR(50) NOT NULL CHECK (frequency IN ('monthly', 'one-time', 'yearly')),
        category VARCHAR(100),
        surcharge_date DATE DEFAULT NOW(),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;

    // GET /surcharges - List all surcharges
    if (event.httpMethod === 'GET') {
      const surcharges = await sql`
        SELECT * FROM surcharges 
        ORDER BY created_at DESC
      `;
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(surcharges)
      };
    }

    // POST /surcharges - Create new surcharge
    if (event.httpMethod === 'POST') {
      const { description, amount, type, frequency, category, surcharge_date } = JSON.parse(event.body);
      
      const [surcharge] = await sql`
        INSERT INTO surcharges (description, amount, type, frequency, category, surcharge_date)
        VALUES (${description}, ${amount}, ${type}, ${frequency}, ${category}, ${surcharge_date || new Date()})
        RETURNING *
      `;
      
      return {
        statusCode: 201,
        headers,
        body: JSON.stringify(surcharge)
      };
    }

    // PUT /surcharges/:id - Update surcharge
    if (event.httpMethod === 'PUT') {
      const id = event.path.split('/').pop();
      const { description, amount, type, frequency, category, surcharge_date } = JSON.parse(event.body);
      
      const [surcharge] = await sql`
        UPDATE surcharges 
        SET description = ${description}, 
            amount = ${amount}, 
            type = ${type}, 
            frequency = ${frequency}, 
            category = ${category},
            surcharge_date = ${surcharge_date},
            updated_at = NOW()
        WHERE id = ${id}
        RETURNING *
      `;
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(surcharge)
      };
    }

    // DELETE /surcharges/:id - Delete surcharge
    if (event.httpMethod === 'DELETE') {
      const id = event.path.split('/').pop();
      
      await sql`DELETE FROM surcharges WHERE id = ${id}`;
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true })
      };
    }

    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };

  } catch (error) {
    console.error('Surcharges error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  }
};
