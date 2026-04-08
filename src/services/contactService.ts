const API_BASE = '/.netlify/functions';

export interface ContactForm {
  naam: string;
  email: string;
  bericht: string;
  type: 'contact' | 'quote';
  package?: string;
  telefoon?: string;
  bedrijf?: string;
  projectType?: string;
}

export interface ContactMessage {
  id: string;
  naam: string;
  email: string;
  bericht: string;
  type: string;
  status: string;
  telefoon?: string;
  bedrijf?: string;
  projectType?: string;
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
    telefoon: msg.telefoon || '',
    bedrijf: msg.bedrijf || '',
    projectType: msg.projectType || '',
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
        // Create a deduplication key from content (email + bericht + createdAt rounded to minute)
        const createDeduplicationKey = (m: any) => {
          const date = new Date(m.createdAt);
          // Round to nearest minute for comparison
          date.setSeconds(0, 0);
          return `${m.email}|${m.bericht?.substring(0, 50)}|${date.getTime()}`;
        };
        
        // Get keys from API messages
        const apiKeys = new Set(apiMessages.map(createDeduplicationKey));
        
        // Filter local messages: only keep if not already in API (by content key)
        const uniqueLocal = localMessages.filter(m => {
          const key = createDeduplicationKey(m);
          // Skip if same content exists in API, or if local message has API-style ID
          return !apiKeys.has(key) && m.id.startsWith('contact-');
        });
        
        const merged = [...apiMessages, ...uniqueLocal].sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        
        console.log(`Merged messages: ${apiMessages.length} API + ${uniqueLocal.length} local unique = ${merged.length} total`);
        return merged;
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

export const deleteContactMessage = async (id: string): Promise<{ success: boolean; error?: string }> => {
  // Try API first
  try {
    const response = await fetch(`${API_BASE}/contact-messages/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });
    if (response.ok) {
      // Also remove from localStorage if it exists there
      const stored = JSON.parse(localStorage.getItem('varexo_contacts') || '[]');
      const filtered = stored.filter((m: any) => m.id !== id);
      localStorage.setItem('varexo_contacts', JSON.stringify(filtered));
      return { success: true };
    }
  } catch (error) {
    console.warn('API not available, deleting from localStorage:', error);
  }
  
  // Fallback: delete from localStorage
  try {
    const stored = JSON.parse(localStorage.getItem('varexo_contacts') || '[]');
    const filtered = stored.filter((m: any) => m.id !== id);
    localStorage.setItem('varexo_contacts', JSON.stringify(filtered));
    return { success: true };
  } catch (error) {
    console.error('Error deleting from localStorage:', error);
    return { success: false, error: 'Failed to delete message' };
  }
};
