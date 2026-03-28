// API service for communicating with Netlify Functions
const API_BASE = '/.netlify/functions';

async function apiCall(endpoint: string, options: RequestInit = {}) {
  // Add cache-busting timestamp for GET requests
  const separator = endpoint.includes('?') ? '&' : '?';
  const cacheBuster = options.method === 'GET' || !options.method ? `${separator}_t=${Date.now()}` : '';
  const url = `${API_BASE}${endpoint}${cacheBuster}`;
  console.log(`API Call: ${options.method || 'GET'} ${url}`);
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`API Error: ${response.status} ${response.statusText} for ${url}`);
    console.error('Error response:', errorText);
    throw new Error(`API Error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  return data;
}

// Auth API
export const authAPI = {
  signup: (email: string, password: string, displayName: string) =>
    apiCall('/auth/signup', { method: 'POST', body: JSON.stringify({ email, password, displayName }) }),

  login: (email: string, password: string) =>
    apiCall('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),

  googleLogin: (email: string, displayName: string, photoURL?: string) =>
    apiCall('/auth/google', { method: 'POST', body: JSON.stringify({ email, displayName, photoURL }) }),

  googleSignup: (email: string, displayName: string, photoURL?: string) =>
    apiCall('/auth/google-signup', { method: 'POST', body: JSON.stringify({ email, displayName, photoURL }) }),

  updateProfile: (email: string, updates: { displayName?: string; phone?: string; company?: string; emailNotifications?: boolean; emailLanguage?: string }) =>
    apiCall('/auth/profile', { method: 'PUT', body: JSON.stringify({ email, ...updates }) }),

  changePassword: (email: string, currentPassword: string, newPassword: string) =>
    apiCall('/auth/password', { method: 'PUT', body: JSON.stringify({ email, currentPassword, newPassword }) }),

  // Password reset
  forgotPassword: (email: string) =>
    apiCall('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }),

  resetPassword: (token: string, newPassword: string) =>
    apiCall('/auth/reset-password', { method: 'POST', body: JSON.stringify({ token, newPassword }) }),
};

// Projects API
export const projectsAPI = {
  getForCustomer: (email: string) =>
    apiCall(`/projects?email=${encodeURIComponent(email)}`),

  getAll: () =>
    apiCall('/projects?all=true'),

  create: (project: { title: string; description: string; status: string; customerEmail: string; deadline?: string; budget?: number }) =>
    apiCall('/projects', { method: 'POST', body: JSON.stringify(project) }),

  update: (id: string, updates: any) =>
    apiCall(`/projects/${id}`, { method: 'PUT', body: JSON.stringify(updates) }),

  delete: (id: string) =>
    apiCall(`/projects/${id}`, { method: 'DELETE' }),
};

// Invoices API
export const invoicesAPI = {
  getForCustomer: (email: string) =>
    apiCall(`/invoices?email=${encodeURIComponent(email)}`),

  getAll: () =>
    apiCall('/invoices?all=true'),

  getNextNumber: () =>
    apiCall('/invoices?nextNumber=true'),

  create: (invoice: { projectTitle: string; customerEmail: string; amount: number; status: string; dueDate: string; items: any[] }) =>
    apiCall('/invoices', { method: 'POST', body: JSON.stringify(invoice) }),

  update: (id: string, updates: any) =>
    apiCall(`/invoices/${id}`, { method: 'PUT', body: JSON.stringify(updates) }),

  delete: (id: string) =>
    apiCall(`/invoices/${id}`, { method: 'DELETE' }),
};

// Customers API
export const customersAPI = {
  getAll: () => apiCall('/customers'),
  delete: (email: string) => apiCall(`/customers/${email}`, { method: 'DELETE' }),
};

// Stats API
export const statsAPI = {
  get: () => apiCall('/stats'),
};

// Project Logs API
export const projectLogsAPI = {
  getForProject: (projectId: string) =>
    apiCall(`/project-logs?projectId=${encodeURIComponent(projectId)}`),

  create: (log: { projectId: string; title: string; description: string; logType?: string; createdBy: string }) =>
    apiCall('/project-logs', { method: 'POST', body: JSON.stringify(log) }),

  update: (id: string, updates: any) =>
    apiCall(`/project-logs/${id}`, { method: 'PUT', body: JSON.stringify(updates) }),

  delete: (id: string) =>
    apiCall(`/project-logs/${id}`, { method: 'DELETE' }),
};
