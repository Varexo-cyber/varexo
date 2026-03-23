// Simple standalone mock contact service - no Firebase, no APIs
export interface ContactForm {
  naam: string;
  email: string;
  bericht: string;
  type: 'contact' | 'quote';
  package?: string;
}

// Store submissions in localStorage for demo purposes
const CONTACTS_KEY = 'varexo_contacts';
const QUOTES_KEY = 'varexo_quotes';

export const submitContactForm = async (formData: ContactForm): Promise<{ success: boolean; id?: string; error?: string }> => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const submission = {
      ...formData,
      id: 'contact-' + Date.now(),
      timestamp: new Date().toISOString(),
      status: 'new'
    };

    // Store in localStorage
    const existing = JSON.parse(localStorage.getItem(CONTACTS_KEY) || '[]');
    existing.push(submission);
    localStorage.setItem(CONTACTS_KEY, JSON.stringify(existing));

    // Log to console for demo
    console.log('Contact form submitted:', submission);

    return { success: true, id: submission.id };
  } catch (error) {
    console.error('Error submitting contact form:', error);
    return { success: false, error: 'Failed to submit form' };
  }
};

export const submitQuoteRequest = async (formData: ContactForm): Promise<{ success: boolean; id?: string; error?: string }> => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const submission = {
      ...formData,
      id: 'quote-' + Date.now(),
      timestamp: new Date().toISOString(),
      status: 'pending'
    };

    // Store in localStorage
    const existing = JSON.parse(localStorage.getItem(QUOTES_KEY) || '[]');
    existing.push(submission);
    localStorage.setItem(QUOTES_KEY, JSON.stringify(existing));

    // Log to console for demo
    console.log('Quote request submitted:', submission);

    return { success: true, id: submission.id };
  } catch (error) {
    console.error('Error submitting quote request:', error);
    return { success: false, error: 'Failed to submit quote request' };
  }
};
