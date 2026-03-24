const PDFDocument = require('pdfkit');

function generateInvoicePDF(invoiceData) {
  return new Promise((resolve, reject) => {
    try {
      console.log('PDF Generation (PDFKit) - Starting for invoice:', invoiceData.invoiceNumber);

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

      // Create PDF document - no margins, we handle layout manually
      const doc = new PDFDocument({ size: 'A4', margin: 0 });
      const buffers = [];

      doc.on('data', (chunk) => buffers.push(chunk));
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(buffers);
        console.log('PDF Generation - Complete, size:', pdfBuffer.length);
        resolve(pdfBuffer);
      });
      doc.on('error', reject);

      const pw = doc.page.width;   // 595.28
      const ph = doc.page.height;  // 841.89
      const mx = 40; // horizontal margin
      const cw = pw - mx * 2; // content width

      // ========================================================
      // HEADER - light green/blue gradient background
      // ========================================================
      // Simulate gradient with two overlapping rects
      doc.rect(0, 0, pw, 140).fill('#c8e6d1');
      doc.rect(pw * 0.4, 0, pw * 0.6, 140).fill('#b8e0e8');
      // Blend overlap
      doc.save();
      doc.rect(pw * 0.3, 0, pw * 0.3, 140).fill('#c0e3dc');
      doc.restore();

      // "FACTUUR" title
      doc.font('Helvetica-Bold').fontSize(32).fill('#000000');
      doc.text('FACTUUR', mx, 30, { width: 300 });

      // Date label + value
      doc.font('Helvetica-Bold').fontSize(10).fill('#000000');
      doc.text('DATUM', mx, 85);
      doc.fontSize(14).text(dateStr, mx, 100);

      // Invoice number label + value
      doc.font('Helvetica-Bold').fontSize(10).fill('#000000');
      doc.text('FACTUURNUMMER', mx + 140, 85);
      doc.fontSize(14).text(invoiceNumber, mx + 140, 100);

      // Right side: Varexo logo area
      const logoX = pw - 220;

      // Draw V shape manually with triangles
      // Left side of V (lighter blue)
      doc.save();
      doc.path('M ' + (logoX) + ' 25 L ' + (logoX + 28) + ' 80 L ' + (logoX + 20) + ' 80 L ' + (logoX - 3) + ' 35 Z')
        .fill('#7cb8d4');
      // Right side of V (dark blue)
      doc.path('M ' + (logoX + 56) + ' 25 L ' + (logoX + 28) + ' 80 L ' + (logoX + 36) + ' 80 L ' + (logoX + 60) + ' 35 Z')
        .fill('#1a3a5c');
      // Center facet
      doc.path('M ' + (logoX + 28) + ' 80 L ' + (logoX + 18) + ' 52 L ' + (logoX + 28) + ' 44 L ' + (logoX + 38) + ' 52 Z')
        .fillOpacity(0.85).fill('#5ba3cb');
      doc.fillOpacity(1);
      // Left facet
      doc.path('M ' + (logoX) + ' 25 L ' + (logoX + 19) + ' 25 L ' + (logoX + 28) + ' 44 L ' + (logoX + 18) + ' 52 Z')
        .fillOpacity(0.9).fill('#a8d4e6');
      doc.fillOpacity(1);
      // Right facet
      doc.path('M ' + (logoX + 56) + ' 25 L ' + (logoX + 37) + ' 25 L ' + (logoX + 28) + ' 44 L ' + (logoX + 38) + ' 52 Z')
        .fillOpacity(0.9).fill('#1e4d7a');
      doc.fillOpacity(1);
      doc.restore();

      // "VAREXO" text next to V
      doc.font('Helvetica-Bold').fontSize(26).fill('#1a3050');
      doc.text('VAREXO', logoX + 68, 38, { width: 150 });

      // Subtitle
      doc.font('Helvetica').fontSize(8).fill('#5a9ec4');
      doc.text('ICT  •  WEBSITES  •  SOFTWARE', logoX + 70, 64, { width: 150, characterSpacing: 0.5 });

      // Company info (right-aligned under logo)
      const companyX = pw - 180;
      doc.font('Helvetica-Bold').fontSize(10).fill('#333333');
      doc.text('Varexo', companyX, 82, { width: 140, align: 'right' });
      doc.font('Helvetica').fontSize(9).fill('#333333');
      doc.text('Regulierenstraat 10', companyX, 94, { width: 140, align: 'right' });
      doc.text('2694BA \'s-Gravenzande', companyX, 106, { width: 140, align: 'right' });
      doc.text('+31 6 36075966', companyX, 118, { width: 140, align: 'right' });
      doc.text('Info@varexo.nl', companyX, 130, { width: 140, align: 'right' });

      // ========================================================
      // CUSTOMER SECTION
      // ========================================================
      let y = 160;

      doc.font('Helvetica-Bold').fontSize(9).fill('#000000');
      doc.text('FACTUUR AAN:', mx, y);
      y += 16;

      doc.font('Helvetica').fontSize(11).fill('#333333');
      if (customerCompany) { doc.font('Helvetica-Bold').text(customerCompany, mx, y); y += 15; }
      doc.font('Helvetica');
      if (customerName) { doc.text(customerName, mx, y); y += 15; }
      if (customerAddress) { doc.text(customerAddress, mx, y); y += 15; }
      const postalCity = `${customerPostal || ''} ${customerCity || ''}`.trim();
      if (postalCity) { doc.text(postalCity, mx, y); y += 15; }
      if (customerPhone) { doc.text(customerPhone, mx, y); y += 15; }
      if (customerEmail) { doc.fill('#0066cc').text(customerEmail, mx, y); y += 15; }

      // ========================================================
      // SUMMARY ROW (gray bar with service info)
      // ========================================================
      y = Math.max(y + 10, 290);

      doc.rect(mx, y, cw, 35).fill('#f8f9fa');
      doc.rect(mx, y, cw, 35).strokeColor('#dee2e6').lineWidth(0.5).stroke();

      const colW = cw / 4;
      doc.font('Helvetica-Bold').fontSize(9).fill('#2c6e4f');
      doc.text('VAREXO', mx + 8, y + 8, { width: colW - 10 });
      doc.text('DIENSTVERLENING', mx + colW + 5, y + 8, { width: colW - 10 });
      doc.text('BETALINGSVOORWAARDEN', mx + colW * 2 + 5, y + 5, { width: colW - 10 });
      doc.font('Helvetica').fontSize(8).fill('#666666');
      doc.text('BETALING BINNEN 14 DAGEN', mx + colW * 2 + 5, y + 18, { width: colW - 10 });
      doc.font('Helvetica-Bold').fontSize(9).fill('#2c6e4f');
      doc.text(dueDateStr, mx + colW * 3 + 5, y + 8, { width: colW - 15, align: 'right' });

      // ========================================================
      // ITEMS TABLE
      // ========================================================
      y += 50;

      // Table header
      doc.font('Helvetica-Bold').fontSize(9).fill('#2c6e4f');
      doc.text('AANTAL', mx + 10, y, { width: 60, align: 'center' });
      doc.text('OMSCHRIJVING', mx + 80, y, { width: 180 });
      doc.text('PRIJS PER EENHEID', mx + 280, y, { width: 110, align: 'right' });
      doc.text('REGELTOTAAL', mx + 400, y, { width: 110, align: 'right' });

      y += 16;
      doc.moveTo(mx, y).lineTo(mx + cw, y).strokeColor('#2c6e4f').lineWidth(1.5).stroke();
      y += 12;

      // Table rows
      parsedItems.forEach((item) => {
        const qty = item.quantity || 1;
        const price = parseFloat(item.price) || 0;
        const total = parseFloat(item.total) || (price * qty);

        doc.font('Helvetica').fontSize(11).fill('#2c6e4f');
        doc.text(String(qty), mx + 10, y, { width: 60, align: 'center' });
        doc.fill('#333333');
        doc.text(item.description || '', mx + 80, y, { width: 180 });
        doc.text('\u20AC' + price.toFixed(2), mx + 280, y, { width: 110, align: 'right' });
        doc.text('\u20AC' + total.toFixed(2), mx + 400, y, { width: 110, align: 'right' });

        y += 22;
        doc.moveTo(mx, y).lineTo(mx + cw, y).strokeColor('#eeeeee').lineWidth(0.5).stroke();
        y += 10;
      });

      // ========================================================
      // TOTALS
      // ========================================================
      y += 15;
      const tLabelX = mx + 280;
      const tValX = mx + 400;
      const tValW = 110;

      doc.font('Helvetica').fontSize(11).fill('#333333');
      doc.text('Subtotaal (excl. BTW)', tLabelX, y, { width: 110 });
      doc.text('\u20AC' + subtotalExcl.toFixed(2), tValX, y, { width: tValW, align: 'right' });
      y += 20;

      doc.text('BTW 21%', tLabelX, y, { width: 110 });
      doc.text('\u20AC' + btwAmount.toFixed(2), tValX, y, { width: tValW, align: 'right' });
      y += 20;

      // Thick line
      doc.moveTo(tLabelX, y).lineTo(tValX + tValW, y).strokeColor('#333333').lineWidth(1.5).stroke();
      y += 10;

      doc.font('Helvetica-Bold').fontSize(13).fill('#000000');
      doc.text('Totaal (incl. BTW)', tLabelX, y, { width: 110 });
      doc.text('\u20AC' + totalIncl.toFixed(2), tValX, y, { width: tValW, align: 'right' });
      y += 18;

      doc.font('Helvetica').fontSize(8).fill('#666666');
      doc.text('Alle bedragen zijn inclusief 21% BTW', tLabelX, y, { width: 220, align: 'right' });

      // ========================================================
      // FOOTER - at bottom of page
      // ========================================================
      const footerH = 60;
      const footerY = ph - footerH;

      // Gradient-like footer bg
      doc.rect(0, footerY, pw * 0.5, footerH).fill('#c8e6d1');
      doc.rect(pw * 0.5, footerY, pw * 0.5, footerH).fill('#b8e0e8');
      doc.rect(pw * 0.3, footerY, pw * 0.4, footerH).fill('#c0e3dc');

      // Footer right: company payment info
      doc.font('Helvetica-Bold').fontSize(10).fill('#333333');
      doc.text('Varexo', pw - 220, footerY + 10, { width: 180, align: 'right' });
      doc.font('Helvetica').fontSize(9).fill('#333333');
      doc.text('t.n.v. Mohammed Taher', pw - 220, footerY + 23, { width: 180, align: 'right' });
      doc.text('IBAN: NL75INGB0756428726', pw - 220, footerY + 35, { width: 180, align: 'right' });
      doc.text('BTW: 21% inbegrepen', pw - 220, footerY + 47, { width: 180, align: 'right' });

      // Finalize PDF
      doc.end();

    } catch (error) {
      console.error('PDF Generation error:', error);
      reject(error);
    }
  });
}

module.exports = { generateInvoicePDF };
