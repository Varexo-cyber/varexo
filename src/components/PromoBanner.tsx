import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import CountdownTimer from './CountdownTimer';

const PromoBanner: React.FC = () => {
  const { language } = useLanguage();
  const location = useLocation();
  const [dismissed, setDismissed] = useState(false);

  // Only show on public pages, NOT on admin, dashboard, profile, login, signup
  const hiddenPaths = ['/admin', '/dashboard', '/profile', '/login', '/signup', '/forgot-password', '/reset-password'];
  const shouldHide = hiddenPaths.some(path => location.pathname.startsWith(path));

  // Check if promo is still valid (until May 31, 2026)
  const promoEnd = new Date('2026-05-31T23:59:59');
  const isExpired = new Date() > promoEnd;

  if (shouldHide || dismissed || isExpired) return null;

  return (
    <div className="bg-dark-800/95 backdrop-blur-sm border-b border-primary-500/30 py-2 sm:py-4 px-2 sm:px-4 relative z-40 overflow-hidden">
      {/* Animated background glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-500/40 via-emerald-500/20 to-primary-500/40 animate-pulse" />
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'linear-gradient(rgba(52,211,153,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(52,211,153,0.3) 1px, transparent 1px)', backgroundSize: '20px 20px'}} />
      
      {/* Circuit board lines - MEGA */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Top left complex circuit */}
        <div className="absolute top-0 left-6 w-px h-16 bg-gradient-to-b from-emerald-400/70 to-transparent" />
        <div className="absolute top-0 left-6 w-12 h-px bg-gradient-to-r from-emerald-400/70 to-transparent" />
        <div className="absolute top-4 left-6 w-px h-8 bg-gradient-to-b from-emerald-400/50 to-transparent" />
        <div className="absolute top-4 left-6 w-6 h-px bg-gradient-to-r from-emerald-400/50 to-transparent" />
        <div className="absolute top-4 left-12 w-px h-4 bg-gradient-to-b from-emerald-400/40 to-transparent" />
        <div className="absolute top-8 left-12 w-4 h-px bg-gradient-to-r from-emerald-400/40 to-transparent" />
        <div className="absolute top-0 left-14 w-px h-6 bg-gradient-to-b from-emerald-400/50 to-transparent" />
        
        {/* Bottom right complex circuit */}
        <div className="absolute bottom-0 right-8 w-px h-14 bg-gradient-to-t from-primary-400/60 to-transparent" />
        <div className="absolute bottom-0 right-8 w-10 h-px bg-gradient-to-l from-primary-400/60 to-transparent" />
        <div className="absolute bottom-4 right-8 w-px h-6 bg-gradient-to-t from-primary-400/40 to-transparent" />
        <div className="absolute bottom-4 right-8 w-5 h-px bg-gradient-to-l from-primary-400/40 to-transparent" />
        <div className="absolute bottom-4 right-13 w-px h-3 bg-gradient-to-t from-primary-400/30 to-transparent" />
        <div className="absolute bottom-0 right-20 w-px h-8 bg-gradient-to-t from-primary-400/50 to-transparent" />
        
        {/* Middle vertical lines */}
        <div className="absolute top-0 left-1/4 w-px h-10 bg-gradient-to-b from-emerald-400/50 to-transparent" />
        <div className="absolute top-0 right-1/3 w-px h-12 bg-gradient-to-b from-emerald-300/40 to-transparent" />
        <div className="absolute bottom-0 left-1/3 w-px h-8 bg-gradient-to-t from-primary-400/45 to-transparent" />
        <div className="absolute bottom-0 right-1/4 w-px h-9 bg-gradient-to-t from-emerald-400/50 to-transparent" />
        <div className="absolute top-0 left-1/2 w-px h-6 bg-gradient-to-b from-emerald-400/35 to-transparent" />
        <div className="absolute bottom-0 left-2/3 w-px h-7 bg-gradient-to-t from-primary-300/40 to-transparent" />
        
        {/* Horizontal data highways */}
        <div className="absolute top-1 left-0 w-10 h-px bg-gradient-to-r from-emerald-400/50 to-transparent" />
        <div className="absolute top-3 left-0 w-8 h-px bg-gradient-to-r from-emerald-400/35 to-transparent" />
        <div className="absolute top-2 right-0 w-12 h-px bg-gradient-to-l from-primary-400/40 to-transparent" />
        <div className="absolute top-4 right-0 w-6 h-px bg-gradient-to-l from-primary-400/30 to-transparent" />
        <div className="absolute bottom-2 left-0 w-14 h-px bg-gradient-to-r from-emerald-400/35 to-transparent" />
        <div className="absolute bottom-1 right-0 w-10 h-px bg-gradient-to-l from-primary-400/45 to-transparent" />
        
        {/* Diagonal laser lines */}
        <div className="absolute top-0 left-20 w-20 h-px bg-gradient-to-r from-transparent via-emerald-400/20 to-transparent transform rotate-45 origin-left" />
        <div className="absolute bottom-0 right-24 w-16 h-px bg-gradient-to-l from-transparent via-primary-400/20 to-transparent transform -rotate-45 origin-right" />
      </div>
      
      {/* Tech brackets */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1 left-2 text-emerald-400/40 text-xs font-mono">[</div>
        <div className="absolute top-1 right-2 text-emerald-400/40 text-xs font-mono">]</div>
        <div className="absolute bottom-1 left-4 text-primary-400/30 text-xs font-mono">{`{`}</div>
        <div className="absolute bottom-1 right-4 text-primary-400/30 text-xs font-mono">{`}`}</div>
      </div>
      
      {/* Floating data squares - MEGA */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1 left-4 w-2.5 h-2.5 border-2 border-emerald-400/80 rounded-sm animate-ping" style={{animationDuration: '1.8s'}} />
        <div className="absolute top-2 left-12 w-2 h-2 bg-emerald-400 rounded-sm animate-ping" style={{animationDuration: '1.6s', animationDelay: '0.1s'}} />
        <div className="absolute top-3 left-20 w-1.5 h-1.5 border border-emerald-300/70 rounded-sm animate-ping" style={{animationDuration: '2s', animationDelay: '0.3s'}} />
        <div className="absolute bottom-1 right-6 w-2.5 h-2.5 border-2 border-primary-400/70 rounded-sm animate-ping" style={{animationDuration: '2.2s', animationDelay: '0.5s'}} />
        <div className="absolute bottom-2 right-16 w-2 h-2 bg-primary-400 rounded-sm animate-ping" style={{animationDuration: '1.7s', animationDelay: '0.2s'}} />
        <div className="absolute bottom-3 right-28 w-1.5 h-1.5 border border-primary-300/60 rounded-sm animate-ping" style={{animationDuration: '1.9s', animationDelay: '0.4s'}} />
        <div className="absolute top-1/2 left-2 w-2 h-2 bg-emerald-400/70 rounded-sm animate-ping" style={{animationDuration: '2.3s', animationDelay: '0.6s'}} />
        <div className="absolute top-1/3 left-8 w-1 h-1 border border-emerald-400/50 rounded-sm animate-ping" style={{animationDuration: '1.5s', animationDelay: '0.8s'}} />
        <div className="absolute top-2/3 right-4 w-2 h-2 border border-primary-400/60 rounded animate-ping" style={{animationDuration: '2.1s', animationDelay: '0.3s'}} />
        <div className="absolute top-1 right-18 w-1.5 h-1.5 bg-emerald-300/70 rounded-sm animate-ping" style={{animationDuration: '1.8s', animationDelay: '0.7s'}} />
        <div className="absolute bottom-2 left-10 w-2 h-2 border border-emerald-400/50 rounded-sm animate-ping" style={{animationDuration: '2.4s', animationDelay: '0.4s'}} />
        <div className="absolute top-3 left-28 w-1 h-1 bg-primary-400/60 rounded-sm animate-ping" style={{animationDuration: '1.6s', animationDelay: '0.9s'}} />
      </div>
      
      {/* Data stream dots - MEGA */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/5 w-3.5 h-3.5 bg-emerald-400 rounded-full animate-ping shadow-[0_0_15px_rgba(52,211,153,1)]" style={{animationDuration: '1s'}} />
        <div className="absolute top-1 left-1/4 w-3 h-3 bg-emerald-300 rounded-full animate-ping" style={{animationDuration: '1.5s', animationDelay: '0.2s'}} />
        <div className="absolute top-0 left-1/3 w-2.5 h-2.5 bg-primary-400 rounded-full animate-ping" style={{animationDuration: '1.8s', animationDelay: '0.4s'}} />
        <div className="absolute bottom-0 right-1/5 w-3 h-3 bg-emerald-400/90 rounded-full animate-ping" style={{animationDuration: '1.3s', animationDelay: '0.3s'}} />
        <div className="absolute bottom-1 right-1/4 w-2.5 h-2.5 bg-primary-300 rounded-full animate-ping" style={{animationDuration: '1.7s', animationDelay: '0.5s'}} />
        <div className="absolute bottom-0 right-1/3 w-2 h-2 bg-emerald-400 rounded-full animate-ping" style={{animationDuration: '2s', animationDelay: '0.6s'}} />
        <div className="absolute top-1 left-8 w-2.5 h-2.5 bg-primary-400/70 rounded-full animate-ping" style={{animationDuration: '1.4s', animationDelay: '0.7s'}} />
        <div className="absolute top-2 right-8 w-2 h-2 bg-emerald-300/80 rounded-full animate-ping" style={{animationDuration: '1.9s', animationDelay: '0.4s'}} />
        <div className="absolute bottom-1 left-16 w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" style={{animationDuration: '1.6s', animationDelay: '0.8s'}} />
        <div className="absolute bottom-2 right-20 w-2 h-2 bg-primary-400/70 rounded-full animate-ping" style={{animationDuration: '2.2s', animationDelay: '0.2s'}} />
        <div className="absolute top-1/2 left-6 w-2.5 h-2.5 bg-emerald-400/60 rounded-full animate-ping" style={{animationDuration: '1.8s', animationDelay: '0.5s'}} />
        <div className="absolute top-1/3 right-10 w-2 h-2 bg-primary-300 rounded-full animate-ping" style={{animationDuration: '2.3s', animationDelay: '0.9s'}} />
        <div className="absolute top-2/3 left-14 w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" style={{animationDuration: '1.5s', animationDelay: '0.1s'}} />
        <div className="absolute top-0 right-14 w-2 h-2 bg-primary-400/50 rounded-full animate-ping" style={{animationDuration: '2s', animationDelay: '0.7s'}} />
        <div className="absolute bottom-0 left-24 w-2.5 h-2.5 bg-emerald-300 rounded-full animate-ping" style={{animationDuration: '1.7s', animationDelay: '0.3s'}} />
      </div>
      
      {/* Connection nodes - MEGA */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-6 w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
        <div className="absolute top-4 left-12 w-1.5 h-1.5 bg-emerald-400/70 rounded-full" />
        <div className="absolute top-8 left-16 w-1 h-1 bg-emerald-400/50 rounded-full" />
        <div className="absolute bottom-0 right-8 w-2 h-2 bg-primary-400 rounded-full animate-pulse" />
        <div className="absolute bottom-4 right-13 w-1.5 h-1.5 bg-primary-400/70 rounded-full" />
        <div className="absolute top-0 left-14 w-1.5 h-1.5 bg-emerald-400/60 rounded-full" />
        <div className="absolute top-1 left-0 w-1.5 h-1.5 bg-emerald-400/50 rounded-full animate-pulse" style={{animationDuration: '2s'}} />
        <div className="absolute bottom-1 right-0 w-1.5 h-1.5 bg-primary-400/40 rounded-full animate-pulse" style={{animationDuration: '1.5s'}} />
        <div className="absolute top-0 left-1/4 w-1 h-1 bg-emerald-400/40 rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-1 h-1 bg-emerald-400/50 rounded-full" />
      </div>
      
      {/* Matrix binary rain - MEGA */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
        <div className="absolute top-0 left-6 text-[9px] text-emerald-400 font-mono animate-pulse" style={{animationDuration: '2.5s'}}>1010</div>
        <div className="absolute top-1 right-12 text-[8px] text-primary-400 font-mono animate-pulse" style={{animationDuration: '2s', animationDelay: '0.3s'}}>0101</div>
        <div className="absolute bottom-0 left-12 text-[9px] text-emerald-400 font-mono animate-pulse" style={{animationDuration: '1.8s', animationDelay: '0.6s'}}>1100</div>
        <div className="absolute bottom-1 right-8 text-[8px] text-primary-400 font-mono animate-pulse" style={{animationDuration: '3s', animationDelay: '0.4s'}}>0011</div>
        <div className="absolute top-0 left-1/4 text-[7px] text-emerald-300 font-mono animate-pulse" style={{animationDuration: '2.2s', animationDelay: '0.2s'}}>10</div>
        <div className="absolute bottom-0 right-1/4 text-[7px] text-emerald-400 font-mono animate-pulse" style={{animationDuration: '2.7s', animationDelay: '0.7s'}}>01</div>
        <div className="absolute top-1 left-18 text-[6px] text-primary-400/80 font-mono animate-pulse" style={{animationDuration: '2.4s', animationDelay: '0.5s'}}>11</div>
        <div className="absolute bottom-1 left-8 text-[6px] text-emerald-400/70 font-mono animate-pulse" style={{animationDuration: '1.9s', animationDelay: '0.8s'}}>00</div>
        <div className="absolute top-2 right-20 text-[5px] text-emerald-300/60 font-mono animate-pulse" style={{animationDuration: '2.1s', animationDelay: '0.1s'}}>1</div>
        <div className="absolute bottom-2 left-20 text-[5px] text-primary-400/50 font-mono animate-pulse" style={{animationDuration: '2.8s', animationDelay: '0.9s'}}>0</div>
      </div>
      
      {/* Loading bars */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1 left-24 w-8 h-0.5 bg-dark-700 rounded overflow-hidden">
          <div className="h-full bg-emerald-400/50 animate-pulse" style={{width: '60%'}} />
        </div>
        <div className="absolute bottom-2 right-24 w-6 h-0.5 bg-dark-700 rounded overflow-hidden">
          <div className="h-full bg-primary-400/40 animate-pulse" style={{width: '40%', animationDelay: '0.5s'}} />
        </div>
      </div>
      
      {/* Horizontal scanlines - MEGA */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-400/80 to-transparent animate-pulse" />
        <div className="absolute top-2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-400/60 to-transparent animate-pulse" style={{animationDelay: '0.2s'}} />
        <div className="absolute top-4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent animate-pulse" style={{animationDelay: '0.4s'}} />
        <div className="absolute bottom-2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent animate-pulse" style={{animationDelay: '0.6s'}} />
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary-400/70 to-transparent animate-pulse" style={{animationDelay: '0.8s'}} />
      </div>
      
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm relative z-10 px-2 sm:px-0">
        <div className="flex items-center gap-2">
          <span className="animate-pulse text-primary-400">✦</span>
          <span className="text-primary-400 font-bold">
            {language === 'nl' ? 'ACTIE' : 'PROMO'}
          </span>
          <span className="text-gray-300">
            {language === 'nl' ? '€250 korting' : '€250 off'}
          </span>
          <span className="animate-pulse text-primary-400">✦</span>
        </div>
        
        <CountdownTimer targetDate="2026-05-31T23:59:59" language={language} />
        
        <a href="/contact" className="text-primary-400 hover:text-primary-300 font-semibold transition-colors inline-flex items-center gap-1 group whitespace-nowrap text-xs sm:text-sm">
          {language === 'nl' ? 'Offerte aanvragen' : 'Request quote'}
          <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </a>
        
        <button 
          onClick={() => setDismissed(true)}
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition p-1"
          aria-label="Sluiten"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default PromoBanner;
