exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  };

  // Try multiple ways to connect
  const dbUrl = process.env.NETLIFY_DATABASE_URL || process.env.DATABASE_URL;
  
  const info = {
    hasNeonPkg: false,
    hasServerlessPkg: false,
    hasDbUrl: !!dbUrl,
    dbUrlPrefix: dbUrl ? dbUrl.substring(0, 30) + '...' : 'NOT SET',
    envKeys: Object.keys(process.env).filter(k => k.includes('DATABASE') || k.includes('NEON')),
  };

  try {
    // Try @netlify/neon first
    const { neon } = require('@netlify/neon');
    info.hasNeonPkg = true;
    const sql = neon();
    const result = await sql`SELECT COUNT(*) as count FROM users`;
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ status: 'OK_NEON', userCount: result[0].count, info })
    };
  } catch (e1) {
    info.neonError = e1.message;
  }

  try {
    // Try @neondatabase/serverless
    const { neon } = require('@neondatabase/serverless');
    info.hasServerlessPkg = true;
    if (!dbUrl) throw new Error('No DATABASE_URL found');
    const sql = neon(dbUrl);
    const result = await sql`SELECT COUNT(*) as count FROM users`;
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ status: 'OK_SERVERLESS', userCount: result[0].count, info })
    };
  } catch (e2) {
    info.serverlessError = e2.message;
  }

  return {
    statusCode: 500,
    headers,
    body: JSON.stringify({ status: 'FAILED', info })
  };
};
