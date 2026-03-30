async function generateInvoicePDF(invoiceData) {
  console.log('PDF Generation - Starting for invoice:', invoiceData.invoiceNumber);

  const {
    invoiceNumber, invoiceDate, customerName, customerCompany,
    customerAddress, customerPostal, customerCity, customerEmail,
    customerPhone, items, amount, dueDate
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

  // Format due date
  let dueDateStr = '';
  if (dueDate) {
    dueDateStr = new Date(dueDate).toLocaleDateString('nl-NL', { day: '2-digit', month: '2-digit', year: 'numeric' });
  } else {
    dueDateStr = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString('nl-NL', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }

  // Parse items
  const parsedItems = typeof items === 'string' ? JSON.parse(items) : (items || []);

  // Build items HTML rows
  const itemsHTML = parsedItems.map(item => {
    const qty = item.quantity || 1;
    const price = parseFloat(item.price) || 0;
    const total = parseFloat(item.total) || (price * qty);
    return `<tr>
      <td class="quantity">${qty}</td>
      <td class="description">${item.description || ''}</td>
      <td class="price">&euro;${price.toFixed(2)}</td>
      <td class="total">&euro;${total.toFixed(2)}</td>
    </tr>`;
  }).join('');

  // EXACT same HTML template as Dashboard.tsx generatePDF
  const html = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>Factuur ${invoiceNumber}</title>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { 
        font-family: 'Inter', Arial, sans-serif; 
        background: white;
        padding: 0;
        color: #333;
      }
      .invoice-container {
        max-width: 800px;
        margin: 0 auto;
        background: white;
        position: relative;
      }
      .header-section {
        background: linear-gradient(135deg, #c8e6d1 0%, #b8e0e8 100%);
        padding: 40px;
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
      }
      .header-left h1 {
        font-size: 32px;
        font-weight: 700;
        color: #000;
        margin-bottom: 30px;
      }
      .invoice-info {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
      }
      .info-block h3 {
        font-size: 12px;
        font-weight: 600;
        text-transform: uppercase;
        color: #000;
        margin-bottom: 8px;
        letter-spacing: 0.5px;
      }
      .info-block p {
        font-size: 16px;
        color: #000;
      }
      .logo-section {
        text-align: right;
      }
      .company-info {
        font-size: 12px;
        color: #333;
        line-height: 1.6;
        text-align: right;
      }
      .customer-section {
        padding: 30px 40px;
        display: flex;
        justify-content: space-between;
      }
      .customer-details {
        max-width: 300px;
      }
      .customer-label {
        font-size: 11px;
        font-weight: 600;
        text-transform: uppercase;
        color: #000;
        margin-bottom: 8px;
      }
      .customer-details p {
        font-size: 13px;
        color: #333;
        line-height: 1.5;
      }
      .customer-email {
        color: #0066cc;
        text-decoration: underline;
      }
      .summary-row {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr;
        background: #f8f9fa;
        margin: 0 30px;
        padding: 12px 15px;
        border: 1px solid #dee2e6;
        font-size: 11px;
        font-weight: 600;
        text-transform: uppercase;
        color: #2c6e4f;
        align-items: center;
      }
      .summary-row span {
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .summary-row span:first-child {
        text-align: left;
        justify-content: flex-start;
      }
      .summary-row span:nth-child(3) {
        text-align: right;
        justify-content: flex-end;
        padding-right: 10px;
      }
      .summary-row span:last-child {
        text-align: left;
        justify-content: flex-start;
        font-size: 9px;
        font-weight: 400;
        text-transform: none;
        line-height: 1.4;
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
        margin-top: 120px;
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
    </style>
  </head>
  <body>
    <div class="invoice-container">
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
          <svg width="180" height="80" viewBox="0 0 360 120" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="vLeft" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#7cb8d4"/>
                <stop offset="100%" style="stop-color:#4a9cc7"/>
              </linearGradient>
              <linearGradient id="vRight" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style="stop-color:#1a3a5c"/>
                <stop offset="100%" style="stop-color:#2a5a8c"/>
              </linearGradient>
              <linearGradient id="vCenter" x1="50%" y1="0%" x2="50%" y2="100%">
                <stop offset="0%" style="stop-color:#5ba3cb"/>
                <stop offset="100%" style="stop-color:#3d8ab8"/>
              </linearGradient>
              <linearGradient id="vLeftFacet" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#a8d4e6"/>
                <stop offset="100%" style="stop-color:#6db5d4"/>
              </linearGradient>
              <linearGradient id="vRightFacet" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style="stop-color:#1e4d7a"/>
                <stop offset="100%" style="stop-color:#2a6a9e"/>
              </linearGradient>
            </defs>
            <polygon points="15,15 65,105 50,105 5,30" fill="url(#vLeft)"/>
            <polygon points="115,15 65,105 80,105 120,30" fill="url(#vRight)"/>
            <polygon points="65,105 45,60 65,48 85,60" fill="url(#vCenter)" opacity="0.85"/>
            <polygon points="15,15 48,15 65,48 45,60" fill="url(#vLeftFacet)" opacity="0.9"/>
            <polygon points="115,15 82,15 65,48 85,60" fill="url(#vRightFacet)" opacity="0.9"/>
            <text x="138" y="68" font-family="system-ui, -apple-system, sans-serif" font-size="48" font-weight="700" fill="#1a3050" letter-spacing="3">VAREXO</text>
            <text x="140" y="88" font-family="system-ui, -apple-system, sans-serif" font-size="12" fill="#5a9ec4" letter-spacing="2">ICT  •  WEBSITES  •  SOFTWARE</text>
          </svg>
          <div class="company-info">
            <strong>Varexo</strong><br>
            Regulierenstraat 10<br>
            2694BA 's-Gravenzande<br>
            +31 6 36075966<br>
            Info@varexo.nl
          </div>
        </div>
      </div>

      <div class="customer-section">
        <div class="customer-details">
          <div class="customer-label">Factuur aan:</div>
          <p>
            ${customerCompany ? `<strong>${customerCompany}</strong><br>` : ''}
            ${customerName || ''}<br>
            ${customerAddress || ''}<br>
            ${customerPostal || ''} ${customerCity || ''}<br>
            ${customerPhone || ''}<br>
            <span class="customer-email">${customerEmail || ''}</span>
          </p>
        </div>
      </div>

      <div class="summary-row">
        <span>VAREXO</span>
        <span>DIENSTVERLENING</span>
        <span><strong>Vervaldatum:</strong> ${dueDateStr}</span>
        <span>Betalingsvoorwaarden:<br>Betaling binnen 14 dagen na vervaldatum</span>
      </div>

      <table class="items-table">
        <thead>
          <tr>
            <th class="quantity">Aantal</th>
            <th class="description">Omschrijving</th>
            <th class="price">Prijs per eenheid</th>
            <th class="total">Regeltotaal</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHTML}
        </tbody>
      </table>

      <div class="totals-section">
        <div class="totals-table">
          <div class="totals-row">
            <span>Subtotaal (excl. BTW)</span>
            <span>&euro;${subtotalExcl.toFixed(2)}</span>
          </div>
          <div class="totals-row">
            <span>BTW 21%</span>
            <span>&euro;${btwAmount.toFixed(2)}</span>
          </div>
          <div class="totals-row total">
            <span>Totaal (incl. BTW)</span>
            <span>&euro;${totalIncl.toFixed(2)}</span>
          </div>
          <div style="font-size:11px;color:#666;margin-top:6px;text-align:right;">Alle bedragen zijn inclusief 21% BTW</div>
        </div>
      </div>

      <div class="footer">
        <div class="footer-content">
          <div class="footer-left"></div>
          <div class="footer-right">
            <strong>Varexo</strong><br>
            t.n.v. Mohammed Taher<br>
            IBAN: NL75INGB0756428726<br>
            BTW: 21% inbegrepen
          </div>
        </div>
      </div>
    </div>
  </body>
</html>`;

  // Render HTML to PDF using headless Chromium (works in serverless)
  let browser = null;
  try {
    const chromium = require('@sparticuz/chromium');
    const puppeteer = require('puppeteer-core');

    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    });

    console.log('PDF Generation - Complete, size:', pdfBuffer.length);
    return Buffer.from(pdfBuffer);
  } catch (error) {
    console.error('PDF Generation error:', error.message);
    throw error;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

module.exports = { generateInvoicePDF };
