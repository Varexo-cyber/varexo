import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { mockAuth, MockUser } from '../services/mockAuth';
import PageTransition from '../components/PageTransition';

// Extended user profile interface
interface UserProfile extends MockUser {
  phone?: string;
  company?: string;
  address?: string;
  city?: string;
  emailNotifications?: boolean;
}

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Form states
  const [displayName, setDisplayName] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [emailNotifications, setEmailNotifications] = useState(true);

  // Password change states
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    const unsubscribe = mockAuth.onAuthChanged((currentUser) => {
      if (currentUser) {
        // Load extended profile from localStorage
        const extendedProfile = localStorage.getItem('varexo_profile_' + currentUser.email);
        const profileData: UserProfile = extendedProfile
          ? { ...currentUser, ...JSON.parse(extendedProfile) }
          : currentUser;

        setUser(profileData);
        setDisplayName(profileData.displayName || '');
        setPhone(profileData.phone || '');
        setCompany(profileData.company || '');
        setAddress(profileData.address || '');
        setCity(profileData.city || '');
        setEmailNotifications(profileData.emailNotifications !== false);
      } else {
        navigate('/login');
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [navigate]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setSaving(true);

    try {
      // Update profile in auth with emailNotifications
      await mockAuth.updateProfile({ displayName, emailNotifications });

      // Save extended profile data
      const extendedProfile = {
        phone,
        company,
        address,
        city,
        emailNotifications
      };
      localStorage.setItem('varexo_profile_' + user?.email, JSON.stringify(extendedProfile));

      // Also sync emailNotifications to varexo_users so Admin can see it
      const users = JSON.parse(localStorage.getItem('varexo_users') || '[]');
      const userIndex = users.findIndex((u: any) => u.email === user?.email);
      if (userIndex !== -1) {
        users[userIndex].emailNotifications = emailNotifications;
        localStorage.setItem('varexo_users', JSON.stringify(users));
      }

      setMessage('Profiel succesvol bijgewerkt!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Er is iets misgegaan. Probeer het opnieuw.');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (newPassword !== confirmPassword) {
      setError('Nieuwe wachtwoorden komen niet overeen');
      return;
    }

    if (newPassword.length < 6) {
      setError('Wachtwoord moet minimaal 6 tekens bevatten');
      return;
    }

    setSaving(true);

    try {
      await mockAuth.changePassword(currentPassword, newPassword);
      setMessage('Wachtwoord succesvol gewijzigd!');
      setShowPasswordForm(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setMessage(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Wachtwoord wijzigen mislukt. Controleer je huidige wachtwoord.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-dark-900 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
            <p className="mt-4 text-gray-400">Laden...</p>
          </div>
        </div>
      </PageTransition>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-dark-900 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
              <Link to="/dashboard" className="hover:text-primary-400">Dashboard</Link>
              <span>/</span>
              <span className="text-white">Profiel</span>
            </div>
            <h1 className="text-3xl font-bold text-white">Mijn Profiel</h1>
            <p className="text-gray-400 mt-1">Beheer je accountgegevens en wachtwoord</p>
          </div>

          {message && (
            <div className="mb-6 p-4 bg-primary-900/50 border border-primary-700 rounded-lg">
              <p className="text-primary-300">{message}</p>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-900/50 border border-red-700 rounded-lg">
              <p className="text-red-300">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Info Card */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-dark-800 rounded-lg border border-dark-700 p-6">
                <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                  <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Persoonlijke gegevens
                </h2>

                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Naam *
                      </label>
                      <input
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        required
                        className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        E-mailadres
                      </label>
                      <input
                        type="email"
                        value={user.email}
                        disabled
                        className="w-full px-3 py-2 bg-dark-900 border border-dark-600 rounded-lg text-gray-500 cursor-not-allowed"
                      />
                      <p className="text-xs text-gray-500 mt-1">E-mail kan niet worden gewijzigd</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Telefoonnummer
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+31 6 12345678"
                        className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Bedrijfsnaam
                      </label>
                      <input
                        type="text"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="Jouw bedrijf (optioneel)"
                        className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Adres
                      </label>
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Straatnaam 123"
                        className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Plaats
                      </label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Amsterdam"
                        className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>

                    {/* Email Notifications Toggle */}
                    <div className="md:col-span-2">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setEmailNotifications(!emailNotifications)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                            emailNotifications ? 'bg-primary-500' : 'bg-dark-600'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              emailNotifications ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                        <div>
                          <span className="text-sm font-medium text-gray-300">E-mail notificaties ontvangen</span>
                          <p className="text-xs text-gray-500">Ontvang automatische e-mails over facturen, updates en belangrijke meldingen</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={saving}
                      className="bg-primary-500 text-dark-900 px-6 py-2 rounded-lg font-semibold hover:bg-primary-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {saving ? 'Opslaan...' : 'Opslaan'}
                    </button>
                  </div>
                </form>
              </div>

              {/* Password Change Section */}
              <div className="bg-dark-800 rounded-lg border border-dark-700 p-6">
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Wachtwoord wijzigen
                </h2>

                {!showPasswordForm ? (
                  <button
                    onClick={() => setShowPasswordForm(true)}
                    className="text-primary-400 hover:text-primary-300 font-medium"
                  >
                    Wachtwoord wijzigen →
                  </button>
                ) : (
                  <form onSubmit={handleChangePassword} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Huidig wachtwoord
                      </label>
                      <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                        className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Nieuw wachtwoord
                      </label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        minLength={6}
                        className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">Minimaal 6 tekens</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Bevestig nieuw wachtwoord
                      </label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button
                        type="submit"
                        disabled={saving}
                        className="bg-primary-500 text-dark-900 px-4 py-2 rounded-lg font-semibold hover:bg-primary-400 transition disabled:opacity-50"
                      >
                        {saving ? 'Bezig...' : 'Wijzigen'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowPasswordForm(false);
                          setCurrentPassword('');
                          setNewPassword('');
                          setConfirmPassword('');
                        }}
                        className="text-gray-400 hover:text-white px-4 py-2"
                      >
                        Annuleren
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Avatar Card */}
              <div className="bg-dark-800 rounded-lg border border-dark-700 p-6 text-center">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt=""
                    className="w-24 h-24 rounded-full mx-auto mb-4"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-primary-500 flex items-center justify-center text-dark-900 font-bold text-3xl mx-auto mb-4">
                    {user.displayName.charAt(0).toUpperCase()}
                  </div>
                )}
                <h3 className="text-lg font-semibold text-white">{user.displayName}</h3>
                <p className="text-sm text-gray-400">{user.email}</p>
                {user.provider === 'google' && (
                  <span className="inline-flex items-center gap-1 mt-2 px-2 py-1 bg-dark-700 rounded text-xs text-gray-400">
                    <svg className="w-3 h-3" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    </svg>
                    Google account
                  </span>
                )}
              </div>

              {/* Quick Links */}
              <div className="bg-dark-800 rounded-lg border border-dark-700 p-6">
                <h3 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wider">
                  Snelle links
                </h3>
                <nav className="space-y-2">
                  <Link
                    to="/dashboard"
                    className="flex items-center gap-2 text-gray-400 hover:text-primary-400 py-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                    Dashboard
                  </Link>
                  <Link
                    to="/"
                    className="flex items-center gap-2 text-gray-400 hover:text-primary-400 py-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Home
                  </Link>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Profile;
