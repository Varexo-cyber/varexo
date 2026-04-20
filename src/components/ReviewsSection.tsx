import React from 'react';
import AnimateOnScroll from './AnimateOnScroll';

const ReviewsSection: React.FC = () => {
  return (
    <section className="py-20 bg-dark-900 relative">
      <div className="container mx-auto px-4">
        <AnimateOnScroll>
          <div className="text-center mb-12">
            <p className="text-primary-400 text-center font-mono text-sm mb-2 tracking-wider">{'// klanten-reviews'}</p>
            <h2 className="text-3xl font-bold text-center mb-4 text-white">Klanten over Varexo</h2>
            <p className="text-gray-400 text-center max-w-xl mx-auto">
              Lees wat klanten over ons zeggen
            </p>
          </div>
        </AnimateOnScroll>

        {/* Trustpilot CTA Card */}
        <AnimateOnScroll delay={0.1}>
          <div className="max-w-2xl mx-auto">
            <a 
              href="https://www.trustpilot.com/review/varexo.nl" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group block glass-card p-8 rounded-2xl border border-dark-700 hover:border-primary-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary-500/10"
            >
              <div className="flex flex-col md:flex-row items-center gap-6">
                {/* Trustpilot Icon */}
                <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-[#00B67A] flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L8.5 9H2l5 4-2 8 7-4.5L19 21l-2-8 5-4h-6.5L12 2z"/>
                  </svg>
                </div>

                {/* Content */}
                <div className="text-center md:text-left flex-1">
                  <p className="text-white font-semibold text-lg mb-1">Lees onze reviews op Trustpilot</p>
                  <p className="text-gray-400 text-sm mb-3">
                    Bekijk eerlijke ervaringen van onze klanten
                  </p>
                  <div className="inline-flex items-center gap-2 text-primary-400 group-hover:text-primary-300 transition">
                    <span className="text-sm font-medium">trustpilot.com/review/varexo.nl</span>
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </div>
                </div>
              </div>
            </a>

            {/* Write Review Link */}
            <div className="mt-6 text-center">
              <p className="text-gray-500 text-sm">
                Tevreden over onze service?{' '}
                <a 
                  href="https://nl.trustpilot.com/evaluate/varexo.nl" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary-400 hover:text-primary-300 font-medium hover-underline"
                >
                  Deel je ervaring op Trustpilot
                </a>
              </p>
            </div>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
};

export default ReviewsSection;
