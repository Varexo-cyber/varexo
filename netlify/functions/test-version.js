// Test if new code is deployed
exports.handler = async () => {
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      message: 'NEW CODE VERSION 2 - If you see this, the deploy worked!',
      timestamp: new Date().toISOString()
    })
  };
};
