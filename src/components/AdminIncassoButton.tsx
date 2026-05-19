import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface Props {
  customerEmail: string;
  customerName: string;
  hasMandate: boolean;
  invoiceId?: string;
  amount?: number;
  onSuccess?: () => void;
}

const AdminIncassoButton: React.FC<Props> = ({ 
  customerEmail, 
  customerName, 
  hasMandate, 
  invoiceId,
  amount = 0,
  onSuccess 
}) => {
  const { language } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{status: string; message: string} | null>(null);
  const [customAmount, setCustomAmount] = useState(amount.toString());

  const handleIncasso = async () => {
    if (!hasMandate) {
      setResult({
        status: 'error',
        message: language === 'nl' ? 'Klant heeft geen SEPA mandaat' : 'Customer has no SEPA mandate'
      });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/payments/admin/incasseren', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          customerEmail,
          amount: parseFloat(customAmount),
          description: `Incasso ${customerName}`,
          invoiceId
        })
      });

      const data = await response.json();

      if (data.success) {
        setResult({
          status: 'success',
          message: language === 'nl' ? 'Incasso succesvol gestart' : 'Direct debit started successfully'
        });
        onSuccess?.();
      } else {
        setResult({
          status: 'error',
          message: data.error || (language === 'nl' ? 'Incasso mislukt' : 'Direct debit failed')
        });
      }
    } catch (err) {
      setResult({
        status: 'error',
        message: language === 'nl' ? 'Kon niet verbinden met server' : 'Could not connect to server'
      });
    } finally {
      setLoading(false);
    }
  };

  if (!hasMandate) {
    return (
      <div className="text-red-400 text-sm">
        {language === 'nl' ? 'Geen SEPA mandaat' : 'No SEPA mandate'}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {amount === 0 && (
        <div>
          <label className="block text-sm text-gray-400 mb-1">
            {language === 'nl' ? 'Bedrag (€)' : 'Amount (€)'}
          </label>
          <input
            type="number"
            value={customAmount}
            onChange={(e) => setCustomAmount(e.target.value)}
            className="w-full px-3 py-2 bg-dark-800 border border-dark-600 rounded-lg text-white"
            placeholder="0.00"
            step="0.01"
            min="0.01"
          />
        </div>
      )}

      {result && (
        <div className={`p-3 rounded-lg text-sm ${
          result.status === 'success' 
            ? 'bg-green-500/20 border border-green-500/30 text-green-400'
            : 'bg-red-500/20 border border-red-500/30 text-red-400'
        }`}>
          {result.message}
        </div>
      )}

      <button
        onClick={handleIncasso}
        disabled={loading || parseFloat(customAmount) <= 0}
        className="w-full bg-primary-500 text-dark-900 px-4 py-3 rounded-lg font-semibold hover:bg-primary-400 transition disabled:opacity-50"
      >
        {loading 
          ? (language === 'nl' ? 'Bezig...' : 'Processing...')
          : (language === 'nl' ? 'Incasseren' : 'Collect Payment')
        }
      </button>
    </div>
  );
};

export default AdminIncassoButton;
