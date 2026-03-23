import React from 'react';
import PageTransition from '../components/PageTransition';
import AnimateOnScroll from '../components/AnimateOnScroll';
import SEO from '../components/SEO';

const Prijzen: React.FC = () => {
  return (
    <PageTransition>
    <SEO 
      title="Prijzen - Betaalbare Websites & Webshops"
      description="Bekijk onze transparante prijzen voor webdesign, webdevelopment en social media beheer. Professionele websites vanaf scherpe tarieven. Geen verborgen kosten."
      keywords="website prijzen, webdesign kosten, website laten maken prijs, webshop kosten, social media beheer prijzen, betaalbare website"
      canonical="/prijzen"
    />
    <div className="py-20 matrix-dots">
      <div className="container mx-auto px-4">
        <AnimateOnScroll>
        <p className="text-primary-400 text-center font-mono text-sm mb-2 tracking-wider">$ cat pricing.json</p>
        <h1 className="text-4xl font-bold text-center mb-4 text-white">Pakketten en Prijzen</h1>
        <p className="text-xl text-center text-gray-400 mb-16 max-w-2xl mx-auto">
          Transparante fixed-price pakketten. Geen verborgen kosten.
        </p>
        </AnimateOnScroll>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          {/* Basic Pakket */}
          <div className="glass-card card-hover p-8 rounded-xl">
            <h3 className="text-2xl font-bold mb-2 text-white">Basic</h3>
            <p className="text-xs font-mono text-gray-500 mb-3">{'// starter-pack'}</p>
            <div className="text-3xl font-bold text-primary-400 text-glow mb-6">€399</div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center">
                <svg className="w-5 h-5 text-primary-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                1 pagina website
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-primary-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Simpel design
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-primary-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Mobiel vriendelijk
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-primary-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Basis SEO
              </li>
            </ul>
            <a 
              href="/contact" 
              className="block w-full bg-primary-500 text-dark-900 text-center py-3 rounded-lg font-bold hover:bg-primary-400 transition glow-emerald"
            >
              Kies Basic
            </a>
          </div>

          {/* Pro Pakket */}
          <div className="relative overflow-hidden bg-gradient-to-b from-primary-600 to-primary-700 text-white p-8 rounded-xl shadow-xl transform scale-105 border-2 border-primary-400 glow-emerald-strong">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-400/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="bg-dark-900 text-primary-400 text-xs font-bold font-mono px-3 py-1 rounded-full inline-block mb-4 tracking-wider">
              MOST_POPULAR
            </div>
            <h3 className="text-2xl font-bold mb-2">Pro</h3>
            <p className="text-xs font-mono text-primary-200 mb-3">{'// best-value'}</p>
            <div className="text-3xl font-bold mb-6">€799</div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center">
                <svg className="w-5 h-5 text-primary-200 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                5 pagina's
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-primary-200 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Responsive design
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-primary-200 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Contactformulier
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-primary-200 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Google Maps integratie
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-primary-200 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Social media links
              </li>
            </ul>
            <a 
              href="/contact" 
              className="block w-full bg-dark-900 text-primary-400 text-center py-3 rounded-lg font-bold hover:bg-dark-800 transition glow-emerald"
            >
              Kies Pro
            </a>
          </div>

          {/* Premium Pakket */}
          <div className="glass-card card-hover p-8 rounded-xl">
            <h3 className="text-2xl font-bold mb-2 text-white">Premium</h3>
            <p className="text-xs font-mono text-gray-500 mb-3">{'// full-stack'}</p>
            <div className="text-3xl font-bold text-primary-400 text-glow mb-6">€1499</div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center">
                <svg className="w-5 h-5 text-primary-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Alles uit Pro pakket
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-primary-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Maatwerk functionaliteiten
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-primary-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                SEO basis optimalisatie
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-primary-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Snelle levering
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-primary-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                1 jaar gratis hosting
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-primary-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Logo ontwerp
              </li>
            </ul>
            <a 
              href="/contact" 
              className="block w-full bg-primary-500 text-dark-900 text-center py-3 rounded-lg font-bold hover:bg-primary-400 transition glow-emerald"
            >
              Kies Premium
            </a>
          </div>
        </div>

        {/* Extra Diensten */}
        <div className="glass-card p-8 rounded-xl max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8 text-white">Extra Diensten</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-dark-800/50 p-6 rounded-xl border border-dark-600/50 card-hover">
              <h3 className="text-xl font-semibold mb-4 text-white">Onderhoud & Support</h3>
              <p className="text-gray-400 mb-4">
                Regulier onderhoud, updates en technische support
              </p>
              <div className="text-2xl font-bold text-primary-400">€50 per maand</div>
            </div>
            <div className="bg-dark-800/50 p-6 rounded-xl border border-dark-600/50 card-hover">
              <h3 className="text-xl font-semibold mb-4 text-white">Hosting</h3>
              <p className="text-gray-400 mb-4">
                Snelle en betrouwbare hosting met back-ups
              </p>
              <div className="text-2xl font-bold text-primary-400">€20 per maand</div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-4 text-white">Niet zeker welk pakket?</h2>
          <p className="text-gray-400 mb-6">
            Neem contact met ons op voor een vrijblijvend adviesgesprek
          </p>
          <a 
            href="/contact" 
            className="bg-primary-500 text-dark-900 px-8 py-3 rounded-lg font-semibold hover:bg-primary-400 transition inline-block"
          >
            Vraag Advies
          </a>
        </div>
      </div>
    </div>
    </PageTransition>
  );
};

export default Prijzen;
