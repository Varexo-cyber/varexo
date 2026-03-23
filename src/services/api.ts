// API service for communicating with Netlify Functions
const API_BASE = '/.netlify/functions';

async function apiCall(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Er is iets misgegaan');
  }

  return data;
}

// Auth API
export const authAPI = {
  signup: (email: string, password: string, displayName: string) =>
    apiCall('/auth/signup', { method: 'POST', body: JSON.stringify({ email, password, displayName }) }),

  login: (email: string, password: string) =>
    apiCall('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),

  googleLogin: (email: string, displayName: string, photoURL?: string) =>
    apiCall('/google-auth', { method: 'POST', body: JSON.stringify({ email, displayName, photoURL }) }),

  updateProfile: (email: string, updates: { displayName?: string; phone?: string; company?: string }) =>
    apiCall('/auth/profile', { method: 'PUT', body: JSON.stringify({ email, ...updates }) }),

  changePassword: (email: string, currentPassword: string, newPassword: string) =>
    apiCall('/auth/password', { method: 'PUT', body: JSON.stringify({ email, currentPassword, newPassword }) }),
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
};

// Stats API
export const statsAPI = {
  get: () => apiCall('/stats'),
};
