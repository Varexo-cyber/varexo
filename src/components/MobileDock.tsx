import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

// App-style floating navigation for phones
const icons: Record<string, string> = {
  home: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
  ai: 'M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z',
  work: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z',
  price: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z',
};

const MobileDock: React.FC = () => {
  const { language } = useLanguage();
  const nl = language === 'nl';
  const { pathname } = useLocation();
  if (['/admin', '/dashboard', '/profile', '/login', '/signup', '/forgot-password', '/reset-password'].some((p) => pathname.startsWith(p))) return null;

  const items = [
    { to: '/', label: 'Home', icon: icons.home, end: true },
    { to: '/ai-assistent', label: 'Rexo AI', icon: icons.ai },
    { to: '/portfolio', label: nl ? 'Werk' : 'Work', icon: icons.work },
    { to: '/prijzen', label: nl ? 'Prijzen' : 'Pricing', icon: icons.price },
  ];

  return (
    <nav className="mobile-dock lg:hidden" aria-label="Snelmenu">
      {items.map((it) => (
        <NavLink key={it.to} to={it.to} end={it.end} className={({ isActive }) => `dock-item ${isActive ? 'is-active' : ''}`}>
          <svg className="w-[22px] h-[22px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d={it.icon} />
          </svg>
          <span>{it.label}</span>
        </NavLink>
      ))}
      <NavLink to="/contact" className="dock-cta">{nl ? 'Offerte' : 'Quote'}</NavLink>
    </nav>
  );
};

export default MobileDock;
