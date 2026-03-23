const PDFDocument = require('pdfkit');

function generateInvoicePDF(invoiceData) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: 'A4', margin: 50 });
      const chunks = [];

      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

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

      // ===== HEADER =====
      // Blue header background
      doc.rect(0, 0, 595, 140).fill('#1a3a5c');

      // VAREXO text
      doc.fontSize(28).font('Helvetica-Bold').fillColor('#ffffff')
        .text('VAREXO', 400, 35, { width: 160, align: 'right' });
      doc.fontSize(8).font('Helvetica').fillColor('#7cb8d4')
        .text('ICT  •  WEBSITES  •  SOFTWARE', 400, 65, { width: 160, align: 'right' });

      // FACTUUR title
      doc.fontSize(32).font('Helvetica-Bold').fillColor('#ffffff')
        .text('FACTUUR', 50, 40);

      // Invoice info in header
      doc.fontSize(9).font('Helvetica-Bold').fillColor('#b0d4e8')
        .text('DATUM', 50, 90);
      doc.fontSize(11).font('Helvetica').fillColor('#ffffff')
        .text(dateStr, 50, 104);

      doc.fontSize(9).font('Helvetica-Bold').fillColor('#b0d4e8')
        .text('FACTUURNUMMER', 200, 90);
      doc.fontSize(11).font('Helvetica').fillColor('#ffffff')
        .text(invoiceNumber || '', 200, 104);

      // ===== COMPANY INFO (right side under header) =====
      doc.fontSize(9).font('Helvetica-Bold').fillColor('#1a3a5c')
        .text('Varexo', 400, 155, { width: 160, align: 'right' });
      doc.fontSize(8).font('Helvetica').fillColor('#666666')
        .text('Regulierenstraat 10', 400, 168, { width: 160, align: 'right' })
        .text("2694BA 's-Gravenzande", 400, 179, { width: 160, align: 'right' })
        .text('info@varexo.nl', 400, 190, { width: 160, align: 'right' });

      // ===== CUSTOMER INFO =====
      doc.fontSize(9).font('Helvetica-Bold').fillColor('#1a3a5c')
        .text('FACTUUR AAN:', 50, 155);
      
      let yPos = 170;
      doc.fontSize(10).font('Helvetica').fillColor('#333333');
      if (customerCompany) {
        doc.font('Helvetica-Bold').text(customerCompany, 50, yPos);
        yPos += 14;
        doc.font('Helvetica');
      }
      if (customerName) { doc.text(customerName, 50, yPos); yPos += 14; }
      if (customerAddress) { doc.text(customerAddress, 50, yPos); yPos += 14; }
      if (customerPostal || customerCity) { 
        doc.text(`${customerPostal || ''} ${customerCity || ''}`.trim(), 50, yPos); 
        yPos += 14; 
      }
      if (customerEmail) { 
        doc.fillColor('#2a5a8c').text(customerEmail, 50, yPos); 
        yPos += 14; 
      }

      // ===== ITEMS TABLE =====
      const tableTop = Math.max(yPos + 30, 240);

      // Table header
      doc.rect(50, tableTop, 495, 25).fill('#f0f4f8');
      doc.fontSize(8).font('Helvetica-Bold').fillColor('#1a3a5c');
      doc.text('AANTAL', 55, tableTop + 8, { width: 50 });
      doc.text('OMSCHRIJVING', 110, tableTop + 8, { width: 230 });
      doc.text('PRIJS', 350, tableTop + 8, { width: 80, align: 'right' });
      doc.text('TOTAAL', 440, tableTop + 8, { width: 100, align: 'right' });

      // Table rows
      let rowY = tableTop + 30;
      const parsedItems = typeof items === 'string' ? JSON.parse(items) : (items || []);
      
      doc.font('Helvetica').fontSize(9).fillColor('#333333');
      parsedItems.forEach((item) => {
        const price = parseFloat(item.price) || 0;
        const qty = parseInt(item.quantity) || 1;
        const total = parseFloat(item.total) || (price * qty);
        
        doc.text(String(qty), 55, rowY, { width: 50 });
        doc.text(item.description || '', 110, rowY, { width: 230 });
        doc.text(`€${price.toFixed(2)}`, 350, rowY, { width: 80, align: 'right' });
        doc.text(`€${total.toFixed(2)}`, 440, rowY, { width: 100, align: 'right' });
        
        // Row separator
        rowY += 20;
        doc.moveTo(50, rowY).lineTo(545, rowY).strokeColor('#eeeeee').lineWidth(0.5).stroke();
        rowY += 8;
      });

      // ===== TOTALS =====
      const totalsY = rowY + 20;
      
      doc.fontSize(9).font('Helvetica').fillColor('#666666');
      doc.text('Subtotaal (excl. BTW)', 350, totalsY, { width: 100, align: 'right' });
      doc.text(`€${subtotalExcl.toFixed(2)}`, 455, totalsY, { width: 85, align: 'right' });

      doc.text('BTW 21%', 350, totalsY + 18, { width: 100, align: 'right' });
      doc.text(`€${btwAmount.toFixed(2)}`, 455, totalsY + 18, { width: 85, align: 'right' });

      // Total line
      doc.moveTo(350, totalsY + 38).lineTo(545, totalsY + 38).strokeColor('#1a3a5c').lineWidth(1.5).stroke();

      doc.fontSize(12).font('Helvetica-Bold').fillColor('#1a3a5c');
      doc.text('Totaal (incl. BTW)', 350, totalsY + 45, { width: 100, align: 'right' });
      doc.text(`€${totalIncl.toFixed(2)}`, 455, totalsY + 45, { width: 85, align: 'right' });

      doc.fontSize(8).font('Helvetica').fillColor('#999999')
        .text('Alle bedragen zijn inclusief 21% BTW', 350, totalsY + 65, { width: 190, align: 'right' });

      // ===== FOOTER =====
      const footerY = 750;
      doc.rect(0, footerY, 595, 100).fill('#1a3a5c');
      
      doc.fontSize(9).font('Helvetica-Bold').fillColor('#ffffff')
        .text('Varexo', 400, footerY + 15, { width: 160, align: 'right' });
      doc.fontSize(8).font('Helvetica').fillColor('#b0d4e8')
        .text('t.n.v. Mohammed Taher', 400, footerY + 28, { width: 160, align: 'right' })
        .text('IBAN: NL75INGB0756428726', 400, footerY + 40, { width: 160, align: 'right' })
        .text('BTW: 21% inbegrepen', 400, footerY + 52, { width: 160, align: 'right' });

      doc.fontSize(8).font('Helvetica').fillColor('#7cb8d4')
        .text('Betaling binnen 14 dagen', 50, footerY + 15);

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = { generateInvoicePDF };
