// Netlify Function: Get products from Mollie sales invoices line items
const axios = require('axios');

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers };

  const MOLLIE_API_KEY = process.env.MOLLIE_API_KEY;

  try {
    // Mollie has no product catalog API - extract unique products from sales invoices
    const response = await axios.get('https://api.mollie.com/v2/sales-invoices?limit=50', {
      headers: { Authorization: `Bearer ${MOLLIE_API_KEY}` }
    });

    const invoices = response.data?._embedded?.['sales-invoices'] || [];

    // Extract unique products from invoice line items
    const seen = new Map();
    for (const invoice of invoices) {
      for (const line of (invoice.lines || [])) {
        const key = line.description;
        if (!seen.has(key)) {
          seen.set(key, {
            id: `mollie_${Buffer.from(key).toString('base64').slice(0, 16)}`,
            name: line.description,
            price: parseFloat(line.unitPrice?.value || line.amount?.value || 0),
            description: line.description
          });
        }
      }
    }

    const mollieProducts = Array.from(seen.values());

    if (mollieProducts.length > 0) {
      return { statusCode: 200, headers, body: JSON.stringify({ products: mollieProducts, source: 'mollie' }) };
    }

    throw new Error('No products found in Mollie invoices');

  } catch (err) {
    console.log('Mollie sales-invoices failed:', err.message);
    // No second attempt needed - fall through to full fallback below

    // Final fallback: ALLE Varexo producten - Mollie producten EERST
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        products: [
          // === UIT MOLLIE DASHBOARD (invoice-ar/products) ===
          { id: 'mollie_website_onderhoud', name: 'Website Onderhoud & Beheer | Varexo', price: 29.99, description: 'Maandelijks website onderhoud & beheer.' },
          { id: 'mollie_email_hosting', name: 'Zakelijk E-mail & Hosting | Varexo', price: 9.99, description: 'Professioneel zakelijk e-mailadres inclusief hosting.' },
          // === WEBSITE PAKKETTEN (eenmalig) ===
          { id: 'prod_basic', name: 'Basic Website Pakket | Varexo', price: 649.99, description: 'Complete website (1-3 paginas), responsive design, contactformulier, Google Maps, basis SEO. Eenmalig.' },
          { id: 'prod_pro', name: 'Pro Website Pakket | Varexo', price: 1049.99, description: 'Geavanceerde website (5-10 paginas), 0.01s laadtijd garantie, geavanceerde SEO, marketing strategie. Eenmalig.' },
          { id: 'prod_premium', name: 'Premium Website Pakket | Varexo', price: 1749.99, description: 'Maatwerk website (10+ paginas), all-inclusive onderhoud, logo ontwerp, geavanceerde SEO. Eenmalig.' },
          // === ONDERHOUD & HOSTING (maandelijks) ===
          { id: 'prod_onderhoud_maand', name: 'Website Onderhoud & Beheer | Varexo', price: 39.99, description: 'Maandelijks onderhoud inclusief hosting, domein, updates en technische support. Vrijgesteld van BTW (KOR).' },
          { id: 'prod_onderhoud_jaar', name: 'Website Onderhoud & Beheer (jaarlijks) | Varexo', price: 449.99, description: 'Jaarlijks onderhoud inclusief hosting, domein, updates en technische support.' },
          // === EMAIL HOSTING ===
          { id: 'prod_email_maand', name: 'Zakelijk E-mail & Hosting | Varexo', price: 9.99, description: 'Professioneel zakelijk e-mailadres inclusief hosting. Bijv. info@jouwbedrijf.nl - per maand.' },
          { id: 'prod_email_jaar', name: 'Zakelijk E-mail & Hosting (jaarlijks) | Varexo', price: 109.99, description: 'Professioneel zakelijk e-mailadres inclusief hosting - jaarlijks.' },
          // === SOCIAL MEDIA & ADS ===
          { id: 'prod_social_starter', name: 'Social Media Starter | Varexo', price: 399.99, description: 'Instagram & Facebook, doelgroep targeting, professioneel ads design, 1 campagne/maand, maandrapportage. 5.000+ weergaven/dag.' },
          { id: 'prod_social_groei', name: 'Social Media Groei | Varexo', price: 699.99, description: 'Alles uit Starter + geavanceerde analyse, 2 campagnes/maand, A/B testing, actieve leadgeneratie, wekelijkse rapportage. 15.000+ weergaven/dag.' },
          { id: 'prod_social_dominant', name: 'Social Media Dominant | Varexo', price: 999.99, description: 'Alles uit Groei + 3 campagnes/maand, premium ads design, conversie-funnels, persoonlijke accountmanager, dagelijkse rapportage. 30.000+ weergaven/dag.' },
          // === SEO ===
          { id: 'prod_seo_maand', name: 'SEO Maandelijks | Varexo', price: 89.99, description: 'Maandelijkse SEO: content strategie, backlinks, ranking rapportage en optimalisatie.' },
          { id: 'prod_seo_opstel', name: 'SEO Eenmalige Opstel | Varexo', price: 399.99, description: 'Eenmalige SEO opstel: technische audit, zoekwoorden, Search Console, concurrentieanalyse.' },
          { id: 'prod_seo_basic_korting', name: 'SEO Opstel - Basic klant korting | Varexo', price: 299.99, description: 'SEO opstel met 100 euro korting voor Basic klanten (normaal 399,99).' },
          { id: 'prod_seo_pro_korting', name: 'SEO Opstel - Pro klant korting | Varexo', price: 249.99, description: 'SEO opstel met 150 euro korting voor Pro klanten (normaal 399,99).' },
          { id: 'prod_seo_premium_korting', name: 'SEO Opstel - Premium klant korting | Varexo', price: 199.99, description: 'SEO opstel met 200 euro korting voor Premium klanten (normaal 399,99).' },
          // === EXTRA DIENSTEN ===
          { id: 'prod_logo', name: 'Logo & Huisstijl | Varexo', price: 199.99, description: 'Logo ontwerp: 3 concepten, 2 revisierondes, PNG/SVG/PDF, kleurenpalet + typografie. Eenmalig.' },
          { id: 'prod_domein', name: 'Domein Registratie | Varexo', price: 19.99, description: '.nl of .com domein inclusief DNS beheer, automatische verlenging en SSL-certificaat. Per jaar.' },
          // === MAATWERK ===
          { id: 'prod_maatwerk', name: 'Maatwerk opdracht | Varexo', price: 0, description: 'Prijs op aanvraag - maatwerk ontwikkeling of dienst.' },
        ]
      })
    };
  }
};
