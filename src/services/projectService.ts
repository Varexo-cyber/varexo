// Project and Invoice management - uses Netlify Functions API with localStorage fallback
import { projectsAPI, invoicesAPI, customersAPI, statsAPI, projectLogsAPI } from './api';

export interface ProjectLog {
  id: string;
  projectId: string;
  title: string;
  description: string;
  logType: 'update' | 'milestone' | 'bugfix' | 'feature' | 'design' | 'deployment';
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

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
  progress?: number;
  features?: string[];
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  invoiceDate: string;
  projectTitle: string;
  customerEmail: string;
  customerName?: string;
  customerCompany?: string;
  customerAddress?: string;
  customerPostal?: string;
  customerCity?: string;
  customerPhone?: string;
  amount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  createdAt: string;
  dueDate: string;
  items: InvoiceItem[];
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
  emailNotifications?: boolean;
  subscription?: 'basic' | 'pro' | 'premium' | null;
  hasSocialMedia?: boolean;
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
      const result = await projectsAPI.create(project as any);
      // Sync to localStorage as backup
      const projects = this.getLocalProjects();
      projects.push(result);
      this.saveLocalProjects(projects);
      return result;
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
      const projects = await projectsAPI.getForCustomer(customerEmail);
      // Merge into localStorage for offline backup
      const allLocal = this.getLocalProjects().filter(p => p.customerEmail !== customerEmail);
      this.saveLocalProjects([...allLocal, ...projects]);
      return projects;
    } catch {
      return this.getProjectsForCustomer(customerEmail);
    }
  }

  getProjectsForCustomer(customerEmail: string): Project[] {
    return this.getLocalProjects().filter(p => p.customerEmail === customerEmail);
  }

  async getAllProjectsAsync(): Promise<Project[]> {
    try {
      const projects = await projectsAPI.getAll();
      // Sync to localStorage as backup
      this.saveLocalProjects(projects);
      return projects;
    } catch {
      return this.getAllProjects();
    }
  }

  getAllProjects(): Project[] {
    return this.getLocalProjects();
  }

  async updateProjectAsync(id: string, updates: Partial<Project>): Promise<Project | null> {
    try {
      const result = await projectsAPI.update(id, updates);
      // Sync to localStorage
      this.updateProject(id, updates);
      return result;
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
  async createInvoiceAsync(invoice: Omit<Invoice, 'id' | 'createdAt'>): Promise<Invoice> {
    try {
      return await invoicesAPI.create(invoice as any);
    } catch {
      return this.createInvoice(invoice);
    }
  }

  createInvoice(invoice: Omit<Invoice, 'id' | 'createdAt'>): Invoice {
    const invoices = this.getLocalInvoices();
    const newInvoice: Invoice = {
      ...invoice,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
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

  async deleteCustomerAsync(email: string): Promise<boolean> {
    try {
      await customersAPI.delete(email);
      return true;
    } catch {
      return this.deleteCustomer(email);
    }
  }

  deleteCustomer(email: string): boolean {
    const customers = this.getCustomers();
    const filtered = customers.filter((c: Customer) => c.email !== email);
    if (filtered.length === customers.length) return false;
    
    this.saveLocalCustomers(filtered);
    return true;
  }

  getLocalCustomers(): Customer[] {
    const users = JSON.parse(localStorage.getItem('varexo_users') || '[]');
    const projects = this.getLocalProjects();
    const invoices = this.getLocalInvoices();

    return users.map((user: any) => ({
      email: user.email,
      displayName: user.displayName,
      phone: user.phone,
      company: user.company,
      emailNotifications: user.emailNotifications,
      subscription: user.subscription,
      hasSocialMedia: user.hasSocialMedia,
      createdAt: user.createdAt || new Date().toISOString(),
      projectCount: projects.filter(p => p.customerEmail === user.email).length,
      invoiceCount: invoices.filter(i => i.customerEmail === user.email).length
    })).filter((customer: Customer) => customer.email !== 'info@varexo.nl');
  }

  saveLocalCustomers(customers: Customer[]): void {
    // Get existing users and update only the customer fields
    const existingUsers = JSON.parse(localStorage.getItem('varexo_users') || '[]');
    const updatedUsers = existingUsers.filter((user: any) => user.email === 'info@varexo.nl' || customers.some((c: Customer) => c.email === user.email));
    
    // Add customer data for non-admin users
    customers.forEach((customer: Customer) => {
      const existingUser = updatedUsers.find((u: any) => u.email === customer.email);
      if (existingUser) {
        existingUser.displayName = customer.displayName;
        existingUser.phone = customer.phone;
        existingUser.company = customer.company;
      }
    });
    
    localStorage.setItem('varexo_users', JSON.stringify(updatedUsers));
  }

  getCustomers(): Customer[] {
    const users = JSON.parse(localStorage.getItem('varexo_users') || '[]');
    const projects = this.getLocalProjects();
    const invoices = this.getLocalInvoices();

    // Debug logging
    console.log('getCustomers - varexo_users data:', users);
    console.log('getCustomers - emailNotifications values:', users.map((u: any) => ({ email: u.email, emailNotifications: u.emailNotifications })));

    return users.map((user: any) => ({
      email: user.email,
      displayName: user.displayName,
      phone: user.phone,
      company: user.company,
      emailNotifications: user.emailNotifications,
      subscription: user.subscription,
      hasSocialMedia: user.hasSocialMedia,
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

    // Debug logging
    console.log('All invoices for stats:', invoices);
    console.log('Non-draft invoices:', invoices.filter(i => i.status !== 'draft'));
    console.log('Revenue calculation:', invoices.filter(i => i.status !== 'draft').reduce((sum, i) => sum + i.amount, 0));

    return {
      totalCustomers: customers.length,
      totalProjects: projects.length,
      activeProjects: projects.filter(p => p.status === 'active').length,
      totalRevenue: invoices.filter(i => i.status !== 'draft').reduce((sum, i) => sum + i.amount, 0),
      pendingInvoices: invoices.filter(i => i.status === 'sent').length,
      overdueInvoices: invoices.filter(i => i.status === 'overdue').length
    };
  }

  // Project Logs management
  async getProjectLogsAsync(projectId: string): Promise<ProjectLog[]> {
    try {
      const logs = await projectLogsAPI.getForProject(projectId);
      // Sync to localStorage
      localStorage.setItem(`varexo_logs_${projectId}`, JSON.stringify(logs));
      return logs;
    } catch {
      return this.getProjectLogs(projectId);
    }
  }

  getProjectLogs(projectId: string): ProjectLog[] {
    const logs = JSON.parse(localStorage.getItem(`varexo_logs_${projectId}`) || '[]');
    return logs.sort((a: ProjectLog, b: ProjectLog) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async addProjectLogAsync(log: Omit<ProjectLog, 'id' | 'createdAt' | 'updatedAt'>): Promise<ProjectLog> {
    try {
      const result = await projectLogsAPI.create(log as any);
      // Also save to localStorage as backup
      const logs = JSON.parse(localStorage.getItem(`varexo_logs_${log.projectId}`) || '[]');
      logs.unshift(result);
      localStorage.setItem(`varexo_logs_${log.projectId}`, JSON.stringify(logs.slice(0, 50)));
      return result;
    } catch {
      return this.addProjectLog(log);
    }
  }

  addProjectLog(log: Omit<ProjectLog, 'id' | 'createdAt' | 'updatedAt'>): ProjectLog {
    const logs = this.getProjectLogs(log.projectId);
    const newLog: ProjectLog = {
      ...log,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    logs.unshift(newLog);
    localStorage.setItem(`varexo_logs_${log.projectId}`, JSON.stringify(logs.slice(0, 50))); // Keep last 50 logs
    return newLog;
  }

  async updateProjectLogAsync(id: string, projectId: string, updates: Partial<ProjectLog>): Promise<ProjectLog | null> {
    try {
      return await projectLogsAPI.update(id, updates);
    } catch {
      return this.updateProjectLog(id, projectId, updates);
    }
  }

  updateProjectLog(id: string, projectId: string, updates: Partial<ProjectLog>): ProjectLog | null {
    const logs = this.getProjectLogs(projectId);
    const index = logs.findIndex(l => l.id === id);
    if (index === -1) return null;
    
    logs[index] = { ...logs[index], ...updates, updatedAt: new Date().toISOString() };
    localStorage.setItem(`varexo_logs_${projectId}`, JSON.stringify(logs));
    return logs[index];
  }

  async deleteProjectLogAsync(id: string, projectId: string): Promise<boolean> {
    try {
      await projectLogsAPI.delete(id);
      return true;
    } catch {
      return this.deleteProjectLog(id, projectId);
    }
  }

  deleteProjectLog(id: string, projectId: string): boolean {
    const logs = this.getProjectLogs(projectId);
    const filtered = logs.filter(l => l.id !== id);
    if (filtered.length === logs.length) return false;
    
    localStorage.setItem(`varexo_logs_${projectId}`, JSON.stringify(filtered));
    return true;
  }

  // Update project progress
  async updateProjectProgressAsync(projectId: string, progress: number): Promise<Project | null> {
    return this.updateProjectAsync(projectId, { progress: Math.max(0, Math.min(100, progress)) });
  }

  updateProjectProgress(projectId: string, progress: number): Project | null {
    return this.updateProject(projectId, { progress: Math.max(0, Math.min(100, progress)) });
  }
}

export const projectService = new ProjectService();
export default projectService;
