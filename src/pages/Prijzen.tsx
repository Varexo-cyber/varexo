import React from 'react';
import PageTransition from '../components/PageTransition';
import AnimateOnScroll from '../components/AnimateOnScroll';
import SEO from '../components/SEO';
import { useLanguage } from '../contexts/LanguageContext';
import CountdownTimer from '../components/CountdownTimer';

const Prijzen: React.FC = () => {
  const { t, language } = useLanguage();
  
  return (
    <PageTransition>
    <SEO 
      title="Prijzen - Professionele Websites met Onderhoud"
      description="Complete website pakketten met maandelijkse garantie. Van Basic tot Premium, inclusief 24/7 uptime, updates en SEO optimalisatie."
      keywords="website prijzen, webdesign kosten, website onderhoud, SEO, hosting, garantie, professionele website"
      canonical="/prijzen"
    />
    <div className="py-20 matrix-dots">
      <div className="container mx-auto px-4">
        <AnimateOnScroll>
        <p className="text-primary-400 text-center font-mono text-sm mb-2 tracking-wider">{t('pricing.tag')}</p>
        <h1 className="text-4xl font-bold text-center mb-4 text-white">{t('pricing.title')}</h1>
        <p className="text-xl text-center text-gray-400 mb-4 max-w-2xl mx-auto">
          {t('pricing.subtitle')}
        </p>
        
        {/* Countdown Timer for Promo */}
        <div className="flex flex-col items-center mb-12">
          <div className="inline-flex flex-col sm:flex-row items-center gap-2 sm:gap-4 bg-red-500/10 border border-red-500/30 rounded-full px-5 py-2">
            <div className="flex items-center gap-2">
              <span className="text-red-400 font-bold text-sm">{language === 'nl' ? 'ACTIE' : 'PROMO'}</span>
              <span className="text-gray-400 text-sm">{language === 'nl' ? '€250 korting t/m 31 mei' : '€250 discount until May 31'}</span>
            </div>
            <CountdownTimer targetDate="2026-05-31T23:59:59" language={language} />
          </div>
        </div>
        </AnimateOnScroll>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          {/* Basic Pakket */}
          <div className="relative">
            <div className="absolute -top-3 -right-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse z-20">-€250</div>
            <div className="glass-card card-hover p-8 rounded-xl h-full">
              <h3 className="text-2xl font-bold mb-2 text-white">{t('pricing.basic.title')}</h3>
              <p className="text-xs font-mono text-gray-500 mb-3">{'// starter-complete'}</p>
              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <div className="text-lg text-gray-500 line-through">€899.99</div>
                  <div className="text-4xl font-bold text-primary-400 text-glow">€649.99</div>
                </div>
                <div className="text-sm text-gray-400">{t('pricing.onetime')}</div>
                <div className="text-xs text-red-400 font-semibold mt-1">{t('pricing.offerValid')}</div>
                <div className="mt-4 pt-4 border-t border-dark-600">
                  <div className="text-xl font-bold text-white">€39.99 <span className="text-sm font-normal text-gray-400">{t('pricing.month')}</span></div>
                  <div className="text-lg font-semibold text-primary-400 mt-1">{t('pricing.or')} €449.99{t('pricing.perYear')}</div>
                </div>
                <div className="text-xs text-gray-400 mt-2">{t('pricing.uptime')}</div>
              </div>
              <ul className="space-y-3 mb-8 text-gray-200">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-primary-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {t('pricing.basic.f1')}
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-primary-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {t('pricing.basic.f2')}
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-primary-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {t('pricing.basic.f3')}
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-primary-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {t('pricing.basic.f4')}
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-primary-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {t('pricing.basic.f5')}
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-primary-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {t('pricing.basic.f6')}
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-primary-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {t('pricing.basic.f7')}
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-primary-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {t('pricing.basic.f8')}
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-primary-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {t('pricing.basic.seoDiscount')}
                </li>
              </ul>
              <a 
                href="/contact" 
                className="block w-full bg-primary-500 text-dark-900 text-center py-3 rounded-lg font-bold hover:bg-primary-400 transition glow-emerald"
              >
                {t('pricing.choose')} {t('pricing.basic.title')}
              </a>
            </div>
          </div>

          {/* Pro Pakket */}
          <div className="relative">
            <div className="absolute -top-7 -right-5 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse z-30 shadow-lg">-€250</div>
            <div className="relative overflow-hidden bg-gradient-to-b from-primary-600 to-primary-700 text-white p-8 rounded-xl shadow-xl transform scale-105 border-2 border-primary-400 glow-emerald-strong">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-400/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
              <div className="bg-dark-900 text-primary-400 text-xs font-bold font-mono px-3 py-1 rounded-full inline-block mb-4 tracking-wider">
                {t('pricing.mostPopular')}
              </div>
              <h3 className="text-2xl font-bold mb-2">{t('pricing.pro.title')}</h3>
              <p className="text-xs font-mono text-primary-200 mb-3">{'// speed-optimized'}</p>
            <div className="mb-6">
              <div className="flex items-baseline gap-2">
                <div className="text-lg text-primary-300/50 line-through">€1299.99</div>
                <div className="text-4xl font-bold text-white" style={{textShadow: '0 0 10px rgba(16,185,129,0.5)'}}>€1049.99</div>
              </div>
              <div className="text-sm text-primary-200">{t('pricing.onetime')}</div>
              <div className="text-xs text-red-300 font-semibold mt-1">{t('pricing.offerValid')}</div>
              <div className="mt-4 pt-4 border-t border-primary-500/30">
                <div className="text-xl font-bold text-white">€39.99 <span className="text-sm font-normal text-primary-200">{t('pricing.month')}</span></div>
                <div className="text-lg font-semibold text-white mt-1" style={{textShadow: '0 0 10px rgba(16,185,129,0.5)'}}>{t('pricing.or')} €449.99{t('pricing.perYear')}</div>
              </div>
              <div className="text-xs text-primary-200 mt-2">{t('pricing.loadTime')}</div>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center">
                <svg className="w-5 h-5 text-primary-200 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {t('pricing.pro.f1')}
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-primary-200 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {t('pricing.pro.f2')}
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-primary-200 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {t('pricing.pro.f3')}
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-primary-200 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {t('pricing.pro.f4')}
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-primary-200 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {t('pricing.pro.f5')}
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-primary-200 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {t('pricing.pro.f6')}
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-primary-200 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {t('pricing.pro.f7')}
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-primary-200 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {t('pricing.pro.f8')}
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-primary-200 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {t('pricing.pro.seoDiscount')}
              </li>
            </ul>
            <a 
              href="/contact" 
              className="block w-full bg-dark-900 text-primary-400 text-center py-3 rounded-lg font-bold hover:bg-dark-800 transition glow-emerald"
            >
              {t('pricing.choose')} {t('pricing.pro.title')}
            </a>
          </div>
        </div>

          {/* Premium Pakket */}
          <div className="relative">
            <div className="absolute -top-3 -right-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse z-20">-€250</div>
            <div className="glass-card card-hover p-8 rounded-xl h-full">
              <h3 className="text-2xl font-bold mb-2 text-white">{t('pricing.premium.title')}</h3>
              <p className="text-xs font-mono text-gray-500 mb-3">{'// all-inclusive'}</p>
              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <div className="text-lg text-gray-500 line-through">€1999.99</div>
                  <div className="text-4xl font-bold text-primary-400 text-glow">€1749.99</div>
                </div>
                <div className="text-sm text-gray-400">{t('pricing.onetime')}</div>
                <div className="text-xs text-red-400 font-semibold mt-1">{t('pricing.offerValid')}</div>
                <div className="mt-4 pt-4 border-t border-dark-600">
                  <div className="text-xl font-bold text-white">€39.99 <span className="text-sm font-normal text-gray-400">{t('pricing.month')}</span></div>
                  <div className="text-lg font-semibold text-primary-400 mt-1">{t('pricing.or')} €449.99{t('pricing.perYear')}</div>
                </div>
                <div className="text-xs text-gray-400 mt-2">{t('pricing.allInclusive')}</div>
              </div>
              <ul className="space-y-3 mb-8 text-gray-200">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-primary-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {t('pricing.premium.f1')}
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-primary-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {t('pricing.premium.f2')}
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-primary-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {t('pricing.premium.f3')}
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-primary-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {t('pricing.premium.f4')}
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-primary-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {t('pricing.premium.f5')}
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-primary-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {t('pricing.premium.f6')}
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-primary-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {t('pricing.premium.f7')}
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-primary-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {t('pricing.premium.f8')}
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-primary-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {t('pricing.premium.f9')}
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-primary-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {t('pricing.premium.seoDiscount')}
                </li>
              </ul>
              <a 
                href="/contact" 
                className="block w-full bg-primary-500 text-dark-900 text-center py-3 rounded-lg font-bold hover:bg-primary-400 transition glow-emerald"
              >
                {t('pricing.choose')} {t('pricing.premium.title')}
              </a>
            </div>
          </div>
        </div>
      </div>

        {/* Garanties */}
        <div className="glass-card p-8 rounded-xl max-w-4xl mx-auto mb-16">
          <h2 className="text-2xl font-bold text-center mb-8 text-white">{t('pricing.guarantees.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-dark-800/50 p-6 rounded-xl border border-dark-600/50 card-hover text-center">
              <div className="text-3xl font-bold text-primary-400 mb-3">24/7</div>
              <h3 className="text-lg font-semibold mb-2 text-white">{t('home.stats.uptime')}</h3>
              <p className="text-gray-400 text-sm">{language === 'nl' ? 'Uw website is altijd online en beschikbaar' : 'Your website is always online and available'}</p>
            </div>
            <div className="bg-dark-800/50 p-6 rounded-xl border border-dark-600/50 card-hover text-center">
              <div className="text-3xl font-bold text-primary-400 mb-3">24u</div>
              <h3 className="text-lg font-semibold mb-2 text-white">{language === 'nl' ? 'Update Garantie' : 'Update Guarantee'}</h3>
              <p className="text-gray-400 text-sm">{language === 'nl' ? 'Wijzigingen binnen 24 uur geïmplementeerd' : 'Changes implemented within 24 hours'}</p>
            </div>
            <div className="bg-dark-800/50 p-6 rounded-xl border border-dark-600/50 card-hover text-center">
              <div className="text-3xl font-bold text-primary-400 mb-3">0.01s</div>
              <h3 className="text-lg font-semibold mb-2 text-white">{language === 'nl' ? 'Snelheid Garantie' : 'Speed Guarantee'}</h3>
              <p className="text-gray-400 text-sm">{language === 'nl' ? 'Website laadt binnen 0.01 seconden (Pro+)' : 'Website loads within 0.01 seconds (Pro+)'}</p>
            </div>
          </div>
        </div>

        {/* Social Media & Ads Packages */}
        <div className="max-w-6xl mx-auto mb-16">
          <AnimateOnScroll>
            <div className="text-center mb-4">
              <span className="inline-block px-4 py-1.5 bg-blue-500/10 text-blue-400 text-xs font-bold font-mono rounded-full border border-blue-500/30 mb-4 tracking-wider">NEW</span>
            </div>
            <p className="text-blue-400 text-center font-mono text-sm mb-2 tracking-wider">$ run ads --target=growth</p>
            <h2 className="text-3xl font-bold text-center mb-4 text-white">
              {language === 'nl' ? 'Social Media & Advertenties' : 'Social Media & Advertising'}
            </h2>
            <p className="text-lg text-center text-gray-400 mb-4 max-w-3xl mx-auto">
              {language === 'nl' 
                ? 'Laat jouw bedrijf ontploffen op social media. Wij zorgen ervoor dat de juiste doelgroep jouw bedrijf vindt, ziet en contact opneemt.' 
                : 'Make your business explode on social media. We ensure the right audience finds, sees and contacts your business.'}
            </p>
            <p className="text-center text-primary-400 font-semibold mb-12">
              {language === 'nl' 
                ? '10.000+ weergaven per dag. Tientallen leads per week. Echte resultaten.' 
                : '10,000+ views per day. Dozens of leads per week. Real results.'}
            </p>
          </AnimateOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Social Basic */}
            <div className="glass-card card-hover p-8 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <h3 className="text-2xl font-bold text-white">{language === 'nl' ? 'Starter' : 'Starter'}</h3>
              </div>
              <p className="text-xs font-mono text-gray-500 mb-3">{'// social-starter'}</p>
              <div className="mb-6">
                <div className="text-4xl font-bold text-blue-400" style={{textShadow: '0 0 10px rgba(59,130,246,0.4)'}}>€399.99</div>
                <div className="text-sm text-gray-400">{language === 'nl' ? 'per maand' : 'per month'}</div>
                <div className="text-xs text-primary-400 mt-2">{language === 'nl' ? 'Inclusief advertentiebudget' : 'Ad budget included'}</div>
              </div>
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 mb-6">
                <p className="text-blue-300 text-xs font-semibold text-center">
                  {language === 'nl' ? '5.000+ weergaven per dag verwacht' : '5,000+ views per day expected'}
                </p>
              </div>
              <ul className="space-y-3 mb-8 text-gray-200">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-blue-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Instagram & Facebook
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-blue-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {language === 'nl' ? 'Doelgroep & regio targeting' : 'Audience & regional targeting'}
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-blue-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {language === 'nl' ? 'Professioneel ads design' : 'Professional ad design'}
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-blue-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {language === 'nl' ? '1 campagne per maand' : '1 campaign per month'}
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-blue-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {language === 'nl' ? 'Maandelijkse rapportage' : 'Monthly reporting'}
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-blue-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {language === 'nl' ? 'Basis leadgeneratie' : 'Basic lead generation'}
                </li>
              </ul>
              <a 
                href="/contact" 
                className="block w-full bg-blue-500 text-white text-center py-3 rounded-lg font-bold hover:bg-blue-400 transition"
                style={{boxShadow: '0 0 20px rgba(59,130,246,0.3)'}}
              >
                {language === 'nl' ? 'Start Starter' : 'Start Starter'}
              </a>
            </div>

            {/* Social Pro - Most Popular */}
            <div className="relative overflow-hidden bg-gradient-to-b from-blue-600 to-blue-700 text-white p-8 rounded-xl shadow-xl transform scale-105 border-2 border-blue-400" style={{boxShadow: '0 0 30px rgba(59,130,246,0.4)'}}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
              <div className="bg-dark-900 text-blue-400 text-xs font-bold font-mono px-3 py-1 rounded-full inline-block mb-4 tracking-wider">
                BEST_RESULTS
              </div>
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-6 h-6 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                </svg>
                <h3 className="text-2xl font-bold">{language === 'nl' ? 'Groei' : 'Growth'}</h3>
              </div>
              <p className="text-xs font-mono text-blue-200 mb-3">{'// maximum-impact'}</p>
              <div className="mb-6">
                <div className="text-4xl font-bold text-white" style={{textShadow: '0 0 15px rgba(59,130,246,0.6)'}}>€699.99</div>
                <div className="text-sm text-blue-200">{language === 'nl' ? 'per maand' : 'per month'}</div>
                <div className="text-xs text-blue-200 mt-2">{language === 'nl' ? 'Inclusief advertentiebudget' : 'Ad budget included'}</div>
              </div>
              <div className="bg-white/10 border border-white/20 rounded-lg p-3 mb-6">
                <p className="text-white text-xs font-bold text-center">
                  {language === 'nl' ? '15.000+ weergaven per dag verwacht' : '15,000+ views per day expected'}
                </p>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-blue-200 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {language === 'nl' ? 'Alles uit Starter pakket' : 'Everything from Starter'}
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-blue-200 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Instagram & Facebook
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-blue-200 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {language === 'nl' ? 'Geavanceerde doelgroep analyse' : 'Advanced audience analysis'}
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-blue-200 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {language === 'nl' ? '2 campagnes per maand' : '2 campaigns per month'}
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-blue-200 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {language === 'nl' ? 'A/B testing voor beste resultaten' : 'A/B testing for best results'}
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-blue-200 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {language === 'nl' ? 'Actieve leadgeneratie & opvolging' : 'Active lead generation & follow-up'}
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-blue-200 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {language === 'nl' ? 'Wekelijkse rapportage & optimalisatie' : 'Weekly reporting & optimization'}
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-blue-200 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {language === 'nl' ? 'Regio-specifieke targeting' : 'Region-specific targeting'}
                </li>
              </ul>
              <a 
                href="/contact" 
                className="block w-full bg-dark-900 text-blue-400 text-center py-3 rounded-lg font-bold hover:bg-dark-800 transition"
                style={{boxShadow: '0 0 20px rgba(59,130,246,0.3)'}}
              >
                {language === 'nl' ? 'Start Groei' : 'Start Growth'}
              </a>
            </div>

            {/* Social Premium */}
            <div className="glass-card card-hover p-8 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                <h3 className="text-2xl font-bold text-white">{language === 'nl' ? 'Dominant' : 'Dominant'}</h3>
              </div>
              <p className="text-xs font-mono text-gray-500 mb-3">{'// full-dominance'}</p>
              <div className="mb-6">
                <div className="text-4xl font-bold text-blue-400" style={{textShadow: '0 0 10px rgba(59,130,246,0.4)'}}>€999.99</div>
                <div className="text-sm text-gray-400">{language === 'nl' ? 'per maand' : 'per month'}</div>
                <div className="text-xs text-primary-400 mt-2">{language === 'nl' ? 'Inclusief advertentiebudget' : 'Ad budget included'}</div>
              </div>
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 mb-6">
                <p className="text-blue-300 text-xs font-semibold text-center">
                  {language === 'nl' ? '30.000+ weergaven per dag verwacht' : '30,000+ views per day expected'}
                </p>
              </div>
              <ul className="space-y-3 mb-8 text-gray-200">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-blue-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {language === 'nl' ? 'Alles uit Groei pakket' : 'Everything from Growth'}
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-blue-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Instagram & Facebook
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-blue-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {language === 'nl' ? '3 campagnes per maand' : '3 campaigns per month'}
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-blue-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {language === 'nl' ? 'Premium ads design' : 'Premium ad design'}
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-blue-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {language === 'nl' ? 'Conversie-geoptimaliseerde funnels' : 'Conversion-optimized funnels'}
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-blue-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {language === 'nl' ? 'Persoonlijke accountmanager' : 'Personal account manager'}
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-blue-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {language === 'nl' ? 'Dagelijkse rapportage & bijsturing' : 'Daily reporting & adjustments'}
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-blue-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Meta Ads (Instagram & Facebook)
                </li>
              </ul>
              <a 
                href="/contact" 
                className="block w-full bg-blue-500 text-white text-center py-3 rounded-lg font-bold hover:bg-blue-400 transition"
                style={{boxShadow: '0 0 20px rgba(59,130,246,0.3)'}}
              >
                {language === 'nl' ? 'Start Dominant' : 'Start Dominant'}
              </a>
            </div>
          </div>

          {/* Results Promise Banner */}
          <div className="mt-10 bg-gradient-to-r from-blue-600/20 via-blue-500/10 to-blue-600/20 border border-blue-500/30 rounded-xl p-8 text-center" style={{boxShadow: '0 0 40px rgba(59,130,246,0.1)'}}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
              <div>
                <div className="text-3xl font-bold text-blue-400" style={{textShadow: '0 0 10px rgba(59,130,246,0.5)'}}>10K+</div>
                <p className="text-gray-400 text-sm">{language === 'nl' ? 'Weergaven / dag' : 'Views / day'}</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-400" style={{textShadow: '0 0 10px rgba(59,130,246,0.5)'}}>50+</div>
                <p className="text-gray-400 text-sm">{language === 'nl' ? 'Leads / maand' : 'Leads / month'}</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-400" style={{textShadow: '0 0 10px rgba(59,130,246,0.5)'}}>24/7</div>
                <p className="text-gray-400 text-sm">{language === 'nl' ? 'Campagne actief' : 'Campaign active'}</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-400" style={{textShadow: '0 0 10px rgba(59,130,246,0.5)'}}>100%</div>
                <p className="text-gray-400 text-sm">{language === 'nl' ? 'Transparantie' : 'Transparency'}</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm max-w-2xl mx-auto">
              {language === 'nl' 
                ? 'Wij focussen op jouw gewenste doelgroep en regio. Met op maat gemaakte advertenties en continue optimalisatie zorgen wij ervoor dat jouw bedrijf gevonden wordt door de mensen die er toe doen. Meer zichtbaarheid, meer klanten, meer omzet.' 
                : 'We focus on your desired audience and region. With custom-made ads and continuous optimization, we ensure your business is found by the people who matter. More visibility, more customers, more revenue.'}
            </p>
          </div>
        </div>

        {/* Extra Diensten Section */}
        <div className="max-w-7xl mx-auto mb-16 mt-16">
          <AnimateOnScroll>
            <div className="text-center mb-4">
              <span className="inline-block px-4 py-1.5 text-xs font-bold font-mono rounded-full mb-4 tracking-wider" style={{background: 'rgba(249, 115, 22, 0.1)', color: '#fb923c', border: '1px solid rgba(249, 115, 22, 0.3)'}}>EXTRA</span>
            </div>
            <p className="text-center font-mono text-sm mb-2 tracking-wider" style={{color: '#fb923c'}}>$ run services --extra</p>
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-white">
              {language === 'nl' ? 'Extra Diensten' : 'Additional Services'}
            </h2>
            <p className="text-lg text-center text-gray-400 mb-12 max-w-3xl mx-auto">
              {language === 'nl'
                ? 'Naast websites en social media bieden wij ook losse diensten aan om jouw bedrijf compleet online te krijgen.'
                : 'Besides websites and social media, we also offer individual services to get your business fully online.'}
            </p>
          </AnimateOnScroll>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {[
              {
                title: language === 'nl' ? 'Email Hosting' : 'Email Hosting',
                price: '€9,99',
                period: language === 'nl' ? '/maand' : '/month',
                subPrice: language === 'nl' ? 'of €109,99/jaar' : 'or €109,99/year',
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                ),
                features: language === 'nl' 
                  ? ['Eigen zakelijk emailadres', 'Webmail toegang', 'Spam- en virusbeveiliging', 'Volledige setup inbegrepen']
                  : ['Own business email address', 'Webmail access', 'Spam & virus protection', 'Full setup included'],
                delay: 0.1
              },
              {
                title: language === 'nl' ? 'Onderhoud & Backups' : 'Maintenance & Backups',
                price: '€39,99',
                period: language === 'nl' ? '/maand' : '/month',
                subPrice: language === 'nl' ? 'of €449,99/jaar' : 'or €449,99/year',
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                ),
                features: language === 'nl' 
                  ? ['Wekelijkse backups', 'Technische updates', 'Bug fixes & aanpassingen', '24/7 uptime monitoring']
                  : ['Weekly backups', 'Technical updates', 'Bug fixes & adjustments', '24/7 uptime monitoring'],
                delay: 0.2
              },
              {
                title: 'SEO',
                price: '€89,99',
                period: language === 'nl' ? '/maand' : '/month',
                subPrice: language === 'nl' ? 'Eenmalige opstel €399,99' : 'One-time setup €399,99',
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                ),
                features: language === 'nl'
                  ? ['Opstel: technische audit + zoekwoorden', 'Opstel: Search Console + concurrentie', 'Maand: content strategie + backlinks', 'Maand: ranking rapportage + optimalisatie']
                  : ['Setup: technical audit + keywords', 'Setup: Search Console + competitor scan', 'Monthly: content strategy + backlinks', 'Monthly: ranking report + optimization'],
                delay: 0.3
              },
              {
                title: language === 'nl' ? 'Logo & Huisstijl' : 'Logo & Branding',
                price: '€199,99',
                period: '',
                subPrice: language === 'nl' ? 'eenmalig' : 'one-time',
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                ),
                features: language === 'nl' 
                  ? ['3 logo concepten', '2 revisierondes', 'PNG, SVG & PDF', 'Kleurenpalet + typografie']
                  : ['3 logo concepts', '2 revision rounds', 'PNG, SVG & PDF', 'Color palette + typography'],
                delay: 0.4
              },
              {
                title: language === 'nl' ? 'Domein Registratie' : 'Domain Registration',
                price: '€19,99',
                period: language === 'nl' ? '/jaar' : '/year',
                subPrice: language === 'nl' ? '.nl of .com' : '.nl or .com',
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                ),
                features: language === 'nl' 
                  ? ['.nl of .com domein', 'DNS beheer inbegrepen', 'Automatische verlenging', 'SSL-certificaat']
                  : ['.nl or .com domain', 'DNS management included', 'Automatic renewal', 'SSL certificate'],
                delay: 0.5
              }
            ].map((service, idx) => (
              <AnimateOnScroll key={idx} animation="reveal-scale" delay={service.delay}>
                <div 
                  className="group relative h-full p-6 rounded-xl bg-dark-800/60 backdrop-blur-sm border border-dark-700 hover:border-orange-500/50 transition-all duration-300 flex flex-col overflow-hidden"
                  style={{boxShadow: '0 0 0 rgba(251, 146, 60, 0)'}}
                  onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 0 30px rgba(251, 146, 60, 0.2)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 0 0 rgba(251, 146, 60, 0)'; }}
                >
                  {/* Decorative gradient blob */}
                  <div 
                    className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-500"
                    style={{background: 'radial-gradient(circle, #fb923c 0%, transparent 70%)'}}
                  />
                  
                  {/* Icon */}
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 relative z-10"
                    style={{
                      background: 'linear-gradient(135deg, rgba(251, 146, 60, 0.2) 0%, rgba(249, 115, 22, 0.1) 100%)',
                      border: '1px solid rgba(251, 146, 60, 0.3)',
                      color: '#fb923c'
                    }}
                  >
                    {service.icon}
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-lg font-bold text-white mb-3 relative z-10">{service.title}</h3>
                  
                  {/* Price */}
                  <div className="mb-4 relative z-10">
                    <div className="flex items-baseline gap-1">
                      <span 
                        className="text-3xl font-bold" 
                        style={{color: '#fb923c', textShadow: '0 0 20px rgba(251, 146, 60, 0.4)'}}
                      >
                        {service.price}
                      </span>
                      {service.period && <span className="text-sm text-gray-400">{service.period}</span>}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{service.subPrice}</div>
                  </div>

                  {/* Features */}
                  <ul className="space-y-2 mb-5 flex-1 relative z-10">
                    {service.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-start text-gray-300 text-sm">
                        <svg className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{color: '#fb923c'}}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <a 
                    href="/contact" 
                    className="relative z-10 block w-full text-center py-2.5 rounded-lg font-semibold transition-all duration-300 group-hover:scale-[1.02]"
                    style={{
                      background: 'linear-gradient(135deg, #fb923c 0%, #f97316 100%)',
                      color: '#0f172a',
                      boxShadow: '0 4px 14px 0 rgba(251, 146, 60, 0.3)'
                    }}
                  >
                    {language === 'nl' ? 'Aanvragen' : 'Request'}
                  </a>
                </div>
              </AnimateOnScroll>
            ))}
          </div>

          {/* Info banner under extra services */}
          <div 
            className="mt-10 rounded-xl p-6 text-center"
            style={{
              background: 'linear-gradient(135deg, rgba(251, 146, 60, 0.08) 0%, rgba(249, 115, 22, 0.04) 100%)',
              border: '1px solid rgba(251, 146, 60, 0.2)'
            }}
          >
            <p className="text-gray-300 max-w-3xl mx-auto">
              {language === 'nl' 
                ? 'Combineer deze losse diensten met een van onze website pakketten voor de beste resultaten. Alles in één hand voor maximaal gemak.' 
                : 'Combine these individual services with one of our website packages for the best results. Everything in one place for maximum convenience.'}
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-4 text-white">{t('pricing.cta.title')}</h2>
          <p className="text-gray-400 mb-6">
            {t('pricing.cta.desc')}
          </p>
          <a 
            href="/contact" 
            className="bg-primary-500 text-dark-900 px-8 py-3 rounded-lg font-semibold hover:bg-primary-400 transition inline-block"
          >
            {t('pricing.cta.button')}
          </a>
        </div>

        {/* Custom Budget Section */}
        <div className="glass-card p-8 rounded-xl max-w-4xl mx-auto mt-16 border border-primary-500/30 glow-emerald">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 bg-primary-900/50 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-xl font-bold text-white mb-2">{t('pricing.budget.title')}</h3>
              <p className="text-gray-400 mb-4">
                {t('pricing.budget.desc')}
              </p>
              <a 
                href="/contact" 
                className="inline-flex items-center gap-2 bg-primary-500 text-dark-900 px-6 py-3 rounded-lg font-semibold hover:bg-primary-400 transition glow-emerald"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                {t('pricing.budget.button')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Prijzen;
