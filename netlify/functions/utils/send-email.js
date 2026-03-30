const nodemailer = require('nodemailer');
const { neon } = require('@netlify/neon');

const PORTAL_URL = process.env.PORTAL_URL || 'https://varexo.nl';

function createTransporter() {
  // Check if required environment variables are set
  const required = ['SMTP_HOST', 'SMTP_USER', 'SMTP_PASS'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing email configuration: ${missing.join(', ')}`);
  }
  
  console.log('Creating email transporter with host:', process.env.SMTP_HOST);
  
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

// Check if user has email notifications enabled and get language preference
async function getUserEmailPrefs(email) {
  try {
    const dbUrl = process.env.DATABASE_URL.replace('&channel_binding=require', '');
    const sql = neon(dbUrl);
    const result = await sql`SELECT email_notifications, email_language FROM users WHERE email = ${email}`;
    if (result.length === 0) return { shouldSend: true, language: 'nl' }; // Default: send to non-registered customers
    return { 
      shouldSend: result[0].email_notifications !== false, 
      language: result[0].email_language || 'nl' 
    };
  } catch (error) {
    console.error('Database check failed:', error);
    return { shouldSend: true, language: 'nl' };
  }
}

function emailTemplate(title, content, ctaText, ctaUrl, language = 'nl') {
  const footer = {
    nl: {
      companyInfo: 'Mohammed Taher',
      companyDesc: 'Webdesign, Webshops & Social Media',
      autoMessage: 'Dit is een automatisch bericht vanuit het Varexo klantenportaal.',
      copyright: `© ${new Date().getFullYear()} Varexo. Alle rechten voorbehouden.`,
      kvk: 'KvK',
      btw: 'BTW'
    },
    en: {
      companyInfo: 'Mohammed Taher',
      companyDesc: 'Webdesign, Webshops & Social Media',
      autoMessage: 'This is an automated message from the Varexo customer portal.',
      copyright: `© ${new Date().getFullYear()} Varexo. All rights reserved.`,
      kvk: 'KvK',
      btw: 'VAT'
    }
  };
  
  const lang = footer[language] || footer.nl;
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
              ${lang.kvk}: [Later Invullen] | ${lang.btw}: [Later Invullen]
            </p>
          </div>
          
          <!-- Divider -->
          <div style="border-top:1px solid #334155;margin:16px 0;"></div>
          
          <!-- Auto Message Notice -->
          <p style="margin:0;color:#475569;font-size:11px;text-align:center;font-style:italic;">
            ${lang.autoMessage}
          </p>
          
          <!-- Copyright -->
          <p style="margin:12px 0 0;color:#334155;font-size:10px;text-align:center;">
            ${lang.copyright}
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

async function sendEmail(to, subject, title, content, ctaText, ctaUrl, attachments, language = 'nl') {
  console.log('=== DEBUG sendEmail: Starting email send to', to);
  
  // Check if user wants to receive emails and get language
  const prefs = await getUserEmailPrefs(to);
  console.log('=== DEBUG sendEmail: prefs =', prefs);
  
  if (!prefs.shouldSend) {
    console.log(`=== DEBUG sendEmail: SKIPPED - ${to} has disabled notifications`);
    return false;
  }
  
  // Use user's preferred language
  const userLang = language || prefs.language;
  
  // Skip if SMTP not configured
  console.log('=== DEBUG sendEmail: Checking SMTP config...');
  console.log('=== DEBUG sendEmail: SMTP_USER exists?', !!process.env.SMTP_USER);
  console.log('=== DEBUG sendEmail: SMTP_PASS exists?', !!process.env.SMTP_PASS);
  
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log('=== DEBUG sendEmail: SKIPPED - SMTP not configured');
    return false;
  }

  try {
    console.log('=== DEBUG sendEmail: Creating transporter...');
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"Varexo" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html: emailTemplate(title, content, ctaText, ctaUrl, userLang),
    };
    
    if (attachments && attachments.length > 0) {
      console.log('=== DEBUG sendEmail: Adding attachments:', attachments.map(a => a.filename));
      mailOptions.attachments = attachments;
    } else {
      console.log('=== DEBUG sendEmail: No attachments to send');
    }
    
    console.log('=== DEBUG sendEmail: Sending mail...');
    await transporter.sendMail(mailOptions);
    console.log(`=== DEBUG sendEmail: SUCCESS - Email sent to ${to}: ${subject}`);
    return true;
  } catch (error) {
    console.error('=== DEBUG sendEmail: ERROR -', error.message);
    console.error('=== DEBUG sendEmail: ERROR STACK -', error.stack);
    return false;
  }
}

// --- Specific notification emails ---

async function sendNewProjectEmail(customerEmail, customerName, projectTitle) {
  const prefs = await getUserEmailPrefs(customerEmail);
  const lang = prefs.language || 'nl';
  
  const translations = {
    nl: {
      greeting: `Beste ${customerName || 'klant'},`,
      intro: 'Er is een nieuw project voor u aangemaakt:',
      button: 'Ga naar uw Klantenportaal',
      title: 'Nieuw Project Aangemaakt',
      subject: `Nieuw project: ${projectTitle}`,
      footer: 'Ga naar uw klantenportaal om de details te bekijken en de voortgang te volgen.'
    },
    en: {
      greeting: `Dear ${customerName || 'customer'},`,
      intro: 'A new project has been created for you:',
      button: 'Go to Customer Portal',
      title: 'New Project Created',
      subject: `New project: ${projectTitle}`,
      footer: 'Go to your customer portal to view the details and track progress.'
    }
  };
  
  const t = translations[lang];
  
  const content = `
    <p style="color:#333333;font-size:16px;line-height:1.7;margin-bottom:16px;">${t.greeting}</p>
    <p style="color:#555555;font-size:16px;line-height:1.7;margin-bottom:24px;">${t.intro}</p>
    <div style="background:#f0fdf4;border-left:4px solid #10b981;padding:16px 20px;border-radius:0 8px 8px 0;margin:20px 0;">
      <p style="margin:0;color:#059669;font-size:18px;font-weight:600;">${projectTitle}</p>
    </div>
    <p style="color:#555555;font-size:16px;line-height:1.7;">${t.footer}</p>
  `;
  return sendEmail(customerEmail, t.subject, t.title, content, t.button, `${PORTAL_URL}/dashboard`, null, lang);
}

async function sendProjectDeletedEmail(customerEmail, customerName, projectTitle) {
  const prefs = await getUserEmailPrefs(customerEmail);
  const lang = prefs.language || 'nl';
  
  const translations = {
    nl: {
      greeting: `Beste ${customerName || 'klant'},`,
      intro: 'Het volgende project is verwijderd:',
      title: 'Project Verwijderd',
      subject: `Project verwijderd: ${projectTitle}`,
      footer: 'Heeft u vragen? Neem gerust contact met ons op.'
    },
    en: {
      greeting: `Dear ${customerName || 'customer'},`,
      intro: 'The following project has been deleted:',
      title: 'Project Deleted',
      subject: `Project deleted: ${projectTitle}`,
      footer: 'Have questions? Feel free to contact us.'
    }
  };
  
  const t = translations[lang];
  
  const content = `
    <p style="color:#333333;font-size:16px;line-height:1.7;margin-bottom:16px;">${t.greeting}</p>
    <p style="color:#555555;font-size:16px;line-height:1.7;margin-bottom:24px;">${t.intro}</p>
    <div style="background:#fef2f2;border-left:4px solid #ef4444;padding:16px 20px;border-radius:0 8px 8px 0;margin:20px 0;">
      <p style="margin:0;color:#dc2626;font-size:18px;font-weight:600;">${projectTitle}</p>
    </div>
    <p style="color:#555555;font-size:16px;line-height:1.7;">${t.footer}</p>
  `;
  return sendEmail(customerEmail, t.subject, t.title, content, null, null, null, lang);
}

async function sendNewInvoiceEmail(customerEmail, customerName, invoiceNumber, amount, invoiceData) {
  console.log('=== DEBUG sendNewInvoiceEmail: Starting ===');
  console.log('=== DEBUG sendNewInvoiceEmail: customerEmail =', customerEmail);
  
  const prefs = await getUserEmailPrefs(customerEmail);
  console.log('=== DEBUG sendNewInvoiceEmail: email prefs =', prefs);
  
  const lang = prefs.language || 'nl';
  
  const dueDateRaw = invoiceData?.dueDate ? new Date(invoiceData.dueDate) : null;
  const dueDate = dueDateRaw ? dueDateRaw.toLocaleDateString(lang === 'nl' ? 'nl-NL' : 'en-US') : 
    (lang === 'nl' ? '14 dagen na factuurdatum' : '14 days from invoice date');
  
  const translations = {
    nl: {
      greeting: `Beste ${customerName || 'klant'},`,
      intro: 'Er staat een nieuwe factuur voor u klaar. Gelieve deze binnen de gestelde termijn te voldoen.',
      invoiceLabel: 'Factuur',
      vatLabel: '(incl. 21% BTW)',
      dueLabel: 'Te betalen voor:',
      pdfText: 'De factuur vindt u als PDF in de bijlage van deze e-mail.',
      bankText: 'U kunt betalen via bankoverschrijving naar:',
      accountLabel: 't.n.v. Mohammed Taher',
      refLabel: 'Onder vermelding van:',
      button: 'Bekijk Klantenportaal',
      title: 'Nieuwe Factuur',
      subject: `Nieuwe factuur: ${invoiceNumber}`,
      footer: 'Bekijk uw klantenportaal voor meer informatie en het overzicht van al uw facturen.'
    },
    en: {
      greeting: `Dear ${customerName || 'customer'},`,
      intro: 'A new invoice is ready for you. Please pay within the specified term.',
      invoiceLabel: 'Invoice',
      vatLabel: '(incl. 21% VAT)',
      dueLabel: 'Due by:',
      pdfText: 'The invoice is attached as a PDF to this email.',
      bankText: 'You can pay by bank transfer to:',
      accountLabel: 'Account holder: Mohammed Taher',
      refLabel: 'Reference:',
      button: 'View Customer Portal',
      title: 'New Invoice',
      subject: `New invoice: ${invoiceNumber}`,
      footer: 'View your customer portal for more information and an overview of all your invoices.'
    }
  };
  
  const t = translations[lang];
  
  const content = `
    <p style="color:#333333;font-size:16px;line-height:1.7;margin-bottom:16px;">${t.greeting}</p>
    <p style="color:#555555;font-size:16px;line-height:1.7;margin-bottom:24px;">${t.intro}</p>
    <div style="background:#f0fdf4;border-left:4px solid #10b981;padding:20px;border-radius:0 8px 8px 0;margin:20px 0;">
      <p style="margin:0 0 8px;color:#059669;font-size:16px;font-weight:600;">${t.invoiceLabel} ${invoiceNumber}</p>
      <p style="margin:0 0 8px;color:#1a1a1a;font-size:28px;font-weight:700;">&euro;${parseFloat(amount).toFixed(2)} <span style="font-size:14px;font-weight:400;color:#6b7280;">${t.vatLabel}</span></p>
      <p style="margin:4px 0 0;color:#6b7280;font-size:14px;">${t.dueLabel} <strong style="color:#d97706;">${dueDate}</strong></p>
    </div>
    <p style="color:#555555;font-size:16px;line-height:1.7;margin-bottom:12px;">${t.pdfText}</p>
    <p style="color:#555555;font-size:16px;line-height:1.7;margin-bottom:12px;">
      ${t.bankText}<br>
      <strong style="color:#1a1a1a;">IBAN: NL75INGB0756428726</strong><br>
      <strong style="color:#1a1a1a;">${t.accountLabel}</strong>
    </p>
    <p style="color:#555555;font-size:16px;line-height:1.7;">${t.footer}</p>
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
      filename: lang === 'nl' ? `Factuur-${invoiceNumber}.pdf` : `Invoice-${invoiceNumber}.pdf`,
      content: pdfBuffer,
      contentType: 'application/pdf',
    }];
  } catch (pdfErr) {
    console.error('PDF generation failed, sending without attachment:', pdfErr);
    console.error('PDF error stack:', pdfErr.stack);
  }

  return sendEmail(
    customerEmail,
    t.subject,
    t.title,
    content,
    t.button,
    `${PORTAL_URL}/dashboard`,
    attachments,
    lang
  );
}

async function sendProjectUpdateEmail(customerEmail, customerName, projectTitle, updateTitle, updateDescription, logType) {
  const prefs = await getUserEmailPrefs(customerEmail);
  const lang = prefs.language || 'nl';
  
  const typeLabels = {
    nl: {
      milestone: 'Mijlpaal bereikt',
      feature: 'Nieuwe functie',
      bugfix: 'Bugfix',
      design: 'Design update',
      deployment: 'Deployment',
      update: 'Project update'
    },
    en: {
      milestone: 'Milestone reached',
      feature: 'New feature',
      bugfix: 'Bugfix',
      design: 'Design update',
      deployment: 'Deployment',
      update: 'Project update'
    }
  };
  
  const typeLabel = typeLabels[lang][logType] || typeLabels[lang].update;

  const translations = {
    nl: {
      greeting: `Beste ${customerName || 'klant'},`,
      intro: `Er is een nieuwe update voor uw project <strong style="color:#059669;">${projectTitle}</strong>:`,
      button: 'Bekijk Voortgang',
      title: 'Project Update',
      subject: `Update: ${projectTitle} - ${updateTitle}`,
      footer: 'Ga naar uw klantenportaal om alle details en de voortgang te bekijken.'
    },
    en: {
      greeting: `Dear ${customerName || 'customer'},`,
      intro: `There is a new update for your project <strong style="color:#059669;">${projectTitle}</strong>:`,
      button: 'View Progress',
      title: 'Project Update',
      subject: `Update: ${projectTitle} - ${updateTitle}`,
      footer: 'Go to your customer portal to view all details and progress.'
    }
  };
  
  const t = translations[lang];

  const content = `
    <p style="color:#333333;font-size:16px;line-height:1.7;margin-bottom:16px;">${t.greeting}</p>
    <p style="color:#555555;font-size:16px;line-height:1.7;margin-bottom:24px;">${t.intro}</p>
    <div style="background:#f0fdf4;border-left:4px solid #10b981;padding:16px 20px;border-radius:0 8px 8px 0;margin:20px 0;">
      <p style="margin:0 0 4px;color:#10b981;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:1px;">${typeLabel}</p>
      <p style="margin:0 0 8px;color:#1a1a1a;font-size:18px;font-weight:600;">${updateTitle}</p>
      ${updateDescription ? `<p style="margin:0;color:#555555;font-size:15px;line-height:1.6;">${updateDescription}</p>` : ''}
    </div>
    <p style="color:#555555;font-size:16px;line-height:1.7;">${t.footer}</p>
  `;
  return sendEmail(customerEmail, t.subject, t.title, content, t.button, `${PORTAL_URL}/dashboard`, null, lang);
}

async function sendProgressUpdateEmail(customerEmail, customerName, projectTitle, progress) {
  const prefs = await getUserEmailPrefs(customerEmail);
  const lang = prefs.language || 'nl';
  
  const translations = {
    nl: {
      greeting: `Beste ${customerName || 'klant'},`,
      intro: 'De voortgang van uw project is bijgewerkt:',
      completed: 'voltooid',
      button: 'Bekijk Voortgang',
      title: 'Voortgang Bijgewerkt',
      subject: `Voortgang: ${projectTitle} - ${progress}%`,
      footer: 'Ga naar uw klantenportaal voor meer details.'
    },
    en: {
      greeting: `Dear ${customerName || 'customer'},`,
      intro: 'The progress of your project has been updated:',
      completed: 'completed',
      button: 'View Progress',
      title: 'Progress Updated',
      subject: `Progress: ${projectTitle} - ${progress}%`,
      footer: 'Go to your customer portal for more details.'
    }
  };
  
  const t = translations[lang];
  
  const content = `
    <p style="color:#333333;font-size:16px;line-height:1.7;margin-bottom:16px;">${t.greeting}</p>
    <p style="color:#555555;font-size:16px;line-height:1.7;margin-bottom:24px;">${t.intro}</p>
    <div style="background:#f0fdf4;border-left:4px solid #10b981;padding:16px 20px;border-radius:0 8px 8px 0;margin:20px 0;">
      <p style="margin:0 0 12px;color:#059669;font-size:18px;font-weight:600;">${projectTitle}</p>
      <div style="background:#e5e7eb;border-radius:10px;height:20px;overflow:hidden;">
        <div style="background:linear-gradient(90deg,#059669,#10b981);height:100%;width:${progress}%;border-radius:10px;"></div>
      </div>
      <p style="margin:12px 0 0;color:#1a1a1a;font-size:16px;font-weight:600;text-align:center;">${progress}% ${t.completed}</p>
    </div>
    <p style="color:#555555;font-size:16px;line-height:1.7;">${t.footer}</p>
  `;
  return sendEmail(customerEmail, t.subject, t.title, content, t.button, `${PORTAL_URL}/dashboard`, null, lang);
}

async function sendPaymentConfirmationEmail(customerEmail, customerName, invoiceNumber, amount) {
  const prefs = await getUserEmailPrefs(customerEmail);
  const lang = prefs.language || 'nl';
  
  const translations = {
    nl: {
      greeting: `Beste ${customerName || 'klant'},`,
      intro: 'Hartelijk dank! Wij hebben uw betaling succesvol ontvangen.',
      invoiceLabel: 'Factuur',
      paidLabel: '[BETAALD]',
      infoText: 'Uw betaling is geregistreerd en de factuur is volledig afgehandeld.',
      button: 'Bekijk Klantenportaal',
      title: 'Betaling Succesvol Ontvangen',
      subject: `Betaling ontvangen - Factuur ${invoiceNumber}`,
      footer: 'Bekijk uw klantenportaal voor het overzicht van al uw facturen.'
    },
    en: {
      greeting: `Dear ${customerName || 'customer'},`,
      intro: 'Thank you very much! We have successfully received your payment.',
      invoiceLabel: 'Invoice',
      paidLabel: '[PAID]',
      infoText: 'Your payment has been registered and the invoice has been fully processed.',
      button: 'View Customer Portal',
      title: 'Payment Successfully Received',
      subject: `Payment received - Invoice ${invoiceNumber}`,
      footer: 'View your customer portal for an overview of all your invoices.'
    }
  };
  
  const t = translations[lang];
  
  const content = `
    <p style="color:#333333;font-size:16px;line-height:1.7;margin-bottom:16px;">${t.greeting}</p>
    <p style="color:#555555;font-size:16px;line-height:1.7;margin-bottom:24px;">${t.intro}</p>
    <div style="background:#f0fdf4;border-left:4px solid #10b981;padding:20px;border-radius:0 8px 8px 0;margin:20px 0;">
      <p style="margin:0 0 8px;color:#059669;font-size:16px;font-weight:600;">${t.invoiceLabel} ${invoiceNumber}</p>
      <p style="margin:0;color:#1a1a1a;font-size:24px;font-weight:700;">&euro;${parseFloat(amount).toFixed(2)}</p>
      <p style="margin:8px 0 0;color:#10b981;font-size:14px;font-weight:600;">${t.paidLabel}</p>
    </div>
    <p style="color:#555555;font-size:16px;line-height:1.7;margin-bottom:12px;">${t.infoText}</p>
    <p style="color:#555555;font-size:16px;line-height:1.7;">${t.footer}</p>
  `;
  return sendEmail(customerEmail, t.subject, t.title, content, t.button, `${PORTAL_URL}/dashboard`, null, lang);
}

async function sendOverdueReminderEmail(customerEmail, customerName, invoiceNumber, amount, dueDate) {
  const prefs = await getUserEmailPrefs(customerEmail);
  const lang = prefs.language || 'nl';
  
  const dueDateFormatted = dueDate ? new Date(dueDate).toLocaleDateString(lang === 'nl' ? 'nl-NL' : 'en-US') : 
    (lang === 'nl' ? 'Onbekend' : 'Unknown');
  const daysOverdue = dueDate ? Math.ceil((new Date() - new Date(dueDate)) / (1000 * 60 * 60 * 24)) : 0;
  
  const translations = {
    nl: {
      greeting: `Beste ${customerName || 'klant'},`,
      warning: 'Uw factuur is te laat met betalen.',
      invoiceLabel: 'Factuur',
      overdueLabel: '[TE LAAT]',
      daysOverdue: 'dagen over datum',
      dueOnLabel: 'Was vervallen op:',
      urgent: 'Betaal nu nog om verdere maatregelen te voorkomen.',
      bankLabel: 'U kunt betalen via bankoverschrijving naar:',
      accountHolder: 't.n.v. Mohammed Taher',
      refLabel: 'Onder vermelding van:',
      questions: 'Heeft u vragen? Neem contact met ons op via info@varexo.nl',
      button: 'Nu Betalen',
      title: '[ACTIE VEREIST] Factuur Te Laat',
      subject: `HERINNERING: Factuur ${invoiceNumber} is te laat`
    },
    en: {
      greeting: `Dear ${customerName || 'customer'},`,
      warning: 'Your invoice is overdue for payment.',
      invoiceLabel: 'Invoice',
      overdueLabel: '[OVERDUE]',
      daysOverdue: 'days overdue',
      dueOnLabel: 'Was due on:',
      urgent: 'Pay now to avoid further measures.',
      bankLabel: 'You can pay by bank transfer to:',
      accountHolder: 'Account holder: Mohammed Taher',
      refLabel: 'With reference:',
      questions: 'Have questions? Contact us at info@varexo.nl',
      button: 'Pay Now',
      title: '[ACTION REQUIRED] Invoice Overdue',
      subject: `REMINDER: Invoice ${invoiceNumber} is overdue`
    }
  };
  
  const t = translations[lang];
  
  const content = `
    <p style="color:#333333;font-size:16px;line-height:1.7;margin-bottom:16px;">${t.greeting}</p>
    <p style="color:#555555;font-size:16px;line-height:1.7;margin-bottom:24px;">
      <strong style="color:#dc2626;">${t.warning}</strong>
    </p>
    <div style="background:#fef2f2;border-left:4px solid #ef4444;padding:20px;border-radius:0 8px 8px 0;margin:20px 0;">
      <p style="margin:0 0 8px;color:#dc2626;font-size:16px;font-weight:600;">${t.invoiceLabel} ${invoiceNumber}</p>
      <p style="margin:0;color:#1a1a1a;font-size:24px;font-weight:700;">&euro;${parseFloat(amount).toFixed(2)}</p>
      <p style="margin:8px 0 0;color:#dc2626;font-size:14px;font-weight:600;">${t.overdueLabel} - ${daysOverdue} ${t.daysOverdue}</p>
      <p style="margin:4px 0 0;color:#6b7280;font-size:13px;">${t.dueOnLabel} ${dueDateFormatted}</p>
    </div>
    <p style="color:#555555;font-size:16px;line-height:1.7;margin-bottom:12px;">
      <strong style="color:#dc2626;">${t.urgent}</strong>
    </p>
    <p style="color:#555555;font-size:16px;line-height:1.7;margin-bottom:12px;">
      ${t.bankLabel}<br>
      <strong style="color:#1a1a1a;">IBAN: NL75INGB0756428726</strong><br>
      <strong style="color:#1a1a1a;">${t.accountHolder}</strong><br>
      <strong style="color:#1a1a1a;">${t.refLabel} ${invoiceNumber}</strong>
    </p>
    <p style="color:#555555;font-size:16px;line-height:1.7;">${t.questions}</p>
  `;
  return sendEmail(customerEmail, t.subject, t.title, content, t.button, `${PORTAL_URL}/dashboard`, null, lang);
}

// Email notification toggle confirmations
async function sendEmailNotificationsEnabledEmail(customerEmail, customerName) {
  const prefs = await getUserEmailPrefs(customerEmail);
  const lang = prefs.language || 'nl';
  
  const translations = {
    nl: {
      greeting: `Beste ${customerName || 'klant'},`,
      success: 'U heeft succesvol uw e-mailnotificaties aangezet! 🎉',
      intro: 'Vanaf nu ontvangt u automatisch berichten over:',
      listItems: [
        'Nieuwe facturen en betalingsherinneringen',
        'Project updates en mijlpalen',
        'Belangrijke mededelingen over uw account',
        'Status wijzigingen van uw projecten'
      ],
      tip: 'Tip:',
      tipText: 'U kunt uw notificatievoorkeuren altijd wijzigen in uw profiel instellingen.',
      button: 'Ga naar uw Profiel',
      title: 'U ontvangt nu weer e-mailnotificaties',
      subject: 'E-mailnotificaties ingeschakeld'
    },
    en: {
      greeting: `Dear ${customerName || 'customer'},`,
      success: 'You have successfully enabled email notifications! 🎉',
      intro: 'From now on you will automatically receive notifications about:',
      listItems: [
        'New invoices and payment reminders',
        'Project updates and milestones',
        'Important announcements about your account',
        'Status changes of your projects'
      ],
      tip: 'Tip:',
      tipText: 'You can always change your notification preferences in your profile settings.',
      button: 'Go to your Profile',
      title: 'You are now receiving email notifications',
      subject: 'Email notifications enabled'
    }
  };
  
  const t = translations[lang];
  
  const content = `
    <p style="color:#333333;font-size:16px;line-height:1.7;margin-bottom:16px;">${t.greeting}</p>
    <p style="color:#555555;font-size:16px;line-height:1.7;margin-bottom:24px;">
      <strong style="color:#059669;">${t.success}</strong>
    </p>
    <p style="color:#555555;font-size:16px;line-height:1.7;margin-bottom:24px;">${t.intro}</p>
    <ul style="color:#555555;font-size:16px;line-height:1.7;margin-bottom:24px;padding-left:24px;">
      ${t.listItems.map(item => `<li>${item}</li>`).join('')}
    </ul>
    <div style="background:#f0fdf4;border-left:4px solid #10b981;padding:16px 20px;border-radius:0 8px 8px 0;margin:20px 0;">
      <p style="margin:0;color:#059669;font-size:15px;font-weight:500;">
        💡 <strong>${t.tip}</strong> ${t.tipText}
      </p>
    </div>
  `;
  return sendEmail(customerEmail, t.subject, t.title, content, t.button, `${PORTAL_URL}/profile`, null, lang);
}

async function sendEmailNotificationsDisabledEmail(customerEmail, customerName) {
  const prefs = await getUserEmailPrefs(customerEmail);
  const lang = prefs.language || 'nl';
  
  const translations = {
    nl: {
      greeting: `Beste ${customerName || 'klant'},`,
      disabled: 'U heeft uw e-mailnotificaties uitgeschakeld.',
      whatMeans: 'Wat betekent dit?',
      listItems: [
        'U ontvangt <strong>geen</strong> automatische e-mails over facturen meer',
        'U ontvangt <strong>geen</strong> project updates via e-mail',
        'Belangrijke meldingen worden alleen in uw klantenportaal getoond'
      ],
      warning: 'Let op:',
      warningText: 'We raden aan om notificaties aan te houden zodat u niets mist!',
      changeSettings: 'Om dit te wijzigen, gaat u naar <strong>Profiel beheren</strong> in uw klantenportaal:',
      button: 'Notificaties weer inschakelen',
      goodbye: 'Jammer om u te zien vertrekken...',
      title: 'E-mailnotificaties uitgeschakeld',
      subject: 'E-mailnotificaties uitgeschakeld'
    },
    en: {
      greeting: `Dear ${customerName || 'customer'},`,
      disabled: 'You have disabled your email notifications.',
      whatMeans: 'What does this mean?',
      listItems: [
        'You will <strong>no longer</strong> receive automatic emails about invoices',
        'You will <strong>no longer</strong> receive project updates via email',
        'Important notifications will only be shown in your customer portal'
      ],
      warning: 'Warning:',
      warningText: 'We recommend keeping notifications enabled so you don\'t miss anything!',
      changeSettings: 'To change this, go to <strong>Manage Profile</strong> in your customer portal:',
      button: 'Re-enable notifications',
      goodbye: 'Sorry to see you go...',
      title: 'Email notifications disabled',
      subject: 'Email notifications disabled'
    }
  };
  
  const t = translations[lang];
  
  const content = `
    <p style="color:#333333;font-size:16px;line-height:1.7;margin-bottom:16px;">${t.greeting}</p>
    <p style="color:#555555;font-size:16px;line-height:1.7;margin-bottom:24px;">
      ${t.disabled}
    </p>
    <p style="color:#555555;font-size:16px;line-height:1.7;margin-bottom:24px;">
      <strong>${t.whatMeans}</strong>
    </p>
    <ul style="color:#555555;font-size:16px;line-height:1.7;margin-bottom:24px;padding-left:24px;">
      ${t.listItems.map(item => `<li>${item}</li>`).join('')}
    </ul>
    <div style="background:#fef2f2;border-left:4px solid #ef4444;padding:16px 20px;border-radius:0 8px 8px 0;margin:20px 0;">
      <p style="margin:0;color:#dc2626;font-size:15px;font-weight:500;">
        ⚠️ <strong>${t.warning}</strong> ${t.warningText}
      </p>
    </div>
    <p style="color:#555555;font-size:16px;line-height:1.7;margin-top:24px;">
      ${t.changeSettings}
    </p>
  `;
  
  // ALWAYS send this email - bypass the shouldSendEmail check
  // This is the LAST email the user will receive
  
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
      subject: t.subject,
      html: emailTemplate(t.goodbye, content, t.button, `${PORTAL_URL}/profile`, lang),
    };
    await transporter.sendMail(mailOptions);
    console.log(`DISABLED notification email sent to ${customerEmail}: ${t.subject}`);
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
    
    // Bilingual content
    const content = {
      nl: {
        subject: 'Wachtwoord reset aanvraag - Varexo',
        title: 'Wachtwoord vergeten?',
        greeting: `Hallo ${displayName},`,
        intro: 'Je hebt een wachtwoord reset aangevraagd voor je Varexo account. Klik op de onderstaande knop om een nieuw wachtwoord in te stellen:',
        button: 'Wachtwoord resetten',
        copyLink: 'Of kopieer deze link naar je browser:',
        warningText: 'Deze link is 24 uur geldig en kan maar één keer gebruikt worden.',
        notRequested: 'Heb jij dit niet aangevraagd? Dan kan je deze email negeren. Je wachtwoord blijft dan ongewijzigd.',
        footerLink: 'Naar Varexo'
      },
      en: {
        subject: 'Password reset request - Varexo',
        title: 'Forgot your password?',
        greeting: `Hello ${displayName},`,
        intro: 'You have requested a password reset for your Varexo account. Click the button below to set a new password:',
        button: 'Reset Password',
        copyLink: 'Or copy this link to your browser:',
        warningText: 'This link is valid for 24 hours and can only be used once.',
        notRequested: "Didn't request this? You can ignore this email. Your password will remain unchanged.",
        footerLink: 'Go to Varexo'
      }
    };
    
    const lang = content[language] || content.nl;
    
    const emailContent = `
      <div style="margin-bottom:32px;">
        <p style="font-size:18px;color:#ffffff;margin-bottom:8px;font-weight:600;">${lang.greeting}</p>
        <p style="font-size:14px;color:#94a3b8;margin:0;">Wachtwoord reset aanvraag</p>
      </div>
      
      <p style="font-size:15px;color:#e2e8f0;margin-bottom:24px;line-height:1.6;">
        ${lang.intro}
      </p>
      
      <div style="text-align:center;margin:32px 0;">
        <a href="${resetUrl}" style="background:#10b981;color:#ffffff;padding:16px 40px;border-radius:8px;text-decoration:none;font-weight:600;font-size:16px;display:inline-block;">
          ${lang.button}
        </a>
      </div>
      
      <p style="font-size:13px;color:#94a3b8;margin-top:24px;line-height:1.6;">
        ${lang.copyLink}<br>
        <a href="${resetUrl}" style="color:#10b981;word-break:break-all;font-size:13px;">${resetUrl}</a>
      </p>
      
      <div style="border-top:1px solid #334155;padding-top:20px;margin-top:28px;">
        <p style="margin:0;color:#64748b;font-size:13px;line-height:1.5;">
          <strong style="color:#e2e8f0;">Opmerking:</strong> ${lang.warningText}
        </p>
      </div>
      
      <p style="font-size:12px;color:#64748b;margin-top:20px;font-style:italic;">
        ${lang.notRequested}
      </p>
    `;
    
    const mailOptions = {
      from: `"Varexo" <${process.env.EMAIL_USER}>`,
      to: customerEmail,
      subject: lang.subject,
      html: emailTemplate(lang.title, emailContent, lang.footerLink, PORTAL_URL),
    };
    
    await transporter.sendMail(mailOptions);
    console.log(`Password reset email sent to ${customerEmail} in ${language}`);
    return true;
  } catch (error) {
    console.error('Password reset email error:', error.message);
    return false;
  }
}

// Send recurring invoice setup confirmation email
async function sendRecurringInvoiceSetupEmail(customerEmail, customerName, description, amount, intervalMonths, nextInvoiceDate, language = 'nl') {
  const prefs = await getUserEmailPrefs(customerEmail);
  const lang = prefs.language || language;
  
  const frequencyText = {
    nl: {
      1: 'maandelijks',
      3: 'per kwartaal',
      6: 'halfjaarlijks',
      12: 'jaarlijks'
    },
    en: {
      1: 'monthly',
      3: 'quarterly',
      6: 'semi-annually',
      12: 'annually'
    }
  };
  
  const frequency = frequencyText[lang][intervalMonths] || (lang === 'nl' ? `elke ${intervalMonths} maanden` : `every ${intervalMonths} months`);
  const nextDate = new Date(nextInvoiceDate).toLocaleDateString(lang === 'nl' ? 'nl-NL' : 'en-US');
  
  const translations = {
    nl: {
      greeting: `Beste ${customerName || 'klant'},`,
      intro: 'Er is een automatische terugkerende factuur voor u ingesteld.',
      detailsTitle: 'Details van uw automatische factuur:',
      serviceLabel: 'Dienst',
      amountLabel: 'Bedrag',
      frequencyLabel: 'Frequentie',
      nextLabel: 'Eerste factuur op',
      infoText: 'U ontvangt automatisch een factuur met PDF bijlage op deze datum.',
      manageText: 'U kunt uw terugkerende facturen beheren in uw klantenportaal.',
      button: 'Beheer Facturen',
      title: 'Terugkerende Factuur Ingesteld',
      subject: 'Automatische factuur ingesteld: ' + description
    },
    en: {
      greeting: `Dear ${customerName || 'customer'},`,
      intro: 'An automatic recurring invoice has been set up for you.',
      detailsTitle: 'Details of your automatic invoice:',
      serviceLabel: 'Service',
      amountLabel: 'Amount',
      frequencyLabel: 'Frequency',
      nextLabel: 'First invoice on',
      infoText: 'You will automatically receive an invoice with PDF attachment on this date.',
      manageText: 'You can manage your recurring invoices in your customer portal.',
      button: 'Manage Invoices',
      title: 'Recurring Invoice Set Up',
      subject: 'Automatic invoice set up: ' + description
    }
  };
  
  const t = translations[lang];
  
  const content = `
    <p style="color:#333333;font-size:16px;line-height:1.7;margin-bottom:16px;">${t.greeting}</p>
    <p style="color:#555555;font-size:16px;line-height:1.7;margin-bottom:24px;">${t.intro}</p>
    
    <div style="background:#f0fdf4;border-left:4px solid #10b981;padding:20px;border-radius:0 8px 8px 0;margin:20px 0;">
      <p style="margin:0 0 16px;color:#059669;font-size:16px;font-weight:600;">${t.detailsTitle}</p>
      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="padding:8px 0;color:#6b7280;font-size:14px;width:40%;">${t.serviceLabel}</td>
          <td style="padding:8px 0;color:#1a1a1a;font-size:14px;font-weight:600;">${description}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;color:#6b7280;font-size:14px;">${t.amountLabel}</td>
          <td style="padding:8px 0;color:#1a1a1a;font-size:16px;font-weight:700;">&euro;${parseFloat(amount).toFixed(2)}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;color:#6b7280;font-size:14px;">${t.frequencyLabel}</td>
          <td style="padding:8px 0;color:#1a1a1a;font-size:14px;font-weight:600;">${frequency}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;color:#6b7280;font-size:14px;">${t.nextLabel}</td>
          <td style="padding:8px 0;color:#059669;font-size:14px;font-weight:700;">${nextDate}</td>
        </tr>
      </table>
    </div>
    
    <p style="color:#555555;font-size:16px;line-height:1.7;margin-bottom:12px;">${t.infoText}</p>
    <p style="color:#555555;font-size:16px;line-height:1.7;">${t.manageText}</p>
  `;
  
  return sendEmail(customerEmail, t.subject, t.title, content, t.button, `${PORTAL_URL}/dashboard`, null, lang);
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
  sendRecurringInvoiceSetupEmail,
};
