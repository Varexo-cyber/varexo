const puppeteer = require('puppeteer');

function generateInvoicePDF(invoiceData) {
  return new Promise(async (resolve, reject) => {
    let browser;
    try {
      console.log('PDF Generation - Starting with data:', JSON.stringify(invoiceData, null, 2));
      const {
        invoiceNumber, invoiceDate, customerName, customerCompany,
        customerAddress, customerPostal, customerCity, customerEmail,
        customerPhone, items, amount
      } = invoiceData;

      // BTW calculation
      const totalIncl = parseFloat(amount) || 0;
      const subtotalExcl = totalIncl / 1.21;
      const btwAmount = totalIncl - subtotalExcl;

      // Format date
      let dateStr = '';
      if (invoiceDate) {
        const d = new Date(invoiceDate);
        dateStr = d.toLocaleDateString('nl-NL', { day: '2-digit', month: '2-digit', year: 'numeric' });
      } else {
        dateStr = new Date().toLocaleDateString('nl-NL', { day: '2-digit', month: '2-digit', year: 'numeric' });
      }

      // Parse items
      const parsedItems = typeof items === 'string' ? JSON.parse(items) : (items || []);

      // Generate items HTML
      const itemsHTML = parsedItems.map(item => `
        <tr>
          <td class="quantity">${item.quantity || 1}</td>
          <td class="description">${item.description || ''}</td>
          <td class="price">€${(parseFloat(item.price) || 0).toFixed(2)}</td>
          <td class="total">€${(parseFloat(item.total) || (parseFloat(item.price) || 0) * (item.quantity || 1)).toFixed(2)}</td>
        </tr>
      `).join('');

      // HTML template (exact copy of frontend template)
      const html = `
        <!DOCTYPE html>
        <html lang="nl">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Factuur ${invoiceNumber}</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              background: #f8f9fa;
              padding: 20px;
              color: #333;
            }
            .invoice-container {
              max-width: 800px;
              margin: 0 auto;
              background: white;
              border-radius: 12px;
              box-shadow: 0 4px 20px rgba(0,0,0,0.08);
              overflow: hidden;
            }
            .header-section {
              background: linear-gradient(135deg, #2c6e4f 0%, #1a5438 100%);
              padding: 40px;
              color: white;
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            .header-left h1 {
              font-size: 48px;
              font-weight: 300;
              margin-bottom: 20px;
              letter-spacing: 2px;
            }
            .invoice-info {
              display: flex;
              gap: 40px;
            }
            .info-block h3 {
              font-size: 12px;
              font-weight: 600;
              text-transform: uppercase;
              color: #a8d5c4;
              margin-bottom: 8px;
            }
            .info-block p {
              font-size: 18px;
              font-weight: 600;
            }
            .logo-section {
              text-align: right;
            }
            .logo-section svg {
              width: 180px;
              height: 80px;
            }
            .content-section {
              padding: 40px;
            }
            .company-info {
              display: flex;
              justify-content: space-between;
              margin-bottom: 40px;
            }
            .company-left h2, .company-right h2 {
              font-size: 14px;
              font-weight: 600;
              color: #2c6e4f;
              margin-bottom: 16px;
              text-transform: uppercase;
            }
            .company-left p, .company-right p {
              font-size: 14px;
              line-height: 1.8;
              margin-bottom: 8px;
              color: #555;
            }
            .company-left p strong, .company-right p strong {
              font-weight: 600;
              color: #333;
            }
            .summary-section {
              background: #f8f9fa;
              padding: 30px 40px;
              margin: 0 40px;
              border-radius: 8px;
            }
            .summary-row {
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 12px 0;
              font-size: 14px;
              border-bottom: 1px solid #e0e0e0;
            }
            .summary-row:last-child {
              border-bottom: none;
              font-weight: 600;
              font-size: 18px;
              color: #2c6e4f;
              margin-top: 8px;
              padding-top: 16px;
              border-top: 2px solid #2c6e4f;
            }
            .items-table {
              margin: 0 40px;
              border-collapse: collapse;
              width: calc(100% - 80px);
            }
            .items-table th {
              text-align: left;
              padding: 15px 20px;
              font-size: 12px;
              font-weight: 600;
              text-transform: uppercase;
              color: #2c6e4f;
              border-bottom: 2px solid #2c6e4f;
            }
            .items-table td {
              padding: 20px;
              font-size: 13px;
              color: #333;
              border-bottom: 1px solid #eee;
            }
            .items-table .quantity { text-align: center; width: 80px; }
            .items-table .description { text-align: left; }
            .items-table .price { text-align: right; width: 120px; }
            .items-table .total { text-align: right; width: 120px; }
            .totals-section {
              margin: 30px 40px 0 40px;
              padding-bottom: 40px;
              display: flex;
              justify-content: flex-end;
            }
            .totals-table {
              width: 300px;
            }
            .totals-row {
              display: flex;
              justify-content: space-between;
              padding: 8px 0;
              font-size: 13px;
              color: #333;
            }
            .totals-row.total {
              font-weight: 600;
              font-size: 16px;
              border-top: 2px solid #333;
              padding-top: 12px;
              margin-top: 8px;
            }
            .footer {
              background: linear-gradient(135deg, #c8e6d1 0%, #b8e0e8 100%);
              padding: 30px 40px;
              margin-top: 40px;
            }
            .footer-content {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
            }
            .footer-left {
              font-size: 11px;
              color: #333;
            }
            .footer-right {
              text-align: right;
              font-size: 12px;
              color: #333;
              line-height: 1.8;
            }
            .footer-right strong {
              font-weight: 600;
            }
            @media print {
              body { background: white; padding: 0; }
              .invoice-container { box-shadow: none; }
            }
          </style>
        </head>
        <body>
          <div class="invoice-container">
            <!-- Header Section -->
            <div class="header-section">
              <div class="header-left">
                <h1>FACTUUR</h1>
                <div class="invoice-info">
                  <div class="info-block">
                    <h3>Datum</h3>
                    <p>${dateStr}</p>
                  </div>
                  <div class="info-block">
                    <h3>Factuurnummer</h3>
                    <p>${invoiceNumber}</p>
                  </div>
                </div>
              </div>
              <div class="logo-section">
                <!-- Varexo Logo -->
                <svg width="180" height="80" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="gradLeft" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#4fc3f7" />
                      <stop offset="100%" stopColor="#29b6f6" />
                    </linearGradient>
                    <linearGradient id="gradRight" x1="100%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#1565c0" />
                      <stop offset="100%" stopColor="#0d47a1" />
                    </linearGradient>
                    <linearGradient id="gradCenter" x1="50%" y1="0%" x2="50%" y2="100%">
                      <stop offset="0%" stopColor="#81d4fa" />
                      <stop offset="100%" stopColor="#42a5f5" />
                    </linearGradient>
                    <linearGradient id="gradLeftFacet" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#b3e5fc" />
                      <stop offset="100%" stopColor="#4fc3f7" />
                    </linearGradient>
                    <linearGradient id="gradRightFacet" x1="100%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#1976d2" />
                      <stop offset="100%" stopColor="#1565c0" />
                    </linearGradient>
                  </defs>
                  <!-- Left side of V - lighter -->
                  <polygon points="10,15 50,90 38,90 5,25" fill="url(#gradLeft)" />
                  <!-- Right side of V - darker -->
                  <polygon points="90,15 50,90 62,90 95,25" fill="url(#gradRight)" />
                  <!-- Center highlight -->
                  <polygon points="50,90 35,55 50,45 65,55" fill="url(#gradCenter)" opacity="0.8" />
                  <!-- Left facet -->
                  <polygon points="10,15 38,15 50,45 35,55" fill="url(#gradLeftFacet)" opacity="0.9" />
                  <!-- Right facet -->
                  <polygon points="90,15 62,15 50,45 65,55" fill="url(#gradRightFacet)" opacity="0.9" />
                </svg>
              </div>
            </div>

            <!-- Content Section -->
            <div class="content-section">
              <!-- Company Information -->
              <div class="company-info">
                <div class="company-left">
                  <h2>Factuur Aan</h2>
                  ${customerCompany ? `<p><strong>${customerCompany}</strong></p>` : ''}
                  ${customerName ? `<p>${customerName}</p>` : ''}
                  ${customerAddress ? `<p>${customerAddress}</p>` : ''}
                  ${customerPostal ? `<p>${customerPostal}</p>` : ''}
                  ${customerCity ? `<p>${customerCity}</p>` : ''}
                  ${customerEmail ? `<p>${customerEmail}</p>` : ''}
                </div>
                <div class="company-right">
                  <h2>Varexo</h2>
                  <p>Regulierenstraat 10</p>
                  <p>2694BA 's-Gravenzande</p>
                  <p>info@varexo.nl</p>
                </div>
              </div>

              <!-- Summary -->
              <div class="summary-section">
                <div class="summary-row">
                  <span>Factuurnummer:</span>
                  <span>${invoiceNumber}</span>
                </div>
                <div class="summary-row">
                  <span>Factuurdatum:</span>
                  <span>${dateStr}</span>
                </div>
                <div class="summary-row">
                  <span>Vervaldatum:</span>
                  <span>${new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString('nl-NL', { day: '2-digit', month: '2-digit', year: 'numeric' })}</span>
                </div>
              </div>

              <!-- Items Table -->
              <table class="items-table">
                <thead>
                  <tr>
                    <th class="quantity">Aantal</th>
                    <th class="description">Omschrijving</th>
                    <th class="price">Prijs</th>
                    <th class="total">Totaal</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHTML}
                </tbody>
              </table>

              <!-- Totals -->
              <div class="totals-section">
                <table class="totals-table">
                  <tr class="totals-row">
                    <td>Subtotaal (excl. BTW)</td>
                    <td>€${subtotalExcl.toFixed(2)}</td>
                  </tr>
                  <tr class="totals-row">
                    <td>BTW 21%</td>
                    <td>€${btwAmount.toFixed(2)}</td>
                  </tr>
                  <tr class="totals-row total">
                    <td>Totaal (incl. BTW)</td>
                    <td>€${totalIncl.toFixed(2)}</td>
                  </tr>
                </table>
              </div>
            </div>

            <!-- Footer -->
            <div class="footer">
              <div class="footer-content">
                <div class="footer-left">
                  <p><strong>Bedrijfsgegevens:</strong></p>
                  <p>Varexo | Regulierenstraat 10 | 2694BA 's-Gravenzande</p>
                  <p>KVK: 12345678 | BTW: NL123456789B01</p>
                  <p>Bank: NL75INGB0756428726</p>
                </div>
                <div class="footer-right">
                  <p><strong>Betalingsvoorwaarden:</strong></p>
                  <p>Betaling binnen 14 dagen</p>
                  <p>Alle bedragen zijn inclusief 21% BTW</p>
                  <p>Vragen? Neem contact op via info@varexo.nl</p>
                </div>
              </div>
            </div>
          </div>
        </body>
        </html>
      `;

      browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      console.log('PDF Generation - Browser launched');
      
      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: 'networkidle0' });
      console.log('PDF Generation - Content set');
      
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '20px',
          right: '20px',
          bottom: '20px',
          left: '20px'
        }
      });
      console.log('PDF Generation - PDF created, size:', pdfBuffer.length);

      await browser.close();
      resolve(pdfBuffer);
    } catch (error) {
      if (browser) await browser.close();
      reject(error);
    }
  });
}

module.exports = { generateInvoicePDF };
