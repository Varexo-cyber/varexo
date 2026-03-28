import React from 'react';
import PageTransition from '../components/PageTransition';
import AnimateOnScroll from '../components/AnimateOnScroll';
import SEO from '../components/SEO';
import { useLanguage } from '../contexts/LanguageContext';

const Diensten: React.FC = () => {
  const { t } = useLanguage();
  
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
                {t('language') === 'nl' ? 'Responsive design voor alle apparaten' : 'Responsive design for all devices'}
              </li>
              <li className="flex items-center text-gray-300">
                <svg className="w-5 h-5 text-primary-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {t('language') === 'nl' ? 'Modern en professioneel uiterlijk' : 'Modern and professional appearance'}
              </li>
              <li className="flex items-center text-gray-300">
                <svg className="w-5 h-5 text-primary-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {t('language') === 'nl' ? 'Geoptimaliseerd voor gebruiksgemak' : 'Optimized for usability'}
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
                {t('language') === 'nl' ? 'Maatwerk oplossingen' : 'Custom solutions'}
              </li>
              <li className="flex items-center text-gray-300">
                <svg className="w-5 h-5 text-primary-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {t('language') === 'nl' ? 'Snelle en veilige code' : 'Fast and secure code'}
              </li>
              <li className="flex items-center text-gray-300">
                <svg className="w-5 h-5 text-primary-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {t('language') === 'nl' ? 'Schaalbare oplossingen' : 'Scalable solutions'}
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
                {t('language') === 'nl' ? 'Content creatie en planning' : 'Content creation and planning'}
              </li>
              <li className="flex items-center text-gray-300">
                <svg className="w-5 h-5 text-primary-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {t('language') === 'nl' ? 'Community management' : 'Community management'}
              </li>
              <li className="flex items-center text-gray-300">
                <svg className="w-5 h-5 text-primary-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {t('language') === 'nl' ? 'Analytics en rapportage' : 'Analytics and reporting'}
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
                {t('language') === 'nl' ? 'Snelle en betrouwbare hosting' : 'Fast and reliable hosting'}
              </li>
              <li className="flex items-center text-gray-300">
                <svg className="w-5 h-5 text-primary-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {t('language') === 'nl' ? 'Regelmatige updates en back-ups' : 'Regular updates and backups'}
              </li>
              <li className="flex items-center text-gray-300">
                <svg className="w-5 h-5 text-primary-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {t('language') === 'nl' ? 'Beveiliging en monitoring' : 'Security and monitoring'}
              </li>
            </ul>
            <a href="/contact" className="text-primary-400 font-semibold hover:text-primary-300">
              {t('services.page.moreInfo')}
            </a>
          </div>
          </AnimateOnScroll>
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
