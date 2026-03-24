const PDFDocument = require('pdfkit');

function generateInvoicePDF(invoiceData) {
  return new Promise((resolve, reject) => {
    try {
      console.log('PDF Generation (PDFKit) - Starting for invoice:', invoiceData.invoiceNumber);

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

      // Create PDF document
      const doc = new PDFDocument({ size: 'A4', margin: 40 });
      const buffers = [];

      doc.on('data', (chunk) => buffers.push(chunk));
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(buffers);
        console.log('PDF Generation - Complete, size:', pdfBuffer.length);
        resolve(pdfBuffer);
      });
      doc.on('error', reject);

      const pageWidth = doc.page.width;
      const contentWidth = pageWidth - 80; // 40px margin each side

      // ===== HEADER SECTION (dark green) =====
      doc.save();
      doc.rect(0, 0, pageWidth, 120).fill('#1a5438');

      // "FACTUUR" title
      doc.fontSize(36).fill('#ffffff').font('Helvetica-Bold');
      doc.text('FACTUUR', 40, 30);

      // Date and invoice number
      doc.fontSize(9).fill('#a8d5c4').font('Helvetica-Bold');
      doc.text('DATUM', 40, 80);
      doc.text('FACTUURNUMMER', 160, 80);

      doc.fontSize(13).fill('#ffffff').font('Helvetica-Bold');
      doc.text(dateStr, 40, 94);
      doc.text(invoiceNumber, 160, 94);

      // VAREXO logo text (right side)
      doc.fontSize(28).fill('#4fc3f7').font('Helvetica-Bold');
      doc.text('V', pageWidth - 160, 35);
      doc.fontSize(22).fill('#ffffff').font('Helvetica-Bold');
      doc.text('VAREXO', pageWidth - 140, 40);
      doc.fontSize(8).fill('#a8d5c4').font('Helvetica');
      doc.text('ICT • WEBSITES • SOFTWARE', pageWidth - 160, 68);

      doc.restore();

      // ===== COMPANY INFO SECTION =====
      let y = 145;

      // Left: Customer info
      doc.fontSize(11).fill('#2c6e4f').font('Helvetica-Bold');
      doc.text('FACTUUR AAN:', 40, y);
      y += 20;

      doc.fontSize(10).fill('#333333').font('Helvetica');
      if (customerCompany) { doc.font('Helvetica-Bold').text(customerCompany, 40, y); y += 16; }
      if (customerName) { doc.font('Helvetica').text(customerName, 40, y); y += 16; }
      if (customerAddress) { doc.text(customerAddress, 40, y); y += 16; }
      if (customerPostal || customerCity) { 
        doc.text(`${customerPostal || ''} ${customerCity || ''}`.trim(), 40, y); y += 16; 
      }
      if (customerEmail) { doc.text(customerEmail, 40, y); y += 16; }
      if (customerPhone) { doc.text(customerPhone, 40, y); y += 16; }

      // Right: Varexo info
      const rightX = pageWidth - 200;
      doc.fontSize(11).fill('#2c6e4f').font('Helvetica-Bold');
      doc.text('VAREXO', rightX, 145);
      doc.fontSize(10).fill('#555555').font('Helvetica');
      doc.text('Regulierenstraat 10', rightX, 165);
      doc.text('2694BA \'s-Gravenzande', rightX, 181);
      doc.text('+31 6 36075966', rightX, 197);
      doc.text('info@varexo.nl', rightX, 213);

      // ===== ITEMS TABLE =====
      y = Math.max(y, 240) + 20;

      // Table header background
      doc.save();
      doc.rect(40, y, contentWidth, 28).fill('#f0fdf4');
      doc.restore();

      // Table header text
      doc.fontSize(9).fill('#2c6e4f').font('Helvetica-Bold');
      doc.text('AANTAL', 50, y + 8, { width: 60, align: 'center' });
      doc.text('OMSCHRIJVING', 120, y + 8, { width: 200, align: 'left' });
      doc.text('PRIJS PER EENHEID', 330, y + 8, { width: 100, align: 'right' });
      doc.text('REGELTOTAAL', 440, y + 8, { width: 100, align: 'right' });

      // Divider
      y += 28;
      doc.moveTo(40, y).lineTo(40 + contentWidth, y).strokeColor('#2c6e4f').lineWidth(1.5).stroke();
      y += 10;

      // Table rows
      doc.font('Helvetica').fontSize(10).fill('#333333');
      parsedItems.forEach((item) => {
        const qty = item.quantity || 1;
        const price = parseFloat(item.price) || 0;
        const total = parseFloat(item.total) || (price * qty);

        doc.fill('#2c6e4f').text(String(qty), 50, y, { width: 60, align: 'center' });
        doc.fill('#333333').text(item.description || '', 120, y, { width: 200, align: 'left' });
        doc.text(`\u20AC${price.toFixed(2)}`, 330, y, { width: 100, align: 'right' });
        doc.text(`\u20AC${total.toFixed(2)}`, 440, y, { width: 100, align: 'right' });

        y += 24;
        doc.moveTo(40, y - 4).lineTo(40 + contentWidth, y - 4).strokeColor('#eeeeee').lineWidth(0.5).stroke();
      });

      // ===== TOTALS SECTION =====
      y += 20;
      const totalsX = 330;
      const totalsValX = 440;
      const totalsW = 100;

      doc.fontSize(10).fill('#666666').font('Helvetica');
      doc.text('Subtotaal (excl. BTW)', totalsX, y);
      doc.text(`\u20AC${subtotalExcl.toFixed(2)}`, totalsValX, y, { width: totalsW, align: 'right' });
      y += 20;

      doc.text('BTW 21%', totalsX, y);
      doc.text(`\u20AC${btwAmount.toFixed(2)}`, totalsValX, y, { width: totalsW, align: 'right' });
      y += 20;

      // Total line
      doc.moveTo(totalsX, y).lineTo(totalsValX + totalsW, y).strokeColor('#333333').lineWidth(1.5).stroke();
      y += 8;

      doc.fontSize(13).fill('#1a1a1a').font('Helvetica-Bold');
      doc.text('Totaal (incl. BTW)', totalsX, y);
      doc.text(`\u20AC${totalIncl.toFixed(2)}`, totalsValX, y, { width: totalsW, align: 'right' });
      y += 16;

      doc.fontSize(8).fill('#888888').font('Helvetica');
      doc.text('Alle bedragen zijn inclusief 21% BTW', totalsX, y);

      // ===== FOOTER =====
      const footerY = doc.page.height - 80;
      doc.save();
      doc.rect(0, footerY, pageWidth, 80).fill('#e8f5e9');
      doc.restore();

      doc.fontSize(10).fill('#333333').font('Helvetica-Bold');
      doc.text('Varexo', 40, footerY + 15);
      doc.fontSize(9).fill('#555555').font('Helvetica');
      doc.text('t.n.v. Mohammed Taher', 40, footerY + 30);
      doc.text('IBAN: NL75INGB0756428726', 40, footerY + 45);
      doc.text('BTW: 21% inbegrepen', 40, footerY + 60);

      doc.fontSize(9).fill('#555555').font('Helvetica');
      doc.text('Betalingsvoorwaarden:', rightX, footerY + 15, { align: 'right', width: 160 });
      doc.text('Betaling binnen 14 dagen', rightX, footerY + 30, { align: 'right', width: 160 });
      doc.text('info@varexo.nl', rightX, footerY + 45, { align: 'right', width: 160 });

      // Finalize PDF
      doc.end();

    } catch (error) {
      console.error('PDF Generation error:', error);
      reject(error);
    }
  });
}

module.exports = { generateInvoicePDF };
