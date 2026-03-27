import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { mockAuth } from '../services/mockAuth';
import { Link } from 'react-router-dom';
import PageTransition from '../components/PageTransition';

const ResetPassword: React.FC = () => {
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
      setError('Ongeldige of verlopen reset link. Vraag een nieuwe wachtwoord reset aan.');
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!token) {
      setError('Ongeldige reset token');
      return;
    }

    if (newPassword.length < 6) {
      setError('Wachtwoord moet minimaal 6 tekens bevatten');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Wachtwoorden komen niet overeen');
      return;
    }

    setLoading(true);

    try {
      await mockAuth.resetPassword(token, newPassword);
      setSuccess('Wachtwoord succesvol gewijzigd! Je wordt doorverwezen naar de login pagina...');
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error: any) {
      setError(error.message || 'Wachtwoord reset mislukt. De link is mogelijk verlopen of al gebruikt.');
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
              Nieuw wachtwoord instellen
            </h2>
            <p className="mt-2 text-center text-sm text-gray-400">
              Kies een sterk wachtwoord voor je account.
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
                      Nieuwe reset link aanvragen →
                    </Link>
                  )}
                </div>
              )}

              {token && (
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300">
                      Nieuw wachtwoord
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
                    <p className="mt-1 text-xs text-gray-500">Minimaal 6 tekens</p>
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">
                      Bevestig wachtwoord
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
                      {loading ? 'Bezig...' : 'Wachtwoord wijzigen'}
                    </button>
                  </div>
                </form>
              )}

              <div className="mt-6 text-center">
                <Link to="/login" className="font-medium text-primary-500 hover:text-primary-400 text-sm">
                  Terug naar inloggen
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
