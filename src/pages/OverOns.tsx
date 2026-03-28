import React from 'react';
import PageTransition from '../components/PageTransition';
import AnimateOnScroll from '../components/AnimateOnScroll';
import SEO from '../components/SEO';
import { useLanguage } from '../contexts/LanguageContext';

const OverOns: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <PageTransition>
    <SEO 
      title="Over Ons - Webdesign Bureau Nederland"
      description="Leer meer over Varexo, een professioneel webdesign- en webdevelopmentbureau uit Nederland. Wij combineren creativiteit met technologie voor jouw online succes."
      keywords="over varexo, webdesign bureau, webdevelopment bureau Nederland, wie zijn wij, webdesigner Nederland"
      canonical="/over-ons"
    />
    <div className="py-20 matrix-dots">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <AnimateOnScroll>
          <p className="text-primary-400 text-center font-mono text-sm mb-2 tracking-wider">{t('about.tag')}</p>
          <h1 className="text-4xl font-bold text-center mb-8 text-white">{t('about.title')}</h1>
          </AnimateOnScroll>
          
          <div className="glass-card p-8 rounded-xl">
            <h2 className="text-2xl font-semibold mb-6 text-primary-400 text-glow">{t('about.company.name')}</h2>
            
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-300 mb-6 leading-relaxed">
                {t('about.company.desc1')}
              </p>
              
              <p className="text-gray-300 mb-6 leading-relaxed">
                {t('about.company.desc2')}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                <div className="glass-card p-6 rounded-xl card-hover">
                  <h3 className="text-xl font-semibold mb-4 text-primary-400">{t('about.mission.title')}</h3>
                  <p className="text-gray-300">
                    {t('about.mission.desc')}
                  </p>
                </div>
                
                <div className="glass-card p-6 rounded-xl card-hover">
                  <h3 className="text-xl font-semibold mb-4 text-primary-400">{t('about.vision.title')}</h3>
                  <p className="text-gray-300">
                    {t('about.vision.desc')}
                  </p>
                </div>
              </div>
              
              <div className="mt-12">
                <h3 className="text-2xl font-semibold mb-6 text-white">{t('about.why.title')}</h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <svg className="w-6 h-6 text-primary-400 mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-300">{t('about.why.experience')}</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-6 h-6 text-primary-400 mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-300">{t('about.why.personal')}</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-6 h-6 text-primary-400 mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-300">{t('about.why.roi')}</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-6 h-6 text-primary-400 mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-300">{t('about.why.transparent')}</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-6 h-6 text-primary-400 mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-300">{t('about.why.fast')}</span>
                  </li>
                </ul>
              </div>
              
              <div className="mt-12 text-center">
                <h3 className="text-2xl font-semibold mb-4 text-white">{t('about.cta.title')}</h3>
                <p className="text-gray-400 mb-6">
                  {t('about.cta.desc')}
                </p>
                <a 
                  href="/contact" 
                  className="bg-primary-500 text-dark-900 px-8 py-3 rounded-lg font-bold hover:bg-primary-400 transition inline-block glow-emerald"
                >
                  {t('about.cta.button')}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </PageTransition>
  );
};

export default OverOns;
