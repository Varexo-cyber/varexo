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

export const submitContactForm = async (formData: ContactForm): Promise<{ success: boolean; id?: string; error?: string }> => {
  try {
    const response = await fetch(`${API_BASE}/contact-messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    const data = await response.json();
    return { success: true, id: data.id };
  } catch (error) {
    console.warn('API not available, using localStorage fallback:', error);
    // Fallback to localStorage for development
    const submission = {
      ...formData,
      id: 'contact-' + Date.now(),
      createdAt: new Date().toISOString(),
      status: 'new'
    };
    const existing = JSON.parse(localStorage.getItem('varexo_contacts') || '[]');
    existing.push(submission);
    localStorage.setItem('varexo_contacts', JSON.stringify(existing));
    return { success: true, id: submission.id };
  }
};

export const submitQuoteRequest = async (formData: ContactForm): Promise<{ success: boolean; id?: string; error?: string }> => {
  return submitContactForm({ ...formData, type: 'quote' });
};

export const getContactMessages = async (): Promise<ContactMessage[]> => {
  try {
    const response = await fetch(`${API_BASE}/contact-messages`);
    return await response.json();
  } catch (error) {
    console.warn('API not available, using localStorage fallback:', error);
    // Fallback to localStorage for development
    const stored = JSON.parse(localStorage.getItem('varexo_contacts') || '[]');
    return stored.map((msg: any) => ({
      id: msg.id,
      naam: msg.naam,
      email: msg.email,
      bericht: msg.bericht,
      type: msg.type,
      status: msg.status,
      createdAt: msg.createdAt
    }));
  }
};
