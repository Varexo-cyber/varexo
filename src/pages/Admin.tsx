import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockAuth } from '../services/mockAuth';
import { roleService } from '../services/roleService';
import { projectService, Customer, Project, Invoice, ProjectLog } from '../services/projectService';
import { invoicesAPI } from '../services/api';
import { getContactMessages, deleteContactMessage, ContactMessage } from '../services/contactService';
import PageTransition from '../components/PageTransition';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'customers' | 'projects' | 'invoices' | 'recurring' | 'messages' | 'finance'>('customers');
  
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
  const [showCustomerDropdown, setShowCustomerDropdown] = useState<string | null>(null);
  const [showInvoiceDeleteConfirm, setShowInvoiceDeleteConfirm] = useState<string | null>(null);
  const [showProjectDropdown, setShowProjectDropdown] = useState<string | null>(null);
  const [showInvoiceDropdown, setShowInvoiceDropdown] = useState<string | null>(null);
  const [showMessageDropdown, setShowMessageDropdown] = useState<string | null>(null);
  const [showMessageDeleteConfirm, setShowMessageDeleteConfirm] = useState<string | null>(null);
  const [showRecurringDropdown, setShowRecurringDropdown] = useState<string | null>(null);
  const [showRecurringDeleteConfirm, setShowRecurringDeleteConfirm] = useState<string | null>(null);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [recurringInvoices, setRecurringInvoices] = useState<any[]>([]);
  const [showRecurringForm, setShowRecurringForm] = useState(false);
  const [isCreatingInvoice, setIsCreatingInvoice] = useState(false);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [expenseForm, setExpenseForm] = useState({
    description: '',
    amount: '',
    type: 'business' as 'business' | 'personal',
    frequency: 'monthly' as 'monthly' | 'one-time',
    category: '',
    expenseDate: new Date().toISOString().split('T')[0]
  });
  const [editingExpense, setEditingExpense] = useState<any | null>(null);
  const [recurringForm, setRecurringForm] = useState({
    customerEmail: '',
    description: '',
    amount: '',
    startDate: new Date().toISOString().split('T')[0],
    intervalMonths: 1
  });
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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.dropdown-container')) {
        setShowCustomerDropdown(null);
        setShowProjectDropdown(null);
        setShowInvoiceDropdown(null);
        setShowMessageDropdown(null);
        setShowRecurringDropdown(null);
      }
    };

    if (showCustomerDropdown || showProjectDropdown || showInvoiceDropdown || showMessageDropdown || showRecurringDropdown) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showCustomerDropdown, showProjectDropdown, showInvoiceDropdown, showMessageDropdown, showRecurringDropdown]);

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
    // Load contact messages separately (won't fail if table doesn't exist yet)
    try {
      const msgs = await getContactMessages();
      setContactMessages(msgs);
    } catch (e) { console.log('No contact messages yet'); }
    // Load recurring invoices
    try {
      const res = await fetch('/.netlify/functions/recurring-invoices?all=true');
      const ri = await res.json();
      setRecurringInvoices(Array.isArray(ri) ? ri : []);
    } catch (e) { console.log('No recurring invoices yet'); }
    // Load expenses
    try {
      const res = await fetch('/.netlify/functions/expenses');
      const ex = await res.json();
      setExpenses(Array.isArray(ex) ? ex : []);
    } catch (e) { console.log('No expenses yet'); }
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

  const openInvoiceForm = async (customerEmail?: string) => {
    if (customerEmail) setSelectedCustomer(customerEmail);
    // Auto-fetch next invoice number
    try {
      const data = await invoicesAPI.getNextNumber();
      setInvoiceForm(prev => ({ ...prev, invoiceNumber: data.nextNumber }));
    } catch {
      // Fallback: generate locally
      const year = new Date().getFullYear();
      const existing = invoices.filter(i => i.invoiceNumber.startsWith(`${year}-`));
      const nextNum = existing.length + 1;
      setInvoiceForm(prev => ({ ...prev, invoiceNumber: `${year}-${String(nextNum).padStart(3, '0')}` }));
    }
    setShowInvoiceForm(true);
  };

  const handleCreateRecurring = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/.netlify/functions/recurring-invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerEmail: recurringForm.customerEmail,
          description: recurringForm.description,
          amount: parseFloat(recurringForm.amount),
          startDate: recurringForm.startDate,
          intervalMonths: recurringForm.intervalMonths,
        }),
      });
      setShowRecurringForm(false);
      setRecurringForm({ customerEmail: '', description: '', amount: '', startDate: new Date().toISOString().split('T')[0], intervalMonths: 1 });
      loadData();
    } catch (error) {
      console.error('Error creating recurring invoice:', error);
    }
  };

  const handleToggleRecurring = async (id: string, active: boolean) => {
    try {
      await fetch(`/.netlify/functions/recurring-invoices/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !active }),
      });
      loadData();
    } catch (error) {
      console.error('Error toggling recurring invoice:', error);
    }
  };

  const handleDeleteRecurring = async (id: string) => {
    try {
      await fetch(`/.netlify/functions/recurring-invoices/${id}`, { method: 'DELETE' });
      loadData();
    } catch (error) {
      console.error('Error deleting recurring invoice:', error);
    }
  };

  const handleDeleteMessage = async (id: string) => {
    try {
      const result = await deleteContactMessage(id);
      if (result.success) {
        setShowMessageDeleteConfirm(null);
        setShowMessageDropdown(null);
        // Reload messages only
        try {
          const msgs = await getContactMessages();
          setContactMessages(msgs);
        } catch (e) { console.log('Error reloading messages'); }
      } else {
        console.error('Failed to delete message:', result.error);
      }
    } catch (error) {
      console.error('Error deleting message:', error);
    }
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

  const handleDeleteInvoice = async (invoiceId: string) => {
    try {
      await projectService.deleteInvoiceAsync(invoiceId);
      setShowInvoiceDeleteConfirm(null);
      loadData();
    } catch (error) {
      console.error('Error deleting invoice:', error);
    }
  };

  const handleUpdateInvoiceStatus = async (invoiceId: string, status: 'paid' | 'sent' | 'overdue') => {
    try {
      await projectService.updateInvoiceAsync(invoiceId, { status });
      loadData();
    } catch (error) {
      console.error('Error updating invoice status:', error);
    }
  };

  // Expense handlers
  const handleCreateExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/.netlify/functions/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: expenseForm.description,
          amount: parseFloat(expenseForm.amount),
          type: expenseForm.type,
          frequency: expenseForm.frequency,
          category: expenseForm.category,
          expense_date: expenseForm.expenseDate
        }),
      });
      setShowExpenseForm(false);
      setExpenseForm({
        description: '',
        amount: '',
        type: 'business',
        frequency: 'monthly',
        category: '',
        expenseDate: new Date().toISOString().split('T')[0]
      });
      loadData();
    } catch (error) {
      console.error('Error creating expense:', error);
    }
  };

  const handleUpdateExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingExpense) return;
    try {
      await fetch(`/.netlify/functions/expenses/${editingExpense.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: expenseForm.description,
          amount: parseFloat(expenseForm.amount),
          type: expenseForm.type,
          frequency: expenseForm.frequency,
          category: expenseForm.category,
          expense_date: expenseForm.expenseDate
        }),
      });
      setShowExpenseForm(false);
      setEditingExpense(null);
      setExpenseForm({
        description: '',
        amount: '',
        type: 'business',
        frequency: 'monthly',
        category: '',
        expenseDate: new Date().toISOString().split('T')[0]
      });
      loadData();
    } catch (error) {
      console.error('Error updating expense:', error);
    }
  };

  const handleDeleteExpense = async (id: string) => {
    try {
      await fetch(`/.netlify/functions/expenses/${id}`, { method: 'DELETE' });
      loadData();
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  const openEditExpense = (expense: any) => {
    setEditingExpense(expense);
    setExpenseForm({
      description: expense.description,
      amount: expense.amount.toString(),
      type: expense.type,
      frequency: expense.frequency,
      category: expense.category || '',
      expenseDate: expense.expense_date ? expense.expense_date.substring(0, 10) : new Date().toISOString().split('T')[0]
    });
    setShowExpenseForm(true);
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

    setIsCreatingInvoice(true);
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
        status: 'sent',
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
    } finally {
      setIsCreatingInvoice(false);
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
    const rawDate = (invoice as any).invoiceDate || invoice.createdAt;
    const invoiceDate = rawDate ? new Date(rawDate).toLocaleDateString('nl-NL', { day: '2-digit', month: '2-digit', year: 'numeric' }) : new Date().toLocaleDateString('nl-NL', { day: '2-digit', month: '2-digit', year: 'numeric' });
    
    // Calculate totals - BTW 21% is inbegrepen
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
                <!-- Varexo Logo -->
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
                  <!-- Left side of V -->
                  <polygon points="15,15 65,105 50,105 5,30" fill="url(#vLeft)"/>
                  <!-- Right side of V -->
                  <polygon points="115,15 65,105 80,105 120,30" fill="url(#vRight)"/>
                  <!-- Center highlight -->
                  <polygon points="65,105 45,60 65,48 85,60" fill="url(#vCenter)" opacity="0.85"/>
                  <!-- Left facet -->
                  <polygon points="15,15 48,15 65,48 45,60" fill="url(#vLeftFacet)" opacity="0.9"/>
                  <!-- Right facet -->
                  <polygon points="115,15 82,15 65,48 85,60" fill="url(#vRightFacet)" opacity="0.9"/>
                  <!-- Text VAREXO -->
                  <text x="138" y="68" font-family="system-ui, -apple-system, sans-serif" font-size="48" font-weight="700" fill="#1a3050" letter-spacing="3">VAREXO</text>
                  <!-- Tagline -->
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

            <!-- Footer -->
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
      <div className="min-h-screen bg-dark-900 pt-16 pb-8">
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
              <button
                onClick={() => setActiveTab('recurring')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'recurring'
                    ? 'border-primary-500 text-primary-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
              >
                Terugkerend ({recurringInvoices.length})
              </button>
              <button
                onClick={() => setActiveTab('messages')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'messages'
                    ? 'border-primary-500 text-primary-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
              >
                Berichten ({contactMessages.length})
              </button>
              <button
                onClick={() => setActiveTab('finance')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'finance'
                    ? 'border-primary-500 text-primary-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
              >
                Kosten/Omzet/Winst
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
                            <div className="relative dropdown-container">
                              <button
                                onClick={() => setShowCustomerDropdown(showCustomerDropdown === customer.email ? null : customer.email)}
                                className="text-gray-400 hover:text-white p-2 rounded hover:bg-dark-700"
                              >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"/>
                                </svg>
                              </button>

                              {/* Dropdown Menu */}
                              {showCustomerDropdown === customer.email && (
                                <div className="absolute right-0 mt-2 w-48 bg-dark-800 border border-dark-600 rounded-lg shadow-lg z-10">
                                  <button
                                    onClick={() => {
                                      setSelectedCustomer(customer.email);
                                      setShowProjectForm(true);
                                      setShowCustomerDropdown(null);
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-dark-700 hover:text-white flex items-center gap-2"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                    Nieuw Project
                                  </button>
                                  <button
                                    onClick={() => {
                                      openInvoiceForm(customer.email);
                                      setShowCustomerDropdown(null);
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-dark-700 hover:text-white flex items-center gap-2"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    Nieuwe Factuur
                                  </button>
                                  <div className="border-t border-dark-600"></div>
                                  <button
                                    onClick={() => {
                                      setShowCustomerDeleteConfirm(customer.email);
                                      setShowCustomerDropdown(null);
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-dark-700 hover:text-red-300 flex items-center gap-2"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    Klant Verwijderen
                                  </button>
                                </div>
                              )}
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
                      <div className="flex justify-end">
                        <div className="relative dropdown-container">
                          <button
                            onClick={() => setShowProjectDropdown(showProjectDropdown === project.id ? null : project.id)}
                            className="text-gray-400 hover:text-white p-2 rounded hover:bg-dark-700"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"/>
                            </svg>
                          </button>

                          {showProjectDropdown === project.id && (
                            <div className="absolute right-0 mt-1 w-48 bg-dark-800 border border-dark-600 rounded-lg shadow-xl z-50 py-1">
                              <button
                                onClick={() => { openProjectLogs(project); setShowProjectDropdown(null); }}
                                className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-dark-700 hover:text-white flex items-center gap-2"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                Logs Bekijken
                              </button>
                              <button
                                onClick={() => { openEditProject(project); setShowProjectDropdown(null); }}
                                className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-dark-700 hover:text-white flex items-center gap-2"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Bewerken
                              </button>
                              <div className="border-t border-dark-600 my-1"></div>
                              <button
                                onClick={() => { setShowDeleteConfirm(project.id); setShowProjectDropdown(null); }}
                                className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-dark-700 hover:text-red-300 flex items-center gap-2"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Verwijderen
                              </button>
                            </div>
                          )}
                        </div>
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
              <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-white">Facturen</h2>
                </div>
                <div className="overflow-x-auto -mx-2">
                  <table className="min-w-full divide-y divide-dark-700">
                    <thead>
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Factuur</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Klant</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Bedrag</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider w-10">Acties</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-dark-700">
                      {invoices.map((invoice) => (
                        <React.Fragment key={invoice.id}>
                        <tr className="hover:bg-dark-700/50 transition-colors">
                          <td className="px-3 py-2.5 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-white">{invoice.invoiceNumber}</div>
                              <div className="text-xs text-gray-400">{new Date(invoice.createdAt).toLocaleDateString('nl-NL')}</div>
                            </div>
                          </td>
                          <td className="px-3 py-2.5 whitespace-nowrap text-xs text-gray-400 truncate max-w-[150px]">
                            {invoice.customerEmail}
                          </td>
                          <td className="px-3 py-2.5 whitespace-nowrap text-sm text-gray-300 font-medium">
                            €{invoice.amount.toFixed(2)}
                          </td>
                          <td className="px-3 py-2.5 whitespace-nowrap">
                            <span className={`px-2 py-0.5 text-xs rounded-full ${
                              invoice.status === 'paid' ? 'bg-green-900 text-green-300' :
                              invoice.status === 'sent' ? 'bg-blue-900 text-blue-300' :
                              invoice.status === 'overdue' ? 'bg-red-900 text-red-300' :
                              'bg-gray-900 text-gray-300'
                            }`}>
                              {invoice.status === 'paid' ? 'Betaald' : 
                               invoice.status === 'sent' ? 'Open' : 
                               invoice.status === 'overdue' ? 'Te laat' : invoice.status}
                            </span>
                          </td>
                          <td className="px-3 py-2.5 whitespace-nowrap text-sm font-medium">
                            <div className="relative dropdown-container">
                              <button
                                onClick={() => setShowInvoiceDropdown(showInvoiceDropdown === invoice.id ? null : invoice.id)}
                                className="text-gray-400 hover:text-white p-2 rounded hover:bg-dark-700"
                              >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"/>
                                </svg>
                              </button>

                              {showInvoiceDropdown === invoice.id && (
                                <div className="absolute right-0 mt-1 w-52 bg-dark-800 border border-dark-600 rounded-lg shadow-xl z-50 py-1">
                                  <button
                                    onClick={() => { openInvoiceDetails(invoice); setShowInvoiceDropdown(null); }}
                                    className="w-full text-left px-3 py-1.5 text-xs text-gray-300 hover:bg-dark-700 hover:text-white flex items-center gap-2"
                                  >
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                    Bekijken
                                  </button>
                                  <div className="border-t border-dark-600 my-0.5"></div>
                                  <p className="px-3 py-0.5 text-xs text-gray-500 uppercase">Status</p>
                                  <button
                                    onClick={() => { handleUpdateInvoiceStatus(invoice.id, 'paid'); setShowInvoiceDropdown(null); }}
                                    className={`w-full text-left px-3 py-1.5 text-xs flex items-center gap-2 ${invoice.status === 'paid' ? 'bg-green-900/30 text-green-400' : 'text-gray-300 hover:bg-dark-700 hover:text-white'}`}
                                  >
                                    ✓ Betaald
                                  </button>
                                  <button
                                    onClick={() => { handleUpdateInvoiceStatus(invoice.id, 'sent'); setShowInvoiceDropdown(null); }}
                                    className={`w-full text-left px-3 py-1.5 text-xs flex items-center gap-2 ${invoice.status === 'sent' ? 'bg-blue-900/30 text-blue-400' : 'text-gray-300 hover:bg-dark-700 hover:text-white'}`}
                                  >
                                    ⏳ Open
                                  </button>
                                  <button
                                    onClick={() => { handleUpdateInvoiceStatus(invoice.id, 'overdue'); setShowInvoiceDropdown(null); }}
                                    className={`w-full text-left px-3 py-1.5 text-xs flex items-center gap-2 ${invoice.status === 'overdue' ? 'bg-red-900/30 text-red-400' : 'text-gray-300 hover:bg-dark-700 hover:text-white'}`}
                                  >
                                    ⚠ Te laat
                                  </button>
                                  <div className="border-t border-dark-600 my-0.5"></div>
                                  <button
                                    onClick={() => { generatePDF(invoice); setShowInvoiceDropdown(null); }}
                                    className="w-full text-left px-3 py-1.5 text-xs text-gray-300 hover:bg-dark-700 hover:text-white flex items-center gap-2"
                                  >
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    Download PDF
                                  </button>
                                  <div className="border-t border-dark-600 my-0.5"></div>
                                  <button
                                    onClick={() => { setShowInvoiceDeleteConfirm(invoice.id); setShowInvoiceDropdown(null); }}
                                    className="w-full text-left px-3 py-1.5 text-xs text-red-400 hover:bg-dark-700 hover:text-red-300 flex items-center gap-2"
                                  >
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    Verwijderen
                                  </button>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>

                        {/* Invoice Delete Confirmation */}
                        {showInvoiceDeleteConfirm === invoice.id && (
                          <tr>
                            <td colSpan={5} className="px-3 py-2">
                              <div className="p-2.5 bg-red-900/30 border border-red-700 rounded-lg">
                                <p className="text-red-300 text-xs mb-2">
                                  Factuur <strong>{invoice.invoiceNumber}</strong> verwijderen?
                                </p>
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => handleDeleteInvoice(invoice.id)}
                                    className="px-2.5 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-500"
                                  >
                                    Ja, verwijderen
                                  </button>
                                  <button
                                    onClick={() => setShowInvoiceDeleteConfirm(null)}
                                    className="px-2.5 py-1 bg-dark-700 text-gray-300 text-xs rounded hover:bg-dark-600"
                                  >
                                    Annuleren
                                  </button>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'recurring' && (
            <div className="bg-dark-800 rounded-lg border border-dark-700">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-white">Terugkerende Facturen</h2>
                  <button
                    onClick={() => setShowRecurringForm(true)}
                    className="bg-primary-500 text-dark-900 px-4 py-2 rounded-lg font-medium hover:bg-primary-400 text-sm"
                  >
                    + Nieuwe Terugkerende Factuur
                  </button>
                </div>

                {recurringInvoices.length === 0 ? (
                  <div className="text-center py-12">
                    <svg className="w-16 h-16 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <p className="text-gray-400">Nog geen terugkerende facturen ingesteld</p>
                    <p className="text-gray-500 text-sm mt-1">Stel maandelijkse facturen in voor onderhoud en andere diensten</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-dark-700">
                      <thead>
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Klant</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Omschrijving</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Bedrag</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Cyclus</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Volgende</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Acties</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-dark-700">
                        {recurringInvoices.map((ri: any) => (
                          <tr key={ri.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-white">{ri.customerEmail}</div>
                              {ri.customerName && <div className="text-xs text-gray-400">{ri.customerName}</div>}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-300">{ri.description}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                              €{parseFloat(ri.amount).toFixed(2)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                              Elke {ri.intervalMonths === 1 ? 'maand' : `${ri.intervalMonths} maanden`}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                              {new Date(ri.nextInvoiceDate).toLocaleDateString('nl-NL', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs rounded-full ${ri.active ? 'bg-green-900 text-green-300' : 'bg-gray-800 text-gray-400'}`}>
                                {ri.active ? 'Actief' : 'Gepauzeerd'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="relative dropdown-container">
                                <button
                                  onClick={() => setShowRecurringDropdown(showRecurringDropdown === ri.id ? null : ri.id)}
                                  className="text-gray-400 hover:text-white p-2 rounded hover:bg-dark-700"
                                >
                                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                                  </svg>
                                </button>

                                {showRecurringDropdown === ri.id && (
                                  <div className="absolute right-0 mt-1 w-48 bg-dark-800 border border-dark-600 rounded-lg shadow-xl z-50 py-1">
                                    <button
                                      onClick={() => { handleToggleRecurring(ri.id, ri.active); setShowRecurringDropdown(null); }}
                                      className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-dark-700 hover:text-white flex items-center gap-2"
                                    >
                                      {ri.active ? (
                                        <>
                                          <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                          </svg>
                                          Pauzeren
                                        </>
                                      ) : (
                                        <>
                                          <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                          </svg>
                                          Activeren
                                        </>
                                      )}
                                    </button>
                                    <button
                                      onClick={() => { setShowRecurringDropdown(null); /* TODO: edit form */ }}
                                      className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-dark-700 hover:text-white flex items-center gap-2"
                                    >
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                      </svg>
                                      Bewerken
                                    </button>
                                    <div className="border-t border-dark-600 my-1"></div>
                                    <button
                                      onClick={() => { setShowRecurringDeleteConfirm(ri.id); setShowRecurringDropdown(null); }}
                                      className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-dark-700 hover:text-red-300 flex items-center gap-2"
                                    >
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                      </svg>
                                      Verwijderen
                                    </button>
                                  </div>
                                )}
                              </div>

                              {/* Delete confirmation */}
                              {showRecurringDeleteConfirm === ri.id && (
                                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                  <div className="bg-dark-800 rounded-lg p-6 w-full max-w-sm border border-dark-700">
                                    <h3 className="text-lg font-semibold text-white mb-2">Terugkerende factuur verwijderen?</h3>
                                    <p className="text-gray-400 text-sm mb-4">Weet je zeker dat je deze terugkerende factuur wilt verwijderen? Dit kan niet ongedaan worden gemaakt.</p>
                                    <div className="flex justify-end gap-3">
                                      <button
                                        onClick={() => setShowRecurringDeleteConfirm(null)}
                                        className="px-4 py-2 text-gray-400 hover:text-white text-sm"
                                      >
                                        Annuleren
                                      </button>
                                      <button
                                        onClick={() => { handleDeleteRecurring(ri.id); setShowRecurringDeleteConfirm(null); }}
                                        className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-500"
                                      >
                                        Verwijderen
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              )}
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

          {/* Recurring Invoice Form Modal */}
          {showRecurringForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-dark-800 rounded-lg p-6 w-full max-w-md border border-dark-700">
                <h3 className="text-xl font-semibold text-white mb-4">Nieuwe Terugkerende Factuur</h3>
                <form onSubmit={handleCreateRecurring}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Klant</label>
                      <select
                        value={recurringForm.customerEmail}
                        onChange={(e) => setRecurringForm({ ...recurringForm, customerEmail: e.target.value })}
                        className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white text-sm"
                        required
                      >
                        <option value="">Selecteer klant...</option>
                        {customers.map(c => (
                          <option key={c.email} value={c.email}>{c.displayName || c.email}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Omschrijving</label>
                      <input
                        type="text"
                        value={recurringForm.description}
                        onChange={(e) => setRecurringForm({ ...recurringForm, description: e.target.value })}
                        className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white text-sm"
                        placeholder="bijv. Website onderhoud maandelijks"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Bedrag (incl. BTW)</label>
                        <input
                          type="number"
                          step="0.01"
                          value={recurringForm.amount}
                          onChange={(e) => setRecurringForm({ ...recurringForm, amount: e.target.value })}
                          className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white text-sm"
                          placeholder="49.99"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Cyclus (maanden)</label>
                        <select
                          value={recurringForm.intervalMonths}
                          onChange={(e) => setRecurringForm({ ...recurringForm, intervalMonths: parseInt(e.target.value) })}
                          className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white text-sm"
                        >
                          <option value={1}>Elke maand</option>
                          <option value={2}>Elke 2 maanden</option>
                          <option value={3}>Elk kwartaal</option>
                          <option value={6}>Elk half jaar</option>
                          <option value={12}>Elk jaar</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Startdatum (eerste factuur)</label>
                      <input
                        type="date"
                        value={recurringForm.startDate}
                        onChange={(e) => setRecurringForm({ ...recurringForm, startDate: e.target.value })}
                        className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white text-sm"
                        required
                      />
                    </div>
                  </div>
                  <div className="flex space-x-3 mt-6">
                    <button type="submit" className="flex-1 bg-primary-500 text-dark-900 py-2 rounded-lg font-medium hover:bg-primary-400">
                      Aanmaken
                    </button>
                    <button type="button" onClick={() => setShowRecurringForm(false)} className="flex-1 bg-dark-700 text-gray-300 py-2 rounded-lg font-medium hover:bg-dark-600">
                      Annuleren
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {activeTab === 'messages' && (
            <div className="bg-dark-800 rounded-lg border border-dark-700">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-white">Berichten</h2>
                </div>
                {contactMessages.length === 0 ? (
                  <div className="text-center py-12">
                    <svg className="w-16 h-16 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    <p className="text-gray-400">Nog geen berichten ontvangen</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {contactMessages.map((msg) => (
                      <div key={msg.id} className="bg-dark-900 p-5 rounded-lg border border-dark-700">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-900/50 rounded-full flex items-center justify-center">
                              <span className="text-blue-300 font-semibold text-sm">{msg.naam.charAt(0).toUpperCase()}</span>
                            </div>
                            <div>
                              <h3 className="text-white font-medium">{msg.naam}</h3>
                              <p className="text-gray-400 text-sm">{msg.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              msg.type === 'quote' ? 'bg-blue-900 text-blue-300' : 'bg-gray-800 text-gray-300'
                            }`}>
                              {msg.type === 'quote' ? 'Offerte' : 'Contact'}
                            </span>
                            <span className="text-gray-500 text-xs">
                              {new Date(msg.createdAt).toLocaleDateString('nl-NL', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </span>
                            {/* Dropdown Menu */}
                            <div className="relative dropdown-container">
                              <button
                                onClick={() => setShowMessageDropdown(showMessageDropdown === msg.id ? null : msg.id)}
                                className="text-gray-400 hover:text-white p-2 rounded hover:bg-dark-700"
                              >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"/>
                                </svg>
                              </button>

                              {showMessageDropdown === msg.id && (
                                <div className="absolute right-0 mt-1 w-48 bg-dark-800 border border-dark-600 rounded-lg shadow-xl z-50 py-1">
                                  <button
                                    onClick={() => { setShowMessageDeleteConfirm(msg.id); setShowMessageDropdown(null); }}
                                    className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-dark-700 hover:text-red-300 flex items-center gap-2"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    Verwijderen
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        {/* Extra details */}
                        {(msg.projectType || msg.telefoon || msg.bedrijf) && (
                          <div className="flex flex-wrap gap-3 mb-3">
                            {msg.projectType && (
                              <span className="px-2 py-1 text-xs rounded bg-primary-900/50 text-primary-300 border border-primary-700/50">
                                {msg.projectType === 'website' ? 'Website' : msg.projectType === 'webshop' ? 'Webshop' : msg.projectType === 'social-media' ? 'Social Media' : msg.projectType === 'seo' ? 'SEO' : msg.projectType === 'maatwerk' ? 'Maatwerk' : msg.projectType === 'onderhoud' ? 'Onderhoud' : msg.projectType}
                              </span>
                            )}
                            {msg.bedrijf && (
                              <span className="px-2 py-1 text-xs rounded bg-dark-700 text-gray-300 border border-dark-600">
                                🏢 {msg.bedrijf}
                              </span>
                            )}
                            {msg.telefoon && (
                              <span className="px-2 py-1 text-xs rounded bg-dark-700 text-gray-300 border border-dark-600">
                                📞 {msg.telefoon}
                              </span>
                            )}
                          </div>
                        )}
                        <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{msg.bericht}</p>

                        {/* Delete Confirmation */}
                        {showMessageDeleteConfirm === msg.id && (
                          <div className="mt-3 p-3 bg-red-900/30 border border-red-700 rounded-lg">
                            <p className="text-red-300 text-sm mb-2">Weet je zeker dat je dit bericht wilt verwijderen?</p>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleDeleteMessage(msg.id)}
                                className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-500"
                              >
                                Ja, verwijderen
                              </button>
                              <button
                                onClick={() => setShowMessageDeleteConfirm(null)}
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
                )}
              </div>
            </div>
          )}

          {activeTab === 'finance' && (
            <div className="space-y-6">
              {/* Financial Overview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-dark-800 p-4 rounded-lg border border-dark-700">
                  <p className="text-gray-400 text-sm">Totale Omzet</p>
                  <p className="text-2xl font-bold text-green-400">
                    €{invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.amount, 0).toFixed(2)}
                  </p>
                </div>
                <div className="bg-dark-800 p-4 rounded-lg border border-dark-700">
                  <p className="text-gray-400 text-sm">Bedrijfskosten</p>
                  <p className="text-2xl font-bold text-red-400">
                    €{expenses.filter(e => e.type === 'business').reduce((sum, e) => sum + parseFloat(e.amount), 0).toFixed(2)}
                  </p>
                </div>
                <div className="bg-dark-800 p-4 rounded-lg border border-dark-700">
                  <p className="text-gray-400 text-sm">Privékosten</p>
                  <p className="text-2xl font-bold text-yellow-400">
                    €{expenses.filter(e => e.type === 'personal').reduce((sum, e) => sum + parseFloat(e.amount), 0).toFixed(2)}
                  </p>
                </div>
                <div className="bg-dark-800 p-4 rounded-lg border border-dark-700">
                  <p className="text-gray-400 text-sm">Netto Winst</p>
                  <p className={`text-2xl font-bold ${
                    (invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.amount, 0) - 
                     expenses.filter(e => e.type === 'business').reduce((sum, e) => sum + parseFloat(e.amount), 0)) >= 0 
                      ? 'text-green-400' : 'text-red-400'
                  }`}>
                    €{(invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.amount, 0) - 
                       expenses.filter(e => e.type === 'business').reduce((sum, e) => sum + parseFloat(e.amount), 0)).toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Expenses Section */}
                <div className="bg-dark-800 rounded-lg border border-dark-700">
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-semibold text-white">Kostenoverzicht</h2>
                      <button
                        onClick={() => {
                          setEditingExpense(null);
                          setExpenseForm({
                            description: '',
                            amount: '',
                            type: 'business',
                            frequency: 'monthly',
                            category: '',
                            expenseDate: new Date().toISOString().split('T')[0]
                          });
                          setShowExpenseForm(true);
                        }}
                        className="bg-primary-500 text-dark-900 px-4 py-2 rounded-lg font-medium hover:bg-primary-400 text-sm"
                      >
                        + Nieuwe Kosten
                      </button>
                    </div>

                    {expenses.length === 0 ? (
                      <div className="text-center py-12">
                        <svg className="w-16 h-16 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a1 1 0 11-2 0 1 1 0 012 0z" />
                        </svg>
                        <p className="text-gray-400">Nog geen kosten toegevoegd</p>
                        <p className="text-gray-500 text-sm mt-1">Voeg bedrijfs- en privékosten toe om je winst te berekenen</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {expenses.map((expense) => (
                          <div key={expense.id} className="bg-dark-900 p-4 rounded-lg border border-dark-700">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="text-white font-medium">{expense.description}</h3>
                                  <span className={`px-2 py-0.5 text-xs rounded-full ${
                                    expense.type === 'business' ? 'bg-blue-900 text-blue-300' : 'bg-purple-900 text-purple-300'
                                  }`}>
                                    {expense.type === 'business' ? 'Bedrijf' : 'Privé'}
                                  </span>
                                  <span className={`px-2 py-0.5 text-xs rounded-full ${
                                    expense.frequency === 'monthly' ? 'bg-green-900 text-green-300' : 'bg-orange-900 text-orange-300'
                                  }`}>
                                    {expense.frequency === 'monthly' ? 'Maandelijks' : 'Eenmalig'}
                                  </span>
                                </div>
                                {expense.category && (
                                  <p className="text-gray-500 text-xs mb-1">{expense.category}</p>
                                )}
                                <p className="text-gray-400 text-sm">
                                  {expense.expense_date ? new Date(expense.expense_date).toLocaleDateString('nl-NL') : 'Geen datum'}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-xl font-bold text-red-400">-€{parseFloat(expense.amount).toFixed(2)}</p>
                                <div className="flex gap-2 mt-2">
                                  <button
                                    onClick={() => openEditExpense(expense)}
                                    className="text-gray-400 hover:text-white text-xs"
                                  >
                                    Bewerken
                                  </button>
                                  <button
                                    onClick={() => handleDeleteExpense(expense.id)}
                                    className="text-red-400 hover:text-red-300 text-xs"
                                  >
                                    Verwijderen
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Cost Summary by Category */}
                <div className="bg-dark-800 rounded-lg border border-dark-700">
                  <div className="p-6">
                    <h2 className="text-xl font-semibold text-white mb-6">Kosten per Categorie</h2>
                    
                    {/* Business Costs Summary */}
                    <div className="mb-6">
                      <h3 className="text-sm font-semibold text-blue-400 uppercase mb-3">Bedrijfskosten</h3>
                      <div className="space-y-2">
                        {(() => {
                          const businessExpenses = expenses.filter(e => e.type === 'business');
                          const monthlyBusiness = businessExpenses.filter(e => e.frequency === 'monthly').reduce((sum, e) => sum + parseFloat(e.amount), 0);
                          const oneTimeBusiness = businessExpenses.filter(e => e.frequency === 'one-time').reduce((sum, e) => sum + parseFloat(e.amount), 0);
                          return (
                            <>
                              <div className="flex justify-between items-center py-2 border-b border-dark-700">
                                <span className="text-gray-400">Maandelijkse kosten</span>
                                <span className="text-white font-medium">€{monthlyBusiness.toFixed(2)}/maand</span>
                              </div>
                              <div className="flex justify-between items-center py-2 border-b border-dark-700">
                                <span className="text-gray-400">Eenmalige kosten</span>
                                <span className="text-white font-medium">€{oneTimeBusiness.toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between items-center py-2">
                                <span className="text-white font-semibold">Totaal bedrijfskosten</span>
                                <span className="text-red-400 font-bold">€{(monthlyBusiness + oneTimeBusiness).toFixed(2)}</span>
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    </div>

                    {/* Personal Costs Summary */}
                    <div>
                      <h3 className="text-sm font-semibold text-purple-400 uppercase mb-3">Privékosten</h3>
                      <div className="space-y-2">
                        {(() => {
                          const personalExpenses = expenses.filter(e => e.type === 'personal');
                          const monthlyPersonal = personalExpenses.filter(e => e.frequency === 'monthly').reduce((sum, e) => sum + parseFloat(e.amount), 0);
                          const oneTimePersonal = personalExpenses.filter(e => e.frequency === 'one-time').reduce((sum, e) => sum + parseFloat(e.amount), 0);
                          return (
                            <>
                              <div className="flex justify-between items-center py-2 border-b border-dark-700">
                                <span className="text-gray-400">Maandelijkse kosten</span>
                                <span className="text-white font-medium">€{monthlyPersonal.toFixed(2)}/maand</span>
                              </div>
                              <div className="flex justify-between items-center py-2 border-b border-dark-700">
                                <span className="text-gray-400">Eenmalige kosten</span>
                                <span className="text-white font-medium">€{oneTimePersonal.toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between items-center py-2">
                                <span className="text-white font-semibold">Totaal privékosten</span>
                                <span className="text-yellow-400 font-bold">€{(monthlyPersonal + oneTimePersonal).toFixed(2)}</span>
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Profit/Loss Calculation */}
              <div className="bg-dark-800 rounded-lg border border-dark-700">
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-white mb-6">Winst & Verlies Berekening</h2>
                  
                  {(() => {
                    const totalRevenue = invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.amount, 0);
                    const businessCosts = expenses.filter(e => e.type === 'business').reduce((sum, e) => sum + parseFloat(e.amount), 0);
                    const personalCosts = expenses.filter(e => e.type === 'personal').reduce((sum, e) => sum + parseFloat(e.amount), 0);
                    const netProfit = totalRevenue - businessCosts;
                    const afterPersonal = netProfit - personalCosts;
                    
                    return (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center py-3 border-b border-dark-700">
                          <span className="text-gray-400">Totale Omzet (betaalde facturen)</span>
                          <span className="text-green-400 font-medium text-lg">+ €{totalRevenue.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-dark-700">
                          <span className="text-gray-400">Bedrijfskosten</span>
                          <span className="text-red-400 font-medium text-lg">- €{businessCosts.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-dark-700 bg-dark-900/50 rounded">
                          <span className="text-white font-semibold">Bruto Winst (voor privékosten)</span>
                          <span className={`font-bold text-lg ${netProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            €{netProfit.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-dark-700">
                          <span className="text-gray-400">Privékosten</span>
                          <span className="text-yellow-400 font-medium text-lg">- €{personalCosts.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center py-4 bg-primary-900/20 rounded-lg px-4">
                          <span className="text-white font-bold text-lg">Netto Winst (zakelijk)</span>
                          <span className={`font-bold text-2xl ${afterPersonal >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            €{afterPersonal.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    );
                  })()}
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
                        <label className="block text-sm font-medium text-gray-300 mb-1">Factuurnummer <span className="text-gray-500 text-xs">(automatisch)</span></label>
                        <input
                          type="text"
                          value={invoiceForm.invoiceNumber}
                          onChange={(e) => setInvoiceForm(prev => ({ ...prev, invoiceNumber: e.target.value }))}
                          className="w-full px-3 py-2 bg-dark-900 border border-dark-600 rounded-lg text-primary-400 font-mono"
                          readOnly
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
                      disabled={isCreatingInvoice}
                      className="px-4 py-2 bg-primary-500 text-dark-900 rounded-lg font-medium hover:bg-primary-400 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isCreatingInvoice ? (
                        <>
                          <svg className="animate-spin h-4 w-4 text-dark-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Bezig met aanmaken...
                        </>
                      ) : (
                        'Aanmaken & PDF Genereren'
                      )}
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

          {/* Expense Form Modal */}
          {showExpenseForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-dark-800 rounded-lg p-6 w-full max-w-md border border-dark-700">
                <h3 className="text-xl font-semibold text-white mb-4">
                  {editingExpense ? 'Kosten Bewerken' : 'Nieuwe Kosten'}
                </h3>
                <form onSubmit={editingExpense ? handleUpdateExpense : handleCreateExpense}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Omschrijving</label>
                      <input
                        type="text"
                        value={expenseForm.description}
                        onChange={(e) => setExpenseForm(prev => ({ ...prev, description: e.target.value }))}
                        className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white"
                        placeholder="Bijv. Huur kantoor, Software licentie, etc."
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Bedrag (€)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={expenseForm.amount}
                        onChange={(e) => setExpenseForm(prev => ({ ...prev, amount: e.target.value }))}
                        className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white"
                        placeholder="0.00"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Type</label>
                        <select
                          value={expenseForm.type}
                          onChange={(e) => setExpenseForm(prev => ({ ...prev, type: e.target.value as 'business' | 'personal' }))}
                          className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white"
                        >
                          <option value="business">Bedrijfskosten</option>
                          <option value="personal">Privékosten</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Frequentie</label>
                        <select
                          value={expenseForm.frequency}
                          onChange={(e) => setExpenseForm(prev => ({ ...prev, frequency: e.target.value as 'monthly' | 'one-time' }))}
                          className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white"
                        >
                          <option value="monthly">Maandelijks</option>
                          <option value="one-time">Eenmalig</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Categorie (optioneel)</label>
                      <input
                        type="text"
                        value={expenseForm.category}
                        onChange={(e) => setExpenseForm(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white"
                        placeholder="Bijv. Vaste lasten, Marketing, Reiskosten"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Datum</label>
                      <input
                        type="date"
                        value={expenseForm.expenseDate}
                        onChange={(e) => setExpenseForm(prev => ({ ...prev, expenseDate: e.target.value }))}
                        className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 mt-6">
                    <button
                      type="button"
                      onClick={() => {
                        setShowExpenseForm(false);
                        setEditingExpense(null);
                        setExpenseForm({
                          description: '',
                          amount: '',
                          type: 'business',
                          frequency: 'monthly',
                          category: '',
                          expenseDate: new Date().toISOString().split('T')[0]
                        });
                      }}
                      className="px-4 py-2 text-gray-400 hover:text-white"
                    >
                      Annuleren
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-primary-500 text-dark-900 rounded-lg font-medium hover:bg-primary-400"
                    >
                      {editingExpense ? 'Opslaan' : 'Toevoegen'}
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
