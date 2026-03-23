import React from 'react';
import PageTransition from '../components/PageTransition';
import AnimateOnScroll from '../components/AnimateOnScroll';
import SEO from '../components/SEO';

const Portfolio: React.FC = () => {
  return (
    <PageTransition>
    <SEO 
      title="Portfolio - Onze Projecten & Websites"
      description="Bekijk ons portfolio met professionele websites en webshops. Van startups tot gevestigde bedrijven, wij leveren maatwerk webdesign dat resultaat oplevert."
      keywords="portfolio webdesign, website voorbeelden, webshop voorbeelden, webdesign projecten, gemaakte websites"
      canonical="/portfolio"
    />
    <div className="py-20 matrix-dots">
      <div className="container mx-auto px-4">
        <AnimateOnScroll>
        <p className="text-primary-400 text-center font-mono text-sm mb-2 tracking-wider">$ ls projects/</p>
        <h1 className="text-4xl font-bold text-center mb-4 text-white">Portfolio</h1>
        <p className="text-xl text-center text-gray-400 mb-16 max-w-2xl mx-auto">
          Bekijk onze recente projecten en successverhalen
        </p>
        </AnimateOnScroll>
        
        {/* Coming Soon Message */}
        <div className="max-w-2xl mx-auto text-center">
          <div className="glass-card p-12 rounded-xl">
            <div className="w-24 h-24 bg-primary-500/10 rounded-xl border border-primary-500/20 flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-4 text-white">Portfolio in Ontwikkeling</h2>
            <p className="text-gray-400 mb-8">
              We werken momenteel aan het toevoegen van onze recente projecten. 
              Binnenkort vind je hier een overzicht van onze werkzaamheden en successverhalen.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="glass-card card-hover p-6 rounded-xl">
                <h3 className="font-semibold mb-2 text-white">E-commerce Websites</h3>
                <p className="text-gray-400 text-sm">Complete webshops met betaalfunctionaliteit</p>
              </div>
              <div className="glass-card card-hover p-6 rounded-xl">
                <h3 className="font-semibold mb-2 text-white">Bedrijfswebsites</h3>
                <p className="text-gray-400 text-sm">Professionele websites voor bedrijven</p>
              </div>
              <div className="glass-card card-hover p-6 rounded-xl">
                <h3 className="font-semibold mb-2 text-white">Maatwerk Applicaties</h3>
                <p className="text-gray-400 text-sm">Custom oplossingen voor specifieke behoeften</p>
              </div>
            </div>
            <a 
              href="/contact" 
              className="bg-primary-500 text-dark-900 px-8 py-3 rounded-lg font-bold hover:bg-primary-400 transition inline-block glow-emerald">
              Vraag naar Referenties
            </a>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-20">
          <h2 className="text-2xl font-bold text-center mb-12 text-white">Onze Resultaten</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-400 text-glow mb-2">50+</div>
              <p className="text-gray-400">Tevreden klanten</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-400 text-glow mb-2">100+</div>
              <p className="text-gray-400">Projecten opgeleverd</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-400 mb-2">5★</div>
              <p className="text-gray-400">Gemiddelde review</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-400 text-glow mb-2">24h</div>
              <p className="text-gray-400">Reactietijd</p>
            </div>
          </div>
        </div>

        {/* Testimonials Preview */}
        <div className="mt-20">
          <h2 className="text-2xl font-bold text-center mb-12 text-white">Wat onze klanten zeggen</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="glass-card card-hover p-6 rounded-xl">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-dark-600 rounded-full mr-4"></div>
                <div>
                  <h4 className="font-semibold text-white">Jan Jansen</h4>
                  <p className="text-gray-400 text-sm">Eigenaar, Jansen Installaties</p>
                </div>
              </div>
              <div className="text-primary-400 mb-2">
                ★★★★★
              </div>
              <p className="text-gray-300">
                "Varexo heeft een prachtige website voor ons gebouwd. Professioneel, snel en betaalbaar!"
              </p>
            </div>
            <div className="glass-card card-hover p-6 rounded-xl">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-dark-600 rounded-full mr-4"></div>
                <div>
                  <h4 className="font-semibold text-white">Maria de Vries</h4>
                  <p className="text-gray-400 text-sm">Directeur, De Vries Coaching</p>
                </div>
              </div>
              <div className="text-primary-400 mb-2">
                ★★★★★
              </div>
              <p className="text-gray-300">
                "Super tevreden met het resultaat. De communicatie was uitstekend en alles werd precies gebouwd zoals we wilden."
              </p>
            </div>
            <div className="glass-card card-hover p-6 rounded-xl">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-dark-600 rounded-full mr-4"></div>
                <div>
                  <h4 className="font-semibold text-white">Ahmed El Amrani</h4>
                  <p className="text-gray-400 text-sm">Eigenaar, El Amrani Restaurant</p>
                </div>
              </div>
              <div className="text-primary-400 mb-2">
                ★★★★★
              </div>
              <p className="text-gray-300">
                "Onze online bestelsysteem werkt perfect. Klanten zijn erg tevreden en onze omzet is gestegen."
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </PageTransition>
  );
};

export default Portfolio;
