import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockAuth, MockUser } from '../services/mockAuth';
import { roleService } from '../services/roleService';
import { projectService, Project, Invoice, ProjectLog } from '../services/projectService';
import { paymentTrackingAPI } from '../services/api';
import PageTransition from '../components/PageTransition';
import { useLanguage } from '../contexts/LanguageContext';

const CustomerDashboard: React.FC = () => {
  const { t, language } = useLanguage();
  const [user, setUser] = useState<MockUser | null>(null);
  const [activeTab, setActiveTab] = useState<'projects' | 'invoices'>('projects');
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [recurringInvoices, setRecurringInvoices] = useState<any[]>([]);
  const [recurringPaymentTracking, setRecurringPaymentTracking] = useState<{[key: string]: any[]}>({});
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projectLogs, setProjectLogs] = useState<ProjectLog[]>([]);
  const [logsLoading, setLogsLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = mockAuth.onAuthChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        if (roleService.isAdmin(currentUser.email)) {
          navigate('/admin');
          return;
        }
        loadCustomerData(currentUser.email);
      } else {
        navigate('/login');
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [navigate]);

  const openProjectDetails = async (project: Project) => {
    setSelectedProject(project);
    setLogsLoading(true);
    try {
      const logs = await projectService.getProjectLogsAsync(project.id);
      setProjectLogs(logs);
    } catch {
      setProjectLogs(projectService.getProjectLogs(project.id));
    }
    setLogsLoading(false);
  };

  const closeProjectDetails = () => {
    setSelectedProject(null);
    setProjectLogs([]);
  };

  const loadRecurringPaymentTracking = async (recurringId: string) => {
    try {
      const tracking = await paymentTrackingAPI.getForInvoice(recurringId);
      setRecurringPaymentTracking(prev => ({ ...prev, [recurringId]: tracking }));
    } catch (error) {
      console.error('Error loading payment tracking:', error);
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress < 25) return 'bg-red-500';
    if (progress < 50) return 'bg-yellow-500';
    if (progress < 75) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getLogTypeIcon = (type: string) => {
    const iconClass = "w-5 h-5 flex-shrink-0";
    switch (type) {
      case 'milestone': 
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'feature': 
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
        );
      case 'bugfix': 
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        );
      case 'design': 
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
          </svg>
        );
      case 'deployment': 
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
      default: 
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        );
    }
  };

  const getLogTypeLabel = (type: string) => {
    switch (type) {
      case 'milestone': return t('log.milestone') || 'Mijlpaal';
      case 'feature': return t('log.feature') || 'Nieuwe functie';
      case 'bugfix': return t('log.bugfix') || 'Bugfix';
      case 'design': return t('log.design') || 'Design';
      case 'deployment': return t('log.deployment') || 'Deployment';
      default: return t('log.update') || 'Update';
    }
  };

  const generatePDF = (invoice: Invoice) => {
    const customerName = (invoice as any).customerName || invoice.customerEmail.split('@')[0];
    const customerCompany = (invoice as any).customerCompany || '';
    const customerAddress = (invoice as any).customerAddress || '';
    const customerPostal = (invoice as any).customerPostal || '';
    const customerCity = (invoice as any).customerCity || '';
    const customerPhone = (invoice as any).customerPhone || '';
    const customerEmail = invoice.customerEmail;
    const invoiceNumber = (invoice as any).invoiceNumber || invoice.invoiceNumber;
    const rawDate = (invoice as any).invoiceDate || invoice.createdAt;
    const invoiceDate = rawDate ? new Date(rawDate).toLocaleDateString('nl-NL', { day: '2-digit', month: '2-digit', year: 'numeric' }) : new Date().toLocaleDateString('nl-NL', { day: '2-digit', month: '2-digit', year: 'numeric' });
    
    const totalIncl = invoice.amount;
    const subtotalExcl = totalIncl / 1.21;
    const btwAmount = totalIncl - subtotalExcl;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Factuur ${invoiceNumber}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: 'Inter', Arial, sans-serif; 
              background: linear-gradient(135deg, #d4edda 0%, #a8d8ea 50%, #d4edda 100%);
              min-height: 100vh;
              padding: 40px;
              color: #333;
              margin: 0;
            }
            .invoice-container {
              max-width: 800px;
              margin: 0 auto;
              background: white;
              box-shadow: 0 4px 20px rgba(0,0,0,0.1);
              position: relative;
            }
            .header-section {
              background: linear-gradient(135deg, #c8e6d1 0%, #b8e0e8 100%);
              padding: 30px;
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
            .logo-section img {
              max-width: 150px;
              margin-bottom: 10px;
            }
            .company-info {
              font-size: 12px;
              color: #333;
              line-height: 1.6;
              text-align: right;
            }
            .customer-section {
              padding: 20px 30px;
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
              grid-template-columns: 1fr 1fr 2fr 1fr;
              background: #f8f9fa;
              margin: 0 30px;
              padding: 12px 15px;
              border: 1px solid #dee2e6;
              font-size: 12px;
              font-weight: 600;
              text-transform: uppercase;
              color: #2c6e4f;
            }
            .summary-row span {
              text-align: center;
            }
            .summary-row span:first-child {
              text-align: left;
            }
            .summary-row span:last-child {
              text-align: right;
            }
            .items-table {
              margin: 0 30px;
              border-collapse: collapse;
              width: calc(100% - 60px);
            }
            .items-table th {
              text-align: left;
              padding: 12px 15px;
              font-size: 12px;
              font-weight: 600;
              text-transform: uppercase;
              color: #2c6e4f;
              border-bottom: 2px solid #2c6e4f;
            }
            .items-table td {
              padding: 12px 15px;
              font-size: 13px;
              color: #333;
              border-bottom: 1px solid #eee;
            }
            .items-table .quantity { text-align: center; width: 80px; }
            .items-table .description { text-align: left; }
            .items-table .price { text-align: right; width: 120px; }
            .items-table .total { text-align: right; width: 120px; }
            .totals-section {
              margin: 20px 30px 0 30px;
              padding-bottom: 20px;
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
              padding: 20px 30px;
              margin-top: 20px;
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
              @page {
                size: A4;
                margin: 0;
              }
              body { 
                background: white; 
                padding: 20px; 
                min-height: auto;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
              .invoice-container { 
                box-shadow: none; 
                max-width: 100%;
                min-height: calc(100vh - 40px);
                display: flex;
                flex-direction: column;
              }
              .footer {
                margin-top: auto;
                page-break-inside: avoid;
              }
              .header-section {
                padding: 25px 30px;
              }
              .customer-section {
                padding: 20px 30px;
              }
              .summary-row {
                margin: 0 30px;
                padding: 12px 15px;
              }
              .items-table {
                margin: 0 30px;
                width: calc(100% - 60px);
              }
              .items-table th, .items-table td {
                padding: 12px 15px;
              }
              .totals-section {
                margin: 20px 30px 0 30px;
                padding-bottom: 20px;
              }
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
                    <p>${invoiceDate}</p>
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
                  ${customerName}<br>
                  ${customerAddress}<br>
                  ${customerPostal} ${customerCity}<br>
                  ${customerPhone}<br>
                  <span class="customer-email">${customerEmail}</span>
                </p>
              </div>
            </div>

            <div class="summary-row">
              <span>VAREXO</span>
              <span>DIENSTVERLENING</span>
              <span style="text-align:right;"><strong>Vervaldatum:</strong> ${new Date(invoice.dueDate).toLocaleDateString('nl-NL')}</span>
              <span style="text-align:left;font-size:10px;font-weight:400;">Betalingsvoorwaarden:<br>Betaling binnen 14 dagen na vervaldatum</span>
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
                ${invoice.items.map(item => `
                  <tr>
                    <td class="quantity">${item.quantity}</td>
                    <td class="description">${item.description}</td>
                    <td class="price">€${item.price.toFixed(2)}</td>
                    <td class="total">€${item.total.toFixed(2)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>

            <div class="totals-section">
              <div class="totals-table">
                <div class="totals-row">
                  <span>Subtotaal (excl. BTW)</span>
                  <span>€${subtotalExcl.toFixed(2)}</span>
                </div>
                <div class="totals-row">
                  <span>BTW 21%</span>
                  <span>€${btwAmount.toFixed(2)}</span>
                </div>
                <div class="totals-row total">
                  <span>Totaal (incl. BTW)</span>
                  <span>€${totalIncl.toFixed(2)}</span>
                </div>
                <div style="font-size:11px;color:#666;margin-top:6px;text-align:right;">Alle bedragen zijn inclusief 21% BTW</div>
              </div>
            </div>

            <div class="footer">
              <div class="footer-content">
                <div class="footer-left">
                </div>
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
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.print();
    }
  };

  // Generate PDF for recurring invoice period
  const generateRecurringPDF = (recurring: any, period: any) => {
    const customerName = recurring.customerName || recurring.customerEmail?.split('@')[0] || 'Klant';
    const customerCompany = recurring.customerCompany || '';
    const customerAddress = recurring.customerAddress || '';
    const customerPostal = recurring.customerPostal || '';
    const customerCity = recurring.customerCity || '';
    const customerPhone = recurring.customerPhone || '';
    const customerEmail = recurring.customerEmail || '';
    const invoiceNumber = period.invoiceNumber ? `${period.invoiceNumber}-P${period.periodNumber}` : `${recurring.id}-P${period.periodNumber}`;
    const invoiceDate = new Date(period.periodStartDate).toLocaleDateString('nl-NL', { day: '2-digit', month: '2-digit', year: 'numeric' });
    
    const totalIncl = period.amount;
    const subtotalExcl = totalIncl / 1.21;
    const btwAmount = totalIncl - subtotalExcl;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Factuur ${invoiceNumber}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: 'Inter', Arial, sans-serif; 
              background: linear-gradient(135deg, #d4edda 0%, #a8d8ea 50%, #d4edda 100%);
              min-height: 100vh;
              padding: 40px;
              color: #333;
              margin: 0;
            }
            .invoice-container {
              max-width: 800px;
              margin: 0 auto;
              background: white;
              box-shadow: 0 4px 20px rgba(0,0,0,0.1);
              position: relative;
            }
            .header-section {
              background: linear-gradient(135deg, #c8e6d1 0%, #b8e0e8 100%);
              padding: 30px;
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
            .logo-section img {
              max-width: 150px;
              margin-bottom: 10px;
            }
            .company-info {
              font-size: 12px;
              color: #333;
              line-height: 1.6;
              text-align: right;
            }
            .customer-section {
              padding: 20px 30px;
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
              grid-template-columns: 1fr 1fr 2fr 1fr;
              background: #f8f9fa;
              margin: 0 30px;
              padding: 12px 15px;
              border: 1px solid #dee2e6;
              font-size: 12px;
              font-weight: 600;
              text-transform: uppercase;
              color: #2c6e4f;
            }
            .summary-row span {
              text-align: center;
            }
            .summary-row span:first-child {
              text-align: left;
            }
            .summary-row span:last-child {
              text-align: right;
            }
            .items-table {
              margin: 0 30px;
              border-collapse: collapse;
              width: calc(100% - 60px);
            }
            .items-table th {
              text-align: left;
              padding: 12px 15px;
              font-size: 12px;
              font-weight: 600;
              text-transform: uppercase;
              color: #2c6e4f;
              border-bottom: 2px solid #2c6e4f;
            }
            .items-table td {
              padding: 12px 15px;
              font-size: 13px;
              color: #333;
              border-bottom: 1px solid #eee;
            }
            .items-table .quantity { text-align: center; width: 80px; }
            .items-table .description { text-align: left; }
            .items-table .price { text-align: right; width: 120px; }
            .items-table .total { text-align: right; width: 120px; }
            .totals-section {
              margin: 20px 30px 0 30px;
              padding-bottom: 20px;
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
              padding: 20px 30px;
              margin-top: 20px;
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
              @page {
                size: A4;
                margin: 0;
              }
              body { 
                background: white; 
                padding: 20px; 
                min-height: auto;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
              .invoice-container { 
                box-shadow: none; 
                max-width: 100%;
                min-height: calc(100vh - 40px);
                display: flex;
                flex-direction: column;
              }
              .footer {
                margin-top: auto;
                page-break-inside: avoid;
              }
              .header-section {
                padding: 25px 30px;
              }
              .customer-section {
                padding: 20px 30px;
              }
              .summary-row {
                margin: 0 30px;
                padding: 12px 15px;
              }
              .items-table {
                margin: 0 30px;
                width: calc(100% - 60px);
              }
              .items-table th, .items-table td {
                padding: 12px 15px;
              }
              .totals-section {
                margin: 20px 30px 0 30px;
                padding-bottom: 20px;
              }
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
                    <p>${invoiceDate}</p>
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
                  ${customerName}<br>
                  ${customerAddress}<br>
                  ${customerPostal} ${customerCity}<br>
                  ${customerPhone}<br>
                  <span class="customer-email">${customerEmail}</span>
                </p>
              </div>
            </div>

            <div class="summary-row">
              <span>VAREXO</span>
              <span>DIENSTVERLENING</span>
              <span style="text-align:right;"><strong>Vervaldatum:</strong> ${new Date(period.periodEndDate).toLocaleDateString('nl-NL')}</span>
              <span style="text-align:left;font-size:10px;font-weight:400;">Betalingsvoorwaarden:<br>Betaling binnen 14 dagen na vervaldatum</span>
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
                <tr>
                  <td class="quantity">1</td>
                  <td class="description">${recurring.description} - Periode #${period.periodNumber}<br><small>(${new Date(period.periodStartDate).toLocaleDateString('nl-NL')} t/m ${new Date(period.periodEndDate).toLocaleDateString('nl-NL')})</small></td>
                  <td class="price">€${totalIncl.toFixed(2)}</td>
                  <td class="total">€${totalIncl.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>

            <div class="totals-section">
              <div class="totals-table">
                <div class="totals-row">
                  <span>Subtotaal (excl. BTW)</span>
                  <span>€${subtotalExcl.toFixed(2)}</span>
                </div>
                <div class="totals-row">
                  <span>BTW 21%</span>
                  <span>€${btwAmount.toFixed(2)}</span>
                </div>
                <div class="totals-row total">
                  <span>Totaal (incl. BTW)</span>
                  <span>€${totalIncl.toFixed(2)}</span>
                </div>
                <div style="font-size:11px;color:#666;margin-top:6px;text-align:right;">Alle bedragen zijn inclusief 21% BTW</div>
              </div>
            </div>

            <div class="footer">
              <div class="footer-content">
                <div class="footer-left">
                </div>
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
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const loadCustomerData = async (email: string) => {
    try {
      const [p, i, r] = await Promise.all([
        projectService.getProjectsForCustomerAsync(email),
        projectService.getInvoicesForCustomerAsync(email),
        fetch(`/.netlify/functions/recurring-invoices?email=${encodeURIComponent(email)}`).then(res => res.json()).catch(() => [])
      ]);
      setProjects(p);
      setInvoices(i);
      setRecurringInvoices(Array.isArray(r) ? r : []);
    } catch {
      setProjects(projectService.getProjectsForCustomer(email));
      setInvoices(projectService.getInvoicesForCustomer(email));
      setRecurringInvoices([]);
    }
  };

  if (loading) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-dark-900 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
            <p className="mt-4 text-gray-400">Laden...</p>
          </div>
        </div>
      </PageTransition>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-dark-900 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white">{t('dashboard.title')}</h1>
              <p className="text-gray-400 mt-1">
                {(() => {
                  const hour = new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/Amsterdam' })).getHours();
                  let greeting = '';
                  if (language === 'nl') {
                    if (hour >= 6 && hour < 12) greeting = 'Goedemorgen';
                    else if (hour >= 12 && hour < 18) greeting = 'Goedemiddag';
                    else if (hour >= 18 && hour < 23) greeting = 'Goedenavond';
                    else greeting = 'Goedenacht';
                  } else {
                    if (hour >= 6 && hour < 12) greeting = 'Good morning';
                    else if (hour >= 12 && hour < 18) greeting = 'Good afternoon';
                    else if (hour >= 18 && hour < 23) greeting = 'Good evening';
                    else greeting = 'Good night';
                  }
                  return `${greeting}, ${user.displayName} 👋`;
                })()}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {/* Subscription Card */}
            <div className="bg-dark-800 p-6 rounded-lg border border-dark-700">
              <div className="flex items-center">
                <div className="p-3 bg-blue-900 rounded-lg">
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-400">{t('dashboard.subscription')}</p>
                  <div className="flex flex-col">
                    {(() => {
                      const users = JSON.parse(localStorage.getItem('varexo_users') || '[]');
                      const currentUser = users.find((u: any) => u.email === user?.email);
                      const subscription = currentUser?.subscription;
                      const hasSocialMedia = currentUser?.hasSocialMedia;
                      
                      if (!subscription) {
                        return <span className="text-sm text-gray-500">{t('dashboard.noSubscription')}</span>;
                      }
                      
                      return (
                        <>
                          <span className={`text-sm font-bold ${
                            subscription === 'basic' ? 'text-gray-300' :
                            subscription === 'pro' ? 'text-primary-400' :
                            'text-yellow-400'
                          }`}>
                            {subscription === 'basic' ? 'Basic' :
                             subscription === 'pro' ? 'Pro' : 'Premium'}
                          </span>
                          {hasSocialMedia && (
                            <span className="text-xs text-purple-400">+ {t('common.socialMedia')}</span>
                          )}
                        </>
                      );
                    })()}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-dark-800 p-6 rounded-lg border border-dark-700">
              <div className="flex items-center">
                <div className="p-3 bg-primary-900 rounded-lg">
                  <svg className="w-6 h-6 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-400">{t('dashboard.activeProjects')}</p>
                  <p className="text-2xl font-bold text-white">{projects.filter(p => p.status === 'active').length}</p>
                </div>
              </div>
            </div>

            <div className="bg-dark-800 p-6 rounded-lg border border-dark-700">
              <div className="flex items-center">
                <div className="p-3 bg-green-900 rounded-lg">
                  <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-400">{t('dashboard.completedProjects')}</p>
                  <p className="text-2xl font-bold text-white">{projects.filter(p => p.status === 'completed').length}</p>
                </div>
              </div>
            </div>

            <div className="bg-dark-800 p-6 rounded-lg border border-dark-700">
              <div className="flex items-center">
                <div className="p-3 bg-yellow-900 rounded-lg">
                  <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-400">{t('dashboard.pendingInvoices')}</p>
                  <p className="text-2xl font-bold text-white">{invoices.filter(i => i.status === 'sent').length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-dark-700 mb-6">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('projects')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'projects'
                    ? 'border-primary-500 text-primary-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
              >
                {t('dashboard.projects')} ({projects.length})
              </button>
              <button
                onClick={() => setActiveTab('invoices')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'invoices'
                    ? 'border-primary-500 text-primary-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
              >
                {t('dashboard.invoices')} ({invoices.length})
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          {activeTab === 'projects' && (
            <div className="bg-dark-800 rounded-lg border border-dark-700">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-white mb-4">{t('dashboard.projects')}</h2>
                {projects.length === 0 ? (
                  <div className="text-center py-12">
                    <svg className="w-12 h-12 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <p className="text-gray-400">{t('dashboard.noProjects')}</p>
                    <p className="text-gray-500 text-sm mt-2">{t('dashboard.adminWillCreate')}</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
                    {projects.map((project) => (
                      <div 
                        key={project.id} 
                        onClick={() => openProjectDetails(project)}
                        className="bg-dark-900 p-4 rounded-lg border border-dark-700 hover:border-primary-500 cursor-pointer transition group"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-lg font-medium text-white group-hover:text-primary-400 transition">{project.title}</h3>
                          <svg className="w-5 h-5 text-gray-500 group-hover:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                        <p className="text-gray-400 text-sm mb-3 line-clamp-2">{project.description}</p>
                        
                        {/* Contact Phone */}
                        <div className="flex items-center gap-2 mb-3 text-xs text-primary-400">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          <a href="tel:+31636075966" className="hover:text-primary-300 transition">06-36075966</a>
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="mb-3">
                          <div className="flex justify-between text-xs text-gray-400 mb-1">
                            <span>{t('common.progress')}</span>
                            <span>{project.progress || 0}%</span>
                          </div>
                          <div className="w-full bg-dark-700 rounded-full h-2">
                            <div 
                              className={`${getProgressColor(project.progress || 0)} h-2 rounded-full transition-all duration-500`}
                              style={{ width: `${project.progress || 0}%` }}
                            ></div>
                          </div>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            project.status === 'active' ? 'bg-green-900 text-green-300' :
                            project.status === 'completed' ? 'bg-blue-900 text-blue-300' :
                            project.status === 'paused' ? 'bg-yellow-900 text-yellow-300' :
                            'bg-gray-900 text-gray-300'
                          }`}>
                            {project.status === 'planning' ? t('common.planning') :
                             project.status === 'active' ? t('common.active') :
                             project.status === 'completed' ? t('common.completed') : t('common.paused')}
                          </span>
                          {project.deadline && (
                            <span className="text-xs text-gray-500">
                              {new Date(project.deadline).toLocaleDateString('nl-NL')}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'invoices' && (
            <div className="bg-dark-800 rounded-lg border border-dark-700">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-white mb-4">{t('dashboard.invoices')}</h2>
                {invoices.length === 0 ? (
                  <div className="text-center py-12">
                    <svg className="w-12 h-12 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-gray-400">{t('dashboard.noInvoicesFound')}</p>
                    <p className="text-gray-500 text-sm mt-2">{t('dashboard.adminWillCreateInvoices')}</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-dark-700">
                      <thead>
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">{t('dashboard.invoice')}</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">{t('dashboard.project')}</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">{t('dashboard.amount')}</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">{t('dashboard.status')}</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">{t('dashboard.dueDate')}</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">{t('dashboard.action')}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-dark-700">
                        {invoices.map((invoice) => (
                          <tr key={invoice.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-white">{invoice.invoiceNumber}</div>
                                <div className="text-sm text-gray-400">{new Date(invoice.createdAt).toLocaleDateString('nl-NL')}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                              {invoice.projectTitle}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                              €{invoice.amount.toFixed(2)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                invoice.status === 'paid' ? 'bg-green-900 text-green-300' :
                                invoice.status === 'sent' ? 'bg-blue-900 text-blue-300' :
                                invoice.status === 'overdue' ? 'bg-red-900 text-red-300' :
                                'bg-gray-900 text-gray-300'
                              }`}>
                                {invoice.status === 'draft' ? t('dashboard.invoiceStatus.draft') :
                                 invoice.status === 'sent' ? t('dashboard.invoiceStatus.sent') :
                                 invoice.status === 'paid' ? t('dashboard.invoiceStatus.paid') : t('dashboard.invoiceStatus.overdue')}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                              {new Date(invoice.dueDate).toLocaleDateString('nl-NL')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <button
                                onClick={() => generatePDF(invoice)}
                                className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-primary-400 hover:text-primary-300 transition bg-primary-900/30 rounded-md hover:bg-primary-900/50"
                              >
                                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                {t('common.download')}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'invoices' && recurringInvoices.length > 0 && (
            <div className="bg-dark-800 rounded-lg border border-dark-700 mb-6">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-white mb-4">
                  {language === 'nl' ? 'Terugkerende Facturen' : 'Recurring Invoices'}
                </h2>
                <div className="space-y-4">
                  {recurringInvoices.map((recurring) => (
                    <div key={recurring.id} className="bg-dark-900 p-4 rounded-lg border border-dark-700">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-lg font-medium text-white">{recurring.description}</h3>
                          <p className="text-sm text-gray-400">
                            {language === 'nl' ? 'Bedrag' : 'Amount'}: €{recurring.amount?.toFixed(2)} / 
                            {recurring.intervalMonths === 1 ? (language === 'nl' ? 'maand' : 'month') :
                             recurring.intervalMonths === 12 ? (language === 'nl' ? 'jaar' : 'year') :
                             `${recurring.intervalMonths} ${language === 'nl' ? 'maanden' : 'months'}`}
                          </p>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          recurring.active ? 'bg-green-900 text-green-300' : 'bg-gray-900 text-gray-300'
                        }`}>
                          {recurring.active ? (language === 'nl' ? 'Actief' : 'Active') : (language === 'nl' ? 'Gepauzeerd' : 'Paused')}
                        </span>
                      </div>
                      
                      {/* Period Information */}
                      <div className="bg-dark-800 p-3 rounded border border-dark-600 mb-3">
                        <p className="text-sm text-primary-400 font-medium mb-2">
                          {language === 'nl' ? 'Huidige periode' : 'Current period'}:
                        </p>
                        <p className="text-sm text-gray-300">
                          {(() => {
                            const startDate = new Date(recurring.startDate);
                            const today = new Date();
                            const monthsDiff = Math.floor((today.getFullYear() - startDate.getFullYear()) * 12 + (today.getMonth() - startDate.getMonth()));
                            const periodNumber = Math.max(1, monthsDiff + 1);
                            
                            // Calculate period dates
                            const periodStart = new Date(startDate);
                            periodStart.setMonth(startDate.getMonth() + (periodNumber - 1) * recurring.intervalMonths);
                            const periodEnd = new Date(periodStart);
                            periodEnd.setMonth(periodStart.getMonth() + recurring.intervalMonths);
                            periodEnd.setDate(periodEnd.getDate() - 1);
                            
                            const nextInvoice = new Date(recurring.nextInvoiceDate);
                            
                            return (
                              <span>
                                <span className="text-white font-medium">
                                  {language === 'nl' ? 'Periode' : 'Period'} #{periodNumber}
                                </span>
                                <span className="text-gray-400"> • </span>
                                <span>
                                  {periodStart.toLocaleDateString('nl-NL')} - {periodEnd.toLocaleDateString('nl-NL')}
                                </span>
                                <br />
                                <span className="text-primary-400 text-xs">
                                  {language === 'nl' ? 'Volgende factuur' : 'Next invoice'}: {nextInvoice.toLocaleDateString('nl-NL')}
                                </span>
                              </span>
                            );
                          })()}
                        </p>
                      </div>

                      {/* Payment History Toggle */}
                      <button
                        onClick={() => {
                          if (!recurringPaymentTracking[recurring.id]) {
                            loadRecurringPaymentTracking(recurring.id);
                          } else {
                            // Toggle by removing from state
                            setRecurringPaymentTracking(prev => {
                              const newState = { ...prev };
                              delete newState[recurring.id];
                              return newState;
                            });
                          }
                        }}
                        className="w-full text-left text-sm text-primary-400 hover:text-primary-300 flex items-center justify-between py-2 px-3 bg-dark-800 rounded border border-dark-600 hover:border-primary-500 transition"
                      >
                        <span className="flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                          </svg>
                          {language === 'nl' ? 'Betalingsoverzicht' : 'Payment Tracking'}
                        </span>
                        <svg 
                          className={`w-4 h-4 transition-transform ${recurringPaymentTracking[recurring.id] ? 'rotate-180' : ''}`} 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      {/* Payment History List */}
                      {recurringPaymentTracking[recurring.id] && (
                        <div className="mt-3 space-y-2">
                          {recurringPaymentTracking[recurring.id].length === 0 ? (
                            <p className="text-gray-500 text-sm text-center py-4 bg-dark-800 rounded">
                              {language === 'nl' ? 'Nog geen betalingshistorie beschikbaar' : 'No payment history available yet'}
                            </p>
                          ) : (
                            recurringPaymentTracking[recurring.id].map((period: any) => (
                              <div key={period.id} className="flex items-center justify-between bg-dark-800 p-3 rounded border border-dark-600">
                                <div className="flex items-center gap-3">
                                  <span className={`w-3 h-3 rounded-full ${period.status === 'paid' ? 'bg-green-500' : period.status === 'overdue' ? 'bg-red-500' : 'bg-yellow-500'}`}></span>
                                  <div>
                                    <p className="text-sm font-medium text-white">{language === 'nl' ? 'Periode' : 'Period'} #{period.periodNumber}</p>
                                    <p className="text-xs text-gray-400">
                                      {new Date(period.periodStartDate).toLocaleDateString('nl-NL')} - {new Date(period.periodEndDate).toLocaleDateString('nl-NL')}
                                    </p>
                                    {period.paidDate && (
                                      <p className="text-xs text-green-400">
                                        {language === 'nl' ? 'Betaald op' : 'Paid on'}: {new Date(period.paidDate).toLocaleDateString('nl-NL')}
                                      </p>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center gap-3">
                                  <span className="text-sm font-medium text-white">€{period.amount.toFixed(2)}</span>
                                  {period.status === 'paid' && (
                                    <button
                                      onClick={() => generateRecurringPDF(recurring, period)}
                                      className="text-xs bg-primary-600 text-white px-2 py-1 rounded hover:bg-primary-500 flex items-center gap-1"
                                      title={language === 'nl' ? 'PDF Factuur' : 'PDF Invoice'}
                                    >
                                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                      </svg>
                                      PDF
                                    </button>
                                  )}
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Project Details Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-800 rounded-lg border border-dark-700 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">{selectedProject.title}</h2>
                  <p className="text-gray-400">{selectedProject.description}</p>
                  {/* Contact Phone */}
                  <div className="flex items-center gap-2 mt-3 text-sm text-primary-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span>{t('dashboard.questionsCall')} </span>
                    <a href="tel:+31636075966" className="font-semibold hover:text-primary-300 transition">06-36075966</a>
                  </div>
                </div>
                <button onClick={closeProjectDetails} className="text-gray-400 hover:text-white">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Progress Section */}
              <div className="bg-dark-900 p-4 rounded-lg border border-dark-700 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold text-white">{t('dashboard.progress')}</h3>
                  <span className="text-2xl font-bold text-primary-400">{selectedProject?.progress || 0}%</span>
                </div>
                <div className="w-full bg-dark-700 rounded-full h-3 mb-4">
                  <div 
                    className={`${getProgressColor(selectedProject?.progress || 0)} h-3 rounded-full transition-all duration-500`}
                    style={{ width: `${selectedProject?.progress || 0}%` }}
                  ></div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div className="bg-dark-800 p-3 rounded">
                    <div className="text-xs text-gray-400">{t('dashboard.status')}</div>
                    <div className="text-sm font-medium text-white">
                      {selectedProject?.status === 'planning' ? t('common.planning') :
                       selectedProject?.status === 'active' ? t('common.active') :
                       selectedProject?.status === 'completed' ? t('common.completed') : t('common.paused')}
                    </div>
                  </div>
                  {selectedProject?.deadline && (
                    <div className="bg-dark-800 p-3 rounded">
                      <div className="text-xs text-gray-400">{t('dashboard.deadline')}</div>
                      <div className="text-sm font-medium text-white">
                        {new Date(selectedProject.deadline).toLocaleDateString('nl-NL')}
                      </div>
                    </div>
                  )}
                  {selectedProject?.budget && (
                    <div className="bg-dark-800 p-3 rounded">
                      <div className="text-xs text-gray-400">{t('dashboard.budget')}</div>
                      <div className="text-sm font-medium text-white">€{selectedProject.budget.toFixed(2)}</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Project Logs */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">{t('dashboard.projectUpdates')}</h3>
                {logsLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
                    <p className="text-gray-400 mt-2">{t('dashboard.loadingUpdates')}</p>
                  </div>
                ) : projectLogs.length === 0 ? (
                  <div className="bg-dark-900 p-6 rounded-lg border border-dark-700 text-center">
                    <p className="text-gray-400">{t('dashboard.noUpdates')}</p>
                    <p className="text-gray-500 text-sm mt-1">{t('dashboard.adminWillPostUpdates')}</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {projectLogs.map((log) => (
                      <div key={log.id} className="bg-dark-900 p-4 rounded-lg border border-dark-700">
                        <div className="flex items-start gap-3">
                          <span className="text-2xl">{getLogTypeIcon(log.logType)}</span>
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-1">
                              <div>
                                <span className="text-xs font-medium text-primary-400 uppercase tracking-wide">
                                  {getLogTypeLabel(log.logType)}
                                </span>
                                <h4 className="text-white font-medium">{log.title}</h4>
                              </div>
                              <span className="text-xs text-gray-500">
                                {new Date(log.createdAt).toLocaleDateString('nl-NL')}
                              </span>
                            </div>
                            <p className="text-gray-400 text-sm">{log.description}</p>
                            {log.createdBy && (
                              <p className="text-xs text-gray-500 mt-2">{t('dashboard.by')} {log.createdBy}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </PageTransition>
  );
};

const Dashboard: React.FC = () => {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = mockAuth.onAuthChanged((currentUser) => {
      if (currentUser) {
        if (roleService.isAdmin(currentUser.email)) {
          navigate('/admin');
          return;
        }
      } else {
        navigate('/login');
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [navigate]);

  if (loading) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-dark-900 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
            <p className="mt-4 text-gray-400">{t('common.loading')}</p>
          </div>
        </div>
      </PageTransition>
    );
  }

  return <CustomerDashboard />;
};

export default Dashboard;
