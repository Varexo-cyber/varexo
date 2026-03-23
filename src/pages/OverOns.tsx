import React from 'react';
import PageTransition from '../components/PageTransition';
import AnimateOnScroll from '../components/AnimateOnScroll';
import SEO from '../components/SEO';

const OverOns: React.FC = () => {
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
          <p className="text-primary-400 text-center font-mono text-sm mb-2 tracking-wider">{'// about-us'}</p>
          <h1 className="text-4xl font-bold text-center mb-8 text-white">Over Ons</h1>
          </AnimateOnScroll>
          
          <div className="glass-card p-8 rounded-xl">
            <h2 className="text-2xl font-semibold mb-6 text-primary-400 text-glow">Varexo</h2>
            
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-300 mb-6 leading-relaxed">
                Varexo is een modern ICT- en webdevelopment bedrijf. Wij helpen ondernemers met het bouwen van 
                professionele websites en het verbeteren van hun online aanwezigheid.
              </p>
              
              <p className="text-gray-300 mb-6 leading-relaxed">
                Ons doel is simpel: meer klanten genereren voor jouw bedrijf. We begrijpen dat een goede website 
                essentieel is in het digitale tijdperk en zorgen ervoor dat jouw bedrijf online opvalt.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                <div className="glass-card p-6 rounded-xl card-hover">
                  <h3 className="text-xl font-semibold mb-4 text-primary-400">Onze Missie</h3>
                  <p className="text-gray-300">
                    Ondernemers helpen succesvol te zijn online met professionele websites en digitale oplossingen 
                    die daadwerkelijk klanten opleveren.
                  </p>
                </div>
                
                <div className="glass-card p-6 rounded-xl card-hover">
                  <h3 className="text-xl font-semibold mb-4 text-primary-400">Onze Visie</h3>
                  <p className="text-gray-300">
                    De partner worden voor ondernemers die hun online aanwezigheid willen professionaliseren 
                    en willen groeien door middel van effectieve digitale strategieën.
                  </p>
                </div>
              </div>
              
              <div className="mt-12">
                <h3 className="text-2xl font-semibold mb-6 text-white">Waarom Kiezen voor Varexo?</h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <svg className="w-6 h-6 text-primary-400 mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-300">Jaren ervaring in webdevelopment en design</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-6 h-6 text-primary-400 mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-300">Persoonlijke aanpak en direct contact</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-6 h-6 text-primary-400 mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-300">Focus op resultaat en ROI</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-6 h-6 text-primary-400 mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-300">Transparante prijzen en duidelijke afspraken</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-6 h-6 text-primary-400 mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-300">Snelle levering zonder kwaliteit te verliezen</span>
                  </li>
                </ul>
              </div>
              
              <div className="mt-12 text-center">
                <h3 className="text-2xl font-semibold mb-4 text-white">Klaar om te starten?</h3>
                <p className="text-gray-400 mb-6">
                  Neem contact met ons op en ontdek hoe we jouw bedrijf kunnen helpen groeien.
                </p>
                <a 
                  href="/contact" 
                  className="bg-primary-500 text-dark-900 px-8 py-3 rounded-lg font-bold hover:bg-primary-400 transition inline-block glow-emerald">
                  Neem Contact Op
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
