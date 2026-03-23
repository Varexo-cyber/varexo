import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { mockAuth, MockUser } from '../services/mockAuth';
import VarexoLogo from './VarexoLogo';

const Header: React.FC = () => {
  const [user, setUser] = useState<MockUser | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = mockAuth.onAuthChanged((currentUser) => {
      setUser(currentUser);
      setImageError(false); // Reset error when user changes
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const isMobile = window.innerWidth < 768; // md breakpoint
      
      if (isMobile) {
        if (currentScrollY > lastScrollY && currentScrollY > 80) {
          // Scrolling down - hide header
          setIsHidden(true);
        } else {
          // Scrolling up - show header
          setIsHidden(false);
        }
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleLogout = async () => {
    await mockAuth.signOut();
    setShowDropdown(false);
    navigate('/');
  };

  const handleImageError = () => {
    console.log('Image error - showing fallback');
    setImageError(true);
  };

  // Debug logging
  if (user) {
    console.log('Debug - photoURL:', user.photoURL, 'imageError:', imageError);
  }

  return (
    <header className={`bg-dark-950/80 backdrop-blur-md shadow-lg border-b border-dark-700/50 sticky top-0 z-50 transition-transform duration-300 ease-out md:transform-none ${isHidden ? '-translate-y-full' : 'translate-y-0'}`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center">
            <VarexoLogo size={36} showText />
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-300 hover:text-primary-400 hover-underline transition text-sm font-medium">Home</Link>
            <Link to="/over-ons" className="text-gray-300 hover:text-primary-400 hover-underline transition text-sm font-medium">Over ons</Link>
            <Link to="/diensten" className="text-gray-300 hover:text-primary-400 hover-underline transition text-sm font-medium">Diensten</Link>
            <Link to="/portfolio" className="text-gray-300 hover:text-primary-400 hover-underline transition text-sm font-medium">Portfolio</Link>
            <Link to="/prijzen" className="text-gray-300 hover:text-primary-400 hover-underline transition text-sm font-medium">Prijzen</Link>
            <Link to="/werkwijze" className="text-gray-300 hover:text-primary-400 hover-underline transition text-sm font-medium">Werkwijze</Link>
            <Link to="/contact" className="text-gray-300 hover:text-primary-400 hover-underline transition text-sm font-medium">Contact</Link>
            
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 bg-dark-800 hover:bg-dark-700 px-3 py-2 rounded-lg transition border border-dark-600"
                >
                  {user.photoURL && !imageError ? (
                    <img 
                      src={user.photoURL} 
                      alt="" 
                      className="w-8 h-8 rounded-full object-cover"
                      referrerPolicy="no-referrer"
                      onError={handleImageError}
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-white font-bold text-sm">
                      {user.displayName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="text-white text-sm font-medium">{user.displayName}</span>
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-dark-800 rounded-lg shadow-lg border border-dark-700 py-1 z-50">
                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-dark-700 hover:text-white"
                      onClick={() => setShowDropdown(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-dark-700 hover:text-white"
                      onClick={() => setShowDropdown(false)}
                    >
                      Profiel beheren
                    </Link>
                    <div className="border-t border-dark-700 my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-dark-700 hover:text-red-300"
                    >
                      Uitloggen
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="bg-primary-500 text-dark-900 px-4 py-2 rounded-lg font-bold hover:bg-primary-400 transition glow-emerald text-sm">
                Klant Login
              </Link>
            )}
          </nav>
          <div className="md:hidden">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-300 hover:text-primary-400 transition"
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-dark-700/50 py-4">
            <div className="flex flex-col space-y-3">
              <Link to="/" className="text-gray-300 hover:text-primary-400 transition text-sm font-medium px-2 py-1" onClick={() => setMobileMenuOpen(false)}>Home</Link>
              <Link to="/over-ons" className="text-gray-300 hover:text-primary-400 transition text-sm font-medium px-2 py-1" onClick={() => setMobileMenuOpen(false)}>Over ons</Link>
              <Link to="/diensten" className="text-gray-300 hover:text-primary-400 transition text-sm font-medium px-2 py-1" onClick={() => setMobileMenuOpen(false)}>Diensten</Link>
              <Link to="/portfolio" className="text-gray-300 hover:text-primary-400 transition text-sm font-medium px-2 py-1" onClick={() => setMobileMenuOpen(false)}>Portfolio</Link>
              <Link to="/prijzen" className="text-gray-300 hover:text-primary-400 transition text-sm font-medium px-2 py-1" onClick={() => setMobileMenuOpen(false)}>Prijzen</Link>
              <Link to="/werkwijze" className="text-gray-300 hover:text-primary-400 transition text-sm font-medium px-2 py-1" onClick={() => setMobileMenuOpen(false)}>Werkwijze</Link>
              <Link to="/contact" className="text-gray-300 hover:text-primary-400 transition text-sm font-medium px-2 py-1" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
              
              <div className="border-t border-dark-700/50 pt-3 mt-2">
                {user ? (
                  <div className="flex flex-col space-y-3">
                    <div className="flex items-center gap-2 px-2">
                      {user.photoURL && !imageError ? (
                        <img src={user.photoURL} alt="" className="w-8 h-8 rounded-full object-cover" referrerPolicy="no-referrer" onError={handleImageError} />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-white font-bold text-sm">
                          {user.displayName.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <span className="text-white text-sm font-medium">{user.displayName}</span>
                    </div>
                    <Link to="/dashboard" className="text-gray-300 hover:text-primary-400 transition text-sm font-medium px-2 py-1" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
                    <Link to="/profile" className="text-gray-300 hover:text-primary-400 transition text-sm font-medium px-2 py-1" onClick={() => setMobileMenuOpen(false)}>Profiel beheren</Link>
                    <button
                      onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                      className="text-left text-red-400 hover:text-red-300 transition text-sm font-medium px-2 py-1"
                    >
                      Uitloggen
                    </button>
                  </div>
                ) : (
                  <Link 
                    to="/login" 
                    className="block bg-primary-500 text-dark-900 px-4 py-2 rounded-lg font-bold hover:bg-primary-400 transition text-sm text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Klant Login
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
