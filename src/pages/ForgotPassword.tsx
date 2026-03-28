import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockAuth } from '../services/mockAuth';
import { Link } from 'react-router-dom';
import PageTransition from '../components/PageTransition';
import { useLanguage } from '../contexts/LanguageContext';

const ForgotPassword: React.FC = () => {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!email) {
      setError(t('auth.enterEmail'));
      setLoading(false);
      return;
    }

    try {
      await mockAuth.forgotPassword(email);
      // Always show success (prevent email enumeration)
      setSuccess(t('auth.resetLinkSent'));
      setTimeout(() => {
        navigate('/login');
      }, 5000);
    } catch (error: any) {
      setError(error.message || t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-dark-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center">
            <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
              {t('auth.forgotPasswordTitle')}
            </h2>
            <p className="mt-2 text-center text-sm text-gray-400">
              {t('auth.forgotPasswordSubtitle')}
            </p>
          </div>

          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-dark-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
              {success && (
                <div className="mb-4 p-4 bg-green-900/50 border border-green-500 rounded-md">
                  <p className="text-green-400 text-sm">{success}</p>
                </div>
              )}

              {error && (
                <div className="mb-4 p-4 bg-red-900/50 border border-red-500 rounded-md">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                    {t('auth.email')}
                  </label>
                  <div className="mt-1">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="appearance-none block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-dark-700 text-white"
                      placeholder={t('auth.emailPlaceholder')}
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                  >
                    {loading ? t('auth.sending') : t('auth.sendResetLink')}
                  </button>
                </div>
              </form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-600"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-dark-800 text-gray-400">{t('auth.or')}</span>
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <Link to="/login" className="font-medium text-primary-500 hover:text-primary-400">
                    {t('auth.backToLogin')}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default ForgotPassword;
