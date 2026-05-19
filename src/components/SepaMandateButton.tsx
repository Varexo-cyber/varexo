import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface Props {
  customerEmail: string;
  hasMandate: boolean;
  onSuccess?: () => void;
}

const SepaMandateButton: React.FC<Props> = ({ customerEmail, hasMandate, onSuccess }) => {
  const { language } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const setupMandate = async () => {
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/payments/klant/setup-mandate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          redirectUrl: `${window.location.origin}/dashboard`
        })
      });

      const data = await response.json();

      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        setError(language === 'nl' ? 'Er ging iets mis' : 'Something went wrong');
      }
    } catch (err) {
      setError(language === 'nl' ? 'Kon niet verbinden' : 'Could not connect');
    } finally {
      setLoading(false);
    }
  };

  if (hasMandate) {
    return (
      <div className="flex items-center gap-2 text-green-400">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        <span className="text-sm">
          {language === 'nl' ? 'SEPA mandaat actief' : 'SEPA mandate active'}
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {error && (
        <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}
      
      <button
        onClick={setupMandate}
        disabled={loading}
        className="w-full bg-yellow-500 text-dark-900 px-6 py-4 rounded-xl font-semibold hover:bg-yellow-400 transition disabled:opacity-50"
      >
        {loading 
          ? (language === 'nl' ? 'Bezig...' : 'Loading...')
          : (language === 'nl' ? 'SEPA Mandaat instellen' : 'Setup SEPA Mandate')
        }
      </button>
      
      <p className="text-sm text-gray-500">
        {language === 'nl' 
          ? 'Geef toestemming voor automatische incasso via iDEAL'
          : 'Give permission for automatic direct debit via iDEAL'
        }
      </p>
    </div>
  );
};

export default SepaMandateButton;
