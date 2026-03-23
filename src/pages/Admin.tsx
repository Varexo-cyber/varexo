import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockAuth } from '../services/mockAuth';
import { roleService } from '../services/roleService';
import { projectService, Customer, Project, Invoice, ProjectLog } from '../services/projectService';
import PageTransition from '../components/PageTransition';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'customers' | 'projects' | 'invoices'>('customers');
  
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [stats, setStats] = useState<any>({});

  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showEditProjectForm, setShowEditProjectForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<string>('');

  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [showCustomerDeleteConfirm, setShowCustomerDeleteConfirm] = useState<string | null>(null);
  const [showProjectLogs, setShowProjectLogs] = useState(false);
  const [selectedProjectForLogs, setSelectedProjectForLogs] = useState<Project | null>(null);
  const [projectLogs, setProjectLogs] = useState<ProjectLog[]>([]);
  
  // Invoice details modal
  const [showInvoiceDetails, setShowInvoiceDetails] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [newLogForm, setNewLogForm] = useState({
    title: '',
    description: '',
    logType: 'update' as 'update' | 'milestone' | 'bugfix' | 'feature' | 'design' | 'deployment'
  });

  const [projectForm, setProjectForm] = useState({
    title: '',
    description: '',
    status: 'planning' as 'planning' | 'active' | 'completed' | 'paused',
    deadline: '',
    budget: '',
    progress: 0
  });

  const [invoiceForm, setInvoiceForm] = useState({
    invoiceNumber: '',
    invoiceDate: new Date().toISOString().split('T')[0],
    customerName: '',
    customerCompany: '',
    customerAddress: '',
    customerPostal: '',
    customerCity: '',
    customerPhone: '',
    customerEmail: '',
    projectTitle: '',
    amount: '',
    dueDate: '',
    items: [{ description: '', quantity: 1, price: 0, total: 0 }]
  });

  useEffect(() => {
    const unsubscribe = mockAuth.onAuthChanged((currentUser) => {
      if (currentUser && roleService.isAdmin(currentUser.email)) {
        loadData();
      } else {
        navigate('/dashboard');
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [navigate]);

  const loadData = async () => {
    try {
      const [c, p, i, s] = await Promise.all([
        projectService.getCustomersAsync(),
        projectService.getAllProjectsAsync(),
        projectService.getAllInvoicesAsync(),
        projectService.getStatsAsync()
      ]);
      setCustomers(c);
      setProjects(p);
      setInvoices(i);
      setStats(s);
    } catch (err) {
      console.warn('API failed, using localStorage fallback:', err);
      setCustomers(projectService.getCustomers());
      setProjects(projectService.getAllProjects());
      setInvoices(projectService.getAllInvoices());
      setStats(projectService.getStats());
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer) return;

    try {
      await projectService.createProjectAsync({
        title: projectForm.title,
        description: projectForm.description,
        status: projectForm.status,
        customerEmail: selectedCustomer,
        deadline: projectForm.deadline || undefined,
        budget: projectForm.budget ? parseFloat(projectForm.budget) : undefined
      });

      setShowProjectForm(false);
      setProjectForm({ title: '', description: '', status: 'planning', deadline: '', budget: '', progress: 0 });
      setSelectedCustomer('');
      loadData();
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  const handleUpdateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    try {
      await projectService.updateProjectAsync(editingProject.id, {
        title: projectForm.title,
        description: projectForm.description,
        status: projectForm.status,
        deadline: projectForm.deadline || undefined,
        budget: projectForm.budget ? parseFloat(projectForm.budget) : undefined,
        progress: projectForm.progress
      });

      setShowEditProjectForm(false);
      setEditingProject(null);
      setProjectForm({ title: '', description: '', status: 'planning', deadline: '', budget: '', progress: 0 });
      loadData();
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  const openEditProject = (project: Project) => {
    setEditingProject(project);
    setProjectForm({
      title: project.title,
      description: project.description,
      status: project.status,
      deadline: project.deadline ? project.deadline.substring(0, 10) : '',
      budget: project.budget?.toString() || '',
      progress: project.progress || 0
    });
    setShowEditProjectForm(true);
  };

  const openProjectLogs = async (project: Project) => {
    setSelectedProjectForLogs(project);
    try {
      const logs = await projectService.getProjectLogsAsync(project.id);
      setProjectLogs(logs);
    } catch {
      setProjectLogs(projectService.getProjectLogs(project.id));
    }
    setShowProjectLogs(true);
  };

  const closeProjectLogs = () => {
    setShowProjectLogs(false);
    setSelectedProjectForLogs(null);
    setProjectLogs([]);
    setNewLogForm({ title: '', description: '', logType: 'update' });
  };

  const openInvoiceDetails = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setShowInvoiceDetails(true);
  };

  const closeInvoiceDetails = () => {
    setShowInvoiceDetails(false);
    setSelectedInvoice(null);
  };

  const handleDeleteProject = async (projectId: string) => {
    try {
      await projectService.deleteProjectAsync(projectId);
      setShowDeleteConfirm(null);
      loadData();
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const handleDeleteCustomer = async (email: string) => {
    try {
      await projectService.deleteCustomerAsync(email);
      setShowCustomerDeleteConfirm(null);
      loadData();
    } catch (error) {
      console.error('Error deleting customer:', error);
    }
  };

  const handleAddLog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectForLogs) return;

    try {
      await projectService.addProjectLogAsync({
        projectId: selectedProjectForLogs.id,
        title: newLogForm.title,
        description: newLogForm.description,
        logType: newLogForm.logType,
        createdBy: 'Admin'
      });
      
      setNewLogForm({ title: '', description: '', logType: 'update' });
      
      // Refresh logs
      const logs = await projectService.getProjectLogsAsync(selectedProjectForLogs.id);
      setProjectLogs(logs);
    } catch (error) {
      console.error('Error adding log:', error);
    }
  };

  const handleUpdateProgress = async (projectId: string, progress: number) => {
    try {
      await projectService.updateProjectProgressAsync(projectId, progress);
      loadData();
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer) return;

    try {
      const items = invoiceForm.items.map(item => ({
        description: item.description,
        quantity: item.quantity,
        price: item.price,
        total: item.quantity * item.price
      }));

      await projectService.createInvoiceAsync({
        invoiceNumber: invoiceForm.invoiceNumber,
        invoiceDate: invoiceForm.invoiceDate,
        projectTitle: invoiceForm.projectTitle,
        customerEmail: selectedCustomer,
        customerName: invoiceForm.customerName,
        customerCompany: invoiceForm.customerCompany,
        customerAddress: invoiceForm.customerAddress,
        customerPostal: invoiceForm.customerPostal,
        customerCity: invoiceForm.customerCity,
        customerPhone: invoiceForm.customerPhone,
        amount: items.reduce((sum, item) => sum + item.total, 0),
        status: 'draft',
        dueDate: invoiceForm.dueDate,
        items
      });

      setShowInvoiceForm(false);
      setInvoiceForm({ 
        invoiceNumber: '', 
        invoiceDate: new Date().toISOString().split('T')[0], 
        customerName: '', 
        customerCompany: '', 
        customerAddress: '', 
        customerPostal: '', 
        customerCity: '', 
        customerPhone: '', 
        customerEmail: '', 
        projectTitle: '', 
        amount: '', 
        dueDate: '', 
        items: [{ description: '', quantity: 1, price: 0, total: 0 }] 
      });
      setSelectedCustomer('');
      loadData();
    } catch (error) {
      console.error('Error creating invoice:', error);
    }
  };

  const addInvoiceItem = () => {
    setInvoiceForm(prev => ({
      ...prev,
      items: [...prev.items, { description: '', quantity: 1, price: 0, total: 0 }]
    }));
  };

  const updateInvoiceItem = (index: number, field: string, value: string | number) => {
    const items = [...invoiceForm.items];
    items[index] = { ...items[index], [field]: value };
    
    if (field === 'quantity' || field === 'price') {
      const quantity = typeof items[index].quantity === 'number' ? items[index].quantity : 1;
      const price = typeof items[index].price === 'number' ? items[index].price : 0;
      items[index].total = quantity * price;
    }
    
    setInvoiceForm(prev => ({ ...prev, items }));
  };

  const generatePDF = (invoice: Invoice) => {
    // Get customer details from invoice metadata or form
    const customerName = (invoice as any).customerName || invoice.customerEmail.split('@')[0];
    const customerCompany = (invoice as any).customerCompany || '';
    const customerAddress = (invoice as any).customerAddress || '';
    const customerPostal = (invoice as any).customerPostal || '';
    const customerCity = (invoice as any).customerCity || '';
    const customerPhone = (invoice as any).customerPhone || '';
    const customerEmail = invoice.customerEmail;
    const invoiceNumber = (invoice as any).invoiceNumber || invoice.invoiceNumber;
    const invoiceDate = (invoice as any).invoiceDate || new Date(invoice.createdAt).toLocaleDateString('nl-NL');
    
    // Calculate totals
    const subtotal = invoice.amount;
    const btw = 0; // BTW 0% voor particulier
    const total = subtotal + btw;

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
              padding: 60px;
              color: #333;
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
              grid-template-columns: 1fr 1fr 2fr 1fr;
              background: #f8f9fa;
              margin: 0 40px;
              padding: 15px 20px;
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
                    <p>${invoiceDate}</p>
                  </div>
                  <div class="info-block">
                    <h3>Factuurnummer</h3>
                    <p>${invoiceNumber}</p>
                  </div>
                </div>
              </div>
              <div class="logo-section">
                <!-- Clean Varexo Logo -->
                <svg width="140" height="70" viewBox="0 0 280 100" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="vGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style="stop-color:#2563eb"/>
                      <stop offset="100%" style="stop-color:#1e40af"/>
                    </linearGradient>
                  </defs>
                  <!-- V shape -->
                  <path d="M30,25 L70,85 L110,25" fill="none" stroke="url(#vGradient)" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>
                  <!-- Text VAREXO -->
                  <text x="125" y="65" font-family="system-ui, -apple-system, sans-serif" font-size="42" font-weight="700" fill="#1e40af" letter-spacing="2">VAREXO</text>
                  <!-- Tagline -->
                  <text x="125" y="82" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#64748b" letter-spacing="1.5">ICT • WEBSITES • SOFTWARE</text>
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

            <!-- Customer Section -->
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

            <!-- Summary Row -->
            <div class="summary-row">
              <span>VAREXO</span>
              <span>DIENSTVERLENING</span>
              <span>BETALINGSVOORWAARDEN<br><small style="font-weight:400;font-size:11px;">Betaling binnen 14 dagen</small></span>
              <span>${invoiceForm.dueDate ? new Date(invoiceForm.dueDate).toLocaleDateString('nl-NL') : new Date(invoice.dueDate).toLocaleDateString('nl-NL')}</span>
            </div>

            <!-- Items Table -->
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

            <!-- Totals Section -->
            <div class="totals-section">
              <div class="totals-table">
                <div class="totals-row">
                  <span>Subtotaal</span>
                  <span>€${subtotal.toFixed(2)}</span>
                </div>
                <div class="totals-row">
                  <span>Btw</span>
                  <span>€${btw.toFixed(2)}</span>
                </div>
                <div class="totals-row total">
                  <span>Totaal</span>
                  <span>€${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <!-- Footer -->
            <div class="footer">
              <div class="footer-content">
                <div class="footer-left">
                </div>
                <div class="footer-right">
                  <strong>Varexo</strong><br>
                  t.n.v. Mohammed Taher<br>
                  IBAN: NL75INGB0756428726<br>
                  BTW: niet van toepassing (particulier)
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

  return (
    <PageTransition>
      <div className="min-h-screen bg-dark-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white">Admin Panel</h1>
            <p className="text-gray-400 mt-1">Beheer klanten, projecten en facturen</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            <div className="bg-dark-800 p-4 rounded-lg border border-dark-700">
              <p className="text-gray-400 text-sm">Klanten</p>
              <p className="text-2xl font-bold text-white">{stats.totalCustomers || 0}</p>
            </div>
            <div className="bg-dark-800 p-4 rounded-lg border border-dark-700">
              <p className="text-gray-400 text-sm">Projecten</p>
              <p className="text-2xl font-bold text-white">{stats.totalProjects || 0}</p>
            </div>
            <div className="bg-dark-800 p-4 rounded-lg border border-dark-700">
              <p className="text-gray-400 text-sm">Actief</p>
              <p className="text-2xl font-bold text-primary-400">{stats.activeProjects || 0}</p>
            </div>
            <div className="bg-dark-800 p-4 rounded-lg border border-dark-700">
              <p className="text-gray-400 text-sm">Omzet</p>
              <p className="text-2xl font-bold text-green-400">€{(stats.totalRevenue || 0).toFixed(2)}</p>
            </div>
            <div className="bg-dark-800 p-4 rounded-lg border border-dark-700">
              <p className="text-gray-400 text-sm">Openstaand</p>
              <p className="text-2xl font-bold text-yellow-400">{stats.pendingInvoices || 0}</p>
            </div>
            <div className="bg-dark-800 p-4 rounded-lg border border-dark-700">
              <p className="text-gray-400 text-sm">Te laat</p>
              <p className="text-2xl font-bold text-red-400">{stats.overdueInvoices || 0}</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-dark-700 mb-6">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('customers')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'customers'
                    ? 'border-primary-500 text-primary-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
              >
                Klanten ({customers.length})
              </button>
              <button
                onClick={() => setActiveTab('projects')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'projects'
                    ? 'border-primary-500 text-primary-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
              >
                Projecten ({projects.length})
              </button>
              <button
                onClick={() => setActiveTab('invoices')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'invoices'
                    ? 'border-primary-500 text-primary-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
              >
                Facturen ({invoices.length})
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          {activeTab === 'customers' && (
            <div className="bg-dark-800 rounded-lg border border-dark-700">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-white">Klanten</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-dark-700">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Klant</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Bedrijf</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Projecten</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Facturen</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Acties</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-dark-700">
                      {customers.map((customer) => (
                        <tr key={customer.email}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-white">{customer.displayName}</div>
                              <div className="text-sm text-gray-400">{customer.email}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                            {customer.company || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                            {customer.projectCount}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                            {customer.invoiceCount}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => {
                                  setSelectedCustomer(customer.email);
                                  setShowProjectForm(true);
                                }}
                                className="text-primary-400 hover:text-primary-300"
                              >
                                Project
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedCustomer(customer.email);
                                  setShowInvoiceForm(true);
                                }}
                                className="text-green-400 hover:text-green-300"
                              >
                                Factuur
                              </button>
                              <button
                                onClick={() => setShowCustomerDeleteConfirm(customer.email)}
                                className="text-red-400 hover:text-red-300"
                              >
                                Verwijderen
                              </button>
                            </div>
                          </td>

                          {/* Customer Delete Confirmation */}
                          {showCustomerDeleteConfirm === customer.email && (
                            <tr>
                              <td colSpan={5} className="px-6 py-4">
                                <div className="p-3 bg-red-900/30 border border-red-700 rounded-lg">
                                  <p className="text-red-300 text-sm mb-2">
                                    Weet je zeker dat je klant <strong>{customer.displayName}</strong> wilt verwijderen? 
                                    Dit verwijdert ook alle projecten en facturen van deze klant.
                                  </p>
                                  <div className="flex space-x-2">
                                    <button
                                      onClick={() => handleDeleteCustomer(customer.email)}
                                      className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-500"
                                    >
                                      Ja, verwijderen
                                    </button>
                                    <button
                                      onClick={() => setShowCustomerDeleteConfirm(null)}
                                      className="px-3 py-1 bg-dark-700 text-gray-300 text-xs rounded hover:bg-dark-600"
                                    >
                                      Annuleren
                                    </button>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="bg-dark-800 rounded-lg border border-dark-700">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-white">Projecten</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {projects.map((project) => (
                    <div key={project.id} className="bg-dark-900 p-4 rounded-lg border border-dark-700">
                      <h3 className="text-lg font-medium text-white mb-2">{project.title}</h3>
                      <p className="text-gray-400 text-sm mb-3">{project.description}</p>
                      
                      {/* Progress Bar */}
                      <div className="mb-3">
                        <div className="flex justify-between text-xs text-gray-400 mb-1">
                          <span>Voortgang</span>
                          <span>{project.progress || 0}%</span>
                        </div>
                        <div className="w-full bg-dark-700 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-500 ${
                              (project.progress || 0) < 25 ? 'bg-red-500' :
                              (project.progress || 0) < 50 ? 'bg-yellow-500' :
                              (project.progress || 0) < 75 ? 'bg-blue-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${project.progress || 0}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center mb-3">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          project.status === 'active' ? 'bg-green-900 text-green-300' :
                          project.status === 'completed' ? 'bg-blue-900 text-blue-300' :
                          project.status === 'paused' ? 'bg-yellow-900 text-yellow-300' :
                          'bg-gray-900 text-gray-300'
                        }`}>
                          {project.status}
                        </span>
                        <span className="text-xs text-gray-400">{project.customerEmail}</span>
                      </div>
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => openProjectLogs(project)}
                          className="text-green-400 hover:text-green-300 text-sm"
                        >
                          Logs
                        </button>
                        <button
                          onClick={() => openEditProject(project)}
                          className="text-primary-400 hover:text-primary-300 text-sm"
                        >
                          Bewerken
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(project.id)}
                          className="text-red-400 hover:text-red-300 text-sm"
                        >
                          Verwijderen
                        </button>
                      </div>

                      {/* Delete Confirmation */}
                      {showDeleteConfirm === project.id && (
                        <div className="mt-3 p-3 bg-red-900/30 border border-red-700 rounded-lg">
                          <p className="text-red-300 text-sm mb-2">Weet je zeker dat je dit project wilt verwijderen?</p>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleDeleteProject(project.id)}
                              className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-500"
                            >
                              Ja, verwijderen
                            </button>
                            <button
                              onClick={() => setShowDeleteConfirm(null)}
                              className="px-3 py-1 bg-dark-700 text-gray-300 text-xs rounded hover:bg-dark-600"
                            >
                              Annuleren
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'invoices' && (
            <div className="bg-dark-800 rounded-lg border border-dark-700">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-white">Facturen</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-dark-700">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Factuur</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Klant</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Bedrag</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Acties</th>
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
                            {invoice.customerEmail}
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
                              {invoice.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-3">
                              <button
                                onClick={() => openInvoiceDetails(invoice)}
                                className="text-blue-400 hover:text-blue-300"
                              >
                                Bekijk
                              </button>
                              <button
                                onClick={() => generatePDF(invoice)}
                                className="text-primary-400 hover:text-primary-300"
                              >
                                PDF
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Project Form Modal */}
          {showProjectForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-dark-800 rounded-lg p-6 w-full max-w-md border border-dark-700">
                <h3 className="text-xl font-semibold text-white mb-4">Nieuw Project</h3>
                <form onSubmit={handleCreateProject}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Klant</label>
                      <select
                        value={selectedCustomer}
                        onChange={(e) => setSelectedCustomer(e.target.value)}
                        className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white"
                        required
                      >
                        <option value="">Selecteer klant</option>
                        {customers.map(customer => (
                          <option key={customer.email} value={customer.email}>
                            {customer.displayName} ({customer.email})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Titel</label>
                      <input
                        type="text"
                        value={projectForm.title}
                        onChange={(e) => setProjectForm(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Beschrijving</label>
                      <textarea
                        value={projectForm.description}
                        onChange={(e) => setProjectForm(prev => ({ ...prev, description: e.target.value }))}
                        className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white"
                        rows={3}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
                      <select
                        value={projectForm.status}
                        onChange={(e) => setProjectForm(prev => ({ ...prev, status: e.target.value as any }))}
                        className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white"
                      >
                        <option value="planning">Planning</option>
                        <option value="active">Actief</option>
                        <option value="completed">Voltooid</option>
                        <option value="paused">Gepauzeerd</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Deadline</label>
                      <input
                        type="date"
                        value={projectForm.deadline}
                        onChange={(e) => setProjectForm(prev => ({ ...prev, deadline: e.target.value }))}
                        className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Budget</label>
                      <input
                        type="number"
                        value={projectForm.budget}
                        onChange={(e) => setProjectForm(prev => ({ ...prev, budget: e.target.value }))}
                        className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-3 mt-6">
                    <button
                      type="button"
                      onClick={() => setShowProjectForm(false)}
                      className="px-4 py-2 text-gray-400 hover:text-white"
                    >
                      Annuleren
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-primary-500 text-dark-900 rounded-lg font-medium hover:bg-primary-400"
                    >
                      Aanmaken
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Edit Project Form Modal */}
          {showEditProjectForm && editingProject && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-dark-800 rounded-lg p-6 w-full max-w-md border border-dark-700">
                <h3 className="text-xl font-semibold text-white mb-4">Project Bewerken</h3>
                <form onSubmit={handleUpdateProject}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Titel</label>
                      <input
                        type="text"
                        value={projectForm.title}
                        onChange={(e) => setProjectForm(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Beschrijving</label>
                      <textarea
                        value={projectForm.description}
                        onChange={(e) => setProjectForm(prev => ({ ...prev, description: e.target.value }))}
                        className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white"
                        rows={3}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
                      <select
                        value={projectForm.status}
                        onChange={(e) => setProjectForm(prev => ({ ...prev, status: e.target.value as any }))}
                        className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white"
                      >
                        <option value="planning">Planning</option>
                        <option value="active">Actief</option>
                        <option value="completed">Voltooid</option>
                        <option value="paused">Gepauzeerd</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Deadline</label>
                      <input
                        type="date"
                        value={projectForm.deadline}
                        onChange={(e) => setProjectForm(prev => ({ ...prev, deadline: e.target.value }))}
                        className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Voortgang: {projectForm.progress}%
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={projectForm.progress}
                        onChange={(e) => setProjectForm(prev => ({ ...prev, progress: parseInt(e.target.value) }))}
                        className="w-full h-2 bg-dark-700 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="w-full bg-dark-700 rounded-full h-2 mt-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-500 ${
                            projectForm.progress < 25 ? 'bg-red-500' :
                            projectForm.progress < 50 ? 'bg-yellow-500' :
                            projectForm.progress < 75 ? 'bg-blue-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${projectForm.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Budget</label>
                      <input
                        type="number"
                        value={projectForm.budget}
                        onChange={(e) => setProjectForm(prev => ({ ...prev, budget: e.target.value }))}
                        className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-3 mt-6">
                    <button
                      type="button"
                      onClick={() => {
                        setShowEditProjectForm(false);
                        setEditingProject(null);
                        setProjectForm({ title: '', description: '', status: 'planning', deadline: '', budget: '', progress: 0 });
                      }}
                      className="px-4 py-2 text-gray-400 hover:text-white"
                    >
                      Annuleren
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-primary-500 text-dark-900 rounded-lg font-medium hover:bg-primary-400"
                    >
                      Opslaan
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Invoice Form Modal */}
          {showInvoiceForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-dark-800 rounded-lg p-6 w-full max-w-3xl border border-dark-700 max-h-[90vh] overflow-y-auto">
                <h3 className="text-xl font-semibold text-white mb-4">Nieuwe Factuur</h3>
                <form onSubmit={handleCreateInvoice}>
                  <div className="space-y-4">
                    {/* Invoice Details */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Factuurnummer</label>
                        <input
                          type="text"
                          value={invoiceForm.invoiceNumber}
                          onChange={(e) => setInvoiceForm(prev => ({ ...prev, invoiceNumber: e.target.value }))}
                          className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white"
                          placeholder="bv. 2026-001"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Factuurdatum</label>
                        <input
                          type="date"
                          value={invoiceForm.invoiceDate}
                          onChange={(e) => setInvoiceForm(prev => ({ ...prev, invoiceDate: e.target.value }))}
                          className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white"
                          required
                        />
                      </div>
                    </div>

                    {/* Customer Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Klant (e-mail)</label>
                      <select
                        value={selectedCustomer}
                        onChange={(e) => {
                          setSelectedCustomer(e.target.value);
                          // Auto-fill customer email
                          setInvoiceForm(prev => ({ ...prev, customerEmail: e.target.value }));
                        }}
                        className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white"
                        required
                      >
                        <option value="">Selecteer klant</option>
                        {customers.map(customer => (
                          <option key={customer.email} value={customer.email}>
                            {customer.displayName} ({customer.email})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Customer Details */}
                    <div className="bg-dark-900 p-4 rounded-lg border border-dark-700">
                      <h4 className="text-sm font-semibold text-primary-400 uppercase mb-3">Klantgegevens</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-400 mb-1">Bedrijfsnaam</label>
                          <input
                            type="text"
                            value={invoiceForm.customerCompany}
                            onChange={(e) => setInvoiceForm(prev => ({ ...prev, customerCompany: e.target.value }))}
                            className="w-full px-3 py-2 bg-dark-800 border border-dark-600 rounded text-white text-sm"
                            placeholder="Bedrijfsnaam"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-400 mb-1">Contactpersoon</label>
                          <input
                            type="text"
                            value={invoiceForm.customerName}
                            onChange={(e) => setInvoiceForm(prev => ({ ...prev, customerName: e.target.value }))}
                            className="w-full px-3 py-2 bg-dark-800 border border-dark-600 rounded text-white text-sm"
                            placeholder="Naam"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-400 mb-1">Adres</label>
                          <input
                            type="text"
                            value={invoiceForm.customerAddress}
                            onChange={(e) => setInvoiceForm(prev => ({ ...prev, customerAddress: e.target.value }))}
                            className="w-full px-3 py-2 bg-dark-800 border border-dark-600 rounded text-white text-sm"
                            placeholder="Straat + huisnummer"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-400 mb-1">Telefoon</label>
                          <input
                            type="text"
                            value={invoiceForm.customerPhone}
                            onChange={(e) => setInvoiceForm(prev => ({ ...prev, customerPhone: e.target.value }))}
                            className="w-full px-3 py-2 bg-dark-800 border border-dark-600 rounded text-white text-sm"
                            placeholder="+31 6 12345678"
                          />
                        </div>
                        <div className="flex gap-2">
                          <div className="w-1/3">
                            <label className="block text-xs font-medium text-gray-400 mb-1">Postcode</label>
                            <input
                              type="text"
                              value={invoiceForm.customerPostal}
                              onChange={(e) => setInvoiceForm(prev => ({ ...prev, customerPostal: e.target.value }))}
                              className="w-full px-3 py-2 bg-dark-800 border border-dark-600 rounded text-white text-sm"
                              placeholder="1234AB"
                            />
                          </div>
                          <div className="flex-1">
                            <label className="block text-xs font-medium text-gray-400 mb-1">Plaats</label>
                            <input
                              type="text"
                              value={invoiceForm.customerCity}
                              onChange={(e) => setInvoiceForm(prev => ({ ...prev, customerCity: e.target.value }))}
                              className="w-full px-3 py-2 bg-dark-800 border border-dark-600 rounded text-white text-sm"
                              placeholder="Amsterdam"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Project / Omschrijving</label>
                      <input
                        type="text"
                        value={invoiceForm.projectTitle}
                        onChange={(e) => setInvoiceForm(prev => ({ ...prev, projectTitle: e.target.value }))}
                        className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white"
                        placeholder="Website Ontwikkeling"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Vervaldatum</label>
                      <input
                        type="date"
                        value={invoiceForm.dueDate}
                        onChange={(e) => setInvoiceForm(prev => ({ ...prev, dueDate: e.target.value }))}
                        className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white"
                        required
                      />
                    </div>
                    
                    {/* Invoice Items */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-medium text-gray-300">Factuurregels</label>
                        <button
                          type="button"
                          onClick={addInvoiceItem}
                          className="text-primary-400 hover:text-primary-300 text-sm"
                        >
                          + Regel toevoegen
                        </button>
                      </div>
                      <div className="bg-dark-900 p-3 rounded-lg border border-dark-700">
                        <div className="grid grid-cols-12 gap-2 mb-2 text-xs text-gray-400 uppercase">
                          <div className="col-span-1">Aantal</div>
                          <div className="col-span-6">Omschrijving</div>
                          <div className="col-span-3">Prijs</div>
                          <div className="col-span-2">Totaal</div>
                        </div>
                        {invoiceForm.items.map((item, index) => (
                          <div key={index} className="grid grid-cols-12 gap-2 mb-2">
                            <input
                              type="number"
                              placeholder="1"
                              value={item.quantity}
                              onChange={(e) => updateInvoiceItem(index, 'quantity', parseInt(e.target.value) || 1)}
                              className="col-span-1 px-2 py-2 bg-dark-800 border border-dark-600 rounded text-white text-sm text-center"
                              required
                            />
                            <input
                              type="text"
                              placeholder="Omschrijving"
                              value={item.description}
                              onChange={(e) => updateInvoiceItem(index, 'description', e.target.value)}
                              className="col-span-6 px-2 py-2 bg-dark-800 border border-dark-600 rounded text-white text-sm"
                              required
                            />
                            <input
                              type="number"
                              placeholder="0.00"
                              value={item.price}
                              onChange={(e) => updateInvoiceItem(index, 'price', parseFloat(e.target.value) || 0)}
                              className="col-span-3 px-2 py-2 bg-dark-800 border border-dark-600 rounded text-white text-sm"
                              required
                            />
                            <div className="col-span-2 px-2 py-2 bg-dark-800 border border-dark-600 rounded text-gray-400 text-sm flex items-center justify-end">
                              €{((item.quantity || 1) * (item.price || 0)).toFixed(2)}
                            </div>
                          </div>
                        ))}
                        {/* Total */}
                        <div className="border-t border-dark-600 mt-3 pt-3 flex justify-end">
                          <div className="text-right">
                            <div className="text-sm text-gray-400">Totaalbedrag</div>
                            <div className="text-xl font-bold text-white">
                              €{invoiceForm.items.reduce((sum, item) => sum + (item.quantity * item.price), 0).toFixed(2)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-3 mt-6">
                    <button
                      type="button"
                      onClick={() => setShowInvoiceForm(false)}
                      className="px-4 py-2 text-gray-400 hover:text-white"
                    >
                      Annuleren
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-primary-500 text-dark-900 rounded-lg font-medium hover:bg-primary-400"
                    >
                      Aanmaken & PDF Genereren
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
          {/* Invoice Details Modal */}
          {showInvoiceDetails && selectedInvoice && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-dark-800 rounded-lg border border-dark-700 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-white">Factuur Details</h3>
                      <p className="text-primary-400 text-lg">{selectedInvoice.invoiceNumber}</p>
                    </div>
                    <button onClick={closeInvoiceDetails} className="text-gray-400 hover:text-white">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-6 mb-6">
                    {/* Invoice Info */}
                    <div className="bg-dark-900 p-4 rounded-lg border border-dark-700">
                      <h4 className="text-sm font-semibold text-primary-400 uppercase mb-3">Factuurinformatie</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Factuurnummer:</span>
                          <span className="text-white">{selectedInvoice.invoiceNumber}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Factuurdatum:</span>
                          <span className="text-white">{selectedInvoice.invoiceDate ? new Date(selectedInvoice.invoiceDate).toLocaleDateString('nl-NL') : new Date(selectedInvoice.createdAt).toLocaleDateString('nl-NL')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Vervaldatum:</span>
                          <span className="text-white">{new Date(selectedInvoice.dueDate).toLocaleDateString('nl-NL')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Status:</span>
                          <span className="text-white capitalize">{selectedInvoice.status}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Project:</span>
                          <span className="text-white">{selectedInvoice.projectTitle}</span>
                        </div>
                      </div>
                    </div>

                    {/* Customer Info */}
                    <div className="bg-dark-900 p-4 rounded-lg border border-dark-700">
                      <h4 className="text-sm font-semibold text-primary-400 uppercase mb-3">Klantgegevens</h4>
                      <div className="space-y-2 text-sm">
                        {selectedInvoice.customerCompany && (
                          <div className="flex justify-between">
                            <span className="text-gray-400">Bedrijf:</span>
                            <span className="text-white">{selectedInvoice.customerCompany}</span>
                          </div>
                        )}
                        {selectedInvoice.customerName && (
                          <div className="flex justify-between">
                            <span className="text-gray-400">Contact:</span>
                            <span className="text-white">{selectedInvoice.customerName}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-gray-400">E-mail:</span>
                          <span className="text-white">{selectedInvoice.customerEmail}</span>
                        </div>
                        {selectedInvoice.customerPhone && (
                          <div className="flex justify-between">
                            <span className="text-gray-400">Telefoon:</span>
                            <span className="text-white">{selectedInvoice.customerPhone}</span>
                          </div>
                        )}
                        {(selectedInvoice.customerAddress || selectedInvoice.customerPostal || selectedInvoice.customerCity) && (
                          <div className="flex justify-between">
                            <span className="text-gray-400">Adres:</span>
                            <span className="text-white text-right">
                              {selectedInvoice.customerAddress && <div>{selectedInvoice.customerAddress}</div>}
                              {(selectedInvoice.customerPostal || selectedInvoice.customerCity) && (
                                <div>{selectedInvoice.customerPostal} {selectedInvoice.customerCity}</div>
                              )}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Invoice Items */}
                  <div className="bg-dark-900 p-4 rounded-lg border border-dark-700 mb-6">
                    <h4 className="text-sm font-semibold text-primary-400 uppercase mb-3">Factuurregels</h4>
                    <table className="w-full">
                      <thead>
                        <tr className="text-left text-xs text-gray-400 uppercase border-b border-dark-700">
                          <th className="pb-2">Omschrijving</th>
                          <th className="pb-2 text-center">Aantal</th>
                          <th className="pb-2 text-right">Prijs</th>
                          <th className="pb-2 text-right">Totaal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedInvoice.items.map((item, idx) => (
                          <tr key={idx} className="text-sm">
                            <td className="py-2 text-white">{item.description}</td>
                            <td className="py-2 text-center text-gray-300">{item.quantity}</td>
                            <td className="py-2 text-right text-gray-300">€{item.price.toFixed(2)}</td>
                            <td className="py-2 text-right text-white font-medium">€{item.total.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="border-t border-dark-700">
                          <td colSpan={3} className="pt-3 text-right text-gray-400">Totaalbedrag:</td>
                          <td className="pt-3 text-right text-xl font-bold text-primary-400">€{selectedInvoice.amount.toFixed(2)}</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={closeInvoiceDetails}
                      className="px-4 py-2 text-gray-400 hover:text-white"
                    >
                      Sluiten
                    </button>
                    <button
                      onClick={() => {
                        generatePDF(selectedInvoice);
                        closeInvoiceDetails();
                      }}
                      className="px-4 py-2 bg-primary-500 text-dark-900 rounded-lg font-medium hover:bg-primary-400"
                    >
                      PDF Genereren
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Project Logs Modal */}
          {showProjectLogs && selectedProjectForLogs && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-dark-800 rounded-lg border border-dark-700 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-xl font-semibold text-white">Project Logs: {selectedProjectForLogs.title}</h3>
                      <p className="text-gray-400 text-sm">{selectedProjectForLogs.customerEmail}</p>
                    </div>
                    <button onClick={closeProjectLogs} className="text-gray-400 hover:text-white">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  {/* Add New Log Form */}
                  <form onSubmit={handleAddLog} className="bg-dark-900 p-4 rounded-lg border border-dark-700 mb-6">
                    <h4 className="text-sm font-semibold text-primary-400 uppercase mb-3">Nieuwe Update Toevoegen</h4>
                    <div className="space-y-3">
                      <div>
                        <input
                          type="text"
                          placeholder="Titel van de update"
                          value={newLogForm.title}
                          onChange={(e) => setNewLogForm(prev => ({ ...prev, title: e.target.value }))}
                          className="w-full px-3 py-2 bg-dark-800 border border-dark-600 rounded-lg text-white"
                          required
                        />
                      </div>
                      <div>
                        <textarea
                          placeholder="Beschrijving van wat er is gedaan..."
                          value={newLogForm.description}
                          onChange={(e) => setNewLogForm(prev => ({ ...prev, description: e.target.value }))}
                          className="w-full px-3 py-2 bg-dark-800 border border-dark-600 rounded-lg text-white"
                          rows={2}
                          required
                        />
                      </div>
                      <div className="flex gap-2">
                        <select
                          value={newLogForm.logType}
                          onChange={(e) => setNewLogForm(prev => ({ ...prev, logType: e.target.value as any }))}
                          className="px-3 py-2 bg-dark-800 border border-dark-600 rounded-lg text-white"
                        >
                          <option value="update">📝 Update</option>
                          <option value="milestone">🎯 Mijlpaal</option>
                          <option value="feature">✨ Nieuwe functie</option>
                          <option value="bugfix">🐛 Bugfix</option>
                          <option value="design">🎨 Design</option>
                          <option value="deployment">🚀 Deployment</option>
                        </select>
                        <button
                          type="submit"
                          className="flex-1 px-4 py-2 bg-primary-500 text-dark-900 rounded-lg font-medium hover:bg-primary-400"
                        >
                          Toevoegen
                        </button>
                      </div>
                    </div>
                  </form>

                  {/* Logs List */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-400 uppercase mb-3">Updates & Logs</h4>
                    {projectLogs.length === 0 ? (
                      <div className="text-center py-8 bg-dark-900 rounded-lg border border-dark-700">
                        <p className="text-gray-400">Nog geen updates voor dit project.</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {projectLogs.map((log) => (
                          <div key={log.id} className="bg-dark-900 p-3 rounded-lg border border-dark-700">
                            <div className="flex items-start gap-3">
                              <span className="text-xl">
                                {log.logType === 'milestone' ? '🎯' :
                                 log.logType === 'feature' ? '✨' :
                                 log.logType === 'bugfix' ? '🐛' :
                                 log.logType === 'design' ? '🎨' :
                                 log.logType === 'deployment' ? '🚀' : '📝'}
                              </span>
                              <div className="flex-1">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <span className="text-xs font-medium text-primary-400 uppercase">
                                      {log.logType === 'milestone' ? 'Mijlpaal' :
                                       log.logType === 'feature' ? 'Nieuwe functie' :
                                       log.logType === 'bugfix' ? 'Bugfix' :
                                       log.logType === 'design' ? 'Design' :
                                       log.logType === 'deployment' ? 'Deployment' : 'Update'}
                                    </span>
                                    <h5 className="text-white font-medium">{log.title}</h5>
                                  </div>
                                  <span className="text-xs text-gray-500">
                                    {new Date(log.createdAt).toLocaleDateString('nl-NL')}
                                  </span>
                                </div>
                                <p className="text-gray-400 text-sm mt-1">{log.description}</p>
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

        </div>
      </div>
    </PageTransition>
  );
};

export default AdminDashboard;
