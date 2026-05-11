import React from 'react';
import PageTransition from '../components/PageTransition';
import AnimateOnScroll from '../components/AnimateOnScroll';
import SEO from '../components/SEO';
import { useLanguage } from '../contexts/LanguageContext';

const Diensten: React.FC = () => {
  const { t, language } = useLanguage();
  
  return (
    <PageTransition>
    <SEO 
      title="Diensten - Webdesign, Webshops & Social Media"
      description="Ontdek onze diensten: professioneel webdesign, webdevelopment, webshop ontwikkeling, social media beheer, SEO optimalisatie en online marketing. Alles voor jouw online groei."
      keywords="webdesign diensten, webshop laten maken, social media beheer, SEO optimalisatie, online marketing, website onderhoud, webdevelopment diensten"
      canonical="/diensten"
    />
    <div className="py-20 tech-grid">
      <div className="container mx-auto px-4">
        <AnimateOnScroll>
        <p className="text-primary-400 text-center font-mono text-sm mb-2 tracking-wider">{t('services.page.tag')}</p>
        <h1 className="text-4xl font-bold text-center mb-4 text-white">{t('services.page.title')}</h1>
        <p className="text-gray-400 text-center mb-16 max-w-xl mx-auto">{t('services.page.subtitle')}</p>
        </AnimateOnScroll>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Webdesign */}
          <AnimateOnScroll animation="reveal-scale" delay={0.1}>
          <div className="glass-card card-hover p-8 rounded-xl">
            <div className="w-16 h-16 bg-primary-500/10 rounded-xl border border-primary-500/20 flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-4 text-white">{t('services.webdesign')}</h2>
            <p className="text-gray-400 mb-6">
              {t('services.webdesign.desc')}
            </p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center text-gray-300">
                <svg className="w-5 h-5 text-primary-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {language === 'nl' ? 'Responsive design voor alle apparaten' : 'Responsive design for all devices'}
              </li>
              <li className="flex items-center text-gray-300">
                <svg className="w-5 h-5 text-primary-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {language === 'nl' ? 'Modern en professioneel uiterlijk' : 'Modern and professional appearance'}
              </li>
              <li className="flex items-center text-gray-300">
                <svg className="w-5 h-5 text-primary-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {language === 'nl' ? 'Geoptimaliseerd voor gebruiksgemak' : 'Optimized for usability'}
              </li>
            </ul>
            <a href="/contact" className="text-primary-400 font-semibold hover:text-primary-300">
              {t('services.page.moreInfo')}
            </a>
          </div>
          </AnimateOnScroll>

          {/* Webdevelopment */}
          <AnimateOnScroll animation="reveal-scale" delay={0.2}>
          <div className="glass-card card-hover p-8 rounded-xl">
            <div className="w-16 h-16 bg-primary-500/10 rounded-xl border border-primary-500/20 flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-4 text-white">{t('services.webdev')}</h2>
            <p className="text-gray-400 mb-6">
              {t('services.webdev.desc')}
            </p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center text-gray-300">
                <svg className="w-5 h-5 text-primary-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {language === 'nl' ? 'Maatwerk oplossingen' : 'Custom solutions'}
              </li>
              <li className="flex items-center text-gray-300">
                <svg className="w-5 h-5 text-primary-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {language === 'nl' ? 'Snelle en veilige code' : 'Fast and secure code'}
              </li>
              <li className="flex items-center text-gray-300">
                <svg className="w-5 h-5 text-primary-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {language === 'nl' ? 'Schaalbare oplossingen' : 'Scalable solutions'}
              </li>
            </ul>
            <a href="/contact" className="text-primary-400 font-semibold hover:text-primary-300">
              {t('services.page.moreInfo')}
            </a>
          </div>
          </AnimateOnScroll>

          {/* Social Media Beheer */}
          <AnimateOnScroll animation="reveal-scale" delay={0.3}>
          <div className="glass-card card-hover p-8 rounded-xl">
            <div className="w-16 h-16 bg-primary-500/10 rounded-xl border border-primary-500/20 flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-4 text-white">{t('services.social')}</h2>
            <p className="text-gray-400 mb-6">
              {t('services.social.desc')}
            </p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center text-gray-300">
                <svg className="w-5 h-5 text-primary-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {language === 'nl' ? 'Content creatie en planning' : 'Content creation and planning'}
              </li>
              <li className="flex items-center text-gray-300">
                <svg className="w-5 h-5 text-primary-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {language === 'nl' ? 'Community management' : 'Community management'}
              </li>
              <li className="flex items-center text-gray-300">
                <svg className="w-5 h-5 text-primary-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {language === 'nl' ? 'Analytics en rapportage' : 'Analytics and reporting'}
              </li>
            </ul>
            <a href="/contact" className="text-primary-400 font-semibold hover:text-primary-300">
              {t('services.page.moreInfo')}
            </a>
          </div>
          </AnimateOnScroll>

          {/* Onderhoud & Hosting */}
          <AnimateOnScroll animation="reveal-scale" delay={0.4}>
          <div className="glass-card card-hover p-8 rounded-xl">
            <div className="w-16 h-16 bg-primary-500/10 rounded-xl border border-primary-500/20 flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-4 text-white">{t('services.hosting')}</h2>
            <p className="text-gray-400 mb-6">
              {t('services.hosting.desc')}
            </p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center text-gray-300">
                <svg className="w-5 h-5 text-primary-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {language === 'nl' ? 'Snelle en betrouwbare hosting' : 'Fast and reliable hosting'}
              </li>
              <li className="flex items-center text-gray-300">
                <svg className="w-5 h-5 text-primary-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {language === 'nl' ? 'Regelmatige updates en back-ups' : 'Regular updates and backups'}
              </li>
              <li className="flex items-center text-gray-300">
                <svg className="w-5 h-5 text-primary-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {language === 'nl' ? 'Beveiliging en monitoring' : 'Security and monitoring'}
              </li>
            </ul>
            <a href="/contact" className="text-primary-400 font-semibold hover:text-primary-300">
              {t('services.page.moreInfo')}
            </a>
          </div>
          </AnimateOnScroll>
        </div>

        {/* Extra Diensten */}
        <div className="mt-20 max-w-6xl mx-auto">
          <AnimateOnScroll>
            <div className="text-center mb-4">
              <span className="inline-block px-4 py-1.5 bg-amber-500/10 text-amber-400 text-xs font-bold font-mono rounded-full border border-amber-500/30 mb-4 tracking-wider">EXTRA</span>
            </div>
            <h2 className="text-3xl font-bold text-center mb-4 text-white">
              {language === 'nl' ? 'Extra Diensten' : 'Additional Services'}
            </h2>
            <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
              {language === 'nl'
                ? 'Wij bieden ook losse diensten aan om jouw online aanwezigheid compleet te maken.'
                : 'We also offer individual services to complete your online presence.'}
            </p>
          </AnimateOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Email Hosting */}
            <AnimateOnScroll animation="reveal-scale" delay={0.1}>
            <div className="glass-card card-hover p-6 rounded-xl border-l-4 border-l-amber-500/70 h-full">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-amber-500/10 rounded-xl border border-amber-500/20 flex items-center justify-center">
                  <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white">Email Hosting</h3>
              </div>
              <p className="text-gray-400 text-sm mb-4">
                {language === 'nl'
                  ? 'Professioneel zakelijk emailadres op jouw eigen domeinnaam. Inclusief webmail, spam-beveiliging en volledige setup.'
                  : 'Professional business email on your own domain. Including webmail, spam protection and full setup.'}
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-300 text-sm">
                  <svg className="w-4 h-4 text-amber-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  {language === 'nl' ? 'info@jouwbedrijf.nl' : 'info@yourbusiness.com'}
                </li>
                <li className="flex items-center text-gray-300 text-sm">
                  <svg className="w-4 h-4 text-amber-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  {language === 'nl' ? 'Spam- en virusbeveiliging' : 'Spam & virus protection'}
                </li>
              </ul>
            </div>
            </AnimateOnScroll>

            {/* Onderhoud & Backups */}
            <AnimateOnScroll animation="reveal-scale" delay={0.2}>
            <div className="glass-card card-hover p-6 rounded-xl border-l-4 border-l-amber-500/70 h-full">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-amber-500/10 rounded-xl border border-amber-500/20 flex items-center justify-center">
                  <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white">{language === 'nl' ? 'Onderhoud & Backups' : 'Maintenance & Backups'}</h3>
              </div>
              <p className="text-gray-400 text-sm mb-4">
                {language === 'nl'
                  ? 'Regelmatig onderhoud, wekelijkse backups, technische updates en 24/7 uptime monitoring voor jouw website.'
                  : 'Regular maintenance, weekly backups, technical updates and 24/7 uptime monitoring for your website.'}
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-300 text-sm">
                  <svg className="w-4 h-4 text-amber-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  {language === 'nl' ? 'Wekelijkse backups' : 'Weekly backups'}
                </li>
                <li className="flex items-center text-gray-300 text-sm">
                  <svg className="w-4 h-4 text-amber-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  {language === 'nl' ? 'Bug fixes & updates' : 'Bug fixes & updates'}
                </li>
              </ul>
            </div>
            </AnimateOnScroll>

            {/* SEO */}
            <AnimateOnScroll animation="reveal-scale" delay={0.3}>
            <div className="glass-card card-hover p-6 rounded-xl border-l-4 border-l-amber-500/70 h-full">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-amber-500/10 rounded-xl border border-amber-500/20 flex items-center justify-center">
                  <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white">SEO Optimalisatie</h3>
              </div>
              <p className="text-gray-400 text-sm mb-4">
                {language === 'nl'
                  ? 'Zorg dat jouw website gevonden wordt in Google. Technische SEO, zoekwoorden analyse en maandelijkse rapportage.'
                  : 'Make sure your website is found on Google. Technical SEO, keyword analysis and monthly reporting.'}
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-300 text-sm">
                  <svg className="w-4 h-4 text-amber-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  {language === 'nl' ? 'On-page optimalisatie' : 'On-page optimization'}
                </li>
                <li className="flex items-center text-gray-300 text-sm">
                  <svg className="w-4 h-4 text-amber-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  {language === 'nl' ? 'Google Search Console' : 'Google Search Console'}
                </li>
              </ul>
            </div>
            </AnimateOnScroll>

            {/* Logo & Branding */}
            <AnimateOnScroll animation="reveal-scale" delay={0.4}>
            <div className="glass-card card-hover p-6 rounded-xl border-l-4 border-l-amber-500/70 h-full">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-amber-500/10 rounded-xl border border-amber-500/20 flex items-center justify-center">
                  <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white">{language === 'nl' ? 'Logo & Huisstijl' : 'Logo & Branding'}</h3>
              </div>
              <p className="text-gray-400 text-sm mb-4">
                {language === 'nl'
                  ? 'Professioneel logo ontwerp met meerdere concepten, revisierondes en alle bestandsformaten. Inclusief kleurenpalet en typografie advies.'
                  : 'Professional logo design with multiple concepts, revision rounds and all file formats. Including color palette and typography advice.'}
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-300 text-sm">
                  <svg className="w-4 h-4 text-amber-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  {language === 'nl' ? '3 concepten + 2 revisies' : '3 concepts + 2 revisions'}
                </li>
                <li className="flex items-center text-gray-300 text-sm">
                  <svg className="w-4 h-4 text-amber-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  {language === 'nl' ? 'PNG, SVG & PDF formaat' : 'PNG, SVG & PDF format'}
                </li>
              </ul>
            </div>
            </AnimateOnScroll>

            {/* Domein Registratie */}
            <AnimateOnScroll animation="reveal-scale" delay={0.5}>
            <div className="glass-card card-hover p-6 rounded-xl border-l-4 border-l-amber-500/70 h-full">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-amber-500/10 rounded-xl border border-amber-500/20 flex items-center justify-center">
                  <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white">{language === 'nl' ? 'Domein Registratie' : 'Domain Registration'}</h3>
              </div>
              <p className="text-gray-400 text-sm mb-4">
                {language === 'nl'
                  ? 'Registreer jouw eigen domeinnaam (.nl of .com). Inclusief DNS beheer, SSL-certificaat en automatische verlenging.'
                  : 'Register your own domain name (.nl or .com). Including DNS management, SSL certificate and automatic renewal.'}
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-300 text-sm">
                  <svg className="w-4 h-4 text-amber-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  {language === 'nl' ? '.nl of .com domeinen' : '.nl or .com domains'}
                </li>
                <li className="flex items-center text-gray-300 text-sm">
                  <svg className="w-4 h-4 text-amber-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  {language === 'nl' ? 'SSL + DNS inbegrepen' : 'SSL + DNS included'}
                </li>
              </ul>
            </div>
            </AnimateOnScroll>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="relative overflow-hidden bg-gradient-to-r from-primary-600 via-primary-500 to-primary-600 text-white p-8 rounded-xl max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">{t('services.page.cta.title')}</h2>
            <p className="mb-6">
              {t('services.page.cta.desc')}
            </p>
            <a 
              href="/contact" 
              className="bg-dark-900 text-primary-400 px-8 py-3 rounded-lg font-bold hover:bg-dark-800 transition inline-block glow-emerald"
            >
              {t('services.page.cta.button')}
            </a>
          </div>
        </div>
      </div>
    </div>
    </PageTransition>
  );
};

export default Diensten;
