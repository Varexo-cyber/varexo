import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { mockAuth } from '../services/mockAuth';
import { Link } from 'react-router-dom';
import PageTransition from '../components/PageTransition';
import { useLanguage } from '../contexts/LanguageContext';

const ResetPassword: React.FC = () => {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setError(t('auth.invalidResetLink'));
    }
  }, [token, t]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!token) {
      setError(t('auth.invalidResetToken'));
      return;
    }

    if (newPassword.length < 6) {
      setError(t('auth.errors.passwordLength'));
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(t('auth.errors.passwordMismatch'));
      return;
    }

    setLoading(true);

    try {
      await mockAuth.resetPassword(token, newPassword);
      setSuccess(t('auth.passwordChanged'));
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error: any) {
      setError(error.message || t('auth.resetFailed'));
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
              {t('auth.resetPasswordTitle')}
            </h2>
            <p className="mt-2 text-center text-sm text-gray-400">
              {t('auth.resetPasswordSubtitle')}
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
                  {!token && (
                    <Link to="/forgot-password" className="text-primary-500 hover:text-primary-400 text-sm mt-2 block">
                      {t('auth.requestNewLink')}
                    </Link>
                  )}
                </div>
              )}

              {token && (
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300">
                      {t('auth.newPassword')}
                    </label>
                    <div className="mt-1">
                      <input
                        id="newPassword"
                        name="newPassword"
                        type="password"
                        autoComplete="new-password"
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="appearance-none block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-dark-700 text-white"
                        placeholder="••••••••"
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">{t('auth.passwordPlaceholder')}</p>
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">
                      {t('auth.confirmPassword')}
                    </label>
                    <div className="mt-1">
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        autoComplete="new-password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="appearance-none block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-dark-700 text-white"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  <div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                    >
                      {loading ? t('auth.changing') : t('auth.changePassword')}
                    </button>
                  </div>
                </form>
              )}

              <div className="mt-6 text-center">
                <Link to="/login" className="font-medium text-primary-500 hover:text-primary-400 text-sm">
                  {t('auth.backToLogin')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default ResetPassword;
