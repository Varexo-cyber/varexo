const API_BASE = '/.netlify/functions';

export interface ContactForm {
  naam: string;
  email: string;
  bericht: string;
  type: 'contact' | 'quote';
  package?: string;
}

export interface ContactMessage {
  id: string;
  naam: string;
  email: string;
  bericht: string;
  type: string;
  status: string;
  createdAt: string;
}

const saveToLocalStorage = (formData: ContactForm): string => {
  const submission = {
    ...formData,
    id: 'contact-' + Date.now(),
    createdAt: new Date().toISOString(),
    status: 'new'
  };
  const existing = JSON.parse(localStorage.getItem('varexo_contacts') || '[]');
  existing.push(submission);
  localStorage.setItem('varexo_contacts', JSON.stringify(existing));
  return submission.id;
};

export const submitContactForm = async (formData: ContactForm): Promise<{ success: boolean; id?: string; error?: string }> => {
  // Always save to localStorage first as backup
  const localId = saveToLocalStorage(formData);
  
  // Then try API
  try {
    const response = await fetch(`${API_BASE}/contact-messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    if (response.ok) {
      const data = await response.json();
      return { success: true, id: data.id };
    }
    // API returned error status, but localStorage backup is saved
    return { success: true, id: localId };
  } catch (error) {
    console.warn('API not available, saved to localStorage:', error);
    return { success: true, id: localId };
  }
};

export const submitQuoteRequest = async (formData: ContactForm): Promise<{ success: boolean; id?: string; error?: string }> => {
  return submitContactForm({ ...formData, type: 'quote' });
};

const getLocalMessages = (): ContactMessage[] => {
  const stored = JSON.parse(localStorage.getItem('varexo_contacts') || '[]');
  return stored.map((msg: any) => ({
    id: msg.id || 'local-' + Math.random(),
    naam: msg.naam || '',
    email: msg.email || '',
    bericht: msg.bericht || '',
    type: msg.type || 'contact',
    status: msg.status || 'new',
    createdAt: msg.createdAt || new Date().toISOString()
  }));
};

export const getContactMessages = async (): Promise<ContactMessage[]> => {
  const localMessages = getLocalMessages();
  
  try {
    const response = await fetch(`${API_BASE}/contact-messages`);
    if (response.ok) {
      const apiMessages = await response.json();
      if (Array.isArray(apiMessages) && apiMessages.length > 0) {
        // Merge: API messages + any local-only messages (by checking IDs)
        const apiIds = new Set(apiMessages.map((m: any) => m.id));
        const uniqueLocal = localMessages.filter(m => !apiIds.has(m.id) && m.id.startsWith('contact-'));
        return [...apiMessages, ...uniqueLocal].sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      }
    }
  } catch (error) {
    console.warn('API not available, using localStorage:', error);
  }
  
  // Fallback: return localStorage messages sorted by date
  return localMessages.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
};
