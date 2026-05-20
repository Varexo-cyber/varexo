// Netlify Function: Get Mollie products/price lines
const { createMollieClient } = require('@mollie/api-client');

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers };

  try {
    const mollieClient = createMollieClient({ apiKey: process.env.MOLLIE_API_KEY });

    // Get products from Mollie (sales invoice lines / price rates)
    const products = await mollieClient.products?.list?.() || { _embedded: { products: [] } };

    // Fallback: hardcoded Varexo products matching Mollie dashboard
    const defaultProducts = [
      { id: 'prod_website_onderhoud', name: 'Website Onderhoud & Beheer | Varexo', price: 29.99, description: 'Maandelijks onderhoud inclusief hosting, domein, updates en technische support.' },
      { id: 'prod_email_hosting', name: 'Zakelijk E-mail & Hosting | Varexo', price: 9.99, description: 'Professioneel zakelijk e-mailadres inclusief hosting.' },
      { id: 'prod_social_media', name: 'Social Media Beheer | Varexo', price: 149.00, description: 'Volledig social media beheer inclusief content creatie.' },
      { id: 'prod_website_bouw', name: 'Website Bouw | Varexo', price: 0, description: 'Maatwerk website ontwikkeling.' },
    ];

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ products: defaultProducts })
    };
  } catch (error) {
    console.error('Products error:', error);
    // Return default products on error
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        products: [
          { id: 'prod_website_onderhoud', name: 'Website Onderhoud & Beheer | Varexo', price: 29.99, description: 'Maandelijks onderhoud inclusief hosting' },
          { id: 'prod_email_hosting', name: 'Zakelijk E-mail & Hosting | Varexo', price: 9.99, description: 'Zakelijk e-mailadres inclusief hosting' },
          { id: 'prod_social_media', name: 'Social Media Beheer | Varexo', price: 149.00, description: 'Social media beheer inclusief content' },
        ]
      })
    };
  }
};
