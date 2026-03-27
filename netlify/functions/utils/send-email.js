const nodemailer = require('nodemailer');
const { neon } = require('@netlify/neon');

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

// Check if user has email notifications enabled
async function shouldSendEmail(email) {
  try {
    // Use simplified connection string
    const dbUrl = process.env.DATABASE_URL.replace('&channel_binding=require', '');
    const sql = neon(dbUrl);
    const result = await sql`SELECT email_notifications FROM users WHERE email = ${email}`;
    if (result.length === 0) return false;
    return result[0].email_notifications !== false;
  } catch (error) {
    console.error('Database check failed:', error);
    return true; // Default to sending if can't check
  }
}

function emailTemplate(title, content, ctaText, ctaUrl) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800&display=swap" rel="stylesheet">
    </head>
    <body style="margin:0;padding:20px;font-family:'Poppins','Segoe UI',Tahoma,Geneva,Verdana,sans-serif;background:#f5f5f5;">
      <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,0.08);overflow:hidden;border:1px solid #e0e0e0;">
        
        <!-- Header - Dark style like website navbar -->
        <div style="background:#0f172a;padding:28px 40px;text-align:center;border-radius:12px 12px 0 0;">
          <img src="${PORTAL_URL}/varexo-logo.svg" alt="VAREXO - ICT • Websites • Software" width="180" height="50" style="display:block;margin:0 auto;" />
        </div>
        
        <!-- Title bar -->
        <div style="background:linear-gradient(135deg, #0f172a 0%, #1e293b 100%);padding:32px 40px;text-align:center;border-bottom:3px solid #10b981;">
          <h1 style="color:#10b981;font-size:26px;font-weight:800;margin:0;letter-spacing:0.5px;text-transform:uppercase;text-shadow:0 0 20px rgba(16,185,129,0.4), 0 0 40px rgba(16,185,129,0.2);">${title}</h1>
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
        <div style="background:linear-gradient(135deg,#0f172a 0%,#1e293b 100%);padding:32px 40px;border-top:3px solid #10b981;">
          <!-- Company Info -->
          <div style="text-align:center;margin-bottom:20px;">
            <p style="margin:0 0 8px;color:#10b981;font-size:18px;font-weight:700;letter-spacing:1px;">VAREXO</p>
            <p style="margin:0;color:#94a3b8;font-size:14px;font-weight:500;">Mohammed Taher</p>
            <p style="margin:4px 0 0;color:#64748b;font-size:12px;">Webdesign, Webshops & Social Media</p>
          </div>
          
          <!-- Contact Details -->
          <div style="background:rgba(16,185,129,0.1);border-radius:12px;padding:16px;margin-bottom:20px;border:1px solid rgba(16,185,129,0.2);">
            <table style="width:100%;border-collapse:collapse;">
              <tr>
                <td style="padding:6px 0;color:#94a3b8;font-size:13px;width:50%;">📍 Regulierenstraat 10</td>
                <td style="padding:6px 0;color:#94a3b8;font-size:13px;width:50%;">📞 <a href="tel:+31636075966" style="color:#10b981;text-decoration:none;">+31 6 36075966</a></td>
              </tr>
              <tr>
                <td style="padding:6px 0;color:#94a3b8;font-size:13px;">2694BA 's-Gravenzande</td>
                <td style="padding:6px 0;color:#94a3b8;font-size:13px;">✉️ <a href="mailto:info@varexo.nl" style="color:#10b981;text-decoration:none;">info@varexo.nl</a></td>
              </tr>
            </table>
          </div>
          
          <!-- Legal Info -->
          <div style="text-align:center;margin-bottom:16px;">
            <p style="margin:0;color:#64748b;font-size:11px;line-height:1.6;">
              KvK: [Later Invullen] | BTW: [Later Invullen]
            </p>
          </div>
          
          <!-- Divider -->
          <div style="border-top:1px solid #334155;margin:16px 0;"></div>
          
          <!-- Auto Message Notice -->
          <p style="margin:0;color:#475569;font-size:11px;text-align:center;font-style:italic;">
            Dit is een automatisch bericht vanuit het Varexo klantenportaal.
          </p>
          
          <!-- Copyright -->
          <p style="margin:12px 0 0;color:#334155;font-size:10px;text-align:center;">
            © 2026 Varexo. Alle rechten voorbehouden.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

async function sendEmail(to, subject, title, content, ctaText, ctaUrl, attachments) {
  // Check if user wants to receive emails
  const shouldSend = await shouldSendEmail(to);
  if (!shouldSend) {
    console.log(`Email skipped: ${to} has disabled notifications`);
    return false;
  }
  
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
  return sendEmail(customerEmail, `Nieuw project: ${projectTitle}`, 'Nieuw Project Aangemaakt', content, 'Ga naar uw Klantenportaal', `${PORTAL_URL}/dashboard`);
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
    `${PORTAL_URL}/dashboard`,
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
  return sendEmail(customerEmail, `Update: ${projectTitle} - ${updateTitle}`, 'Project Update', content, 'Bekijk Voortgang', `${PORTAL_URL}/dashboard`);
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
  return sendEmail(customerEmail, `Voortgang: ${projectTitle} - ${progress}%`, 'Voortgang Bijgewerkt', content, 'Bekijk Voortgang', `${PORTAL_URL}/dashboard`);
}

async function sendPaymentConfirmationEmail(customerEmail, customerName, invoiceNumber, amount) {
  const content = `
    <p style="color:#333333;font-size:16px;line-height:1.7;margin-bottom:16px;">
      Beste ${customerName || 'klant'},
    </p>
    <p style="color:#555555;font-size:16px;line-height:1.7;margin-bottom:24px;">
      Hartelijk dank! Wij hebben uw betaling succesvol ontvangen.
    </p>
    <div style="background:#f0fdf4;border-left:4px solid #10b981;padding:20px;border-radius:0 8px 8px 0;margin:20px 0;">
      <p style="margin:0 0 8px;color:#059669;font-size:16px;font-weight:600;">Factuur ${invoiceNumber}</p>
      <p style="margin:0;color:#1a1a1a;font-size:24px;font-weight:700;">&euro;${parseFloat(amount).toFixed(2)}</p>
      <p style="margin:8px 0 0;color:#10b981;font-size:14px;font-weight:600;">[BETAALD]</p>
    </div>
    <p style="color:#555555;font-size:16px;line-height:1.7;margin-bottom:12px;">
      Uw betaling is geregistreerd en de factuur is volledig afgehandeld.
    </p>
    <p style="color:#555555;font-size:16px;line-height:1.7;">
      Bekijk uw klantenportaal voor het overzicht van al uw facturen.
    </p>
  `;
  return sendEmail(customerEmail, `Betaling ontvangen - Factuur ${invoiceNumber}`, 'Betaling Succesvol Ontvangen', content, 'Bekijk Klantenportaal', `${PORTAL_URL}/dashboard`);
}

async function sendOverdueReminderEmail(customerEmail, customerName, invoiceNumber, amount, dueDate) {
  const dueDateFormatted = dueDate ? new Date(dueDate).toLocaleDateString('nl-NL') : 'Onbekend';
  const daysOverdue = dueDate ? Math.ceil((new Date() - new Date(dueDate)) / (1000 * 60 * 60 * 24)) : 0;
  
  const content = `
    <p style="color:#333333;font-size:16px;line-height:1.7;margin-bottom:16px;">
      Beste ${customerName || 'klant'},
    </p>
    <p style="color:#555555;font-size:16px;line-height:1.7;margin-bottom:24px;">
      <strong style="color:#dc2626;">Uw factuur is te laat met betalen.</strong>
    </p>
    <div style="background:#fef2f2;border-left:4px solid #ef4444;padding:20px;border-radius:0 8px 8px 0;margin:20px 0;">
      <p style="margin:0 0 8px;color:#dc2626;font-size:16px;font-weight:600;">Factuur ${invoiceNumber}</p>
      <p style="margin:0;color:#1a1a1a;font-size:24px;font-weight:700;">&euro;${parseFloat(amount).toFixed(2)}</p>
      <p style="margin:8px 0 0;color:#dc2626;font-size:14px;font-weight:600;">[TE LAAT] - ${daysOverdue} dagen over datum</p>
      <p style="margin:4px 0 0;color:#6b7280;font-size:13px;">Was vervallen op: ${dueDateFormatted}</p>
    </div>
    <p style="color:#555555;font-size:16px;line-height:1.7;margin-bottom:12px;">
      <strong style="color:#dc2626;">Betaal nu nog om verdere maatregelen te voorkomen.</strong>
    </p>
    <p style="color:#555555;font-size:16px;line-height:1.7;margin-bottom:12px;">
      U kunt betalen via bankoverschrijving naar:<br>
      <strong style="color:#1a1a1a;">IBAN: NL75INGB0756428726</strong><br>
      <strong style="color:#1a1a1a;">t.n.v. Mohammed Taher</strong><br>
      <strong style="color:#1a1a1a;">Onder vermelding van: ${invoiceNumber}</strong>
    </p>
    <p style="color:#555555;font-size:16px;line-height:1.7;">
      Heeft u vragen? Neem contact met ons op via info@varexo.nl
    </p>
  `;
  return sendEmail(customerEmail, `HERINNERING: Factuur ${invoiceNumber} is te laat`, '[ACTIE VEREIST] Factuur Te Laat', content, 'Nu Betalen', `${PORTAL_URL}/dashboard`);
}

// Email notification toggle confirmations
async function sendEmailNotificationsEnabledEmail(customerEmail, customerName) {
  const content = `
    <p style="color:#333333;font-size:16px;line-height:1.7;margin-bottom:16px;">
      Beste ${customerName || 'klant'},
    </p>
    <p style="color:#555555;font-size:16px;line-height:1.7;margin-bottom:24px;">
      <strong style="color:#059669;">U heeft succesvol uw e-mailnotificaties aangezet!</strong> 🎉
    </p>
    <p style="color:#555555;font-size:16px;line-height:1.7;margin-bottom:24px;">
      Vanaf nu ontvangt u automatisch berichten over:
    </p>
    <ul style="color:#555555;font-size:16px;line-height:1.7;margin-bottom:24px;padding-left:24px;">
      <li>Nieuwe facturen en betalingsherinneringen</li>
      <li>Project updates en mijlpalen</li>
      <li>Belangrijke mededelingen over uw account</li>
      <li>Status wijzigingen van uw projecten</li>
    </ul>
    <div style="background:#f0fdf4;border-left:4px solid #10b981;padding:16px 20px;border-radius:0 8px 8px 0;margin:20px 0;">
      <p style="margin:0;color:#059669;font-size:15px;font-weight:500;">
        💡 <strong>Tip:</strong> U kunt uw notificatievoorkeuren altijd wijzigen in uw profiel instellingen.
      </p>
    </div>
  `;
  return sendEmail(customerEmail, 'E-mailnotificaties ingeschakeld', 'U ontvangt nu weer e-mailnotificaties', content, 'Ga naar uw Profiel', `${PORTAL_URL}/profile`);
}

async function sendEmailNotificationsDisabledEmail(customerEmail, customerName) {
  const content = `
    <p style="color:#333333;font-size:16px;line-height:1.7;margin-bottom:16px;">
      Beste ${customerName || 'klant'},
    </p>
    <p style="color:#555555;font-size:16px;line-height:1.7;margin-bottom:24px;">
      U heeft uw e-mailnotificaties <strong style="color:#dc2626;">uitgeschakeld</strong>.
    </p>
    <p style="color:#555555;font-size:16px;line-height:1.7;margin-bottom:24px;">
      <strong>Wat betekent dit?</strong>
    </p>
    <ul style="color:#555555;font-size:16px;line-height:1.7;margin-bottom:24px;padding-left:24px;">
      <li>U ontvangt <strong>geen</strong> automatische e-mails over facturen meer</li>
      <li>U ontvangt <strong>geen</strong> project updates via e-mail</li>
      <li>Belangrijke meldingen worden alleen in uw klantenportaal getoond</li>
    </ul>
    <div style="background:#fef2f2;border-left:4px solid #ef4444;padding:16px 20px;border-radius:0 8px 8px 0;margin:20px 0;">
      <p style="margin:0;color:#dc2626;font-size:15px;font-weight:500;">
        ⚠️ <strong>Let op:</strong> We raden aan om notificaties aan te houden zodat u niets mist!
      </p>
    </div>
    <p style="color:#555555;font-size:16px;line-height:1.7;margin-top:24px;">
      Om dit te wijzigen, gaat u naar <strong>Profiel beheren</strong> in uw klantenportaal:
    </p>
  `;
  
  // ALWAYS send this email - bypass the shouldSendEmail check
  // This is the LAST email the user will receive
  const title = 'Jammer om u te zien vertrekken...';
  const subject = 'E-mailnotificaties uitgeschakeld';
  
  // Skip if SMTP not configured
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log('Email skipped: SMTP not configured');
    return false;
  }

  try {
    const transporter = createTransporter();
    const mailOptions = {
      from: `"Varexo" <${process.env.SMTP_USER}>`,
      to: customerEmail,
      subject,
      html: emailTemplate(title, content, 'Notificaties weer inschakelen', `${PORTAL_URL}/profile`),
    };
    await transporter.sendMail(mailOptions);
    console.log(`DISABLED notification email sent to ${customerEmail}: ${subject}`);
    return true;
  } catch (error) {
    console.error('Email error:', error.message);
    return false;
  }
}

// Send password reset email
async function sendPasswordResetEmail(customerEmail, displayName, resetUrl, language = 'nl') {
  try {
    const transporter = createTransporter();
    const { SITE_URL, PORTAL_URL } = getUrls();
    
    // Bilingual content
    const content = {
      nl: {
        subject: '🔐 Wachtwoord reset aanvraag - Varexo',
        title: 'Wachtwoord vergeten?',
        greeting: `Hallo ${displayName},`,
        intro: 'Je hebt een wachtwoord reset aangevraagd voor je Varexo account. Klik op de onderstaande knop om een nieuw wachtwoord in te stellen:',
        button: 'Wachtwoord resetten',
        copyLink: 'Of kopieer deze link naar je browser:',
        warning: '⚠️ Belangrijk:',
        warningText: 'Deze link is 24 uur geldig en kan maar één keer gebruikt worden.',
        notRequested: 'Heb jij dit niet aangevraagd? Dan kan je deze email negeren. Je wachtwoord blijft dan ongewijzigd.',
        footerLink: 'Naar Varexo'
      },
      en: {
        subject: '🔐 Password reset request - Varexo',
        title: 'Forgot your password?',
        greeting: `Hello ${displayName},`,
        intro: 'You have requested a password reset for your Varexo account. Click the button below to set a new password:',
        button: 'Reset Password',
        copyLink: 'Or copy this link to your browser:',
        warning: '⚠️ Important:',
        warningText: 'This link is valid for 24 hours and can only be used once.',
        notRequested: "Didn't request this? You can ignore this email. Your password will remain unchanged.",
        footerLink: 'Go to Varexo'
      }
    };
    
    const lang = content[language] || content.nl;
    
    const emailContent = `
      <p style="font-size:16px;color:#e2e8f0;margin-bottom:24px;">${lang.greeting}</p>
      
      <p style="font-size:15px;color:#94a3b8;margin-bottom:24px;line-height:1.6;">
        ${lang.intro}
      </p>
      
      <div style="text-align:center;margin:32px 0;">
        <a href="${resetUrl}" style="background:linear-gradient(135deg,#10b981 0%,#059669 100%);color:#ffffff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:600;font-size:15px;display:inline-block;box-shadow:0 4px 14px rgba(16,185,129,0.3);">
          ${lang.button}
        </a>
      </div>
      
      <p style="font-size:13px;color:#64748b;margin-top:24px;line-height:1.6;">
        ${lang.copyLink}<br>
        <a href="${resetUrl}" style="color:#10b981;word-break:break-all;">${resetUrl}</a>
      </p>
      
      <div style="background:rgba(245,158,11,0.1);border-left:4px solid #f59e0b;padding:16px;margin-top:24px;border-radius:4px;">
        <p style="margin:0;color:#fbbf24;font-size:13px;">
          <strong>${lang.warning}</strong> ${lang.warningText}
        </p>
      </div>
      
      <p style="font-size:13px;color:#64748b;margin-top:24px;">
        ${lang.notRequested}
      </p>
    `;
    
    const mailOptions = {
      from: `"Varexo" <${process.env.EMAIL_USER}>`,
      to: customerEmail,
      subject: lang.subject,
      html: emailTemplate(lang.title, emailContent, lang.footerLink, SITE_URL),
    };
    
    await transporter.sendMail(mailOptions);
    console.log(`Password reset email sent to ${customerEmail} in ${language}`);
    return true;
  } catch (error) {
    console.error('Password reset email error:', error.message);
    return false;
  }
}

module.exports = {
  sendNewProjectEmail,
  sendProjectDeletedEmail,
  sendNewInvoiceEmail,
  sendProjectUpdateEmail,
  sendProgressUpdateEmail,
  sendPaymentConfirmationEmail,
  sendOverdueReminderEmail,
  sendEmailNotificationsEnabledEmail,
  sendEmailNotificationsDisabledEmail,
  sendPasswordResetEmail,
};
