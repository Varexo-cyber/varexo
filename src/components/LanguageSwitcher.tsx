import { useLanguage } from '../contexts/LanguageContext';

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="lang-switch" role="group" aria-label="Taal / Language">
      <span className="lang-switch-thumb" style={{ transform: language === 'en' ? 'translateX(100%)' : 'none' }} />
      <button onClick={() => setLanguage('nl')} className={language === 'nl' ? 'is-active' : ''} title="Nederlands">NL</button>
      <button onClick={() => setLanguage('en')} className={language === 'en' ? 'is-active' : ''} title="English">EN</button>
    </div>
  );
}
