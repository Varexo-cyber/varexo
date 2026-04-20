import React from 'react';
import AnimateOnScroll from './AnimateOnScroll';

const ReviewsSection: React.FC = () => {
  return (
    <section className="py-20 bg-dark-900 relative">
      <div className="container mx-auto px-4">
        <AnimateOnScroll>
          <div className="text-center mb-12">
            <p className="text-primary-400 text-center font-mono text-sm mb-2 tracking-wider">{'// klanten-reviews'}</p>
            <h2 className="text-3xl font-bold text-center mb-4 text-white">Wat onze klanten zeggen</h2>
            <p className="text-gray-400 text-center max-w-xl mx-auto">
              Echte reviews van tevreden klanten
            </p>
          </div>
        </AnimateOnScroll>

        {/* Trust Score Badge */}
        <AnimateOnScroll delay={0.1}>
          <div className="flex justify-center mb-12">
            <a 
              href="https://www.trustpilot.com/review/varexo.nl" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-4 bg-dark-800 hover:bg-dark-700 border border-dark-700 hover:border-primary-500/30 px-6 py-4 rounded-xl transition group"
            >
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-6 h-6 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-white font-bold text-lg">5.0</span>
              </div>
              <div className="h-8 w-px bg-dark-600"></div>
              <div className="text-left">
                <p className="text-gray-300 text-sm">Bekijk onze reviews</p>
                <p className="text-primary-400 text-xs group-hover:text-primary-300 transition">trustpilot.com/review/varexo.nl &rarr;</p>
              </div>
            </a>
          </div>
        </AnimateOnScroll>

        {/* Review Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
          <AnimateOnScroll animation="reveal-scale" delay={0.2}>
            <div className="glass-card p-6 rounded-xl border border-dark-700 hover:border-primary-500/20 transition h-full">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-300 text-sm mb-4">"Varexo heeft onze website compleet vernieuwd. Professioneel, snel en zeer klantvriendelijk. Echte aanrader voor iedereen!"</p>
              <div className="flex items-center gap-3 mt-auto">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-semibold text-sm">JD</div>
                <div>
                  <p className="text-white text-sm font-medium">Jan de Vries</p>
                  <p className="text-gray-500 text-xs">Eigenaar, De Vries Websites</p>
                </div>
              </div>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll animation="reveal-scale" delay={0.3}>
            <div className="glass-card p-6 rounded-xl border border-dark-700 hover:border-primary-500/20 transition h-full">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-300 text-sm mb-4">"Super tevreden met mijn nieuwe webshop. De conversie is verdubbeld sinds de lancering. Echt top werk geleverd!"</p>
              <div className="flex items-center gap-3 mt-auto">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-semibold text-sm">MK</div>
                <div>
                  <p className="text-white text-sm font-medium">Maria Klaassen</p>
                  <p className="text-gray-500 text-xs">Eigenaar, MK Fashion</p>
                </div>
              </div>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll animation="reveal-scale" delay={0.4}>
            <div className="glass-card p-6 rounded-xl border border-dark-700 hover:border-primary-500/20 transition h-full">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-300 text-sm mb-4">"Snelle levering, uitstekende communicatie en een prachtig resultaat. Varexo weet wat ze doen. Aanrader!"</p>
              <div className="flex items-center gap-3 mt-auto">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-semibold text-sm">PB</div>
                <div>
                  <p className="text-white text-sm font-medium">Peter Bakker</p>
                  <p className="text-gray-500 text-xs">Directeur, Bakker Consult</p>
                </div>
              </div>
            </div>
          </AnimateOnScroll>
        </div>

        {/* CTA Button */}
        <AnimateOnScroll delay={0.5}>
          <div className="flex flex-col items-center gap-4">
            <a 
              href="https://nl.trustpilot.com/evaluate/varexo.nl" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg shadow-green-500/25 hover:shadow-green-500/40 hover:scale-105 hover:-translate-y-1"
            >
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span>Deel je ervaring</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
            <p className="text-gray-400 text-sm">Help anderen en schrijf een review op Trustpilot</p>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
};

export default ReviewsSection;
