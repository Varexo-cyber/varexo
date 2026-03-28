import React from 'react';
import { Link } from 'react-router-dom';
import PageTransition from '../components/PageTransition';
import AnimateOnScroll from '../components/AnimateOnScroll';
import SEO from '../components/SEO';
import { useLanguage } from '../contexts/LanguageContext';

const Home: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <PageTransition>
      <SEO 
        title="Website Laten Maken | Webdesign & Social Media Beheer"
        description="Varexo bouwt professionele websites die klanten opleveren. Webdesign, webdevelopment, webshops en social media beheer voor ondernemers in Nederland. Vraag gratis een offerte aan!"
        keywords="website laten maken, webdesign, webdevelopment, social media beheer, webshop laten maken, professionele website, website bouwen, online marketing, SEO, Nederland"
        canonical="/"
      />
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-dark-950 via-dark-900 to-dark-800 text-white py-28 code-rain scanlines">
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <AnimateOnScroll animation="reveal-left">
              <div className="inline-block mb-4 px-4 py-1.5 rounded-full border border-primary-500/30 bg-primary-500/10 text-primary-400 text-sm font-mono tracking-wider">
                &gt; npm run build-your-dream
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
                {t('home.hero.title')}{' '}
                <span className="text-primary-400 text-glow-strong">{t('home.hero.titleHighlight')}</span>
              </h1>
              <p className="text-xl mb-8 text-gray-300 max-w-lg">
                {t('home.hero.subtitle')}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link 
                  to="/contact" 
                  className="bg-primary-500 text-dark-900 px-8 py-3 rounded-lg font-bold hover:bg-primary-400 transition glow-emerald hover:glow-emerald-strong"
                >
                  {t('home.hero.cta.primary')}
                </Link>
                <Link 
                  to="/werkwijze" 
                  className="border border-primary-500/50 text-primary-400 px-8 py-3 rounded-lg font-semibold hover:bg-primary-500/10 transition"
                >
                  {t('home.hero.cta.secondary')} &rarr;
                </Link>
              </div>
            </AnimateOnScroll>

            {/* Terminal Code Block */}
            <AnimateOnScroll animation="reveal-right" delay={0.2} className="hidden lg:block">
            <div className="animate-float">
              <div className="terminal glow-emerald">
                <div className="terminal-header">
                  <div className="terminal-dot bg-red-500"></div>
                  <div className="terminal-dot bg-yellow-500"></div>
                  <div className="terminal-dot bg-green-500"></div>
                  <span className="text-gray-400 text-xs ml-2">varexo-project</span>
                </div>
                <div className="p-5 text-sm leading-relaxed">
                  <p><span className="text-gray-500">$</span> <span className="text-primary-400">varexo</span> create jouw-website</p>
                  <p className="text-gray-500 mt-2">&#9654; Designing responsive layout...</p>
                  <p className="text-gray-500">&#9654; Building custom features...</p>
                  <p className="text-gray-500">&#9654; Optimizing for SEO...</p>
                  <p className="text-gray-500">&#9654; Running performance tests...</p>
                  <p className="mt-2 text-primary-400">&#10003; Website deployed successfully!</p>
                  <p className="mt-2"><span className="text-gray-500">$</span> <span className="text-primary-300 cursor-blink">_</span></p>
                </div>
              </div>
            </div>
            </AnimateOnScroll>
          </div>

          {/* Tech Stack Bar */}
          <AnimateOnScroll delay={0.3}>
          <div className="mt-16 pt-8 border-t border-dark-700/50">
            <p className="text-gray-500 text-sm text-center mb-4 uppercase tracking-widest">{t('home.techStack.label')}</p>
            <div className="flex flex-wrap justify-center gap-6 text-gray-400">
              <span className="flex items-center gap-2 text-sm font-mono px-3 py-1.5 bg-dark-800/50 rounded border border-dark-700/50 hover:border-primary-500/30 hover:text-primary-400 transition">
                &lt;React /&gt;
              </span>
              <span className="flex items-center gap-2 text-sm font-mono px-3 py-1.5 bg-dark-800/50 rounded border border-dark-700/50 hover:border-primary-500/30 hover:text-primary-400 transition">
                TypeScript
              </span>
              <span className="flex items-center gap-2 text-sm font-mono px-3 py-1.5 bg-dark-800/50 rounded border border-dark-700/50 hover:border-primary-500/30 hover:text-primary-400 transition">
                Tailwind CSS
              </span>
              <span className="flex items-center gap-2 text-sm font-mono px-3 py-1.5 bg-dark-800/50 rounded border border-dark-700/50 hover:border-primary-500/30 hover:text-primary-400 transition">
                Node.js
              </span>
              <span className="flex items-center gap-2 text-sm font-mono px-3 py-1.5 bg-dark-800/50 rounded border border-dark-700/50 hover:border-primary-500/30 hover:text-primary-400 transition">
                Firebase
              </span>
              <span className="flex items-center gap-2 text-sm font-mono px-3 py-1.5 bg-dark-800/50 rounded border border-dark-700/50 hover:border-primary-500/30 hover:text-primary-400 transition">
                Next.js
              </span>
            </div>
          </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-dark-800 tech-grid">
        <div className="container mx-auto px-4">
          <AnimateOnScroll>
          <p className="text-primary-400 text-center font-mono text-sm mb-2 tracking-wider">{t('home.services.tag')}</p>
          <h2 className="text-3xl font-bold text-center mb-4 text-white">{t('home.services.title')}</h2>
          <p className="text-gray-400 text-center mb-12 max-w-xl mx-auto">{t('home.services.subtitle')}</p>
          </AnimateOnScroll>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <AnimateOnScroll animation="reveal-scale" delay={0.1}>
            <div className="glass-card card-hover p-6 rounded-xl text-center">
              <div className="w-16 h-16 bg-primary-500/10 rounded-xl flex items-center justify-center mx-auto mb-4 animate-pulse-glow">
                <svg className="w-8 h-8 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">{t('home.services.webdesign')}</h3>
              <p className="text-gray-400 text-sm">{t('home.services.webdesign.desc')}</p>
            </div>
            </AnimateOnScroll>
            <AnimateOnScroll animation="reveal-scale" delay={0.2}>
            <div className="glass-card card-hover p-6 rounded-xl text-center">
              <div className="w-16 h-16 bg-primary-500/10 rounded-xl flex items-center justify-center mx-auto mb-4 animate-pulse-glow">
                <svg className="w-8 h-8 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">{t('home.services.webdev')}</h3>
              <p className="text-gray-400 text-sm">{t('home.services.webdev.desc')}</p>
            </div>
            </AnimateOnScroll>
            <AnimateOnScroll animation="reveal-scale" delay={0.3}>
            <div className="glass-card card-hover p-6 rounded-xl text-center">
              <div className="w-16 h-16 bg-primary-500/10 rounded-xl flex items-center justify-center mx-auto mb-4 animate-pulse-glow">
                <svg className="w-8 h-8 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">{t('home.services.social')}</h3>
              <p className="text-gray-400 text-sm">{t('home.services.social.desc')}</p>
            </div>
            </AnimateOnScroll>
            <AnimateOnScroll animation="reveal-scale" delay={0.4}>
            <div className="glass-card card-hover p-6 rounded-xl text-center">
              <div className="w-16 h-16 bg-primary-500/10 rounded-xl flex items-center justify-center mx-auto mb-4 animate-pulse-glow">
                <svg className="w-8 h-8 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">{t('home.services.hosting')}</h3>
              <p className="text-gray-400 text-sm">{t('home.services.hosting.desc')}</p>
            </div>
            </AnimateOnScroll>
          </div>
          <p className="text-primary-400 text-center font-mono text-sm mt-12 tracking-wider">{t('home.services.closingTag')}</p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-dark-900 relative">
        <div className="container mx-auto px-4">
          <AnimateOnScroll>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center glass-card rounded-xl p-6">
              <div className="text-4xl font-extrabold text-primary-400 text-glow mb-1">10+</div>
              <p className="text-gray-400 text-sm">{t('home.stats.clients')}</p>
            </div>
            <div className="text-center glass-card rounded-xl p-6">
              <div className="text-4xl font-extrabold text-primary-400 text-glow mb-1">10+</div>
              <p className="text-gray-400 text-sm">{t('home.stats.projects')}</p>
            </div>
            <div className="text-center glass-card rounded-xl p-6">
              <div className="text-4xl font-extrabold text-primary-400 text-glow mb-1">99,9%</div>
              <p className="text-gray-400 text-sm">{t('home.stats.uptime')}</p>
            </div>
            <div className="text-center glass-card rounded-xl p-6">
              <div className="text-4xl font-extrabold text-primary-400 text-glow mb-1">&gt;24h</div>
              <p className="text-gray-400 text-sm">{t('home.stats.support')}</p>
            </div>
          </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-dark-800 matrix-dots">
        <div className="container mx-auto px-4">
          <p className="text-primary-400 text-center font-mono text-sm mb-2 tracking-wider">{'// why-varexo'}</p>
          <h2 className="text-3xl font-bold text-center mb-12 text-white">{t('home.why.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center card-hover p-6 rounded-xl">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500/20 to-primary-600/10 rounded-xl flex items-center justify-center mx-auto mb-4 border border-primary-500/20">
                <svg className="w-8 h-8 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">{t('home.why.fast')}</h3>
              <p className="text-gray-400 text-sm">{t('home.why.fast.desc')}</p>
            </div>
            <div className="text-center card-hover p-6 rounded-xl">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500/20 to-primary-600/10 rounded-xl flex items-center justify-center mx-auto mb-4 border border-primary-500/20">
                <svg className="w-8 h-8 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">{t('home.why.affordable')}</h3>
              <p className="text-gray-400 text-sm">{t('home.why.affordable.desc')}</p>
            </div>
            <div className="text-center card-hover p-6 rounded-xl">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500/20 to-primary-600/10 rounded-xl flex items-center justify-center mx-auto mb-4 border border-primary-500/20">
                <svg className="w-8 h-8 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">{t('home.why.personal')}</h3>
              <p className="text-gray-400 text-sm">{t('home.why.personal.desc')}</p>
            </div>
            <div className="text-center card-hover p-6 rounded-xl">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500/20 to-primary-600/10 rounded-xl flex items-center justify-center mx-auto mb-4 border border-primary-500/20">
                <svg className="w-8 h-8 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">{t('home.why.results')}</h3>
              <p className="text-gray-400 text-sm">{t('home.why.results.desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <AnimateOnScroll animation="reveal-scale">
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600 via-primary-500 to-primary-600"></div>
        <div className="absolute inset-0 tech-grid opacity-20"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <p className="font-mono text-primary-100 text-sm mb-4 tracking-wider">{t('home.cta.tag')}</p>
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-white">{t('home.cta.title')}</h2>
          <p className="text-xl mb-8 text-primary-100 max-w-xl mx-auto">
            {t('home.cta.subtitle')}
          </p>
          <Link 
            to="/contact" 
            className="bg-dark-900 text-primary-400 px-10 py-4 rounded-lg font-bold hover:bg-dark-800 transition text-lg glow-emerald"
          >
            {t('home.cta.button')} &rarr;
          </Link>
        </div>
      </section>
      </AnimateOnScroll>
    </PageTransition>
  );
};

export default Home;
