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
      setError(language === 'nl' 
        ? 'Service tijdelijk niet beschikbaar. Probeer later opnieuw.' 
        : 'Service temporarily unavailable. Please try again later.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (hasMandate) {
    return (
      <div className="flex items-center gap-3 px-4 py-3 bg-green-500/10 border border-green-500/30 rounded-xl">
        <div className="p-2 bg-green-500/20 rounded-full">
          <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <p className="text-green-400 font-semibold">
            {language === 'nl' ? 'Automatisch betalen actief' : 'Automatic payment active'}
          </p>
          <p className="text-green-400/70 text-sm">
            {language === 'nl' ? 'SEPA mandaat ingesteld' : 'SEPA mandate configured'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Error Message - Mooier design */}
      {error && (
        <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
          <div className="p-1 bg-red-500/20 rounded-full mt-0.5">
            <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-red-400 font-medium text-sm">{error}</p>
            <p className="text-red-400/70 text-xs mt-1">
              {language === 'nl' 
                ? 'De betalingsservice wordt momenteel geconfigureerd.'
                : 'Payment service is being configured.'
              }
            </p>
          </div>
        </div>
      )}
      
      {/* Main Button - Gele stijl zoals varexo.nl */}
      <button
        onClick={setupMandate}
        disabled={loading}
        className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-dark-900 px-6 py-4 rounded-xl font-bold text-lg hover:from-yellow-300 hover:to-yellow-400 transition-all duration-200 shadow-lg shadow-yellow-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {language === 'nl' ? 'Even geduld...' : 'Please wait...'}
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {language === 'nl' ? 'SEPA Mandaat Instellen' : 'Setup SEPA Mandate'}
          </>
        )}
      </button>
      
      {/* Info text */}
      <div className="flex items-start gap-3 px-4 py-3 bg-dark-700/50 rounded-xl">
        <div className="p-1 bg-primary-500/20 rounded-full mt-0.5">
          <svg className="w-4 h-4 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-sm text-gray-400 leading-relaxed">
          {language === 'nl' 
            ? <>Geef toestemming voor <strong className="text-white">automatische incasso</strong>. Je betaalt eerst <strong className="text-primary-400">€0,01 via iDEAL</strong> om het mandaat te activeren.</>
            : <>Give permission for <strong className="text-white">automatic direct debit</strong>. First pay <strong className="text-primary-400">€0,01 via iDEAL</strong> to activate the mandate.</>
          }
        </p>
      </div>
    </div>
  );
};

export default SepaMandateButton;
