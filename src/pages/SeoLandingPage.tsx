import React from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import PageTransition from '../components/PageTransition';
import AnimateOnScroll from '../components/AnimateOnScroll';
import SEO from '../components/SEO';
import { seoLandingPages, LandingPageData } from '../data/seoLandingPages';

const SeoLandingPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const data: LandingPageData | undefined = slug ? seoLandingPages[slug] : undefined;

  if (!data) {
    return <Navigate to="/" replace />;
  }

  const isEnglish = data.language === 'en';

  return (
    <PageTransition>
      <SEO
        title={data.title}
        description={data.description}
        keywords={data.keywords}
        canonical={`/${slug}`}
        language={data.language || 'nl'}
      />
      <div className="py-20 tech-grid">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Hero */}
          <AnimateOnScroll>
            <div className="text-center mb-16">
              <p className="text-primary-400 font-mono text-sm mb-4 tracking-wider">
                {isEnglish ? '// varexo --service' : '// varexo --dienst'}
              </p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight">
                {data.h1}
              </h1>
              <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                {data.intro}
              </p>

              {/* Trust badges */}
              <div className="flex flex-wrap justify-center gap-3 mt-8">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/30 text-primary-400 text-sm font-medium">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  {isEnglish ? '7 days delivery' : 'Binnen 7 dagen live'}
                </span>
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/30 text-primary-400 text-sm font-medium">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  {isEnglish ? 'New customer guarantee' : 'Garantie op nieuwe klanten'}
                </span>
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/30 text-primary-400 text-sm font-medium">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {isEnglish ? 'From £650' : 'Vanaf €650'}
                </span>
              </div>
            </div>
          </AnimateOnScroll>

          {/* Sections */}
          <div className="space-y-16">
            {data.sections.map((section, idx) => (
              <AnimateOnScroll key={idx} delay={idx * 0.1}>
                <div className="glass-card p-8 md:p-12 rounded-2xl border border-dark-700">
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 flex items-start gap-3">
                    <span className="text-primary-400 font-mono text-lg mt-1">0{idx + 1}.</span>
                    <span>{section.h2}</span>
                  </h2>
                  <p className="text-gray-300 text-base md:text-lg leading-relaxed pl-0 md:pl-10">
                    {section.text}
                  </p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>

          {/* CTA */}
          <AnimateOnScroll animation="reveal-scale">
            <div
              className="mt-20 rounded-2xl p-8 md:p-12 text-center relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.05) 100%)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                boxShadow: '0 0 40px rgba(16, 185, 129, 0.15)',
              }}
            >
              <p className="text-primary-400 font-mono text-sm mb-4 tracking-wider">
                {isEnglish ? '$ start --project' : '$ start --project'}
              </p>
              <h2 className="text-2xl md:text-4xl font-extrabold text-white mb-4">
                {data.cta.text}
              </h2>
              <Link
                to="/contact"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: '#0f172a',
                  boxShadow: '0 4px 20px rgba(16, 185, 129, 0.5)',
                }}
              >
                {data.cta.button}
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <p className="text-gray-400 text-sm mt-6">
                {isEnglish
                  ? 'Free consultation · Reply within 24 hours · No obligations'
                  : 'Gratis adviesgesprek · Reactie binnen 24 uur · Vrijblijvend'}
              </p>
            </div>
          </AnimateOnScroll>

          {/* Internal links */}
          <AnimateOnScroll>
            <div className="mt-16 text-center">
              <p className="text-gray-400 mb-4">
                {isEnglish ? 'More information:' : 'Meer informatie:'}
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link to="/diensten" className="px-4 py-2 rounded-lg bg-dark-800 hover:bg-dark-700 text-gray-300 hover:text-primary-400 transition border border-dark-700 text-sm">
                  {isEnglish ? 'Services' : 'Diensten'}
                </Link>
                <Link to="/prijzen" className="px-4 py-2 rounded-lg bg-dark-800 hover:bg-dark-700 text-gray-300 hover:text-primary-400 transition border border-dark-700 text-sm">
                  {isEnglish ? 'Pricing' : 'Prijzen'}
                </Link>
                <Link to="/portfolio" className="px-4 py-2 rounded-lg bg-dark-800 hover:bg-dark-700 text-gray-300 hover:text-primary-400 transition border border-dark-700 text-sm">
                  Portfolio
                </Link>
                <Link to="/werkwijze" className="px-4 py-2 rounded-lg bg-dark-800 hover:bg-dark-700 text-gray-300 hover:text-primary-400 transition border border-dark-700 text-sm">
                  {isEnglish ? 'How we work' : 'Werkwijze'}
                </Link>
                <Link to="/contact" className="px-4 py-2 rounded-lg bg-dark-800 hover:bg-dark-700 text-gray-300 hover:text-primary-400 transition border border-dark-700 text-sm">
                  Contact
                </Link>
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </div>
    </PageTransition>
  );
};

export default SeoLandingPage;
