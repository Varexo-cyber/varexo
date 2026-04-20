import React, { useEffect } from 'react';

// Trustpilot Widget - Gratis versie via Trustbox
// Werkt zonder API key, gewoon via embed code
const TrustpilotWidget: React.FC = () => {
  useEffect(() => {
    // Load Trustpilot script
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = '//widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js';
    script.async = true;
    document.head.appendChild(script);

    return () => {
      // Cleanup script on unmount
      const existingScript = document.querySelector('script[src="//widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js"]');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  return (
    <section className="py-20 bg-dark-900 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-primary-400 text-center font-mono text-sm mb-2 tracking-wider">{'// klanten-reviews'}</p>
          <h2 className="text-3xl font-bold text-center mb-4 text-white">Wat onze klanten zeggen</h2>
          <p className="text-gray-400 text-center max-w-xl mx-auto">
            Echte reviews van onze klanten op Trustpilot
          </p>
        </div>

        {/* Trustpilot Trustbox Widget */}
        <div className="max-w-4xl mx-auto">
          <div 
            className="trustpilot-widget" 
            data-locale="nl-NL" 
            data-template-id="5419b6a8b0d04a076446a9ad" 
            data-businessunit-id="69e662b164743ce967a3c442" 
            data-style-height="24px" 
            data-style-width="100%" 
            data-theme="dark"
            data-style-alignment="center"
          >
            <a href="https://nl.trustpilot.com/review/varexo.nl" target="_blank" rel="noopener">
              Trustpilot
            </a>
          </div>

          {/* Mini Carousel Widget */}
          <div className="mt-8">
            <div 
              className="trustpilot-widget" 
              data-locale="nl-NL" 
              data-template-id="539ad60defb9600b94d7df2c" 
              data-businessunit-id="69e662b164743ce967a3c442" 
              data-style-height="500px" 
              data-style-width="100%"
              data-theme="dark"
              data-stars="4,5"
              data-review-languages="nl"
            >
              <a href="https://nl.trustpilot.com/review/varexo.nl" target="_blank" rel="noopener">
                Trustpilot
              </a>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="mt-12 text-center">
          <a 
            href="https://nl.trustpilot.com/evaluate/varexo.nl" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#00B67A] hover:bg-[#00A06D] text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L8.5 9H2l5 4-2 8 7-4.5L19 21l-2-8 5-4h-6.5L12 2z"/>
            </svg>
            Schrijf een review op Trustpilot
          </a>
        </div>
      </div>
    </section>
  );
};

export default TrustpilotWidget;
