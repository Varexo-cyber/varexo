const { getDbClient } = require('./utils/db-client');

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers };
  }

  const sql = getDbClient();

  try {
    // GET /expenses - List all expenses
    if (event.httpMethod === 'GET') {
      const expenses = await sql`
        SELECT * FROM expenses 
        ORDER BY created_at DESC
      `;
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(expenses)
      };
    }

    // POST /expenses - Create new expense
    if (event.httpMethod === 'POST') {
      const { description, amount, type, frequency, category, expense_date } = JSON.parse(event.body);
      
      const [expense] = await sql`
        INSERT INTO expenses (description, amount, type, frequency, category, expense_date)
        VALUES (${description}, ${amount}, ${type}, ${frequency}, ${category}, ${expense_date || new Date()})
        RETURNING *
      `;
      
      return {
        statusCode: 201,
        headers,
        body: JSON.stringify(expense)
      };
    }

    // PUT /expenses/:id - Update expense
    if (event.httpMethod === 'PUT') {
      const id = event.path.split('/').pop();
      const { description, amount, type, frequency, category, expense_date } = JSON.parse(event.body);
      
      const [expense] = await sql`
        UPDATE expenses 
        SET description = ${description}, 
            amount = ${amount}, 
            type = ${type}, 
            frequency = ${frequency}, 
            category = ${category},
            expense_date = ${expense_date},
            updated_at = NOW()
        WHERE id = ${id}
        RETURNING *
      `;
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(expense)
      };
    }

    // DELETE /expenses/:id - Delete expense
    if (event.httpMethod === 'DELETE') {
      const id = event.path.split('/').pop();
      
      await sql`DELETE FROM expenses WHERE id = ${id}`;
      
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
    console.error('Expenses error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  }
};
