import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'nl' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  nl: {
    // Navigation
    'nav.home': 'Home',
    'nav.about': 'Over ons',
    'nav.services': 'Diensten',
    'nav.pricing': 'Prijzen',
    'nav.process': 'Werkwijze',
    'nav.contact': 'Contact',
    'nav.login': 'Inloggen',
    'nav.signup': 'Account aanmaken',
    'nav.dashboard': 'Dashboard',
    'nav.admin': 'Admin',
    'nav.logout': 'Uitloggen',
    
    // Hero
    'hero.title': 'Varexo - Full-stack Webdevelopment',
    'hero.subtitle': 'Wij bouwen professionele websites en software voor jouw bedrijf',
    'hero.cta': 'Bekijk onze diensten',
    
    // Services
    'services.title': 'Onze Diensten',
    'services.webdev': 'Webdevelopment',
    'services.webdev.desc': 'Professionele websites en webapplicaties op maat',
    'services.software': 'Software Development',
    'services.software.desc': 'Maatwerk software voor jouw bedrijf',
    'services.maintenance': 'Onderhoud & Support',
    'services.maintenance.desc': 'Continue onderhoud en technische support',
    
    // Footer
    'footer.rights': 'Alle rechten voorbehouden',
    'footer.contact': 'Contact',
    'footer.navigation': 'Navigatie',
    'footer.legal': 'Juridisch',
    
    // Auth
    'auth.login': 'Inloggen',
    'auth.signup': 'Account aanmaken',
    'auth.email': 'Email adres',
    'auth.password': 'Wachtwoord',
    'auth.forgotPassword': 'Wachtwoord vergeten?',
    'auth.noAccount': 'Nog geen account?',
    'auth.hasAccount': 'Al een account?',
    'auth.createAccount': 'Maak een account aan',
    'auth.loginHere': 'Log hier in',
    
    // Dashboard
    'dashboard.title': 'Mijn Dashboard',
    'dashboard.welcome': 'Welkom terug',
    'dashboard.projects': 'Mijn Projecten',
    'dashboard.invoices': 'Mijn Facturen',
    'dashboard.settings': 'Instellingen',
    'dashboard.noProjects': 'Nog geen projecten',
    'dashboard.noInvoices': 'Nog geen facturen',
    
    // Admin
    'admin.title': 'Admin Dashboard',
    'admin.customers': 'Klanten',
    'admin.projects': 'Projecten',
    'admin.invoices': 'Facturen',
    'admin.finance': 'Financiën',
    'admin.messages': 'Berichten',
    'admin.settings': 'Instellingen',
    'admin.stats': 'Statistieken',
    'admin.totalCustomers': 'Klanten',
    'admin.totalProjects': 'Projecten',
    'admin.totalRevenue': 'Omzet',
    'admin.pendingInvoices': 'Openstaand',
    
    // Profile Settings
    'settings.title': 'Instellingen',
    'settings.profile': 'Profiel',
    'settings.displayName': 'Weergavenaam',
    'settings.phone': 'Telefoon',
    'settings.company': 'Bedrijf',
    'settings.emailNotifications': 'Email notificaties',
    'settings.emailNotifications.desc': 'Ontvang emails over project updates en facturen',
    'settings.language': 'Taal',
    'settings.language.desc': 'Kies je voorkeurstaal',
    'settings.save': 'Opslaan',
    'settings.saving': 'Opslaan...',
    'settings.saved': 'Opgeslagen!',
    
    // Email Language Preference
    'email.language.title': 'Email taal',
    'email.language.desc': 'Ontvang emails in je voorkeurstaal',
    'email.language.nl': 'Nederlands',
    'email.language.en': 'Engels',
    
    // Common
    'common.loading': 'Laden...',
    'common.save': 'Opslaan',
    'common.cancel': 'Annuleren',
    'common.delete': 'Verwijderen',
    'common.edit': 'Bewerken',
    'common.create': 'Aanmaken',
    'common.search': 'Zoeken',
    'common.filter': 'Filteren',
    'common.all': 'Alle',
    'common.status': 'Status',
    'common.date': 'Datum',
    'common.amount': 'Bedrag',
    'common.actions': 'Acties',
    'common.view': 'Bekijken',
    'common.download': 'Downloaden',
    'common.send': 'Versturen',
    'common.close': 'Sluiten',
    'common.back': 'Terug',
    'common.next': 'Volgende',
    'common.submit': 'Verzenden',
    'common.success': 'Succes!',
    'common.error': 'Er is een fout opgetreden',
    'common.confirm': 'Bevestigen',
    'common.yes': 'Ja',
    'common.no': 'Nee',
  },
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.services': 'Services',
    'nav.pricing': 'Pricing',
    'nav.process': 'Process',
    'nav.contact': 'Contact',
    'nav.login': 'Login',
    'nav.signup': 'Sign Up',
    'nav.dashboard': 'Dashboard',
    'nav.admin': 'Admin',
    'nav.logout': 'Logout',
    
    // Hero
    'hero.title': 'Varexo - Full-stack Webdevelopment',
    'hero.subtitle': 'We build professional websites and software for your business',
    'hero.cta': 'View our services',
    
    // Services
    'services.title': 'Our Services',
    'services.webdev': 'Web Development',
    'services.webdev.desc': 'Professional websites and web applications tailored to your needs',
    'services.software': 'Software Development',
    'services.software.desc': 'Custom software solutions for your business',
    'services.maintenance': 'Maintenance & Support',
    'services.maintenance.desc': 'Continuous maintenance and technical support',
    
    // Footer
    'footer.rights': 'All rights reserved',
    'footer.contact': 'Contact',
    'footer.navigation': 'Navigation',
    'footer.legal': 'Legal',
    
    // Auth
    'auth.login': 'Login',
    'auth.signup': 'Sign Up',
    'auth.email': 'Email address',
    'auth.password': 'Password',
    'auth.forgotPassword': 'Forgot password?',
    'auth.noAccount': "Don't have an account?",
    'auth.hasAccount': 'Already have an account?',
    'auth.createAccount': 'Create an account',
    'auth.loginHere': 'Login here',
    
    // Dashboard
    'dashboard.title': 'My Dashboard',
    'dashboard.welcome': 'Welcome back',
    'dashboard.projects': 'My Projects',
    'dashboard.invoices': 'My Invoices',
    'dashboard.settings': 'Settings',
    'dashboard.noProjects': 'No projects yet',
    'dashboard.noInvoices': 'No invoices yet',
    
    // Admin
    'admin.title': 'Admin Dashboard',
    'admin.customers': 'Customers',
    'admin.projects': 'Projects',
    'admin.invoices': 'Invoices',
    'admin.finance': 'Finance',
    'admin.messages': 'Messages',
    'admin.settings': 'Settings',
    'admin.stats': 'Statistics',
    'admin.totalCustomers': 'Customers',
    'admin.totalProjects': 'Projects',
    'admin.totalRevenue': 'Revenue',
    'admin.pendingInvoices': 'Pending',
    
    // Profile Settings
    'settings.title': 'Settings',
    'settings.profile': 'Profile',
    'settings.displayName': 'Display Name',
    'settings.phone': 'Phone',
    'settings.company': 'Company',
    'settings.emailNotifications': 'Email notifications',
    'settings.emailNotifications.desc': 'Receive emails about project updates and invoices',
    'settings.language': 'Language',
    'settings.language.desc': 'Choose your preferred language',
    'settings.save': 'Save',
    'settings.saving': 'Saving...',
    'settings.saved': 'Saved!',
    
    // Email Language Preference
    'email.language.title': 'Email language',
    'email.language.desc': 'Receive emails in your preferred language',
    'email.language.nl': 'Dutch',
    'email.language.en': 'English',
    
    // Common
    'common.loading': 'Loading...',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.create': 'Create',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.all': 'All',
    'common.status': 'Status',
    'common.date': 'Date',
    'common.amount': 'Amount',
    'common.actions': 'Actions',
    'common.view': 'View',
    'common.download': 'Download',
    'common.send': 'Send',
    'common.close': 'Close',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.submit': 'Submit',
    'common.success': 'Success!',
    'common.error': 'An error occurred',
    'common.confirm': 'Confirm',
    'common.yes': 'Yes',
    'common.no': 'No',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Auto-detect language from domain
  const getDefaultLanguage = (): Language => {
    const domain = window.location.hostname;
    if (domain.includes('varexo.net')) return 'en';
    if (domain.includes('varexo.nl')) return 'nl';
    
    // Check stored preference
    const stored = localStorage.getItem('varexo-language') as Language;
    if (stored === 'nl' || stored === 'en') return stored;
    
    // Default to browser language
    const browserLang = navigator.language.toLowerCase();
    if (browserLang.startsWith('nl')) return 'nl';
    return 'en';
  };

  const [language, setLanguageState] = useState<Language>(getDefaultLanguage());

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('varexo-language', lang);
    // Update HTML lang attribute
    document.documentElement.lang = lang;
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['nl']] || key;
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
