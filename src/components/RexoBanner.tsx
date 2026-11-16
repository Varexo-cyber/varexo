import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

// "Rexo AI" wordmark
export const RexoMark: React.FC<{ className?: string }> = ({ className = '' }) => (
  <span className={`rexo-mark ${className}`}>
    rexo<span className="rexo-mark-ai">ai</span>
  </span>
);

// Two crossing marquee stripes, used as a loud promo band
const RexoBanner: React.FC = () => {
  const { language } = useLanguage();
  const nl = language === 'nl';
  const a = nl
    ? ['Rexo AI', 'Bedient je hele pc', 'Kent jouw accounts', 'Je pc op spraak', 'Installatie aan huis']
    : ['Rexo AI', 'Controls your whole PC', 'Knows your accounts', 'Your PC by voice', 'Installed at your home'];
  const b = nl
    ? ['WhatsApp', 'Gmail', 'Discord', 'Instagram', 'Je eigen apps', 'Echt geheugen']
    : ['WhatsApp', 'Gmail', 'Discord', 'Instagram', 'Your own apps', 'Real memory'];

  const row = (items: string[], k: number) => (
    <div className="flex items-center shrink-0" key={k}>
      {items.map((t) => (
        <span key={t + k} className="flex items-center">
          <span className="rexo-band-text">{t}</span>
          <span className="rexo-band-star" />
        </span>
      ))}
    </div>
  );

  return (
    <Link to="/ai-assistent" className="rexo-band block" aria-label="Rexo AI">
      <div className="rexo-stripe rexo-stripe-back">
        <div className="marquee rexo-marquee-rev">{[0, 1, 2].map((k) => row(b, k))}</div>
      </div>
      <div className="rexo-stripe rexo-stripe-front">
        <div className="marquee rexo-marquee">{[0, 1, 2].map((k) => row(a, k))}</div>
      </div>
    </Link>
  );
};

// Slim announcement bar shown above the navigation on public pages
export const RexoAnnouncement: React.FC = () => {
  const { language } = useLanguage();
  const nl = language === 'nl';
  return (
    <Link to="/ai-assistent" className="rexo-announce group">
      <span className="rexo-announce-shine" />
      <span className="px-2 py-0.5 rounded-full bg-dark-950 text-primary-300 text-[11px] font-bold">{nl ? 'NIEUW' : 'NEW'}</span>
      <span><b>Rexo AI</b><span className="hidden sm:inline"> {nl ? 'bedient je hele pc en je eigen apps, en kent jou echt.' : 'runs your whole PC and your own apps, and really knows you.'}</span><span className="sm:hidden"> {nl ? 'bedient je hele pc.' : 'runs your whole PC.'}</span></span>
      <span className="font-semibold underline underline-offset-2 group-hover:no-underline">{nl ? 'Ontdek' : 'Discover'} →</span>
    </Link>
  );
};

export default RexoBanner;
