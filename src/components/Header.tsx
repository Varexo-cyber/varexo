import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { mockAuth, MockUser } from '../services/mockAuth';
import VarexoLogo from './VarexoLogo';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useLanguage } from '../contexts/LanguageContext';

const Header: React.FC = () => {
  const { t, language } = useLanguage();
  const [user, setUser] = useState<MockUser | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = mockAuth.onAuthChanged((currentUser) => {
      setUser(currentUser);
      setImageError(false);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setShowDropdown(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await mockAuth.signOut();
    setShowDropdown(false);
    navigate('/');
  };

  const links = [
    { to: '/diensten', label: t('nav.services') },
    { to: '/portfolio', label: 'Portfolio' },
    { to: '/werkwijze', label: t('nav.process') },
    { to: '/prijzen', label: t('nav.pricing') },
    { to: '/over-ons', label: t('nav.about') },
    { to: '/contact', label: t('nav.contact') },
  ];

  const avatar = (size: string) =>
    user?.photoURL && !imageError ? (
      <img src={user.photoURL} alt="" className={`${size} rounded-full object-cover`} referrerPolicy="no-referrer" onError={() => setImageError(true)} />
    ) : (
      <div className={`${size} rounded-full bg-primary-500/15 text-primary-300 flex items-center justify-center font-semibold text-sm`}>
        {user?.displayName?.charAt(0).toUpperCase()}
      </div>
    );

  return (
    <header className={`nav-shell sticky top-0 z-50 ${scrolled || mobileMenuOpen ? 'scrolled' : ''}`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-[72px]">
          <Link to="/" className="flex items-center">
            <VarexoLogo size={32} showText />
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <LanguageSwitcher />
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full border border-white/10 hover:border-white/20 bg-white/5 transition"
                >
                  {avatar('w-8 h-8')}
                  <span className="text-white text-sm font-medium max-w-[120px] truncate">{user.displayName}</span>
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-white/10 bg-dark-900/95 backdrop-blur-xl p-1.5 shadow-2xl">
                    <div className="px-3 py-2 text-xs text-gray-500 truncate">{user.email}</div>
                    <Link to="/dashboard" className="block px-3 py-2 rounded-xl text-sm text-gray-200 hover:bg-white/5">{t('nav.dashboard')}</Link>
                    <Link to="/profile" className="block px-3 py-2 rounded-xl text-sm text-gray-200 hover:bg-white/5">{t('settings.profile')}</Link>
                    <div className="h-px bg-white/5 my-1" />
                    <button onClick={handleLogout} className="block w-full text-left px-3 py-2 rounded-xl text-sm text-red-400 hover:bg-red-500/10">
                      {t('nav.logout')}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="text-sm text-gray-300 hover:text-white px-3 py-2 transition">{t('nav.login')}</Link>
                <Link to="/contact" className="text-sm font-semibold bg-white text-dark-950 px-4 py-2 rounded-full hover:bg-primary-300 transition">
                  {language === 'nl' ? 'Gratis offerte' : 'Free quote'}
                </Link>
              </>
            )}
          </div>

          <div className="lg:hidden flex items-center gap-2">
            <LanguageSwitcher />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-200"
              aria-label="Menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 8h16M4 16h16'} />
              </svg>
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden pb-6">
            <div className="flex flex-col">
              {[{ to: '/', label: t('nav.home') }, ...links].map((l) => (
                <Link key={l.to} to={l.to} className="text-2xl font-semibold tracking-tight text-white py-3 border-b border-white/5">
                  {l.label}
                </Link>
              ))}
            </div>
            <div className="mt-6">
              {user ? (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    {avatar('w-9 h-9')}
                    <span className="text-white text-sm font-medium">{user.displayName}</span>
                  </div>
                  <Link to="/dashboard" className="text-gray-300 text-sm">{t('nav.dashboard')}</Link>
                  <Link to="/profile" className="text-gray-300 text-sm">{t('settings.profile')}</Link>
                  <button onClick={handleLogout} className="text-left text-red-400 text-sm">{t('nav.logout')}</button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <Link to="/login" className="text-center py-3 rounded-full border border-white/10 text-white text-sm">{t('nav.login')}</Link>
                  <Link to="/contact" className="text-center py-3 rounded-full bg-primary-500 text-dark-950 font-semibold text-sm">{language === 'nl' ? 'Offerte' : 'Quote'}</Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
