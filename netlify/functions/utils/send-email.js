const nodemailer = require('nodemailer');

const PORTAL_URL = process.env.PORTAL_URL || 'https://varexo.nl';

function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

function emailTemplate(title, content, ctaText, ctaUrl) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
    </head>
    <body style="margin:0;padding:20px;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;background:#f5f5f5;">
      <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,0.08);overflow:hidden;border:1px solid #e0e0e0;">
        
        <!-- Header - Dark style like website navbar -->
        <div style="background:#0f172a;padding:24px 40px;text-align:center;border-radius:12px 12px 0 0;">
          <table cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;">
            <tr>
              <td style="vertical-align:middle;padding-right:4px;">
                <div style="display:inline-block;width:38px;height:38px;background:linear-gradient(135deg,#4fc3f7 0%,#1565c0 100%);border-radius:8px;text-align:center;line-height:38px;">
                  <span style="color:#ffffff;font-size:24px;font-weight:900;font-family:Arial,Helvetica,sans-serif;">V</span>
                </div>
              </td>
              <td style="vertical-align:middle;padding-left:8px;">
                <span style="color:#ffffff;font-size:22px;font-weight:800;letter-spacing:2px;font-family:Arial,Helvetica,sans-serif;">VAREXO</span>
              </td>
            </tr>
          </table>
          <p style="color:#10b981;font-size:11px;margin:10px 0 0;letter-spacing:2.5px;text-transform:uppercase;font-family:Arial,Helvetica,sans-serif;">ICT &bull; Websites &bull; Software</p>
        </div>
        
        <!-- Title bar -->
        <div style="background:#ffffff;padding:24px 40px 0;text-align:center;border-bottom:none;">
          <h1 style="color:#1a1a1a;font-size:22px;font-weight:600;margin:0;letter-spacing:0.5px;">${title}</h1>
        </div>

        <!-- Content -->
        <div style="padding:40px 40px 20px;background:#ffffff;">
          ${content}
        </div>

        <!-- CTA Button -->
        ${ctaText && ctaUrl ? `
        <div style="padding:0 40px 40px;text-align:center;background:#ffffff;">
          <a href="${ctaUrl}" style="display:inline-block;background:#10b981;color:#ffffff;padding:14px 28px;text-decoration:none;border-radius:8px;font-weight:600;font-size:15px;box-shadow:0 4px 12px rgba(16,185,129,0.25);">
            ${ctaText}
          </a>
        </div>
        ` : ''}

        <!-- Footer -->
        <div style="background:#f8f9fa;padding:24px 40px;border-top:1px solid #e9ecef;">
          <p style="margin:0;color:#6c757d;font-size:13px;line-height:1.6;text-align:center;">
            <strong style="color:#10b981;">Varexo</strong><br>
            Regulierenstraat 10, 2694BA 's-Gravenzande<br>
            <a href="mailto:info@varexo.nl" style="color:#10b981;text-decoration:none;">info@varexo.nl</a>
          </p>
          <p style="margin:12px 0 0;color:#adb5bd;font-size:11px;text-align:center;">
            Dit is een automatisch bericht vanuit het Varexo klantenportaal.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

async function sendEmail(to, subject, title, content, ctaText, ctaUrl, attachments) {
  // Skip if SMTP not configured
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log('Email skipped: SMTP not configured');
    return false;
  }

  try {
    const transporter = createTransporter();
    const mailOptions = {
      from: `"Varexo" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html: emailTemplate(title, content, ctaText, ctaUrl),
    };
    if (attachments && attachments.length > 0) {
      console.log('Adding attachments:', attachments.map(a => a.filename));
      mailOptions.attachments = attachments;
    } else {
      console.log('No attachments to send');
    }
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}: ${subject}`);
    return true;
  } catch (error) {
    console.error('Email error:', error.message);
    return false;
  }
}

// --- Specific notification emails ---

async function sendNewProjectEmail(customerEmail, customerName, projectTitle) {
  const content = `
    <p style="color:#333333;font-size:16px;line-height:1.7;margin-bottom:16px;">
      Beste ${customerName || 'klant'},
    </p>
    <p style="color:#555555;font-size:16px;line-height:1.7;margin-bottom:24px;">
      Er is een nieuw project voor u aangemaakt:
    </p>
    <div style="background:#f0fdf4;border-left:4px solid #10b981;padding:16px 20px;border-radius:0 8px 8px 0;margin:20px 0;">
      <p style="margin:0;color:#059669;font-size:18px;font-weight:600;">${projectTitle}</p>
    </div>
    <p style="color:#555555;font-size:16px;line-height:1.7;">
      Ga naar uw klantenportaal om de details te bekijken en de voortgang te volgen.
    </p>
  `;
  return sendEmail(customerEmail, `Nieuw project: ${projectTitle}`, 'Nieuw Project Aangemaakt', content, 'Ga naar uw Klantenportaal', `${PORTAL_URL}/login`);
}

async function sendProjectDeletedEmail(customerEmail, customerName, projectTitle) {
  const content = `
    <p style="color:#333333;font-size:16px;line-height:1.7;margin-bottom:16px;">
      Beste ${customerName || 'klant'},
    </p>
    <p style="color:#555555;font-size:16px;line-height:1.7;margin-bottom:24px;">
      Het volgende project is verwijderd:
    </p>
    <div style="background:#fef2f2;border-left:4px solid #ef4444;padding:16px 20px;border-radius:0 8px 8px 0;margin:20px 0;">
      <p style="margin:0;color:#dc2626;font-size:18px;font-weight:600;">${projectTitle}</p>
    </div>
    <p style="color:#555555;font-size:16px;line-height:1.7;">
      Heeft u vragen? Neem gerust contact met ons op.
    </p>
  `;
  return sendEmail(customerEmail, `Project verwijderd: ${projectTitle}`, 'Project Verwijderd', content, null, null);
}

async function sendNewInvoiceEmail(customerEmail, customerName, invoiceNumber, amount, invoiceData) {
  const dueDate = invoiceData?.dueDate ? new Date(invoiceData.dueDate).toLocaleDateString('nl-NL') : '14 dagen na factuurdatum';
  
  const content = `
    <p style="color:#333333;font-size:16px;line-height:1.7;margin-bottom:16px;">
      Beste ${customerName || 'klant'},
    </p>
    <p style="color:#555555;font-size:16px;line-height:1.7;margin-bottom:24px;">
      Er staat een nieuwe factuur voor u klaar. Gelieve deze binnen de gestelde termijn te voldoen.
    </p>
    <div style="background:#f0fdf4;border-left:4px solid #10b981;padding:20px;border-radius:0 8px 8px 0;margin:20px 0;">
      <p style="margin:0 0 8px;color:#059669;font-size:16px;font-weight:600;">Factuur ${invoiceNumber}</p>
      <p style="margin:0 0 8px;color:#1a1a1a;font-size:28px;font-weight:700;">&euro;${parseFloat(amount).toFixed(2)} <span style="font-size:14px;font-weight:400;color:#6b7280;">(incl. 21% BTW)</span></p>
      <p style="margin:4px 0 0;color:#6b7280;font-size:14px;">Te betalen voor: <strong style="color:#d97706;">${dueDate}</strong></p>
    </div>
    <p style="color:#555555;font-size:16px;line-height:1.7;margin-bottom:12px;">
      De factuur vindt u als PDF in de bijlage van deze e-mail. 
    </p>
    <p style="color:#555555;font-size:16px;line-height:1.7;margin-bottom:12px;">
      U kunt betalen via bankoverschrijving naar:<br>
      <strong style="color:#1a1a1a;">IBAN: NL75INGB0756428726</strong><br>
      <strong style="color:#1a1a1a;">t.n.v. Mohammed Taher</strong>
    </p>
    <p style="color:#555555;font-size:16px;line-height:1.7;">
      Bekijk uw klantenportaal voor meer informatie en het overzicht van al uw facturen.
    </p>
  `;

  // Generate PDF attachment
  let attachments = [];
  try {
    console.log('Starting PDF generation for invoice:', invoiceNumber);
    const { generateInvoicePDF } = require('./generate-invoice-pdf');
    const pdfBuffer = await generateInvoicePDF({
      invoiceNumber,
      invoiceDate: invoiceData?.invoiceDate || new Date().toISOString(),
      customerName: invoiceData?.customerName || customerName || '',
      customerCompany: invoiceData?.customerCompany || '',
      customerAddress: invoiceData?.customerAddress || '',
      customerPostal: invoiceData?.customerPostal || '',
      customerCity: invoiceData?.customerCity || '',
      customerEmail,
      customerPhone: invoiceData?.customerPhone || '',
      items: invoiceData?.items || [],
      amount,
    });
    console.log('PDF generated successfully, size:', pdfBuffer.length);
    attachments = [{
      filename: `Factuur-${invoiceNumber}.pdf`,
      content: pdfBuffer,
      contentType: 'application/pdf',
    }];
  } catch (pdfErr) {
    console.error('PDF generation failed, sending without attachment:', pdfErr);
    console.error('PDF error stack:', pdfErr.stack);
  }

  return sendEmail(
    customerEmail,
    `Nieuwe factuur: ${invoiceNumber}`,
    'Nieuwe Factuur',
    content,
    'Bekijk Klantenportaal',
    `${PORTAL_URL}/login`,
    attachments
  );
}

async function sendProjectUpdateEmail(customerEmail, customerName, projectTitle, updateTitle, updateDescription, logType) {
  const typeLabels = {
    milestone: 'Mijlpaal bereikt',
    feature: 'Nieuwe functie',
    bugfix: 'Bugfix',
    design: 'Design update',
    deployment: 'Deployment',
    update: 'Project update',
  };
  const typeLabel = typeLabels[logType] || 'Project update';

  const content = `
    <p style="color:#333333;font-size:16px;line-height:1.7;margin-bottom:16px;">
      Beste ${customerName || 'klant'},
    </p>
    <p style="color:#555555;font-size:16px;line-height:1.7;margin-bottom:24px;">
      Er is een nieuwe update voor uw project <strong style="color:#059669;">${projectTitle}</strong>:
    </p>
    <div style="background:#f0fdf4;border-left:4px solid #10b981;padding:16px 20px;border-radius:0 8px 8px 0;margin:20px 0;">
      <p style="margin:0 0 4px;color:#10b981;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:1px;">${typeLabel}</p>
      <p style="margin:0 0 8px;color:#1a1a1a;font-size:18px;font-weight:600;">${updateTitle}</p>
      ${updateDescription ? `<p style="margin:0;color:#555555;font-size:15px;line-height:1.6;">${updateDescription}</p>` : ''}
    </div>
    <p style="color:#555555;font-size:16px;line-height:1.7;">
      Ga naar uw klantenportaal om alle details en de voortgang te bekijken.
    </p>
  `;
  return sendEmail(customerEmail, `Update: ${projectTitle} - ${updateTitle}`, 'Project Update', content, 'Bekijk Voortgang', `${PORTAL_URL}/login`);
}

async function sendProgressUpdateEmail(customerEmail, customerName, projectTitle, progress) {
  const content = `
    <p style="color:#333333;font-size:16px;line-height:1.7;margin-bottom:16px;">
      Beste ${customerName || 'klant'},
    </p>
    <p style="color:#555555;font-size:16px;line-height:1.7;margin-bottom:24px;">
      De voortgang van uw project is bijgewerkt:
    </p>
    <div style="background:#f0fdf4;border-left:4px solid #10b981;padding:16px 20px;border-radius:0 8px 8px 0;margin:20px 0;">
      <p style="margin:0 0 12px;color:#059669;font-size:18px;font-weight:600;">${projectTitle}</p>
      <div style="background:#e5e7eb;border-radius:10px;height:20px;overflow:hidden;">
        <div style="background:linear-gradient(90deg,#059669,#10b981);height:100%;width:${progress}%;border-radius:10px;"></div>
      </div>
      <p style="margin:12px 0 0;color:#1a1a1a;font-size:16px;font-weight:600;text-align:center;">${progress}% voltooid</p>
    </div>
    <p style="color:#555555;font-size:16px;line-height:1.7;">
      Ga naar uw klantenportaal voor meer details.
    </p>
  `;
  return sendEmail(customerEmail, `Voortgang: ${projectTitle} - ${progress}%`, 'Voortgang Bijgewerkt', content, 'Bekijk Voortgang', `${PORTAL_URL}/login`);
}

module.exports = {
  sendNewProjectEmail,
  sendProjectDeletedEmail,
  sendNewInvoiceEmail,
  sendProjectUpdateEmail,
  sendProgressUpdateEmail,
};
