// Mollie API Service voor automatische incasso
const MOLLIE_API_KEY = process.env.REACT_APP_MOLLIE_API_KEY;
const API_BASE = 'https://api.mollie.com/v2';

interface MollieCustomer {
  id: string;
  name: string;
  email: string;
}

interface MollieMandate {
  id: string;
  status: 'pending' | 'valid' | 'invalid' | 'revoked';
  method: 'directdebit';
  signatureDate: string;
}

interface MolliePayment {
  id: string;
  status: string;
  amount: { currency: string; value: string };
  checkoutUrl?: string;
}

class MollieService {
  private headers = {
    'Authorization': `Bearer ${MOLLIE_API_KEY}`,
    'Content-Type': 'application/json'
  };

  // Maak Mollie klant aan
  async createCustomer(name: string, email: string): Promise<MollieCustomer> {
    const response = await fetch(`${API_BASE}/customers`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({ name, email })
    });
    
    if (!response.ok) throw new Error('Kon klant niet aanmaken');
    return response.json();
  }

  // Eerste betaling via iDEAL (creëert automatisch mandaat)
  async createFirstPayment(
    customerId: string,
    amount: number,
    description: string,
    redirectUrl: string,
    webhookUrl: string
  ): Promise<MolliePayment> {
    const response = await fetch(`${API_BASE}/payments`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({
        amount: { currency: 'EUR', value: amount.toFixed(2) },
        customerId,
        description,
        redirectUrl,
        webhookUrl,
        method: 'ideal',
        sequenceType: 'first'
      })
    });
    
    if (!response.ok) throw new Error('Kon betaling niet aanmaken');
    return response.json();
  }

  // Recurring SEPA incasso
  async createRecurringPayment(
    customerId: string,
    amount: number,
    description: string,
    webhookUrl: string
  ): Promise<MolliePayment> {
    const response = await fetch(`${API_BASE}/payments`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({
        amount: { currency: 'EUR', value: amount.toFixed(2) },
        customerId,
        description,
        webhookUrl,
        method: 'directdebit',
        sequenceType: 'recurring'
      })
    });
    
    if (!response.ok) throw new Error('Kon incasso niet aanmaken');
    return response.json();
  }

  // Haal mandates op
  async getMandates(customerId: string): Promise<MollieMandate[]> {
    const response = await fetch(`${API_BASE}/customers/${customerId}/mandates`, {
      headers: this.headers
    });
    
    if (!response.ok) return [];
    const data = await response.json();
    return data._embedded?.mandates || [];
  }

  // Check of klant geldig mandaat heeft
  async hasValidMandate(customerId: string): Promise<boolean> {
    const mandates = await this.getMandates(customerId);
    return mandates.some(m => m.status === 'valid');
  }

  // Haal payment status
  async getPayment(paymentId: string): Promise<MolliePayment> {
    const response = await fetch(`${API_BASE}/payments/${paymentId}`, {
      headers: this.headers
    });
    
    if (!response.ok) throw new Error('Kon betaling niet ophalen');
    return response.json();
  }
}

export const mollieService = new MollieService();
