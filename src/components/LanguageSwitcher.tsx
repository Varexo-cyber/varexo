import { useLanguage } from '../contexts/LanguageContext';

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-1 bg-dark-800 rounded-lg p-1 border border-dark-600">
      <button
        onClick={() => setLanguage('nl')}
        className={`flex items-center gap-1.5 px-2 py-1.5 rounded-md text-sm font-medium transition-all ${
          language === 'nl'
            ? 'bg-primary-500 text-dark-900'
            : 'text-gray-400 hover:text-white hover:bg-dark-700'
        }`}
        title="Nederlands"
      >
        <span className="text-lg">🇳🇱</span>
        <span className="hidden sm:inline">NL</span>
      </button>
      
      <button
        onClick={() => setLanguage('en')}
        className={`flex items-center gap-1.5 px-2 py-1.5 rounded-md text-sm font-medium transition-all ${
          language === 'en'
            ? 'bg-primary-500 text-dark-900'
            : 'text-gray-400 hover:text-white hover:bg-dark-700'
        }`}
        title="English"
      >
        <span className="text-lg">🇬🇧</span>
        <span className="hidden sm:inline">EN</span>
      </button>
    </div>
  );
}
