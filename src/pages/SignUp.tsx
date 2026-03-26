import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { mockAuth } from '../services/mockAuth';
import { googleAuthService, GoogleUser } from '../services/googleAuth';
import { authAPI } from '../services/api';
import PageTransition from '../components/PageTransition';

const SignUp: React.FC = () => {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleInitialized, setGoogleInitialized] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize Google Auth when component mounts
    googleAuthService.initialize()
      .then(() => setGoogleInitialized(true))
      .catch(err => console.error('Google auth init failed:', err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Wachtwoorden komen niet overeen');
      return;
    }

    if (password.length < 6) {
      setError('Wachtwoord moet minimaal 6 tekens bevatten');
      return;
    }

    setLoading(true);

    try {
      await mockAuth.signUp(email, password, displayName);
      navigate('/dashboard');
    } catch (error: any) {
      setError(error.message || 'Registratie mislukt. Probeer het opnieuw.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setError('');
    setGoogleLoading(true);

    try {
      const googleUser: GoogleUser = await googleAuthService.signIn();
      
      // Use googleSignup API (creates new account)
      const dbUser = await authAPI.googleSignup(googleUser.email, googleUser.displayName, googleUser.photoURL);
      
      // Save to localStorage
      const savedUser = {
        email: dbUser.email,
        displayName: dbUser.displayName,
        photoURL: dbUser.photoURL,
        provider: 'google',
        isAdmin: dbUser.isAdmin
      };
      localStorage.setItem('varexo_user', JSON.stringify(savedUser));
      
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Google signup error:', error);
      setError(error.message || 'Google registratie mislukt. Probeer het opnieuw.');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <PageTransition>
    <div className="min-h-screen bg-dark-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-primary-400 mb-2">Varexo</h2>
          <h2 className="text-2xl font-bold text-white">Maak een account</h2>
          <p className="mt-2 text-gray-400">
            Registreer om toegang te krijgen tot het klantportaal
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-dark-800 py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-dark-700">
          {/* Google Sign Up Button */}
          <button
            onClick={handleGoogleSignUp}
            disabled={googleLoading || !googleInitialized}
            className="w-full flex justify-center items-center gap-3 py-2 px-4 border border-dark-600 rounded-md shadow-sm text-sm font-medium text-white bg-dark-700 hover:bg-dark-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {googleLoading ? (
              <div className="w-5 h-5 border-2 border-primary-400 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            )}
            {googleLoading ? 'Bezig met Google...' : 'Registreer met Google'}
          </button>

          <div className="mt-6 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-dark-600" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-dark-800 text-gray-400">Of met e-mail</span>
            </div>
          </div>

          <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-900 border border-red-700 text-red-300 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="displayName" className="block text-sm font-medium text-gray-300">
                Naam
              </label>
              <div className="mt-1">
                <input
                  id="displayName"
                  name="displayName"
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-dark-600 rounded-md placeholder-gray-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-dark-700 text-white"
                  placeholder="Jouw naam"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                E-mailadres
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
                  className="appearance-none block w-full px-3 py-2 border border-dark-600 rounded-md placeholder-gray-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-dark-700 text-white"
                  placeholder="jouw@email.nl"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Wachtwoord
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-dark-600 rounded-md placeholder-gray-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-dark-700 text-white"
                  placeholder="Minimaal 6 tekens"
                />
              </div>
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
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-dark-600 rounded-md placeholder-gray-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-dark-700 text-white"
                  placeholder="Herhaal wachtwoord"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-dark-900 bg-primary-500 hover:bg-primary-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {loading ? 'Registreren...' : 'Account aanmaken'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-dark-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-dark-800 text-gray-400">Al een account?</span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Link
                to="/login"
                className="font-medium text-primary-400 hover:text-primary-300"
              >
                Log hier in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
    </PageTransition>
  );
};

export default SignUp;
