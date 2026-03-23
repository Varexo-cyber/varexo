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
    console.error('Error submitting contact form:', error);
    return { success: false, error: 'Failed to submit form' };
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
    console.error('Error fetching messages:', error);
    return [];
  }
};
