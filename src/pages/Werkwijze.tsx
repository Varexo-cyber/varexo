import React from 'react';
import PageTransition from '../components/PageTransition';
import AnimateOnScroll from '../components/AnimateOnScroll';
import SEO from '../components/SEO';
import { useLanguage } from '../contexts/LanguageContext';

const Werkwijze: React.FC = () => {
  const { t, language } = useLanguage();
  
  return (
    <PageTransition>
    <SEO 
      title="Werkwijze - Hoe Wij Websites Bouwen"
      description="Ontdek onze werkwijze: van intake tot oplevering. Wij bouwen professionele websites in 4 stappen. Persoonlijk, transparant en resultaatgericht."
      keywords="werkwijze webdesign, hoe website laten maken, webdesign proces, website ontwikkeling stappen"
      canonical="/werkwijze"
    />
    <div className="py-20 tech-grid">
      <div className="container mx-auto px-4">
        <AnimateOnScroll>
        <p className="text-primary-400 text-center font-mono text-sm mb-2 tracking-wider">{'// git log --oneline'}</p>
        <h1 className="text-4xl font-bold text-center mb-4 text-white">{language === 'nl' ? 'Onze Werkwijze' : 'Our Process'}</h1>
        <p className="text-gray-400 text-center mb-16 max-w-xl mx-auto">{language === 'nl' ? 'Van intake tot deployment in 5 sprints' : 'From intake to deployment in 5 sprints'}</p>
        </AnimateOnScroll>
        
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-primary-500/30 via-primary-500/10 to-primary-500/30"></div>
            
            {/* Steps */}
            <div className="space-y-12">
              {/* Step 1 */}
              <div className="flex items-center">
                <div className="w-1/2 pr-8 text-right">
                  <div className="glass-card p-6 rounded-xl inline-block">
                    <h3 className="text-xl font-bold mb-2 text-primary-400">{t('process.step1.title')}</h3>
                    <p className="text-gray-400">{t('process.step1.desc')}</p>
                  </div>
                </div>
                <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center z-10 glow-emerald">
                  <span className="text-white font-bold">1</span>
                </div>
                <div className="w-1/2 pl-8"></div>
              </div>

              {/* Step 2 */}
              <div className="flex items-center">
                <div className="w-1/2 pr-8"></div>
                <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center z-10 glow-emerald">
                  <span className="text-white font-bold">2</span>
                </div>
                <div className="w-1/2 pl-8">
                  <div className="glass-card p-6 rounded-xl inline-block">
                    <h3 className="text-xl font-bold mb-2 text-primary-400">{t('process.step2.title')}</h3>
                    <p className="text-gray-400">{t('process.step2.desc')}</p>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-center">
                <div className="w-1/2 pr-8 text-right">
                  <div className="glass-card p-6 rounded-xl inline-block">
                    <h3 className="text-xl font-bold mb-2 text-primary-400">{t('process.step3.title')}</h3>
                    <p className="text-gray-400">{t('process.step3.desc')}</p>
                  </div>
                </div>
                <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center z-10 glow-emerald">
                  <span className="text-white font-bold">3</span>
                </div>
                <div className="w-1/2 pl-8"></div>
              </div>

              {/* Step 4 */}
              <div className="flex items-center">
                <div className="w-1/2 pr-8"></div>
                <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center z-10 glow-emerald">
                  <span className="text-white font-bold">4</span>
                </div>
                <div className="w-1/2 pl-8">
                  <div className="glass-card p-6 rounded-xl inline-block">
                    <h3 className="text-xl font-bold mb-2 text-primary-400">{t('process.step4.title')}</h3>
                    <p className="text-gray-400">{t('process.step4.desc')}</p>
                  </div>
                </div>
              </div>

              {/* Step 5 */}
              <div className="flex items-center">
                <div className="w-1/2 pr-8 text-right">
                  <div className="glass-card p-6 rounded-xl inline-block">
                    <h3 className="text-xl font-bold mb-2 text-primary-400">{t('process.step5.title')}</h3>
                    <p className="text-gray-400">{t('process.step5.desc')}</p>
                  </div>
                </div>
                <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center z-10 glow-emerald">
                  <span className="text-white font-bold">5</span>
                </div>
                <div className="w-1/2 pl-8"></div>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-16 glass-card p-8 rounded-xl">
            <h2 className="text-2xl font-bold mb-6 text-center text-white">{t('process.expect.title')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start">
                <svg className="w-6 h-6 text-primary-400 mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h3 className="font-semibold mb-2 text-white">{t('process.expect.communication.title')}</h3>
                  <p className="text-gray-400">{t('process.expect.communication.desc')}</p>
                </div>
              </div>
              <div className="flex items-start">
                <svg className="w-6 h-6 text-primary-400 mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h3 className="font-semibold mb-2 text-white">{t('process.expect.timeline.title')}</h3>
                  <p className="text-gray-400">{t('process.expect.timeline.desc')}</p>
                </div>
              </div>
              <div className="flex items-start">
                <svg className="w-6 h-6 text-primary-400 mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h3 className="font-semibold mb-2 text-white">{t('process.expect.quality.title')}</h3>
                  <p className="text-gray-400">{t('process.expect.quality.desc')}</p>
                </div>
              </div>
              <div className="flex items-start">
                <svg className="w-6 h-6 text-primary-400 mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <div>
                  <h3 className="font-semibold mb-2 text-white">{t('process.expect.aftercare.title')}</h3>
                  <p className="text-gray-400">{t('process.expect.aftercare.desc')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-16 text-center">
            <h2 className="text-2xl font-bold mb-4 text-white">{t('process.cta.title')}</h2>
            <p className="text-gray-400 mb-6">{t('process.cta.desc')}</p>
            <a 
              href="/contact" 
              className="bg-primary-500 text-dark-900 px-8 py-3 rounded-lg font-bold hover:bg-primary-400 transition inline-block glow-emerald"
            >
              {t('process.cta.button')}
            </a>
          </div>
        </div>
      </div>
    </div>
    </PageTransition>
  );
};

export default Werkwijze;
