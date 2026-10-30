import React from 'react';
import { Link } from 'react-router-dom';
import AnimateOnScroll from './AnimateOnScroll';
import { SpotlightCard, Magnetic } from './Interactive';
import { useLanguage } from '../contexts/LanguageContext';

export const ArrowIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
  </svg>
);

export const CheckIcon = ({ className = 'w-3 h-3' }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
  </svg>
);

// Page header used on every public subpage
export const PageHero: React.FC<{
  eyebrow: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  children?: React.ReactNode;
  center?: boolean;
}> = ({ eyebrow, title, lead, children, center }) => (
  <section className="relative overflow-hidden bg-dark-950 -mt-[72px] pt-[72px]">
    <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 55% 60% at 50% -10%, rgba(16,185,129,0.16), transparent 70%)' }} />
    <div className="hero-grid absolute inset-0 pointer-events-none" />
    <div className={`container mx-auto px-4 max-w-6xl relative pt-24 pb-16 md:pt-32 md:pb-20 ${center ? 'text-center' : ''}`}>
      <AnimateOnScroll>
        <span className="eyebrow">{eyebrow}</span>
        <h1 className={`display text-5xl md:text-7xl mt-5 mb-6 ${center ? 'mx-auto' : ''} max-w-4xl`}>{title}</h1>
        {lead && <p className={`lead md:text-xl max-w-2xl ${center ? 'mx-auto' : ''}`}>{lead}</p>}
        {children}
      </AnimateOnScroll>
    </div>
  </section>
);

export const CtaBlock: React.FC<{ title?: React.ReactNode; text?: string; button?: string }> = ({ title, text, button }) => {
  const { language } = useLanguage();
  const nl = language === 'nl';
  return (
    <section className="py-28 bg-dark-950">
      <div className="container mx-auto px-4 max-w-6xl">
        <AnimateOnScroll animation="reveal-scale">
          <SpotlightCard className="cta-card rounded-[2rem] px-8 py-20 md:px-16 text-center overflow-hidden border border-white/10">
            <h2 className="display text-4xl md:text-6xl mb-6 relative">
              {title || (nl ? <>Klaar om te <span className="serif text-primary-300">beginnen?</span></> : <>Ready to <span className="serif text-primary-300">start?</span></>)}
            </h2>
            <p className="lead md:text-xl max-w-xl mx-auto mb-10 relative">
              {text || (nl ? 'Vertel ons over je plannen. Binnen 24 uur heb je een eerlijk voorstel.' : 'Tell us about your plans. You will have an honest proposal within 24 hours.')}
            </p>
            <Magnetic>
              <Link to="/contact" className="btn-primary-modern btn-lg group relative">
                {button || (nl ? 'Neem contact op' : 'Get in touch')}
                <ArrowIcon className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Magnetic>
          </SpotlightCard>
        </AnimateOnScroll>
      </div>
    </section>
  );
};
