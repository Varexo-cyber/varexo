import React from 'react';
import PageTransition from '../components/PageTransition';
import AnimateOnScroll from '../components/AnimateOnScroll';
import SEO from '../components/SEO';

const Prijzen: React.FC = () => {
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
        <p className="text-primary-400 text-center font-mono text-sm mb-2 tracking-wider">$ cat pricing_strategy.json</p>
        <h1 className="text-4xl font-bold text-center mb-4 text-white">Complete Website Pakketten</h1>
        <p className="text-xl text-center text-gray-400 mb-16 max-w-2xl mx-auto">
          Transparante prijzen met maandelijkse garantie en 24/7 support. Geen verborgen kosten.
        </p>
        </AnimateOnScroll>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          {/* Basic Pakket */}
          <div className="glass-card card-hover p-8 rounded-xl">
            <h3 className="text-2xl font-bold mb-2 text-white">Basic</h3>
            <p className="text-xs font-mono text-gray-500 mb-3">{'// starter-complete'}</p>
            <div className="mb-6">
              <div className="text-4xl font-bold text-primary-400 text-glow">€599.99</div>
              <div className="text-sm text-gray-400">eenmalig</div>
              <div className="mt-4 pt-4 border-t border-dark-600">
                <div className="text-xl font-bold text-white">€69.99 <span className="text-sm font-normal text-gray-400">/maand</span></div>
                <div className="text-lg font-semibold text-primary-400 mt-1">of €799.99/jaar</div>
              </div>
              <div className="text-xs text-gray-400 mt-2">24/7 uptime garantie</div>
            </div>
            <ul className="space-y-3 mb-8 text-gray-200">
              <li className="flex items-center">
                <svg className="w-5 h-5 text-primary-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Complete website (1-3 pagina's)
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-primary-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Responsive design
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-primary-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Contactformulier
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-primary-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Google Maps integratie
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-primary-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Social media links
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-primary-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Basis SEO optimalisatie
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-primary-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Updates binnen 24 uur
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-primary-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                24/7 uptime garantie
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
            <p className="text-xs font-mono text-primary-200 mb-3">{'// speed-optimized'}</p>
            <div className="mb-6">
              <div className="text-4xl font-bold text-white" style={{textShadow: '0 0 10px rgba(16,185,129,0.5)'}}>€899.99</div>
              <div className="text-sm text-primary-200">eenmalig</div>
              <div className="mt-4 pt-4 border-t border-primary-500/30">
                <div className="text-xl font-bold text-white">€59.99 <span className="text-sm font-normal text-primary-200">/maand</span></div>
                <div className="text-lg font-semibold text-white mt-1" style={{textShadow: '0 0 10px rgba(16,185,129,0.5)'}}>of €699.99/jaar</div>
              </div>
              <div className="text-xs text-primary-200 mt-2">0.01s laadtijd garantie</div>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center">
                <svg className="w-5 h-5 text-primary-200 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Alles uit Basic pakket
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-primary-200 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
        Geavanceerde website (5-10 pagina's)
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-primary-200 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                0.01s laadtijd garantie
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-primary-200 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Geavanceerde SEO
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-primary-200 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Marketing strategie
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-primary-200 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Snelle levering
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-primary-200 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Updates binnen 12 uur
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-primary-200 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                24/7 uptime garantie
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
            <p className="text-xs font-mono text-gray-500 mb-3">{'// all-inclusive'}</p>
            <div className="mb-6">
              <div className="text-4xl font-bold text-primary-400 text-glow">€1299.99</div>
              <div className="text-sm text-gray-400">eenmalig</div>
              <div className="mt-4 pt-4 border-t border-dark-600">
                <div className="text-xl font-bold text-white">€49.99 <span className="text-sm font-normal text-gray-400">/maand</span></div>
                <div className="text-lg font-semibold text-primary-400 mt-1">of €499.99/jaar</div>
              </div>
              <div className="text-xs text-gray-400 mt-2">all-inclusive</div>
            </div>
            <ul className="space-y-3 mb-8 text-gray-200">
              <li className="flex items-center">
                <svg className="w-5 h-5 text-primary-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Alles uit Pro pakket
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-primary-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Maatwerk website (10+ pagina's)
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-primary-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                All-inclusive onderhoud
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-primary-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Logo ontwerp
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-primary-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Snelle levering
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-primary-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Geavanceerde SEO
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-primary-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Marketing strategie
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-primary-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Updates binnen 6 uur
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-primary-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                24/7 uptime garantie
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

        {/* Garanties */}
        <div className="glass-card p-8 rounded-xl max-w-4xl mx-auto mb-16">
          <h2 className="text-2xl font-bold text-center mb-8 text-white">Onze Garanties</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-dark-800/50 p-6 rounded-xl border border-dark-600/50 card-hover text-center">
              <div className="text-3xl font-bold text-primary-400 mb-3">24/7</div>
              <h3 className="text-lg font-semibold mb-2 text-white">Uptime Garantie</h3>
              <p className="text-gray-400 text-sm">Uw website is altijd online en beschikbaar</p>
            </div>
            <div className="bg-dark-800/50 p-6 rounded-xl border border-dark-600/50 card-hover text-center">
              <div className="text-3xl font-bold text-primary-400 mb-3">24u</div>
              <h3 className="text-lg font-semibold mb-2 text-white">Update Garantie</h3>
              <p className="text-gray-400 text-sm">Wijzigingen binnen 24 uur geïmplementeerd</p>
            </div>
            <div className="bg-dark-800/50 p-6 rounded-xl border border-dark-600/50 card-hover text-center">
              <div className="text-3xl font-bold text-primary-400 mb-3">0.01s</div>
              <h3 className="text-lg font-semibold mb-2 text-white">Snelheid Garantie</h3>
              <p className="text-gray-400 text-sm">Website laadt binnen 0.01 seconden (Pro+)</p>
            </div>
          </div>
        </div>

        {/* Social Media Management */}
        <div className="glass-card p-8 rounded-xl max-w-4xl mx-auto mb-16">
          <h2 className="text-2xl font-bold text-center mb-8 text-white">Social Media Management</h2>
          <div className="bg-dark-800/50 p-8 rounded-xl border border-dark-600/50 card-hover">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-semibold mb-2 text-white">Leads & Social Media Management</h3>
                <p className="text-gray-400 mb-4">
                  Complete social media strategie met leadgeneratie. Wij optimaliseren uw advertenties en zorgen voor sterke, kwalitatieve leads.
                </p>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-primary-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Social media strategie & content
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-primary-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Advertentie optimalisatie
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-primary-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Leadgeneratie & conversie
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-primary-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Maandelijkse rapportage
                  </li>
                </ul>
              </div>
              <div className="text-center md:text-right mt-6 md:mt-0">
                <div className="text-3xl font-bold text-primary-400 mb-2">€149.99</div>
                <div className="text-sm text-gray-400">per maand</div>
                <div className="text-xs text-gray-500 mt-2">excl. advertentiebudget</div>
              </div>
            </div>
            <a 
              href="/contact" 
              className="block w-full bg-primary-500 text-dark-900 text-center py-3 rounded-lg font-bold hover:bg-primary-400 transition glow-emerald"
            >
              Start Social Media Management
            </a>
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
              <h3 className="text-xl font-bold text-white mb-2">Werken binnen uw budget</h3>
              <p className="text-gray-400 mb-4">
                Heeft u een specifiek budget in gedachten? Wij denken graag met u mee en passen onze diensten aan zodat ze binnen uw financiële mogelijkheden passen. Alles is bespreekbaar - van aangepaste pakketten tot gefaseerde oplevering.
              </p>
              <a 
                href="/contact" 
                className="inline-flex items-center gap-2 bg-primary-500 text-dark-900 px-6 py-3 rounded-lg font-semibold hover:bg-primary-400 transition glow-emerald"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Neem contact op
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
    </PageTransition>
  );
};

export default Prijzen;
