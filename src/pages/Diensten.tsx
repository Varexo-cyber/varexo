import React from 'react';
import PageTransition from '../components/PageTransition';
import AnimateOnScroll from '../components/AnimateOnScroll';
import SEO from '../components/SEO';

const Diensten: React.FC = () => {
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
        <p className="text-primary-400 text-center font-mono text-sm mb-2 tracking-wider">{'// what-we-build'}</p>
        <h1 className="text-4xl font-bold text-center mb-4 text-white">Onze Diensten</h1>
        <p className="text-gray-400 text-center mb-16 max-w-xl mx-auto">Van pixel-perfect design tot production-ready code</p>
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
            <h2 className="text-2xl font-bold mb-4 text-white">Webdesign</h2>
            <p className="text-gray-400 mb-6">
              Moderne en professionele websites die jouw bedrijf online laten stralen. 
              We zorgen voor een gebruiksvriendelijk design dat perfect past bij jouw merk.
            </p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center text-gray-300">
                <svg className="w-5 h-5 text-primary-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Responsive design voor alle apparaten
              </li>
              <li className="flex items-center text-gray-300">
                <svg className="w-5 h-5 text-primary-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Modern en professioneel uiterlijk
              </li>
              <li className="flex items-center text-gray-300">
                <svg className="w-5 h-5 text-primary-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Geoptimaliseerd voor gebruiksgemak
              </li>
            </ul>
            <a href="/contact" className="text-primary-400 font-semibold hover:text-primary-300">
              Meer informatie →
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
            <h2 className="text-2xl font-bold mb-4 text-white">Webdevelopment</h2>
            <p className="text-gray-400 mb-6">
              Maatwerk functionaliteiten die jouw website uniek maken. Van simpele contactformulieren 
              tot complexe systemen, wij bouwen wat jij nodig hebt.
            </p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center text-gray-300">
                <svg className="w-5 h-5 text-primary-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Maatwerk oplossingen
              </li>
              <li className="flex items-center text-gray-300">
                <svg className="w-5 h-5 text-primary-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Snelle en veilige code
              </li>
              <li className="flex items-center text-gray-300">
                <svg className="w-5 h-5 text-primary-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Schaalbare oplossingen
              </li>
            </ul>
            <a href="/contact" className="text-primary-400 font-semibold hover:text-primary-300">
              Meer informatie →
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
            <h2 className="text-2xl font-bold mb-4 text-white">Social Media Beheer</h2>
            <p className="text-gray-400 mb-6">
              Groei jouw bereik en klanten via sociale media. We beheren jouw kanalen professioneel 
              en zorgen voor consistente content die resultaten oplevert.
            </p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center text-gray-300">
                <svg className="w-5 h-5 text-primary-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Content creatie en planning
              </li>
              <li className="flex items-center text-gray-300">
                <svg className="w-5 h-5 text-primary-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Community management
              </li>
              <li className="flex items-center text-gray-300">
                <svg className="w-5 h-5 text-primary-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Analytics en rapportage
              </li>
            </ul>
            <a href="/contact" className="text-primary-400 font-semibold hover:text-primary-300">
              Meer informatie →
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
            <h2 className="text-2xl font-bold mb-4 text-white">Onderhoud & Hosting</h2>
            <p className="text-gray-400 mb-6">
              Wij houden jouw website veilig en snel. Met professionele hosting en regelmatig onderhoud 
              zorg je ervoor dat jouw website altijd optimaal presteert.
            </p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center text-gray-300">
                <svg className="w-5 h-5 text-primary-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Snelle en betrouwbare hosting
              </li>
              <li className="flex items-center text-gray-300">
                <svg className="w-5 h-5 text-primary-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Regelmatige updates en back-ups
              </li>
              <li className="flex items-center text-gray-300">
                <svg className="w-5 h-5 text-primary-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Beveiliging en monitoring
              </li>
            </ul>
            <a href="/contact" className="text-primary-400 font-semibold hover:text-primary-300">
              Meer informatie →
            </a>
          </div>
          </AnimateOnScroll>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="relative overflow-hidden bg-gradient-to-r from-primary-600 via-primary-500 to-primary-600 text-white p-8 rounded-xl max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Welke dienst past bij jou?</h2>
            <p className="mb-6">
              Neem contact met ons op voor een vrijblijvend adviesgesprek. We helpen je graag 
              met het kiezen van de juiste oplossing voor jouw bedrijf.
            </p>
            <a 
              href="/contact" 
              className="bg-dark-900 text-primary-400 px-8 py-3 rounded-lg font-bold hover:bg-dark-800 transition inline-block glow-emerald"
            >
              Vraag Offerte Aan
            </a>
          </div>
        </div>
      </div>
    </div>
    </PageTransition>
  );
};

export default Diensten;
