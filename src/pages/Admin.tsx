import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockAuth } from '../services/mockAuth';
import { roleService } from '../services/roleService';
import { projectService, Customer, Project, Invoice } from '../services/projectService';
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

  const [projectForm, setProjectForm] = useState({
    title: '',
    description: '',
    status: 'planning' as 'planning' | 'active' | 'completed' | 'paused',
    deadline: '',
    budget: ''
  });

  const [invoiceForm, setInvoiceForm] = useState({
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

  const loadData = () => {
    setCustomers(projectService.getCustomers());
    setProjects(projectService.getAllProjects());
    setInvoices(projectService.getAllInvoices());
    setStats(projectService.getStats());
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer) return;

    try {
      projectService.createProject({
        title: projectForm.title,
        description: projectForm.description,
        status: projectForm.status,
        customerEmail: selectedCustomer,
        deadline: projectForm.deadline || undefined,
        budget: projectForm.budget ? parseFloat(projectForm.budget) : undefined
      });

      setShowProjectForm(false);
      setProjectForm({ title: '', description: '', status: 'planning', deadline: '', budget: '' });
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
      projectService.updateProject(editingProject.id, {
        title: projectForm.title,
        description: projectForm.description,
        status: projectForm.status,
        deadline: projectForm.deadline || undefined,
        budget: projectForm.budget ? parseFloat(projectForm.budget) : undefined
      });

      setShowEditProjectForm(false);
      setEditingProject(null);
      setProjectForm({ title: '', description: '', status: 'planning', deadline: '', budget: '' });
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
      deadline: project.deadline || '',
      budget: project.budget?.toString() || ''
    });
    setShowEditProjectForm(true);
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

      projectService.createInvoice({
        projectTitle: invoiceForm.projectTitle,
        customerEmail: selectedCustomer,
        amount: items.reduce((sum, item) => sum + item.total, 0),
        status: 'draft',
        dueDate: invoiceForm.dueDate,
        items
      });

      setShowInvoiceForm(false);
      setInvoiceForm({ projectTitle: '', amount: '', dueDate: '', items: [{ description: '', quantity: 1, price: 0, total: 0 }] });
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
    const html = `
      <html>
        <head>
          <title>Factuur ${invoice.invoiceNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            .header { border-bottom: 2px solid #10b981; padding-bottom: 20px; margin-bottom: 30px; }
            .invoice-info { float: right; text-align: right; }
            .items { margin: 30px 0; }
            .items table { width: 100%; border-collapse: collapse; }
            .items th, .items td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            .items th { background-color: #f5f5f5; }
            .total { text-align: right; font-size: 18px; font-weight: bold; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Varexo Factuur</h1>
            <div class="invoice-info">
              <p><strong>Factuurnummer:</strong> ${invoice.invoiceNumber}</p>
              <p><strong>Datum:</strong> ${new Date(invoice.createdAt).toLocaleDateString('nl-NL')}</p>
              <p><strong>Verloopdatum:</strong> ${new Date(invoice.dueDate).toLocaleDateString('nl-NL')}</p>
            </div>
          </div>
          
          <h2>Factuur voor: ${invoice.customerEmail}</h2>
          <h3>Project: ${invoice.projectTitle}</h3>
          
          <div class="items">
            <table>
              <thead>
                <tr>
                  <th>Omschrijving</th>
                  <th>Aantal</th>
                  <th>Prijs</th>
                  <th>Totaal</th>
                </tr>
              </thead>
              <tbody>
                ${invoice.items.map(item => `
                  <tr>
                    <td>${item.description}</td>
                    <td>${item.quantity}</td>
                    <td>€${item.price.toFixed(2)}</td>
                    <td>€${item.total.toFixed(2)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
          
          <div class="total">
            Totaalbedrag: €${invoice.amount.toFixed(2)}
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
                      <div className="flex justify-between items-center mb-2">
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
                      <div className="flex justify-end">
                        <button
                          onClick={() => openEditProject(project)}
                          className="text-primary-400 hover:text-primary-300 text-sm"
                        >
                          Bewerken
                        </button>
                      </div>
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
                            <button
                              onClick={() => generatePDF(invoice)}
                              className="text-primary-400 hover:text-primary-300"
                            >
                              PDF
                            </button>
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
                        setProjectForm({ title: '', description: '', status: 'planning', deadline: '', budget: '' });
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
              <div className="bg-dark-800 rounded-lg p-6 w-full max-w-2xl border border-dark-700 max-h-[90vh] overflow-y-auto">
                <h3 className="text-xl font-semibold text-white mb-4">Nieuwe Factuur</h3>
                <form onSubmit={handleCreateInvoice}>
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
                      <label className="block text-sm font-medium text-gray-300 mb-1">Project</label>
                      <input
                        type="text"
                        value={invoiceForm.projectTitle}
                        onChange={(e) => setInvoiceForm(prev => ({ ...prev, projectTitle: e.target.value }))}
                        className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white"
                        placeholder="Projectnaam"
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
                      {invoiceForm.items.map((item, index) => (
                        <div key={index} className="grid grid-cols-4 gap-2 mb-2">
                          <input
                            type="text"
                            placeholder="Omschrijving"
                            value={item.description}
                            onChange={(e) => updateInvoiceItem(index, 'description', e.target.value)}
                            className="px-2 py-1 bg-dark-700 border border-dark-600 rounded text-white text-sm"
                            required
                          />
                          <input
                            type="number"
                            placeholder="Aantal"
                            value={item.quantity}
                            onChange={(e) => updateInvoiceItem(index, 'quantity', parseInt(e.target.value) || 1)}
                            className="px-2 py-1 bg-dark-700 border border-dark-600 rounded text-white text-sm"
                            required
                          />
                          <input
                            type="number"
                            placeholder="Prijs"
                            value={item.price}
                            onChange={(e) => updateInvoiceItem(index, 'price', parseFloat(e.target.value) || 0)}
                            className="px-2 py-1 bg-dark-700 border border-dark-600 rounded text-white text-sm"
                            required
                          />
                          <div className="px-2 py-1 bg-dark-900 border border-dark-600 rounded text-gray-400 text-sm">
                            €{((item.quantity || 1) * (item.price || 0)).toFixed(2)}
                          </div>
                        </div>
                      ))}
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
                      Aanmaken
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default AdminDashboard;
