import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import VarexoLogo from './VarexoLogo';
import { useLanguage } from '../contexts/LanguageContext';

const Footer: React.FC = () => {
  const { t, language } = useLanguage();
  const nl = language === 'nl';
  const { pathname } = useLocation();
  const isApp = ['/admin', '/dashboard'].some((p) => pathname.startsWith(p));

  const col = (title: string, items: { to: string; label: string }[]) => (
    <div>
      <h4 className="text-sm text-gray-500 mb-4">{title}</h4>
      <ul className="space-y-2.5">
        {items.map((i) => (
          <li key={i.to}>
            <Link to={i.to} className="text-gray-300 hover:text-white text-sm transition">{i.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );

  if (isApp) {
    return (
      <footer className="bg-dark-950 border-t border-white/5 py-6">
        <div className="container mx-auto px-4 flex justify-between text-xs text-gray-600">
          <span>&copy; {new Date().getFullYear()} Varexo</span>
          <a href="mailto:info@varexo.nl" className="hover:text-gray-400">info@varexo.nl</a>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-dark-950 text-white border-t border-white/5 relative overflow-hidden">
      <div className="container mx-auto px-4 pt-20 pb-10 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-10">
          <div className="col-span-2 md:col-span-5">
            <Link to="/" className="inline-flex mb-6">
              <VarexoLogo size={30} showText />
            </Link>
            <p className="text-gray-400 max-w-sm leading-relaxed">
              {nl
                ? 'Websites, webshops en software voor ondernemers in Nederland, België en het Verenigd Koninkrijk.'
                : 'Websites, web shops and software for businesses in the Netherlands, Belgium and the United Kingdom.'}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="mailto:info@varexo.nl" className="text-sm px-4 py-2 rounded-full border border-white/10 hover:border-primary-500/50 transition">info@varexo.nl</a>
              <a href="https://wa.me/31636075966?text=Hallo!%20Ik%20wil%20graag%20een%20offerte%20aanvragen." target="_blank" rel="noopener noreferrer" className="text-sm px-4 py-2 rounded-full border border-white/10 hover:border-primary-500/50 transition">
                {t('footer.whatsapp')}
              </a>
            </div>
          </div>
          <div className="md:col-span-2">
            {col(nl ? 'Bedrijf' : 'Company', [
              { to: '/diensten', label: t('nav.services') },
              { to: '/portfolio', label: 'Portfolio' },
              { to: '/werkwijze', label: t('nav.process') },
              { to: '/prijzen', label: t('nav.pricing') },
              { to: '/over-ons', label: t('nav.about') },
            ])}
          </div>
          <div className="md:col-span-2">
            {col(t('footer.legal'), [
              { to: '/privacy-policy', label: t('footer.privacyPolicy') },
              { to: '/algemene-voorwaarden', label: t('footer.terms') },
              { to: '/cookie-policy', label: t('footer.cookiePolicy') },
            ])}
          </div>
          <div className="col-span-2 md:col-span-3">
            <h4 className="text-sm text-gray-500 mb-4">{nl ? 'Gegevens' : 'Details'}</h4>
            <p className="text-sm text-gray-400 leading-7">
              {t('footer.kvk')}: 42042045<br />
              BTW: NL005213845B91<br />
              IBAN: NL20INGB0120284316
            </p>
          </div>
        </div>

        <div className="mt-20 select-none pointer-events-none text-center font-semibold tracking-tighter leading-none text-[22vw] md:text-[17vw] bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(180deg, rgba(255,255,255,0.08), transparent)" }}>
          varexo
        </div>

        <div className="pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between gap-3 text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} Varexo. {t('footer.rights')}</p>
          <p>{nl ? 'Gemaakt in Nederland' : 'Made in the Netherlands'}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
