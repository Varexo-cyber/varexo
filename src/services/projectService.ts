// Project and Invoice management - uses Netlify Functions API with localStorage fallback
import { projectsAPI, invoicesAPI, customersAPI, statsAPI } from './api';

export interface Project {
  id: string;
  title: string;
  description: string;
  status: 'planning' | 'active' | 'completed' | 'paused';
  customerEmail: string;
  createdAt: string;
  updatedAt: string;
  deadline?: string;
  budget?: number;
}

export interface Invoice {
  id: string;
  projectTitle: string;
  customerEmail: string;
  amount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  createdAt: string;
  dueDate: string;
  items: InvoiceItem[];
  invoiceNumber: string;
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Customer {
  email: string;
  displayName: string;
  phone?: string;
  company?: string;
  createdAt: string;
  projectCount: number;
  invoiceCount: number;
}

class ProjectService {
  // localStorage fallbacks
  private getLocalProjects(): Project[] {
    return JSON.parse(localStorage.getItem('varexo_projects') || '[]');
  }

  private saveLocalProjects(projects: Project[]): void {
    localStorage.setItem('varexo_projects', JSON.stringify(projects));
  }

  private getLocalInvoices(): Invoice[] {
    return JSON.parse(localStorage.getItem('varexo_invoices') || '[]');
  }

  private saveLocalInvoices(invoices: Invoice[]): void {
    localStorage.setItem('varexo_invoices', JSON.stringify(invoices));
  }

  // Project management
  async createProjectAsync(project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> {
    try {
      return await projectsAPI.create(project as any);
    } catch {
      console.warn('API unavailable, using localStorage');
      return this.createProject(project);
    }
  }

  createProject(project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Project {
    const projects = this.getLocalProjects();
    const newProject: Project = {
      ...project,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    projects.push(newProject);
    this.saveLocalProjects(projects);
    return newProject;
  }

  async getProjectsForCustomerAsync(customerEmail: string): Promise<Project[]> {
    try {
      return await projectsAPI.getForCustomer(customerEmail);
    } catch {
      return this.getProjectsForCustomer(customerEmail);
    }
  }

  getProjectsForCustomer(customerEmail: string): Project[] {
    return this.getLocalProjects().filter(p => p.customerEmail === customerEmail);
  }

  async getAllProjectsAsync(): Promise<Project[]> {
    try {
      return await projectsAPI.getAll();
    } catch {
      return this.getAllProjects();
    }
  }

  getAllProjects(): Project[] {
    return this.getLocalProjects();
  }

  async updateProjectAsync(id: string, updates: Partial<Project>): Promise<Project | null> {
    try {
      return await projectsAPI.update(id, updates);
    } catch {
      return this.updateProject(id, updates);
    }
  }

  updateProject(id: string, updates: Partial<Project>): Project | null {
    const projects = this.getLocalProjects();
    const index = projects.findIndex(p => p.id === id);
    if (index === -1) return null;
    
    projects[index] = { ...projects[index], ...updates, updatedAt: new Date().toISOString() };
    this.saveLocalProjects(projects);
    return projects[index];
  }

  async deleteProjectAsync(id: string): Promise<boolean> {
    try {
      await projectsAPI.delete(id);
      return true;
    } catch {
      return this.deleteProject(id);
    }
  }

  deleteProject(id: string): boolean {
    const projects = this.getLocalProjects();
    const filtered = projects.filter(p => p.id !== id);
    if (filtered.length === projects.length) return false;
    
    this.saveLocalProjects(filtered);
    return true;
  }

  // Invoice management
  async createInvoiceAsync(invoice: Omit<Invoice, 'id' | 'createdAt' | 'invoiceNumber'>): Promise<Invoice> {
    try {
      return await invoicesAPI.create(invoice as any);
    } catch {
      return this.createInvoice(invoice);
    }
  }

  createInvoice(invoice: Omit<Invoice, 'id' | 'createdAt' | 'invoiceNumber'>): Invoice {
    const invoices = this.getLocalInvoices();
    const invoiceNumber = `INV-${Date.now()}`;
    const newInvoice: Invoice = {
      ...invoice,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      invoiceNumber
    };
    invoices.push(newInvoice);
    this.saveLocalInvoices(invoices);
    return newInvoice;
  }

  async getInvoicesForCustomerAsync(customerEmail: string): Promise<Invoice[]> {
    try {
      return await invoicesAPI.getForCustomer(customerEmail);
    } catch {
      return this.getInvoicesForCustomer(customerEmail);
    }
  }

  getInvoicesForCustomer(customerEmail: string): Invoice[] {
    return this.getLocalInvoices().filter(i => i.customerEmail === customerEmail);
  }

  async getAllInvoicesAsync(): Promise<Invoice[]> {
    try {
      return await invoicesAPI.getAll();
    } catch {
      return this.getAllInvoices();
    }
  }

  getAllInvoices(): Invoice[] {
    return this.getLocalInvoices();
  }

  async updateInvoiceAsync(id: string, updates: Partial<Invoice>): Promise<Invoice | null> {
    try {
      return await invoicesAPI.update(id, updates);
    } catch {
      return this.updateInvoice(id, updates);
    }
  }

  updateInvoice(id: string, updates: Partial<Invoice>): Invoice | null {
    const invoices = this.getLocalInvoices();
    const index = invoices.findIndex(i => i.id === id);
    if (index === -1) return null;
    
    invoices[index] = { ...invoices[index], ...updates };
    this.saveLocalInvoices(invoices);
    return invoices[index];
  }

  async deleteInvoiceAsync(id: string): Promise<boolean> {
    try {
      await invoicesAPI.delete(id);
      return true;
    } catch {
      return this.deleteInvoice(id);
    }
  }

  deleteInvoice(id: string): boolean {
    const invoices = this.getLocalInvoices();
    const filtered = invoices.filter(i => i.id !== id);
    if (filtered.length === invoices.length) return false;
    
    this.saveLocalInvoices(filtered);
    return true;
  }

  // Customer management
  async getCustomersAsync(): Promise<Customer[]> {
    try {
      return await customersAPI.getAll();
    } catch {
      return this.getCustomers();
    }
  }

  getCustomers(): Customer[] {
    const users = JSON.parse(localStorage.getItem('varexo_users') || '[]');
    const projects = this.getLocalProjects();
    const invoices = this.getLocalInvoices();

    return users.map((user: any) => ({
      email: user.email,
      displayName: user.displayName,
      phone: user.phone,
      company: user.company,
      createdAt: user.createdAt || new Date().toISOString(),
      projectCount: projects.filter(p => p.customerEmail === user.email).length,
      invoiceCount: invoices.filter(i => i.customerEmail === user.email).length
    })).filter((customer: Customer) => customer.email !== 'info@varexo.nl');
  }

  getCustomer(email: string): Customer | null {
    const customers = this.getCustomers();
    return customers.find(c => c.email === email) || null;
  }

  // Statistics
  async getStatsAsync() {
    try {
      return await statsAPI.get();
    } catch {
      return this.getStats();
    }
  }

  getStats() {
    const projects = this.getLocalProjects();
    const invoices = this.getLocalInvoices();
    const customers = this.getCustomers();

    return {
      totalCustomers: customers.length,
      totalProjects: projects.length,
      activeProjects: projects.filter(p => p.status === 'active').length,
      totalRevenue: invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.amount, 0),
      pendingInvoices: invoices.filter(i => i.status === 'sent').length,
      overdueInvoices: invoices.filter(i => i.status === 'overdue').length
    };
  }
}

export const projectService = new ProjectService();
export default projectService;
