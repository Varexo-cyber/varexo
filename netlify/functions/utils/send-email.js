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
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin:0;padding:0;background:#f4f6f8;font-family:'Segoe UI',Arial,sans-serif;">
        <div style="max-width:600px;margin:40px auto;background:white;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">
          
          <!-- Header -->
          <div style="background:linear-gradient(135deg,#1a3050 0%,#2a5a8c 100%);padding:30px 40px;text-align:center;">
            <h1 style="margin:0;color:white;font-size:28px;font-weight:700;letter-spacing:2px;">VAREXO</h1>
            <p style="margin:4px 0 0;color:#7cb8d4;font-size:11px;letter-spacing:2px;">ICT &bull; WEBSITES &bull; SOFTWARE</p>
          </div>

          <!-- Content -->
          <div style="padding:40px;">
            <h2 style="margin:0 0 20px;color:#1a3050;font-size:22px;font-weight:600;">${title}</h2>
            ${content}
            
            ${ctaText && ctaUrl ? `
              <div style="text-align:center;margin:30px 0;">
                <a href="${ctaUrl}" style="display:inline-block;background:linear-gradient(135deg,#2a5a8c,#1a3050);color:white;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:600;font-size:15px;">
                  ${ctaText}
                </a>
              </div>
            ` : ''}
          </div>

          <!-- Footer -->
          <div style="background:#f8f9fa;padding:24px 40px;border-top:1px solid #eee;">
            <p style="margin:0;color:#666;font-size:12px;line-height:1.6;">
              <strong>Varexo</strong><br>
              Regulierenstraat 10, 2694BA 's-Gravenzande<br>
              +31 6 36075966 | info@varexo.nl
            </p>
            <p style="margin:12px 0 0;color:#999;font-size:11px;">
              Dit is een automatisch bericht vanuit het Varexo klantenportaal.
            </p>
          </div>
        </div>
      </body>
    </html>
  `;
}

async function sendEmail(to, subject, title, content, ctaText, ctaUrl) {
  // Skip if SMTP not configured
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log('Email skipped: SMTP not configured');
    return false;
  }

  try {
    const transporter = createTransporter();
    await transporter.sendMail({
      from: `"Varexo" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html: emailTemplate(title, content, ctaText, ctaUrl),
    });
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
    <p style="color:#333;font-size:15px;line-height:1.7;">
      Beste ${customerName || 'klant'},
    </p>
    <p style="color:#333;font-size:15px;line-height:1.7;">
      Er is een nieuw project voor u aangemaakt:
    </p>
    <div style="background:#f0f7ff;border-left:4px solid #2a5a8c;padding:16px 20px;border-radius:0 8px 8px 0;margin:20px 0;">
      <p style="margin:0;color:#1a3050;font-size:18px;font-weight:600;">${projectTitle}</p>
    </div>
    <p style="color:#333;font-size:15px;line-height:1.7;">
      Ga naar uw klantenportaal om de details te bekijken en de voortgang te volgen.
    </p>
  `;
  return sendEmail(customerEmail, `Nieuw project: ${projectTitle}`, 'Nieuw Project Aangemaakt', content, 'Ga naar uw Klantenportaal', `${PORTAL_URL}/login`);
}

async function sendProjectDeletedEmail(customerEmail, customerName, projectTitle) {
  const content = `
    <p style="color:#333;font-size:15px;line-height:1.7;">
      Beste ${customerName || 'klant'},
    </p>
    <p style="color:#333;font-size:15px;line-height:1.7;">
      Het volgende project is verwijderd:
    </p>
    <div style="background:#fff5f5;border-left:4px solid #dc3545;padding:16px 20px;border-radius:0 8px 8px 0;margin:20px 0;">
      <p style="margin:0;color:#333;font-size:18px;font-weight:600;">${projectTitle}</p>
    </div>
    <p style="color:#333;font-size:15px;line-height:1.7;">
      Heeft u vragen? Neem gerust contact met ons op.
    </p>
  `;
  return sendEmail(customerEmail, `Project verwijderd: ${projectTitle}`, 'Project Verwijderd', content, null, null);
}

async function sendNewInvoiceEmail(customerEmail, customerName, invoiceNumber, amount) {
  const content = `
    <p style="color:#333;font-size:15px;line-height:1.7;">
      Beste ${customerName || 'klant'},
    </p>
    <p style="color:#333;font-size:15px;line-height:1.7;">
      Er staat een nieuwe factuur voor u klaar:
    </p>
    <div style="background:#f0f7ff;border-left:4px solid #2a5a8c;padding:16px 20px;border-radius:0 8px 8px 0;margin:20px 0;">
      <p style="margin:0 0 8px;color:#1a3050;font-size:16px;font-weight:600;">Factuur ${invoiceNumber}</p>
      <p style="margin:0;color:#333;font-size:20px;font-weight:700;">&euro;${parseFloat(amount).toFixed(2)} <span style="font-size:13px;font-weight:400;color:#666;">(incl. 21% BTW)</span></p>
    </div>
    <p style="color:#333;font-size:15px;line-height:1.7;">
      Ga naar uw klantenportaal om de factuur te bekijken.
    </p>
  `;
  return sendEmail(customerEmail, `Nieuwe factuur: ${invoiceNumber}`, 'Nieuwe Factuur', content, 'Bekijk Factuur in Portaal', `${PORTAL_URL}/login`);
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
    <p style="color:#333;font-size:15px;line-height:1.7;">
      Beste ${customerName || 'klant'},
    </p>
    <p style="color:#333;font-size:15px;line-height:1.7;">
      Er is een nieuwe update voor uw project <strong>${projectTitle}</strong>:
    </p>
    <div style="background:#f0f7ff;border-left:4px solid #2a5a8c;padding:16px 20px;border-radius:0 8px 8px 0;margin:20px 0;">
      <p style="margin:0 0 4px;color:#5a9ec4;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:1px;">${typeLabel}</p>
      <p style="margin:0 0 8px;color:#1a3050;font-size:18px;font-weight:600;">${updateTitle}</p>
      ${updateDescription ? `<p style="margin:0;color:#555;font-size:14px;line-height:1.6;">${updateDescription}</p>` : ''}
    </div>
    <p style="color:#333;font-size:15px;line-height:1.7;">
      Ga naar uw klantenportaal om alle details en de voortgang te bekijken.
    </p>
  `;
  return sendEmail(customerEmail, `Update: ${projectTitle} - ${updateTitle}`, 'Project Update', content, 'Bekijk Voortgang', `${PORTAL_URL}/login`);
}

async function sendProgressUpdateEmail(customerEmail, customerName, projectTitle, progress) {
  const content = `
    <p style="color:#333;font-size:15px;line-height:1.7;">
      Beste ${customerName || 'klant'},
    </p>
    <p style="color:#333;font-size:15px;line-height:1.7;">
      De voortgang van uw project is bijgewerkt:
    </p>
    <div style="background:#f0f7ff;border-left:4px solid #2a5a8c;padding:16px 20px;border-radius:0 8px 8px 0;margin:20px 0;">
      <p style="margin:0 0 12px;color:#1a3050;font-size:18px;font-weight:600;">${projectTitle}</p>
      <div style="background:#e0e0e0;border-radius:10px;height:20px;overflow:hidden;">
        <div style="background:linear-gradient(90deg,#2a5a8c,#5a9ec4);height:100%;width:${progress}%;border-radius:10px;"></div>
      </div>
      <p style="margin:8px 0 0;color:#333;font-size:16px;font-weight:600;text-align:center;">${progress}% voltooid</p>
    </div>
    <p style="color:#333;font-size:15px;line-height:1.7;">
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
